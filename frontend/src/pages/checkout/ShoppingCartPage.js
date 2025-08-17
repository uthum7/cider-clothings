import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiTag, FiArrowRight } from 'react-icons/fi';

import shairt1_img from '../../assets/shairt1.jpg';
import shairt2_img from '../../assets/shairt2.jpg';

// Mock data - in a real app, this would come from a global state (Context/Redux)
const initialCartItems = [
    { id: 1, name: 'Classic Denim Jacket', price: 79.99, image: shairt1_img, quantity: 1, size: 'M', color: 'Blue' },
    { id: 2, name: 'Organic Cotton Tee', price: 24.99, image: shairt2_img, quantity: 2, size: 'L', color: 'White' },
];

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState(initialCartItems);

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 10; // Example: free shipping over $50
    const tax = subtotal * 0.08; // Example: 8% tax
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">Shopping Cart</h1>
                
                {cartItems.length === 0 ? (
                    <div className="text-center mt-8">
                        <p className="text-xl text-gray-600">Your cart is empty.</p>
                        <Link to="/products" className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                        <section className="lg:col-span-7 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="sr-only">Items in your shopping cart</h2>
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex py-6">
                                        <div className="flex-shrink-0 w-24 h-32 border border-gray-200 rounded-md overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div>
                                                <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{item.color} / {item.size}</p>
                                                <p className="mt-1 text-base font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                <div className="flex items-center border rounded">
                                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-2 py-1">-</button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-2 py-1">+</button>
                                                </div>
                                                <button onClick={() => handleRemoveItem(item.id)} type="button" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
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
                                    <p className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</p>
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
                            <div className="mt-6">
                                <div className="flex">
                                    <input type="text" placeholder="Gift card or discount code" className="flex-grow border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500" />
                                    <button className="bg-gray-200 text-gray-600 px-4 rounded-r-md hover:bg-gray-300">Apply</button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Link to="/checkout" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center">
                                    Proceed to Checkout <FiArrowRight className="ml-2" />
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