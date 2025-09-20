// src/pages/customer/ShoppingCartPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiTrash2, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    const { authToken } = useAuth();
    const location = useLocation();

    // Function to fetch cart items
    const fetchCart = async () => {
        setLoading(true);
        setError('');
        try {
            if (!authToken) {
                setError("Authentication token not found. Please sign in.");
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };

            console.log("Fetching cart with config:", config);
            const response = await axios.get('/api/users/cart', config);
            console.log("Fetched cart response:", response.data);
            
            // Ensure response.data is an array
            if (Array.isArray(response.data)) {
                setCartItems(response.data);
            } else {
                console.error("Expected array but got:", typeof response.data);
                setCartItems([]);
            }

        } catch (err) {
            console.error("Fetch Cart API Error:", err);
            let errorMessage = 'Failed to fetch cart.';
            
            if (err.response) {
                console.error("Error response:", err.response);
                if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.status === 401) {
                    errorMessage = 'Please sign in to view your cart.';
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart items when component mounts, authToken changes, or when navigating to this page
    useEffect(() => {
        if (authToken) {
            fetchCart();
        } else {
            setLoading(false);
            setError("Please sign in to view your cart.");
        }
    }, [authToken, location.pathname]);

    // Handle quantity change
    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdating(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };

            console.log("Updating quantity:", { productId, newQuantity });
            
            // Make API call to update quantity
            const response = await axios.put(
                `/api/users/cart/${productId}`, 
                { quantity: newQuantity }, 
                config
            );

            console.log("Update quantity response:", response.data);

            // Update local state after successful API call
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId 
                        ? { ...item, quantity: newQuantity } 
                        : item
                )
            );

        } catch (err) {
            console.error("Update Cart Quantity API Error:", err);
            let errorMessage = 'Failed to update quantity.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
            
            // Optionally refresh cart on error to sync with server
            setTimeout(() => {
                fetchCart();
                setError('');
            }, 2000);
        } finally {
            setUpdating(false);
        }
    };

    // Handle removing an item from the cart
    const handleRemoveItem = async (productId) => {
        if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }

        setUpdating(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };

            console.log("Removing item:", productId);
            
            const response = await axios.delete(`/api/users/cart/${productId}`, config);
            console.log("Remove item response:", response.data);

            // Update local state
            setCartItems(prevItems => 
                prevItems.filter(item => item._id !== productId)
            );

        } catch (err) {
            console.error("Remove from Cart API Error:", err);
            let errorMessage = 'Failed to remove item from cart.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
            
            // Optionally refresh cart on error to sync with server
            setTimeout(() => {
                fetchCart();
                setError('');
            }, 2000);
        } finally {
            setUpdating(false);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 0;
        return sum + (itemPrice * itemQuantity);
    }, 0);
    
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Handle loading state
    if (loading) {
        return (
            <div className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error && !loading) {
        return (
            <div className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg mb-4">{error}</div>
                        {!authToken && (
                            <div className="space-y-4">
                                <Link 
                                    to="/auth" 
                                    className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                                >
                                    Sign In
                                </Link>
                                <div className="text-gray-600">
                                    <Link to="/products" className="text-indigo-600 hover:text-indigo-700">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                        {authToken && (
                            <button 
                                onClick={fetchCart}
                                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">
                    Shopping Cart
                </h1>
                
                {cartItems.length === 0 ? (
                    <div className="text-center mt-8">
                        <p className="text-xl text-gray-600">Your cart is empty.</p>
                        <Link 
                            to="/products" 
                            className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                        {/* Cart Items Section */}
                        <section className="lg:col-span-7 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="sr-only">Items in your shopping cart</h2>
                            
                            {updating && (
                                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-700 text-sm">
                                    Updating cart...
                                </div>
                            )}
                            
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="flex py-6">
                                        <div className="flex-shrink-0 w-24 h-32 border border-gray-200 rounded-md overflow-hidden">
                                            <img 
                                                src={item.image || '/placeholder-image.png'} 
                                                alt={item.name} 
                                                className="w-full h-full object-center object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.png';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div>
                                                <h3 className="text-base font-medium text-gray-900">
                                                    {item.name}
                                                </h3>
                                                {item.category && (
                                                    <p className="text-sm text-gray-500">
                                                        {item.category}
                                                    </p>
                                                )}
                                                {(item.size || item.color) && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.color && `${item.color}`}
                                                        {item.color && item.size && ` / `}
                                                        {item.size}
                                                    </p>
                                                )}
                                                <p className="mt-1 text-base font-medium text-gray-900">
                                                    ${(item.price || 0).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border rounded">
                                                    <button 
                                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                        disabled={updating || item.quantity <= 1}
                                                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                        disabled={updating || item.quantity >= item.stock}
                                                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                {/* Remove Item Button */}
                                                <button 
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    disabled={updating}
                                                    type="button" 
                                                    className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <FiTrash2 /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Order summary */}
                        <section className="mt-16 lg:mt-0 lg:col-span-5 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Subtotal</p>
                                    <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Shipping estimate</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {subtotal > 50 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </p>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Tax estimate</p>
                                    <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-base font-medium text-gray-900">
                                    <p>Order total</p>
                                    <p>${total.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            {subtotal <= 50 && (
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                    <p className="text-sm text-yellow-700">
                                        Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
                                    </p>
                                </div>
                            )}
                            
                            {/* Proceed to Checkout button */}
                            <div className="mt-6">
                                <Link 
                                    to="/checkout" 
                                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center transition-colors"
                                >
                                    Proceed to Checkout <FiArrowRight className="ml-2" />
                                </Link>
                            </div>
                            
                            <div className="mt-4 text-center">
                                <Link 
                                    to="/products" 
                                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartPage;