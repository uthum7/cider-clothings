// backend/routes/orderRoutes.js
const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus, // For status updates (can be admin or customer for tracking)
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // To restrict status updates

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', protect, addOrderItems);

// GET /api/orders/:id - Get a specific order by ID
// Accessible by the order owner OR an admin
router.get('/:id', protect, getOrderById);

// PUT /api/orders/:id/pay - Update order to paid after payment confirmation
router.put('/:id/pay', protect, updateOrderToPaid);

// PUT /api/orders/:id/status - Update order status (e.g., by admin)
// Protect this route so only admins or authorized users can change status
router.put('/:id/status', protect, adminMiddleware, updateOrderStatus); // Ensuring only admins can change status

module.exports = router;