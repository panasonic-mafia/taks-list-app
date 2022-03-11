const express = require('express');
const { check } = require('express-validator');
const tasksController = require('./controllers/tasksController');
const authController = require('./controllers/authController');

const router = express.Router()

//routes for the tasks
router.get('/tasks', tasksController.getTasks);
router.post('/task', tasksController.addTask);
router.put('/task/:id', tasksController.editTask);
//authentication
router.post('/login', check('user').trim().escape().blacklist('\\[\\]'), authController.login);

module.exports = router;