const express = require('express');
app = express();

const {mongoose} = require('./db/mongoose');

// load mongoose models
const { List, Task } = require('./db/models');

// Middleware
app.use(express.json()); //Used to parse JSON bodies

/* Route Handlers */


/* List Routes */

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
 * PATH lists/id
 * Purpose: update the specified list
 */
app.patch('/lists/:id', (req, res) =>{
    // update list based on list id
    // new values based on JSON body
})

/**
 * DELETE /lists/id
 * Purpose: Deletes the specified list
 */
app.delete('/lists/:id', (req,res) => {
    // delete the specified list
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})