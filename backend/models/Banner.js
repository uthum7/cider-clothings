// backend/models/Banner.js
const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: 'Shop Now',
  },
  buttonLink: {
    type: String,
    default: '/products',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);