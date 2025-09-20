// backend/middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  console.log("AdminMiddleware: Checking user role...");
  // Log the entire req.user object to see what's being passed from authMiddleware
  console.log("AdminMiddleware: req.user received:", req.user);

  // Check if user object exists AND if its role is 'admin' (case-sensitive check)
  if (req.user && req.user.role === 'admin') {
    console.log("AdminMiddleware: User role is 'admin'. Proceeding.");
    next(); // Allow access
  } else {
    // Log the role found (or lack thereof) for debugging
    const userRole = req.user ? req.user.role : 'undefined (req.user not found)';
    console.error(`AdminMiddleware: Access denied. User role is '${userRole}'. Expected 'admin'.`);
    res.status(403).json({ message: 'Admin access denied. You are not an admin.' });
  }
};

module.exports = adminMiddleware;