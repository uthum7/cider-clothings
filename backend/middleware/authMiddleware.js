// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("AuthMiddleware: Token received (prefix):", token ? token.substring(0, 15) + '...' : 'None');

      if (!process.env.JWT_SECRET) {
          console.error("AuthMiddleware Error: JWT_SECRET is not defined.");
          return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`AuthMiddleware: Token decoded successfully. User ID from token: ${decoded.id}`);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error(`AuthMiddleware Error: User not found for ID: ${decoded.id}`);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // --- LOG THE USER OBJECT AS FOUND IN THE DATABASE ---
      console.log("AuthMiddleware: User found in DB:", req.user); // <-- LOG THE ENTIRE USER OBJECT
      // --- END LOGGING ---

      next(); // Proceed if user is found
    } catch (error) {
      console.error("AuthMiddleware Error: Token verification failed:", error.message);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    console.log("AuthMiddleware: No token provided.");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };