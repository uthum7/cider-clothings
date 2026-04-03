// backend/controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
  try {
    let query = { status: 'Active' };
    if (req.query.category) {
      const category = await Category.findOne({ name: { $regex: `^${req.query.category}$`, $options: 'i' } });
      if (category) {
        query.category = category._id;
      } else {
        return res.json([]); // Return empty if category not found
      }
    }
    
    // Add Size Array searching
    if (req.query.sizes) {
      const sizesArray = req.query.sizes.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
      query.sizes = { $in: sizesArray };
    }

    // Add Color Array searching
    if (req.query.colors) {
      const colorsArray = req.query.colors.split(',').map(c => new RegExp(`^${c.trim()}$`, 'i'));
      query.colors = { $in: colorsArray };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("ProductController: Error fetching products:", error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
  }
  try {
    const product = await Product.findById(id).populate('category', 'name');
    if (product) {
      if (product.status === 'Archived') {
         return res.status(404).json({ message: 'Product is not available.' });
      }
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error(`ProductController: Error fetching product by ID ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    console.log("--- ProductController: Hit getCategories route ---");
    console.log("Request Params for Categories:", req.params);
    console.log("Request Query for Categories:", req.query);

    const categories = await Category.find({});
    

    // --- IMPORTANT: Check if categories were found ---
    if (!categories || categories.length === 0) {
        // This might be causing the issue if the frontend expects data but gets an empty array.
        // Returning a specific message might help if the frontend isn't handling an empty array gracefully.
        // However, usually, an empty array is fine. The 400 suggests a server issue before this.
        // If you're still getting 400, the problem is likely *before* this point.
        console.warn("--- ProductController: No categories found in the database ---");
        // For debugging, you could temporarily send a 200 with a message, but usually an empty array is expected.
        // return res.json([]); // This is the standard way
    }
    console.log("--- ProductController: Fetched Categories ---", categories.length);
    res.json(categories);
  } catch (error) {
    console.error("ProductController: Error fetching categories:", error);
    // Return a 500 error if Mongoose itself fails
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};