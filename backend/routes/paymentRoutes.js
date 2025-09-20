// backend/routes/paymentRoutes.js
const express = require('express');
const { 
    generatePayHereHash, 
    handlePayHereNotification, 
    verifyPaymentStatus 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/payment/generate-hash
// @desc    Generate PayHere payment hash for security
// @access  Private
router.post('/generate-hash', protect, generatePayHereHash);

// @route   POST /api/payment/notify
// @desc    Handle PayHere payment notifications (webhook)
// @access  Public (PayHere calls this)
router.post('/notify', handlePayHereNotification);

// @route   GET /api/payment/verify/:orderId
// @desc    Verify payment status for an order
// @access  Private
router.get('/verify/:orderId', protect, verifyPaymentStatus);

console.log("Payment routes registered:");
console.log("POST /api/payment/generate-hash");
console.log("POST /api/payment/notify");
console.log("GET /api/payment/verify/:orderId");

module.exports = router;