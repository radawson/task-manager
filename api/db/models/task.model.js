const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    _listId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completed_date: {
        type: Date,
    },
    day: {
        type: Number,
        default: false
    },
    date: {
        type: Date,
        required: false
    },
    public: {
        type: Boolean,
        default: true
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task }