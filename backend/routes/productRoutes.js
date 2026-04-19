// backend/routes/productRoutes.js
const express = require('express');
const { getProducts, getProductById, getCategories, getFilters } = require('../controllers/productController');

const router = express.Router();

console.log("--- ProductRoutes: Defining routes ---");

// Define specific routes FIRST
router.get('/categories', getCategories);
router.get('/filters', getFilters);
console.log("Registered GET /api/products/categories");

// Then define the route that accepts a dynamic ID
router.get('/:id', getProductById);
console.log("Registered GET /api/products/:id");

// And the base route
router.get('/', getProducts);
console.log("Registered GET /api/products");

console.log("--- ProductRoutes: Routes defined ---");

module.exports = router;