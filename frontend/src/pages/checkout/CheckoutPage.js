import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const CheckoutPage = () => {
    // State management
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // Fetch cart items on component mount
    useEffect(() => {
        fetchCartItems();
    }, [authToken]);

    const fetchCartItems = async () => {
        try {
            if (!authToken) {
                setError("Please sign in to continue checkout");
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };

            const response = await axios.get('/api/users/cart', config);
            console.log('Cart response:', response.data);
            
            if (response.data.length === 0) {
                setError("Your cart is empty. Add items before checkout.");
                setTimeout(() => navigate('/products'), 2000);
                return;
            }
            
            setCartItems(response.data);
        } catch (err) {
            console.error("Fetch cart error:", err);
            setError("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

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
    const processPayment = () => {
        return new Promise((resolve, reject) => {
            // PayHere configuration
            const payment = {
                sandbox: true, // Set to false for production
                merchant_id: "1221149", // Replace with your PayHere Merchant ID
                return_url: `${window.location.origin}/order-success`,
                cancel_url: `${window.location.origin}/checkout`,
                notify_url: "/api/payment/notify", // Your backend endpoint
                order_id: `ORDER_${Date.now()}`,
                items: cartItems.map(item => item.name).join(', '),
                amount: total.toFixed(2),
                currency: "LKR",
                hash: "", // Generate hash on backend for security
                first_name: shippingInfo.firstName,
                last_name: shippingInfo.lastName,
                email: "", // Get from user profile
                phone: shippingInfo.phone,
                address: shippingInfo.address,
                city: shippingInfo.city,
                country: "Sri Lanka"
            };

            // For demo purposes, simulate payment success after 2 seconds
            console.log('Processing payment with data:', payment);
            setTimeout(() => {
                console.log("Demo: Payment completed successfully");
                resolve(`DEMO_${Date.now()}`);
            }, 2000);

            // Uncomment below for actual PayHere integration
            /*
            // PayHere checkout
            payhere.startPayment(payment);

            payhere.onCompleted = function onCompleted(orderId) {
                console.log("Payment completed. OrderID:" + orderId);
                resolve(orderId);
            };

            payhere.onDismissed = function onDismissed() {
                console.log("Payment dismissed");
                reject("Payment was dismissed");
            };

            payhere.onError = function onError(error) {
                console.log("Error:" + error);
                reject(error);
            };
            */
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
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
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

            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };

            // Save order to database
            console.log('Sending order to backend...');
            const orderResponse = await axios.post('/api/orders', orderData, config);
            console.log('Order created successfully:', orderResponse.data);
            const orderId = orderResponse.data._id;

            // Process payment
            try {
                console.log('Processing payment...');
                await processPayment();
                console.log('Payment processed successfully');
                
                // If payment successful, update order status (optional - can be handled by webhook)
                // await axios.patch(`/api/orders/${orderId}`, { status: 'paid' }, config);
                
                // Clear cart
                console.log('Clearing cart...');
                await axios.delete('/api/users/cart', config); // Changed from /clear to match your route
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
                                        value={shippingInfo.state}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        id="zipCode" 
                                        name="zipCode" 
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
                                        value={shippingInfo.phone}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                    <select 
                                        id="country" 
                                        name="country" 
                                        value={shippingInfo.country}
                                        onChange={handleShippingChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="India">India</option>
                                        <option value="USA">United States</option>
                                        <option value="UK">United Kingdom</option>
                                    </select>
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
                                            </div>
                                        </div>
                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <p>Subtotal</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Shipping</p>
                                    <p>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Tax</p>
                                    <p>${tax.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-base font-medium border-t pt-2">
                                    <p>Total</p>
                                    <p>${total.toFixed(2)}</p>
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