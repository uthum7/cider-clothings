// backend/controllers/userController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose'); // For ObjectId validation

// --- Profile Management Functions ---

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get User Profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    // Handle profile picture upload if present
    if (req.file) {
      user.profilePicture = req.file.path; // Cloudinary URL
    }

    await user.save();
    
    // Return user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Update User Profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// --- Order Management Functions ---

// @desc    Get logged in user's orders
// @route   GET /api/users/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.productId', 'name images')
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }
    res.json(orders);
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ message: 'Server error fetching user orders.' });
  }
};

// @desc    Get a single order by ID for the logged-in user
// @route   GET /api/users/my-orders/:orderId
// @access  Private
exports.getMyOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, user: req.user.id })
      .populate('orderItems.productId', 'name images')
      .populate('user', 'name email profilePicture');

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to this user.' });
    }
    res.json(order);
  } catch (error) {
    console.error("getMyOrderById error:", error);
    res.status(500).json({ message: 'Server error fetching order details.' });
  }
};

// --- Wishlist Management Functions ---

// @desc    Get logged in user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name price images'); // Populate product details

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Map to a cleaner format for the frontend
    const wishlistWithDetails = user.wishlist.map(item => ({
      _id: item._id, // Product ID
      name: item.name,
      price: item.price,
      image: item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.png', // Fallback image
    }));

    res.json(wishlistWithDetails);
  } catch (error) {
    console.error("Get Wishlist error:", error);
    res.status(500).json({ message: 'Server error fetching wishlist.' });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  console.log("addToWishlist: Received request with productId:", productId);

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    console.error("addToWishlist: Invalid productId format.");
    return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("addToWishlist: User not found for ID:", req.user.id);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log("addToWishlist: User found. Current wishlist:", user.wishlist);

    // Check if the product ID already exists in the wishlist array
    const productAlreadyInWishlist = user.wishlist.some(wishlistItemId => wishlistItemId.toString() === productId);

    if (productAlreadyInWishlist) {
      console.log(`addToWishlist: Product ${productId} already in wishlist.`);
      return res.status(400).json({ message: 'Product already in wishlist.' });
    }

    // Add the productId
    user.wishlist.push(productId);
    await user.save();

    console.log("addToWishlist: Product added. New wishlist length:", user.wishlist.length);
    res.status(201).json({ message: 'Product added to wishlist successfully.' });

  } catch (error) {
    console.error("Add to Wishlist error:", error);
    res.status(500).json({ message: 'Server error adding item to wishlist.' });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`removeFromWishlist: User found. Current wishlist length: ${user.wishlist.length}`);

    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());

    if (user.wishlist.length === initialLength) {
      console.log(`removeFromWishlist: Product ${productId} not found in wishlist.`);
      return res.status(404).json({ message: 'Product not found in wishlist.' });
    }

    await user.save();
    console.log(`removeFromWishlist: Product ${productId} removed. New wishlist length: ${user.wishlist.length}`);
    res.json({ message: 'Product removed from wishlist successfully.' });

  } catch (error) {
    console.error("Remove from Wishlist error:", error);
    res.status(500).json({ message: 'Server error removing item from wishlist.' });
  }
};

// --- Cart Management Functions ---

// @desc    Get logged in user's cart
// @route   GET /api/users/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    console.log("Get Cart: Starting to fetch cart for user:", req.user.id);
    
    // Find the user and populate the cart with product details
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name description price images category stock status',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Get Cart: User found, cart items count:", user.cart.length);

    // Filter out cart items where the product is null (deleted products)
    const validCartItems = user.cart.filter(item => item.product !== null);

    // If we found invalid items, clean up the user's cart
    if (validCartItems.length !== user.cart.length) {
      console.log("Get Cart: Found invalid cart items, cleaning up...");
      user.cart = validCartItems;
      await user.save();
    }

    // Format the cart items for the frontend
    const formattedCartItems = validCartItems.map(item => {
      const product = item.product;
      
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        category: product.category ? product.category.name : 'Uncategorized',
        stock: product.stock,
        quantity: item.quantity,
        cartItemId: item._id, // This is the cart item's unique ID
        size: item.size || null,
        color: item.color || null
      };
    });

    console.log("Get Cart: Formatted cart items:", formattedCartItems.length);
    res.json(formattedCartItems);

  } catch (error) {
    console.error('Get Cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const userId = req.user.id;

    console.log("Add to Cart: Request data:", { productId, quantity, size, color, userId });

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || product.status !== 'Active') {
      return res.status(404).json({ message: 'Product not found or not available' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if item already exists in cart
    const existingCartItem = user.cart.find(item => 
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock for this quantity' });
      }
      existingCartItem.quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity,
        size,
        color
      });
    }

    await user.save();
    console.log("Add to Cart: Item added successfully");
    res.json({ message: 'Item added to cart successfully' });

  } catch (error) {
    console.error('Add to Cart error:', error);
    res.status(500).json({ message: 'Server error adding item to cart' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/users/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    console.log("Update Cart: Request data:", { productId, quantity, userId });

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find cart item
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product || product.status !== 'Active') {
      return res.status(404).json({ message: 'Product not found or not available' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await user.save();

    console.log("Update Cart: Quantity updated successfully");
    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Update Cart error:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    console.log("Remove from Cart: Request data:", { productId, userId });

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and remove cart item
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();

    console.log("Remove from Cart: Item removed successfully");
    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from Cart error:', error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/users/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Clear the cart array
    user.cart = [];
    await user.save();

    console.log(`Cart cleared for user: ${req.user.id}`);
    res.json({ 
      message: 'Cart cleared successfully.',
      cartItemsCount: 0 
    });

  } catch (error) {
    console.error("Clear Cart error:", error);
    res.status(500).json({ 
      message: 'Server error clearing cart.',
      error: error.message 
    });
  }
};

// --- Address Management Functions ---

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.addresses);
  } catch (error) {
    console.error('Get Addresses error:', error);
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
};

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
exports.addUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAddress = req.body;
    
    // If this is set as default, remove default from other addresses
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Add Address error:', error);
    res.status(500).json({ message: 'Server error adding address' });
  }
};

// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Update address fields
    Object.assign(address, req.body);

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();
    res.json({ message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Update Address error:', error);
    res.status(500).json({ message: 'Server error updating address' });
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses.pull(addressId);
    await user.save();

    res.json({ message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Delete Address error:', error);
    res.status(500).json({ message: 'Server error deleting address' });
  }
};