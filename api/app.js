const express = require('express');
app = express();

// make appRoot available globally for configuration
var path = require('path');
global.appRoot = path.resolve(__dirname);

const jwt = require('jsonwebtoken');
const { port } = require('./config');

// load mongoose models
const { mongoose } = require('./db/mongoose');
const { List, Task, User } = require('./db/models');

/* Middleware */
//Used to parse JSON body
app.use(express.json());

//used for CORS resolution
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token");
    res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    next();
});

// Authentication Function
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    if (!token) {
        res.status(401).send({ auth: false })
    }
    else {
        // verify JWT token
        jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
            if (err) {
                // Do Not Authenticate
                return res.status(401).send(err);
            } else {
                req.user_id = decoded._id;
                next();
            }
        });
    }
}

// Used to verify a refresh token (session verification)
let verifySession = (req, res, next) => {
    // get refresh token from header
    let refreshToken = req.header('x-refresh-token');
    // get _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user not found
            return Promise.reject({
                'error': 'User not found. Refresh token or user ID incorrect.'
            });
        }

        //user found, refresh token exists
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if session has expired
                if (User.hasRefreshTokenExpired(session.expireTime) === false) {
                    // refresh token is not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            //handle invalid session
            return Promise.reject({
                'error': 'Refresh token is expired or session is invalid '
            });
        }
    }).catch((err) => {
        res.status(401).send(err);
    });

};

/* Route Handlers */


/* List Routes */

// List Handlers

/**
 * POST /lists
 * Purpose: create a new list and return that list with id
 */
app.post('/lists', authenticate, (req, res) => {
    // create a new list and return that list with db id
    // return list information in JSON body
    let title = req.body.title;
    let description = req.body.description;
    let public_view = req.body.public_view;
    let public_edit = req.body.public_edit;

    let newList = new List({
        title: title,
        description: description,
        public_view: public_view,
        public_edit: public_edit
    });
    newList._userIds.push(req.user_id);
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })

})

/** 
 * GET /lists
 * Purpose: return all lists
 */
app.get('/lists', authenticate, (req, res) => {
    // Return an array of all lists in db
    List.find({
        $or: [
            { public_view: true },
            { _userIds: req.user_id }]
    }).then((lists) => {
        res.send(lists);
    })
})

/**
 * PATCH lists/:listId
 * Purpose: update the specified list
 */
app.patch('/lists/:listId', (req, res) => {
    // update list based on list id
    // new values based on JSON body
    List.findOneAndUpdate({ _id: req.params.listId }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });

})

/**
 * DELETE /lists/:listId
 * Purpose: Deletes the specified list
 */
app.delete('/lists/:listId', (req, res) => {
    // delete the specified list
    List.findOneAndRemove({
        _id: req.params.listId
    }).then((removedListDoc) => {
        // Delete all tasks with this listId
        deleteTasksFromList(removedListDoc._id);
        res.send(removedListDoc);

    });
})

// Tasks Handler

/**
 * POST /lists/:listId/tasks
 * Purpose: Add a task to a specified list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    List.findOne({
        $or: [
            {
                _id: req.params.listId,
                _userId: req.user_id
            },
            { public_edit: true }]
    }).then((list) => {
        if (list) {
            return true;
        }
        //else
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks from a given list 
 */
app.get('/lists/:listId/tasks', authenticate, (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Get a specific task from a given list 
 */
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * PATCH lists/:listId/tasks/:taskId
 * Purpose: update the specified task
 */
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    // update list based on list id
    // new values based on JSON body
    // TODO: Refactor the list check into a function
    List.findOne({
        $or: [
            {
                _id: req.params.listId,
                _userId: req.user_id
            },
            { public_edit: true }]
    }).then((list) => {
        if (list) {
            return true;
        }
        //else
        return false;
    }).then((canUpdateTask) => {
        if (canUpdateTask) {
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                $set: req.body
            }).then(() => {
                res.send({ message: 'Updated Successfully' });
            })
        } else {
            res.sendStatus(404);
        }
    })
})

/**
 * DELETE /lists/:id/tasks/:taskId
 * Purpose: Deletes the specified task
 */
app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    List.findOne({
        $or: [
            {
                _id: req.params.listId,
                _userId: req.user_id
            },
            { public_edit: true }]
    }).then((list) => {
        if (list) {
            return true;
        }
        //else
        return false;
    }).then((canDeleteTask) => {
        if (canDeleteTask) {
            // delete the specified list
            Task.findOneAndRemove({
                _id: req.params.taskId
            }).then((removedListDoc) => {
                res.send(removedListDoc);
            });
        } else {
            res.sendStatus(404);
        }
    });
})

// User Handler

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findByCredentials(username, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((err) => {
        res.status(400).send(err);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: Generates and returns an access token 
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // user is authenticated, userObject is available
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });

})

/* Helper Methods */
// Delete all tasks from a specified list]
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tasks from " + _listId + " were deleted.");
    })
}

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})