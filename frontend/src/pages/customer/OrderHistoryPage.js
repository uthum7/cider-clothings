import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);
    
    const { authToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [authToken]);

    const fetchOrders = async () => {
        try {
            if (!authToken) {
                setError("Please sign in to view your order history.");
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };

            console.log('Fetching orders...');
            const response = await axios.get('/api/users/my-orders', config);
            console.log('Orders response:', response.data);
            
            setOrders(response.data);
        } catch (err) {
            console.error("Fetch orders error:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Please sign in to view your order history.");
                } else if (err.response.status === 404) {
                    setError("No orders found.");
                    setOrders([]); // Set empty array so we don't show loading
                } else {
                    setError(err.response.data.message || "Failed to fetch orders.");
                }
            } else {
                setError("Failed to fetch orders. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'shipped': return 'text-blue-600 bg-blue-100';
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            case 'processing': return 'text-yellow-600 bg-yellow-100';
            case 'pending': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            return dateString;
        }
    };

    const getDateTimeAttribute = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            return dateString;
        }
    };

    const handleTrackOrder = (orderId) => {
        // Navigate to order details page or implement tracking logic
        console.log('Tracking order:', orderId);
        // You can implement this to show more detailed tracking info
    };

    const handleRequestReturn = (orderId) => {
        // Implement return request logic
        console.log('Requesting return for order:', orderId);
        // You can implement this to handle return requests
    };

    if (loading) {
        return (
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !authToken) {
        return (
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order History</h1>
                        <p className="text-red-600 text-lg mb-4">{error}</p>
                        <Link 
                            to="/auth" 
                            className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Order History</h1>
                <p className="mt-2 text-gray-600">Check the status of recent orders, manage returns, and discover similar products.</p>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                        <button 
                            onClick={fetchOrders}
                            className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {orders.length === 0 && !loading && !error ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-6">When you place your first order, it will appear here.</p>
                        <Link 
                            to="/products" 
                            className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 space-y-8">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="p-4 sm:p-6 sm:flex sm:items-center sm:justify-between">
                                    <div className="flex-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div>
                                            <dt className="font-medium text-gray-900">Order number</dt>
                                            <dd className="mt-1">#{order._id.slice(-8).toUpperCase()}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">Date placed</dt>
                                            <dd className="mt-1">
                                                <time dateTime={getDateTimeAttribute(order.createdAt)}>
                                                    {formatDate(order.createdAt)}
                                                </time>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">Total amount</dt>
                                            <dd className="mt-1 font-medium text-gray-900">
                                                ${order.totalPrice?.toFixed(2) || '0.00'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">Status</dt>
                                            <dd className={`mt-1 font-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                                {order.status || 'Processing'}
                                                {order.isPaid && (
                                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                                        Paid
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-4">
                                        <button 
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} 
                                            className="w-full sm:w-auto bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 text-sm"
                                        >
                                            {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                                
                                {expandedOrder === order._id && (
                                    <div className="border-t border-gray-200 p-6">
                                        {/* Shipping Address */}
                                        <div className="mb-6">
                                            <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                                            <div className="text-sm text-gray-600">
                                                <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                                <p>{order.shippingAddress?.address}</p>
                                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                                <p>{order.shippingAddress?.country}</p>
                                                {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <h3 className="font-semibold text-lg mb-4">Items</h3>
                                        <ul role="list" className="divide-y divide-gray-200">
                                            {order.orderItems?.map((item, index) => (
                                                <li key={index} className="flex py-4">
                                                    <img 
                                                        src={item.image || item.productId?.images?.[0] || '/placeholder-image.png'} 
                                                        alt={item.name} 
                                                        className="w-16 h-24 rounded-md object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-gray-500">
                                                            ${item.price?.toFixed(2)} x {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Subtotal: ${(item.price * item.quantity)?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <Link 
                                                        to={`/products/${item.productId?._id || item.productId}`} 
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        View Product
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Order Summary */}
                                        <div className="mt-6 border-t border-gray-200 pt-4">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Items Price:</span>
                                                    <span>${order.itemsPrice?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Shipping:</span>
                                                    <span>${order.shippingPrice?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tax:</span>
                                                    <span>${order.taxPrice?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="flex justify-between font-semibold text-base border-t pt-2">
                                                    <span>Total:</span>
                                                    <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Information */}
                                        <div className="mt-4 text-sm text-gray-600">
                                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                            {order.isPaid && order.paidAt && (
                                                <p><strong>Paid At:</strong> {formatDate(order.paidAt)}</p>
                                            )}
                                            {order.isDelivered && order.deliveredAt && (
                                                <p><strong>Delivered At:</strong> {formatDate(order.deliveredAt)}</p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 flex flex-wrap gap-4">
                                            <button 
                                                onClick={() => handleTrackOrder(order._id)}
                                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                                            >
                                                Track Order
                                            </button>
                                            
                                            {order.status?.toLowerCase() === 'delivered' && (
                                                <button 
                                                    onClick={() => handleRequestReturn(order._id)}
                                                    className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50"
                                                >
                                                    Request Return
                                                </button>
                                            )}
                                            
                                            {(!order.isPaid && order.status?.toLowerCase() !== 'cancelled') && (
                                                <Link
                                                    to={`/checkout/${order._id}`}
                                                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                                                >
                                                    Complete Payment
                                                </Link>
                                            )}

                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                                            >
                                                View Full Details
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;