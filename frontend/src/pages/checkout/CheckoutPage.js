import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { getColorCode } from '../../utils/colorHelper';

const PROVINCES = [
    'Central', 'Eastern', 'North Central', 'Northern', 
    'North Western', 'Sabaragamuwa', 'Southern', 'Uva', 'Western'
];

const COUNTRIES = [
    'Sri Lanka', 'India', 'United States', 'United Kingdom', 'Australia', 
    'Canada', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Saudi Arabia', 
    'Oman', 'Singapore', 'Malaysia', 'Japan', 'France', 'Germany', 
    'Italy', 'Spain', 'New Zealand', 'Maldives'
];

const CheckoutPage = () => {
    const { cartItems, loading, fetchCartItems } = useCart();
    const [orderLoading, setOrderLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form data state
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka', // Added default country
        phone: ''
    });
    
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardName: ''
    });

    const { authToken } = useAuth();
    const navigate = useNavigate();

    // Removed native fetch logic heavily dependent on auth. CartContext handles this intelligently now.
    // Sync cart when authToken changes
    useEffect(() => {
        fetchCartItems();
    }, [authToken]);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Handle form input changes
    const handleShippingChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentInfo({
            ...paymentInfo,
            [e.target.name]: e.target.value
        });
    };

    // Format card number input
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setPaymentInfo({
            ...paymentInfo,
            cardNumber: formatted
        });
    };

    // Payment processing - Using PayHere (Most popular in Sri Lanka)
    const processPayment = (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Generate hash on backend for security
                const config = authToken ? {
                    headers: { Authorization: `Bearer ${authToken}` }
                } : {};
                
                const hashResponse = await axios.post('/api/payment/generate-hash', {
                    order_id: orderId,
                    amount: total.toFixed(2),
                    currency: "LKR"
                }, config);
                
                const { hash, merchant_id } = hashResponse.data;
                
                // PayHere configuration
                const payment = {
                    sandbox: true, // Set to false for production
                    merchant_id: merchant_id, 
                    return_url: `${window.location.origin}/order-success`,
                    cancel_url: `${window.location.origin}/checkout`,
                    notify_url: `${window.location.origin}/api/payment/notify`, // Replace with your public webhook URL in production!
                    order_id: orderId,
                    items: cartItems.map(item => item.name).join(', ').substring(0, 100),
                    amount: total.toFixed(2),
                    currency: "LKR",
                    hash: hash, 
                    first_name: shippingInfo.firstName,
                    last_name: shippingInfo.lastName,
                    email: "customer@example.com", // Replace appropriately if user email is available
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    country: "Sri Lanka"
                };

                // PayHere checkout events
                window.payhere.onCompleted = function onCompleted(completedOrderId) {
                    console.log("Payment completed. OrderID:" + completedOrderId);
                    resolve(completedOrderId);
                };

                window.payhere.onDismissed = function onDismissed() {
                    console.log("Payment dismissed");
                    reject("Payment was canceled by user");
                };

                window.payhere.onError = function onError(error) {
                    console.log("Error:" + error);
                    reject(error);
                };

                // Open PayHere UI
                console.log('Triggering PayHere checkout modal...');
                window.payhere.startPayment(payment);
            } catch (error) {
                console.error("Failed to initialize payment:", error);
                reject("Failed to securely setup payment gateway.");
            }
        });
    };

    // Handle order submission
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setOrderLoading(true);
        setError('');

        try {
            // Basic validation
            if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || !shippingInfo.city) {
                throw new Error("Please fill in all required shipping information");
            }

            console.log('Starting order creation...');

            // Create order data with correct structure for backend
            const orderData = {
                orderItems: cartItems.map(item => ({
                    productId: item._id, // Map standard logic
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    size: item.size,
                    color: item.color
                })),
                shippingAddress: {
                    firstName: shippingInfo.firstName,
                    lastName: shippingInfo.lastName,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zipCode: shippingInfo.zipCode || '00000', // Provide default if empty
                    country: shippingInfo.country,
                    phone: shippingInfo.phone
                },
                paymentMethod: 'PayHere',
                itemsPrice: subtotal,
                shippingPrice: shipping,
                taxPrice: tax,
                totalPrice: total
            };

            console.log('Order data being sent:', orderData);

            const config = authToken ? {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            } : {
                headers: { 'Content-Type': 'application/json' }
            };

            // Save order to database
            console.log('Sending order to backend...');
            const endpoint = authToken ? '/api/orders' : '/api/orders/guest';
            const orderResponse = await axios.post(endpoint, orderData, config);
            console.log('Order created successfully:', orderResponse.data);
            const orderId = orderResponse.data._id;

            // Process payment
            try {
                console.log('Processing payment...');
                await processPayment(orderId);
                console.log('Payment processed successfully');
                
                // If payment successful, update order status (optional - can be handled by webhook)
                // await axios.patch(`/api/orders/${orderId}`, { status: 'paid' }, config);
                
                // Clear cart
                console.log('Clearing cart...');
                if (authToken) {
                    await axios.delete('/api/users/cart', config); // Changed from /clear to match your route
                } else {
                    localStorage.removeItem('guestCart');
                    fetchCartItems();
                }
                console.log('Cart cleared successfully');
                
                // Redirect to success page
                navigate('/order-success', { 
                    state: { 
                        orderId: orderId,
                        orderTotal: total 
                    } 
                });
                
            } catch (paymentError) {
                console.error('Payment error:', paymentError);
                // If payment fails, you might want to update order status
                // await axios.patch(`/api/orders/${orderId}`, { status: 'failed' }, config);
                throw new Error("Payment processing failed: " + paymentError);
            }

        } catch (err) {
            console.error("Order submission error:", err);
            if (err.response) {
                console.error("Error response:", err.response.data);
                setError(err.response.data.message || "Failed to place order");
            } else {
                setError(err.message || "Failed to place order");
            }
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading checkout...</div>;
    }

    if (error && cartItems.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
                <button 
                    onClick={() => navigate('/cart')} 
                    className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                >
                    Go to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">Checkout</h1>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handlePlaceOrder} className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <section className="lg:col-span-7">
                        {/* Shipping Information */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name *</label>
                                    <input 
                                        type="text" 
                                        id="firstName" 
                                        name="firstName" 
                                        placeholder="e.g. John"
                                        required 
                                        value={shippingInfo.firstName}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name *</label>
                                    <input 
                                        type="text" 
                                        id="lastName" 
                                        name="lastName" 
                                        placeholder="e.g. Doe"
                                        required 
                                        value={shippingInfo.lastName}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
                                    <input 
                                        type="text" 
                                        id="address" 
                                        name="address" 
                                        placeholder="e.g. 123 Flower Road"
                                        required 
                                        value={shippingInfo.address}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        name="city" 
                                        placeholder="e.g. Colombo"
                                        required 
                                        value={shippingInfo.city}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                                    <input 
                                        type="text" 
                                        id="state" 
                                        name="state" 
                                        list="province-list"
                                        placeholder="Select or type province"
                                        value={shippingInfo.state}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <datalist id="province-list">
                                        {PROVINCES.map(province => (
                                            <option key={province} value={province} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        id="zipCode" 
                                        name="zipCode" 
                                        placeholder="e.g. 00100"
                                        value={shippingInfo.zipCode}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        placeholder="e.g. 0712345678"
                                        value={shippingInfo.phone}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                    <input 
                                        type="text"
                                        id="country" 
                                        name="country" 
                                        list="country-list"
                                        placeholder="Select or type country"
                                        value={shippingInfo.country}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <datalist id="country-list">
                                        {COUNTRIES.map(country => (
                                            <option key={country} value={country} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
                            <p className="text-sm text-gray-500 mt-1">Secured by PayHere - Sri Lanka's #1 Payment Gateway</p>
                            <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
                                <div className="col-span-4">
                                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                                    <input 
                                        type="text" 
                                        id="cardName" 
                                        name="cardName" 
                                        placeholder="e.g. JOHN DOE"
                                        value={paymentInfo.cardName}
                                        onChange={handlePaymentChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                                    <input 
                                        type="text" 
                                        id="cardNumber" 
                                        name="cardNumber" 
                                        placeholder="1234 5678 9012 3456" 
                                        value={paymentInfo.cardNumber}
                                        onChange={handleCardNumberChange}
                                        maxLength="19"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiration Date (MM/YY)</label>
                                    <input 
                                        type="text" 
                                        id="expiryDate" 
                                        name="expiryDate" 
                                        placeholder="MM/YY" 
                                        value={paymentInfo.expiryDate}
                                        onChange={handlePaymentChange}
                                        maxLength="5"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input 
                                        type="text" 
                                        id="cvc" 
                                        name="cvc" 
                                        placeholder="123" 
                                        value={paymentInfo.cvc}
                                        onChange={handlePaymentChange}
                                        maxLength="4"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Order Summary - Using Real Cart Data */}
                    <section className="mt-16 lg:mt-0 lg:col-span-5">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                            <ul className="divide-y divide-gray-200 mt-4">
                                {cartItems.map(item => (
                                    <li key={item._id} className="flex py-4 items-center justify-between">
                                        <div className="flex items-center">
                                            <img 
                                                src={item.image || '/placeholder-image.png'} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded mr-4"
                                            />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                {(item.size || item.color) && (
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                        {item.color && (
                                                            <div className="flex items-center gap-1">
                                                                <span 
                                                                    className="w-3 h-3 rounded-full border border-gray-300 inline-block" 
                                                                    style={{ backgroundColor: getColorCode(item.color) }}
                                                                    title={item.color}
                                                                />
                                                                {item.color}
                                                            </div>
                                                        )}
                                                        {item.color && item.size && <span>/</span>}
                                                        {item.size && <span>{item.size}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <p>Subtotal</p>
                                    <p>{formatCurrency(subtotal)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Shipping</p>
                                    <p>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Tax</p>
                                    <p>{formatCurrency(tax)}</p>
                                </div>
                                <div className="flex justify-between text-base font-medium border-t pt-2">
                                    <p>Total</p>
                                    <p>{formatCurrency(total)}</p>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={orderLoading}
                                className={`w-full mt-6 py-3 rounded-md text-white font-medium ${
                                    orderLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                {orderLoading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </section>
                </form>
            </main>
        </div>
    );
};

export default CheckoutPage;