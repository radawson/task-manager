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
        type: Boolean,
        default: true
    },
    public_edit: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: false
    }

})

const List = mongoose.model('List', ListSchema);

module.exports = { List }