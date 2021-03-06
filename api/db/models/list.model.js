const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _userIds: {
        type: [mongoose.Types.ObjectId],
        required: false
    },
    public_view: {
        type: String,
        default: 0
    },
    public_edit: {
        type: String,
        default: 0
    },
    description: {
        type: String,
        required: true,
        default: "A list"
    }

})

const List = mongoose.model('List', ListSchema);

module.exports = { List }