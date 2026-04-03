// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); // If needed for user-specific checks

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found in the request.' });
  }

  // Basic validation for shipping address
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Valid shipping address is required.' });
  }

  try {
    // Create a new Order instance
    const order = new Order({
      user: req.user.id, // User ID from JWT
      orderItems: orderItems.map(item => ({
        productId: item.productId, // Make sure this is the MongoDB ObjectId
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // --- Decrement Stock for Purchased Products ---
    for (const item of createdOrder.orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock < item.quantity) {
          // This is a critical scenario: stock check failed or was insufficient.
          // You should ideally perform this check *before* creating the order on the frontend or backend.
          // For now, we'll log a warning and potentially adjust or mark the order for review.
          console.warn(`Insufficient stock for product ${product.name} (ID: ${product._id}). Ordered: ${item.quantity}, Available: ${product.stock}`);
          // Decide how to handle: e.g., throw an error, set order status to 'On Hold', notify admin.
          // For this example, we'll still decrement, but this needs robust handling.
          product.stock = 0; // Set to 0 if ordering more than available
        } else {
          product.stock -= item.quantity;
        }
        await product.save();
      } else {
        console.warn(`Product not found for stock update: ${item.productId}`);
      }
    }
    // --- End Stock Management ---

    // Respond with the newly created order
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Add order items error:", error);
    res.status(500).json({ message: 'Server error creating order.' });
  }
};

// @desc    Create new guest order
// @route   POST /api/orders/guest
// @access  Public
exports.addGuestOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found in the request.' });
  }

  // Basic validation for shipping address with guest details
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.country || !shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Valid shipping address and contact info (first name, last name, phone) is required.' });
  }

  try {
    // Create a new Order instance without user
    const order = new Order({
      orderItems: orderItems.map(item => ({
        productId: item.productId, 
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // --- Decrement Stock for Purchased Products ---
    for (const item of createdOrder.orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock < item.quantity) {
          console.warn(`Insufficient stock for product ${product.name} (ID: ${product._id}). Ordered: ${item.quantity}, Available: ${product.stock}`);
          product.stock = 0; 
        } else {
          product.stock -= item.quantity;
        }
        await product.save();
      } else {
        console.warn(`Product not found for stock update: ${item.productId}`);
      }
    }
    // --- End Stock Management ---

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Add guest order items error:", error);
    res.status(500).json({ message: 'Server error creating guest order.' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User or Admin)
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    // Populate user, product names, and images
    const order = await Order.findById(id)
      .populate('user', 'name email profilePicture') // Populate user details
      .populate('orderItems.productId', 'name images'); // Populate product details

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // --- Authorization Check ---
    // Allow access if the logged-in user is the owner of the order OR if the user is an Admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'User not authorized to view this order.' });
    }
    // --- End Authorization Check ---

    res.json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: 'Server error fetching order.' });
  }
};

// @desc    Update order to be paid (after payment confirmation)
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  const { id } = req.params; // Order ID
  const { paymentResult } = req.body; // Data from payment gateway

  if (!paymentResult || !paymentResult.id || !paymentResult.status) {
      return res.status(400).json({ message: 'Invalid payment result data.' });
  }

  try {
    const order = await Order.findById(id);

    if (order) {
      // Check if order is already paid to prevent duplicate processing
      if (order.isPaid) {
          return res.status(400).json({ message: 'Order has already been paid.' });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentResult.id,
        status: paymentResult.status,
        update_time: paymentResult.update_time, // From PayPal, for example
        email_address: paymentResult.payer.email_address, // From PayPal, for example
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    console.error("Update order to paid error:", error);
    res.status(500).json({ message: 'Server error updating order to paid.' });
  }
};

// @desc    Update order status (e.g., Shipped, Delivered)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only via adminRoutes, or can be accessed by user for tracking)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'Shipped', 'Delivered', 'Cancelled'

  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // --- Authorization Check for Status Change ---
    // Only Admin can change status to 'Shipped' or 'Delivered'
    // A user might be able to cancel if it's still 'Processing' (optional feature)
    if (req.user.role !== 'Admin' && (status === 'Shipped' || status === 'Delivered')) {
      return res.status(403).json({ message: 'Admin privileges required to update order status to Shipped or Delivered.' });
    }
    // Optional: Allow user to cancel if status is 'Processing'
    // if (req.user.role === 'Customer' && status === 'Cancelled' && order.status !== 'Processing') {
    //     return res.status(400).json({ message: 'Order cannot be cancelled at this stage.' });
    // }
    // --- End Authorization Check ---


    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else {
      // If status is changed from 'Delivered', reset delivered flags (optional)
      // if (order.status === 'Delivered') {
      //   order.isDelivered = false;
      //   order.deliveredAt = null;
      // }
    }

    const updatedOrder = await order.save();

    // --- Optional: Send email notification to customer about status change ---
    // try {
    //     await sendEmail({ ... });
    // } catch (emailError) { ... }
    // --- End Optional Email ---

    res.json(updatedOrder);

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: 'Server error updating order status.' });
  }
};