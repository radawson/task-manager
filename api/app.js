const express = require('express');
app = express();

const {mongoose} = require('./db/mongoose');

// load mongoose models
const { List, Task } = require('./db/models');

// Middleware
//Used to parse JSON body
app.use(express.json()); 
//used for CORS resolution
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Route Handlers */


/* List Routes */

// List Handlers

/**
 * POST /lists
 * Purpose: create a new list and treturn that list with id
 */
 app.post('/lists', (req, res) => {
    // create a new list and return that list with db id
    //return list information in JSON body
    let title = req.body.title;

    let newList = new List ({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })

})

/** 
 * GET /lists
 * Purpose: return all lists
 */
app.get('/lists', (req,res) => {
    // Return an array of all lists in db
    List.find({}).then((lists) => {
        res.send(lists);
    })
})

/**
 * PATH lists/:listId
 * Purpose: update the specified list
 */
app.patch('/lists/:listId', (req, res) =>{
    // update list based on list id
    // new values based on JSON body
    List.findOneAndUpdate({_id: req.params.listId}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
    
})

/**
 * DELETE /lists/:listId
 * Purpose: Deletes the specified list
 */
app.delete('/lists/:listId', (req,res) => {
    // delete the specified list
    List.findOneAndRemove({
        _id: req.params.listId
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    });
})

// Tasks Handler

/**
 * POST /lists/:listId/tasks
 * Purpose: Add a task to a specified list
 */
 app.post('/lists/:listId/tasks', (req,res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks from a given list 
 */
 app.get('/lists/:listId/tasks', (req,res) => {
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
 app.get('/lists/:listId/tasks/:taskId', (req,res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * PATH lists/:listId/tasks/:taskId
 * Purpose: update the specified task
 */
 app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // update list based on list id
    // new values based on JSON body
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.send({message: 'Updated Successfully'});
    });
    
})

/**
 * DELETE /lists/:id/tasks/:taskId
 * Purpose: Deletes the specified task
 */
app.delete('/lists/:listId/tasks/:taskId', (req,res) => {
    // delete the specified list
    Task.findOneAndRemove({
        _id: req.params.taskId
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    });
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})