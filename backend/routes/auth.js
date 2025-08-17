const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const {
    registerUser,
    loginUser,
    forgotPassword,
    getUserProfile, 
    updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = multer({ storage }); 

// Route for user registration
router.post('/signup', registerUser);

// Route for user login
router.post('/signin', loginUser);

// Route for handling forgot password requests
router.post('/forgot-password', forgotPassword);

// Route for getting user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Route for updating user profile (protected route)
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

// extra
module.getters = router;

module.exports = router;