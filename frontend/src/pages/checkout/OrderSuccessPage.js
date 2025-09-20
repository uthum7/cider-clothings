// src/pages/checkout/OrderSuccessPage.js
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ShoppingBagIcon, PrinterIcon } from '@heroicons/react/24/outline';

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get order details from navigation state
    const orderDetails = location.state;

    useEffect(() => {
        // If no order details, redirect to home
        if (!orderDetails || !orderDetails.orderId) {
            navigate('/', { replace: true });
        }
    }, [orderDetails, navigate]);

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
                        Order Placed Successfully!
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Thank you for your purchase. Your order has been confirmed and is being processed.
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Order ID: <span className="font-medium text-gray-900">#{orderDetails.orderId}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Placed on: <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                    ${orderDetails.orderTotal?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-sm text-gray-600">Total Amount</p>
                            </div>
                        </div>

                        {/* What's Next Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">1</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Order Confirmation</p>
                                        <p className="text-sm text-gray-600">You'll receive an email confirmation shortly with your order details.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span className="text-yellow-600 font-semibold text-sm">2</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Processing</p>
                                        <p className="text-sm text-gray-600">We'll prepare your order for shipment within 1-2 business days.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-sm">3</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Shipping</p>
                                        <p className="text-sm text-gray-600">You'll receive tracking information once your order ships.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/orders"
                                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-center font-medium"
                            >
                                View Order History
                            </Link>
                            <button
                                onClick={handlePrint}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                            >
                                <PrinterIcon className="h-5 w-5" />
                                Print Receipt
                            </button>
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                <ShoppingBagIcon className="h-5 w-5" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Customer Support Info */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-blue-900">Need Help?</h3>
                        <p className="mt-2 text-sm text-blue-700">
                            If you have any questions about your order, please don't hesitate to contact us.
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/support"
                                className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                            >
                                Contact Support
                            </Link>
                            <a
                                href="mailto:support@yourstore.com"
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;