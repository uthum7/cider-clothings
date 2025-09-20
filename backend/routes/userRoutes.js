// backend/routes/userRoutes.js
const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getMyOrders,
  getMyOrderById,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
} = require('../controllers/userController');

// Fix: Destructure the protect function from authMiddleware
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

console.log('--- UserRoutes: Defining routes ---');

// Profile routes
router.get('/profile', protect, getUserProfile);
console.log('Registered GET /api/users/profile');

// Only add the upload middleware if you have it set up
// If you don't have upload middleware, comment out the next line and use this instead:
router.put('/profile', protect, updateUserProfile);
// router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);
console.log('Registered PUT /api/users/profile');

// Order routes
router.get('/my-orders', protect, getMyOrders);
console.log('Registered GET /api/users/my-orders');

router.get('/my-orders/:orderId', protect, getMyOrderById);
console.log('Registered GET /api/users/my-orders/:orderId');

// Cart routes
router.get('/cart', protect, getCart);
console.log('Registered GET /api/users/cart');

router.post('/cart', protect, addToCart);
console.log('Registered POST /api/users/cart');

router.put('/cart/:productId', protect, updateCartItem);
console.log('Registered PUT /api/users/cart/:productId');

router.delete('/cart/:productId', protect, removeFromCart);
console.log('Registered DELETE /api/users/cart/:productId');

router.delete('/cart', protect, clearCart);
console.log('Registered DELETE /api/users/cart (clear cart)');

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
console.log('Registered GET /api/users/wishlist');

router.post('/wishlist', protect, addToWishlist);
console.log('Registered POST /api/users/wishlist');

router.delete('/wishlist/:productId', protect, removeFromWishlist);
console.log('Registered DELETE /api/users/wishlist/:productId');

// Address routes
router.get('/addresses', protect, getUserAddresses);
console.log('Registered GET /api/users/addresses');

router.post('/addresses', protect, addUserAddress);
console.log('Registered POST /api/users/addresses');

router.put('/addresses/:addressId', protect, updateUserAddress);
console.log('Registered PUT /api/users/addresses/:addressId');

router.delete('/addresses/:addressId', protect, deleteUserAddress);
console.log('Registered DELETE /api/users/addresses/:addressId');

console.log('--- UserRoutes: Routes defined ---');

module.exports = router;