// backend/config/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

console.log("--- Server: Mounting Routes ---");

// Import routes
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');
const adminRoutes = require('../routes/adminRoutes');
const settingsRoutes = require('../routes/settingsRoutes'); // Import the new settings routes
const paymentRoutes = require('../routes/paymentRoutes'); // FIXED: Changed from './routes/paymentRoutes' to '../routes/paymentRoutes'

console.log("--- Server: Routes Mounted ---");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files (e.g., uploaded images)
// Ensure 'uploads' matches where your upload middleware saves files.
// If using Cloudinary, this might not be necessary for image URLs.
app.use('/uploads', express.static('uploads')); 

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes); // Mount the settings routes under '/api/settings'
app.use('/api/payment', paymentRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  // In a production environment, you might want to send a more generic error message
  // and log the detailed error server-side.
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});