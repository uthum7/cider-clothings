// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authToken, isLoggedIn } = useAuth();

  // Fetch cart items when user logs in
  useEffect(() => {
    if (isLoggedIn && authToken) {
      fetchCartItems();
      fetchWishlistItems();
    } else {
      // Clear cart and wishlist when user logs out
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isLoggedIn, authToken]);

  const fetchCartItems = async () => {
    if (!authToken) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/users/cart', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistItems = async () => {
    if (!authToken) return;
    
    try {
      const response = await axios.get('/api/users/wishlist', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setWishlistItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      setWishlistItems([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!authToken) {
      throw new Error('Please sign in to add items to cart');
    }

    try {
      const response = await axios.post('/api/users/cart', {
        productId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      // Refresh cart items after adding
      await fetchCartItems();
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const addToWishlist = async (productId) => {
    if (!authToken) {
      throw new Error('Please sign in to add items to wishlist');
    }

    try {
      const response = await axios.post('/api/users/wishlist', {
        productId
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      // Refresh wishlist items after adding
      await fetchWishlistItems();
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!authToken) return;
    
    try {
      await axios.delete(`/api/users/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!authToken) return;
    
    try {
      await axios.delete(`/api/users/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      await fetchWishlistItems();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (!authToken) return;
    
    try {
      await axios.patch(`/api/users/cart/${itemId}`, {
        quantity
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // Calculate totals
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const wishlistItemCount = wishlistItems.length;
  const cartTotal = cartItems.reduce((total, item) => {
    return total + ((item.product?.price || 0) * (item.quantity || 1));
  }, 0);

  const value = {
    cartItems,
    wishlistItems,
    cartItemCount,
    wishlistItemCount,
    cartTotal,
    loading,
    addToCart,
    addToWishlist,
    removeFromCart,
    removeFromWishlist,
    updateCartItemQuantity,
    fetchCartItems,
    fetchWishlistItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};