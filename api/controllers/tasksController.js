const Task = require('../models/task');
const sanitize = require('mongo-sanitize');


exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Server error'
        })
    }
}

exports.addTask = async (req, res) => {
    try {
        const newTask = sanitize(req.body);
        const task = await Task.create(newTask);
        return res.status(200).json({
            success: true,
            data: task
        })
    } catch (error) {
        console.error(err)
        return res.status(500).json({
            error: 'Server error'
        })
    }
}

exports.editTask = async (req, res) => {
    try {
        const id = sanitize(req.params.id);
        const update = sanitize(req.body);
        const task = await Task.findByIdAndUpdate(id, update, {returnDocument: 'after'})
        return res.status(200).json({
            success: true,
            data: task
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Server error'
        })
    }
}