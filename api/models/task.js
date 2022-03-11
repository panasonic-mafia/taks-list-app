const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const TaskSchema = mongoose.Schema({
    user: {
        type: String,
        required: [true, 'Please provide username'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add email for the task'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide task description'],
        minLength: 1
    },
    completed: {
        type: Boolean,
        default: false
    }
}) 

TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', TaskSchema);