// backend/routes/authRoutes.js
const express = require('express');
const {
  signup,
  signin,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For profile picture upload

const router = express.Router();

// POST /api/auth/signup - User registration
router.post('/signup', signup);

// POST /api/auth/signin - User login
router.post('/signin', signin);

// GET /api/auth/profile - Get logged-in user's profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile - Update logged-in user's profile
// Use upload.single('profilePicture') because it's a single file upload
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', forgotPassword);

// PUT /api/auth/reset-password/:token - Reset password using token
router.put('/reset-password/:token', resetPassword);

module.exports = router;