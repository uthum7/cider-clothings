// backend/routes/adminRoutes.js
const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  createCategory,
  getCategoriesForAdmin,
  getAllProducts, // Imported
  getProductById,
  getDashboardStats, 
  getSalesData,
  getRecentOrders,
  getRevenueAnalytics,
  getProductAnalytics,
  getOrderAnalytics,   // Dashboard functions
} = require('../controllers/adminController'); // Ensure path is correct
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For product images

const router = express.Router();

console.log("--- AdminRoutes: Defining routes ---");

// --- Dashboard Routes (Add these FIRST) ---
router.get('/dashboard/stats', protect, adminMiddleware, getDashboardStats);
console.log("Registered GET /api/admin/dashboard/stats");

router.get('/dashboard/sales', protect, adminMiddleware, getSalesData);
console.log("Registered GET /api/admin/dashboard/sales");

router.get('/dashboard/recent-orders', protect, adminMiddleware, getRecentOrders);
console.log("Registered GET /api/admin/dashboard/recent-orders");

// --- Product Management Routes ---
// POST /api/admin/products - Create a new product
router.post('/products', protect, adminMiddleware, upload.array('images', 5), createProduct);
console.log("Registered POST /api/admin/products");

// GET /api/admin/products - Get all products (for admin)
router.get('/products', protect, adminMiddleware, getAllProducts);
console.log("Registered GET /api/admin/products");

// GET /api/admin/products/:id - Get a single product by ID (for editing)
router.get('/products/:id', protect, adminMiddleware, getProductById);
console.log("Registered GET /api/admin/products/:id");

// PUT /api/admin/products/:id - Update an existing product
router.put('/products/:id', protect, adminMiddleware, upload.array('images', 5), updateProduct);
console.log("Registered PUT /api/admin/products/:id");

// DELETE /api/admin/products/:id - Delete a product
router.delete('/products/:id', protect, adminMiddleware, deleteProduct);
console.log("Registered DELETE /api/admin/products/:id");

// --- User Management Routes ---
// GET /api/admin/users - Get all users
router.get('/users', protect, adminMiddleware, getUsers);
console.log("Registered GET /api/admin/users");

// PUT /api/admin/users/:id/role - Update a user's role
router.put('/users/:id/role', protect, adminMiddleware, updateUserRole);
console.log("Registered PUT /api/admin/users/:id/role");

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', protect, adminMiddleware, deleteUser);
console.log("Registered DELETE /api/admin/users/:id");

// --- Order Management Routes ---
// GET /api/admin/orders - Get all orders
router.get('/orders', protect, adminMiddleware, getAllOrders);
console.log("Registered GET /api/admin/orders");

// --- Category Management Routes ---
// POST /api/admin/categories - Create a new category
router.post('/categories', protect, adminMiddleware, createCategory);
console.log("Registered POST /api/admin/categories");

// GET /api/admin/categories - Get all categories
router.get('/categories', protect, adminMiddleware, getCategoriesForAdmin);
console.log("Registered GET /api/admin/categories");

// --- Analytics Routes ---
router.get('/analytics/revenue', protect, adminMiddleware, getRevenueAnalytics);
console.log("Registered GET /api/admin/analytics/revenue");

router.get('/analytics/products', protect, adminMiddleware, getProductAnalytics);
console.log("Registered GET /api/admin/analytics/products");

router.get('/analytics/orders', protect, adminMiddleware, getOrderAnalytics);
console.log("Registered GET /api/admin/analytics/orders");
console.log("--- AdminRoutes: Routes defined ---");

module.exports = router;