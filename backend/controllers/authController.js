// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto'); // For password reset tokens

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Customer', // Default role
    });

    // --- Optional: Send Welcome Email ---
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Cider Clothing!',
        html: `
          <h1>Welcome, ${user.name}!</h1>
          <p>Thank you for joining Cider Clothing. We're excited to have you!</p>
          <p>Start shopping now: <a href="YOUR_FRONTEND_URL/products">Our Collection</a></p>
        `
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Log the error but don't fail the signup process
    }
    // --- End Optional Welcome Email ---

    res.status(201).json({ message: 'User registered successfully. Please sign in.' });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Respond with user details and token
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture, // This will be null if not set
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: 'Server error during signin.' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpire'); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// @desc    Update user profile (including image upload)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id; // User ID from the JWT

  try {
    let updatedUser = await User.findById(userId);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields
    if (name) updatedUser.name = name;
    if (email) {
      // Check if the new email is already in use by another user
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: 'This email is already in use by another account.' });
      }
      updatedUser.email = email;
    }

    // Handle profile picture upload
    if (req.file) { // req.file is provided by Multer if a file was uploaded
      // --- IMPORTANT: Delete old profile picture from Cloudinary if it exists ---
      if (updatedUser.profilePicture) {
        const publicIdMatch = updatedUser.profilePicture.match(/\/(\w+)\.\w+$/); // Basic extraction of public ID
        if (publicIdMatch && publicIdMatch[1]) {
          try {
            // Adjust folder name if needed
            await cloudinary.uploader.destroy(`cider-clothing/avatars/${publicIdMatch[1]}`, { invalidate: true });
          } catch (cleanupError) {
            console.error("Error deleting old profile picture from Cloudinary:", cleanupError);
            // Log the error but continue updating the user record
          }
        }
      }
      // Set the new profile picture URL
      updatedUser.profilePicture = req.file.path; // Cloudinary URL from multer-storage-cloudinary
    }

    const savedUser = await updatedUser.save();

    // Respond with the updated user information (excluding sensitive fields)
    res.json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      profilePicture: savedUser.profilePicture,
      // NOTE: Do NOT send the token back here, as the user is already authenticated.
      // Sending the updated user object is sufficient for the frontend to refresh its state.
    });

  } catch (error) {
    console.error("Update profile error:", error);
    // Clean up uploaded file if error occurred after upload but before save
     if (req.file && updatedUser && updatedUser.profilePicture && req.file.path !== updatedUser.profilePicture) {
        try {
            await cloudinary.uploader.destroy(req.file.filename); // Delete the new file that failed to save
        } catch (cleanupError) {
            console.error("Error cleaning up uploaded file on profile update error:", cleanupError);
        }
    }
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // It's good practice to return a success message even if the email isn't found,
      // to prevent email enumeration attacks.
      return res.status(200).json({ success: true, message: 'If an account with that email exists, we have sent password reset instructions.' });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expiration time (e.g., 10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false }); // Skip validation for these fields

    // Create the password reset URL
    // This URL must point to your frontend's password reset page, with the token as a parameter
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // Make sure FRONTEND_URL is set in .env

    const message = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) requested to reset your password for your Cider Clothing account.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off" style="color: #4f46e5;">${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Cider Clothing - Password Reset Request',
      html: message,
    });

    res.status(200).json({ success: true, message: 'Password reset instructions have been sent to your email.' });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: 'Server error initiating password reset. Please try again later.' });
  }
};

// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
      return res.status(400).json({ message: 'Please provide a new password.' });
  }
  if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    // Hash the reset token sent from the frontend to compare with the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if token has not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    // Update the user's password
    user.password = password;
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Optionally, log the user in immediately by sending a new token
    // res.json({ token: generateToken(user._id), message: 'Password reset successfully. You are now logged in.' });
    // Or simply confirm success
    res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: 'Server error resetting password.' });
  }
};