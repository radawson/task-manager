// Handler for db access

const mongoose = require('mongoose');

// TODO: Get all configs from the config file
// import * as configs from '../config';
const DB_URL = 'mongodb://localhost:27017/TaskManager'

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, { useNewURLParser:true }).then(() => {
    console.log("Connection to mongoDB successful");
}).catch((e) => {
    console.log('Error connecting to DB');
    console.log(e);
});

// To prevent deprectation warnings (from MongoDB native driver)
// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);


module.exports = {
    mongoose
};