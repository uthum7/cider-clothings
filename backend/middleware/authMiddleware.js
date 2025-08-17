const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // This line is perfect. It attaches the full user object to the request.
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- CORRECTION 1: Changed 'export const' to just 'const' ---
const isAdmin = (req, res, next) => {
    // This logic is perfect. It correctly checks the user object that 'protect' added.
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// --- CORRECTION 2: Added 'isAdmin' to the exports object ---
module.exports = { 
    protect,
    isAdmin 
};