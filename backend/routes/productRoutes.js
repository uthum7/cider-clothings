// backend/routes/productRoutes.js
const express = require('express');
const { getProducts, getProductById, getCategories } = require('../controllers/productController');

const router = express.Router();

console.log("--- ProductRoutes: Defining routes ---");

// Define the specific route for categories FIRST
router.get('/categories', getCategories);
console.log("Registered GET /api/products/categories");

// Then define the route that accepts a dynamic ID
router.get('/:id', getProductById);
console.log("Registered GET /api/products/:id");

// And the base route
router.get('/', getProducts);
console.log("Registered GET /api/products");

console.log("--- ProductRoutes: Routes defined ---");

module.exports = router;