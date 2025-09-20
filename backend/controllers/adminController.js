// backend/controllers/adminController.js
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose'); // For ObjectId validation

// --- Product Management ---

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category, status } = req.body;

  try {
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields (name, description, price, stock, category).' });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID provided.' });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: 'Price and stock must be valid non-negative numbers.' });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    if (imageUrls.length === 0) {
        return res.status(400).json({ message: 'At least one product image is required.' });
    }

    const product = new Product({
      name, description, price: parsedPrice, stock: parsedStock, category: categoryExists._id,
      images: imageUrls, status: status || 'Active',
    });

    const createdProduct = await product.save();
    await createdProduct.populate('category', 'name'); // Populate category name for response
    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("Admin createProduct error:", error);
    // Clean up uploaded files if creation fails midway
    if (req.files) {
        for (const file of req.files) {
            try { await cloudinary.uploader.destroy(file.filename); }
            catch (cleanupError) { console.error("Error cleaning up uploaded file:", cleanupError); }
        }
    }
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// @desc    Get a single product by ID (for admin editing)
// @route   GET /api/admin/products/:id
// @access  Private (Admin)
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
  }
  try {
    const product = await Product.findById(id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Admin getProductById error for ID ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching product details' });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, category, status } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update basic fields
    product.name = name || product.name;
    product.description = description || product.description;
    if (price !== undefined) {
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) return res.status(400).json({ message: 'Invalid price provided.' });
        product.price = parsedPrice;
    }
    if (stock !== undefined) {
        const parsedStock = parseInt(stock, 10);
        if (isNaN(parsedStock) || parsedStock < 0) return res.status(400).json({ message: 'Invalid stock quantity provided.' });
        product.stock = parsedStock;
    }
    product.status = status || product.status;

    // Handle category update
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(400).json({ message: 'Invalid category ID provided.' });
      product.category = categoryExists._id;
    }

    // Handle image updates if new files are uploaded
    if (req.files && req.files.length > 0) {
      if (product.images && product.images.length > 0) { // Delete old images from Cloudinary
        for (const imageUrl of product.images) {
          const publicIdMatch = imageUrl.match(/\/(\w+)\.\w+$/); // Extract public ID from URL
          if (publicIdMatch && publicIdMatch[1]) {
            try {
                // Assuming images are stored in 'cider-clothing/products/' folder in Cloudinary
                await cloudinary.uploader.destroy(`cider-clothing/products/${publicIdMatch[1]}`, { invalidate: true });
            } catch (cleanupError) {
                console.error("Error deleting old image from Cloudinary:", cleanupError);
            }
          }
        }
      }
      // Update with new image URLs
      product.images = req.files.map(file => file.path);
    }

    const updatedProduct = await product.save();
    await updatedProduct.populate('category', 'name'); // Repopulate category for response
    res.json(updatedProduct);

  } catch (error) {
    console.error("Admin updateProduct error:", error);
    if (req.files && product && product.images && product.images.length > 0 && !product.isNew) { // Cleanup new uploads on error
        for (const file of req.files) {
            if (!product.images.includes(file.path)) { // If it's a new image that wasn't saved
                 try { await cloudinary.uploader.destroy(file.filename); }
                 catch (cleanupError) { console.error("Error cleaning up uploaded file on update error:", cleanupError); }
            }
        }
    }
    res.status(500).json({ message: 'Server error updating product' });
  }
};


// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete associated images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const publicIdMatch = imageUrl.match(/\/(\w+)\.\w+$/);
          if (publicIdMatch && publicIdMatch[1]) {
            try { await cloudinary.uploader.destroy(`cider-clothing/products/${publicIdMatch[1]}`, { invalidate: true }); }
            catch (cleanupError) { console.error("Error deleting image from Cloudinary during product delete:", cleanupError); }
          }
        }
      }
      // Delete the product record from the database
      await product.deleteOne(); // Use deleteOne() for modern Mongoose
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Admin deleteProduct error:", error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// --- User Management ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpire'); // Exclude sensitive fields
    res.json(users);
  } catch (error) {
    console.error("Admin getUsers error:", error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!role || !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided. Must be "customer" or "admin".' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.user.id) { // Prevent self-modification
        return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    user.role = role;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, message: `User role updated to ${role}` });
  } catch (error) {
    console.error("Admin updateUserRole error:", error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user._id.toString() === req.user.id) { // Prevent self-deletion
        return res.status(400).json({ message: 'You cannot delete your own account.' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Admin deleteUser error:", error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// --- Order Management ---

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders, populate user and product details for display
    const orders = await Order.find({})
      .populate('user', 'name email') // Populate user details
      .populate('orderItems.productId', 'name images') // Populate product name and first image from order items
      .sort({ createdAt: -1 }); // Sort by most recent

    res.json(orders);
  } catch (error) {
    console.error("Admin getAllOrders error:", error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// --- Category Management ---

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  try {
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) return res.status(400).json({ message: 'Category with this name already exists.' });
    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (error) {
    console.error("Admin createCategory error:", error);
    res.status(500).json({ message: 'Server error creating category' });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Public (For product forms)
exports.getCategoriesForAdmin = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error("Admin getCategories error:", error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

// --- IMPORTANT: Ensure getAllProducts is exported ---
// This function is used in adminRoutes.js for the Product Management page
exports.getAllProducts = async (req, res) => {
  try {
    let query = { status: 'Active' }; // Default to active products
    if (req.query.category) {
      const category = await Category.findOne({ name: { $regex: req.query.category, $options: 'i' } });
      if (category) {
        query.category = category._id;
      } else {
        return res.json([]); // Return empty if category not found
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Admin getAllProducts error:", error);
    res.status(500).json({ message: 'Server error fetching all products' });
  }
};

// --- IMPORTANT: Ensure getProductById is exported ---
// This function is used in adminRoutes.js for editing a specific product
exports.getProductById = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameter

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  try {
    // Find product by the validated ID and populate category
    const product = await Product.findById(id).populate('category', 'name');

    if (product) {
      // Optionally check if product is active (admin might need to see archived too, but for editing it's fine)
      // if (product.status === 'Archived') {
      //    return res.status(404).json({ message: 'Product is not available.' });
      // }
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Admin getProductById error for ID ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching product details' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get current month and last month dates
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Revenue (from all paid orders)
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Revenue for current month and last month
    const currentMonthRevenue = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      { 
        $match: { 
          isPaid: true, 
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Calculate revenue change percentage
    const currentRevenue = currentMonthRevenue[0]?.total || 0;
    const lastRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueChange = lastRevenue > 0 ? 
      ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 
      currentRevenue > 0 ? 100 : 0;

    // New Orders this month vs last month
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfCurrentMonth }
    });

    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const ordersChange = lastMonthOrders > 0 ? 
      ((currentMonthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1) : 
      currentMonthOrders > 0 ? 100 : 0;

    // New Users this month vs last month
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfCurrentMonth }
    });

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const usersChange = lastMonthUsers > 0 ? 
      ((currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1) : 
      currentMonthUsers > 0 ? 100 : 0;

    // Total products in stock
    const totalStock = await Product.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, total: { $sum: "$stock" } } }
    ]);

    // Get stock from last week for comparison
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // For stock change, we'll calculate based on new products added this week
    const newProductsThisWeek = await Product.countDocuments({
      createdAt: { $gte: oneWeekAgo },
      status: 'Active'
    });

    const stats = {
      totalRevenue: {
        value: totalRevenue[0]?.total || 0,
        change: revenueChange,
        isPositive: parseFloat(revenueChange) >= 0
      },
      newOrders: {
        value: currentMonthOrders,
        change: ordersChange,
        isPositive: parseFloat(ordersChange) >= 0
      },
      newUsers: {
        value: currentMonthUsers,
        change: usersChange,
        isPositive: parseFloat(usersChange) >= 0
      },
      totalStock: {
        value: totalStock[0]?.total || 0,
        change: newProductsThisWeek,
        isPositive: true // New products is always positive
      }
    };

    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: 'Server error fetching dashboard statistics' });
  }
};

// @desc    Get sales data for chart (last 6 months)
// @route   GET /api/admin/dashboard/sales
// @access  Private (Admin)
exports.getSalesData = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const salesData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          sales: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Create array of last 6 months with proper month names
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Find matching sales data
      const salesForMonth = salesData.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1
      );

      months.push({
        name: monthName,
        Sales: Math.round(salesForMonth?.sales || 0)
      });
    }

    res.json(months);
  } catch (error) {
    console.error("Sales data error:", error);
    res.status(500).json({ message: 'Server error fetching sales data' });
  }
};

// @desc    Get recent orders for dashboard
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private (Admin)
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id user totalPrice status createdAt');

    // Format the orders for frontend
    const formattedOrders = recentOrders.map(order => ({
      id: order._id.toString().slice(-8).toUpperCase(), // Last 8 characters of ObjectId
      customer: order.user?.name || 'Unknown Customer',
      amount: order.totalPrice,
      status: order.status
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Recent orders error:", error);
    res.status(500).json({ message: 'Server error fetching recent orders' });
  }
};

// @desc    Get revenue analytics data
// @route   GET /api/admin/analytics/revenue
// @access  Private (Admin)
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get daily revenue for the last 30 days
    const revenueData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    // Create array of last 30 days with proper formatting
    const dailyRevenue = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Find matching revenue data
      const revenueForDay = revenueData.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1 &&
        item._id.day === date.getDate()
      );

      dailyRevenue.push({
        name: dateString,
        revenue: Math.round(revenueForDay?.revenue || 0),
        orders: revenueForDay?.orderCount || 0
      });
    }

    res.json(dailyRevenue);
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res.status(500).json({ message: 'Server error fetching revenue analytics' });
  }
};

// @desc    Get product analytics (stock levels, best sellers)
// @route   GET /api/admin/analytics/products
// @access  Private (Admin)
exports.getProductAnalytics = async (req, res) => {
  try {
    // Get products with low stock (less than 10)
    const lowStockProducts = await Product.find({ 
      status: 'Active', 
      stock: { $lt: 10 } 
    })
    .populate('category', 'name')
    .select('name stock category')
    .sort({ stock: 1 })
    .limit(10);

    // Get best selling products (based on order frequency)
    const bestSellers = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalSold: 1,
          revenue: 1,
          currentStock: "$product.stock"
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          name: "$category.name",
          count: 1,
          totalStock: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      lowStockProducts,
      bestSellers,
      categoryStats
    });
  } catch (error) {
    console.error("Product analytics error:", error);
    res.status(500).json({ message: 'Server error fetching product analytics' });
  }
};

// @desc    Get order analytics
// @route   GET /api/admin/analytics/orders
// @access  Private (Admin)
exports.getOrderAnalytics = async (req, res) => {
  try {
    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Monthly order trends (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyOrderTrends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          avgOrderValue: { $avg: "$totalPrice" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format monthly trends
    const formattedMonthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthData = monthlyOrderTrends.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1
      );

      formattedMonthlyTrends.push({
        name: monthName,
        orders: monthData?.orderCount || 0,
        revenue: Math.round(monthData?.totalRevenue || 0),
        avgOrderValue: Math.round(monthData?.avgOrderValue || 0)
      });
    }

    res.json({
      orderStatusStats,
      monthlyOrderTrends: formattedMonthlyTrends
    });
  } catch (error) {
    console.error("Order analytics error:", error);
    res.status(500).json({ message: 'Server error fetching order analytics' });
  }
};