const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getAssignedTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Create a new task
router.post('/', protect, createTask);

// Get all tasks
router.get('/', protect, getTasks);

// Get tasks by status
router.get('/status/:status', protect, getTasksByStatus);

// Get tasks assigned to the logged-in user
router.get('/assigned', protect, getAssignedTasks);

// Get, update, and delete task by ID
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
