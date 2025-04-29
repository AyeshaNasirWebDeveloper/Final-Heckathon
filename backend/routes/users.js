const express = require('express');
const router = express.Router();
const { updateUserProfile, getUsers, getUserById } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Get all users (admin only)
router.get('/', protect, getUsers);

// Get user by ID
router.get('/:id', protect, getUserById);

module.exports = router;
