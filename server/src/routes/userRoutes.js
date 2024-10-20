const express = require('express');
const { registerUser, loginUser, getUserDetails, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route
router.get('/:id', protect, getUserDetails);
// Get all users
router.get('/', protect, getAllUsers);
  

module.exports = router;
