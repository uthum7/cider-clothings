// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please assign a category'],
  },
  images: [{ // Array of image URLs
    type: String,
    required: true,
  }],
  status: { // e.g., 'Active', 'Archived'
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active',
  },
  sizes: [{
     type: String
  }], 
  colors: [{
     type: String 
  }],
  // Add other fields like sizes, colors, ratings, etc.
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);