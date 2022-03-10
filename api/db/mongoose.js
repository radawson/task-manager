// Handler for db access

const mongoose = require('mongoose');
const { DB_URL } = require(appRoot + '/config');

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, { useNewURLParser: true }).then(() => {
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