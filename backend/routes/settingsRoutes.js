// backend/routes/settingsRoutes.js
const express = require('express');
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getSiteSettings,
  updateSiteSettings,
  getHomepageData,
  getPublicSiteSettings,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// --- Public Routes ---
router.get('/homepage', getHomepageData);
router.get('/public', getPublicSiteSettings);

// --- Admin Routes ---

// Banner Management
router.get('/banners', protect, adminMiddleware, getBanners);
router.post('/banners', protect, adminMiddleware, upload.single('image'), createBanner);
router.put('/banners/:id', protect, adminMiddleware, upload.single('image'), updateBanner);
router.delete('/banners/:id', protect, adminMiddleware, deleteBanner);

// Promotion Management
router.get('/promotions', protect, adminMiddleware, getPromotions);
router.post('/promotions', protect, adminMiddleware, createPromotion);
router.put('/promotions/:id', protect, adminMiddleware, updatePromotion);
router.delete('/promotions/:id', protect, adminMiddleware, deletePromotion);

// Site Settings
router.get('/site', protect, adminMiddleware, getSiteSettings);
router.put('/site', protect, adminMiddleware, updateSiteSettings);

module.exports = router;

// Add this to your main app.js or server.js:
// app.use('/api/settings', require('./routes/settingsRoutes'));