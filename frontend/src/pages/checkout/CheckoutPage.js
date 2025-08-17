import React from 'react';

// Mock data for the cart items being purchased
const orderItems = [
    { id: 1, name: 'Classic Denim Jacket', price: 79.99, quantity: 1 },
    { id: 2, name: 'Organic Cotton Tee', price: 24.99, quantity: 2 },
];
const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const total = subtotal + 10.00; // Including dummy shipping

const CheckoutPage = () => {
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // In a real app, you would submit the form data to your backend
        alert('Order placed successfully! (simulation)');
    };

    return (
        <div className="bg-gray-50">
            <main className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">Checkout</h1>

                <form onSubmit={handlePlaceOrder} className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <section className="lg:col-span-7">
                        {/* Shipping Information */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                           <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                           <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                               <div>
                                   <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                   <input type="text" id="first-name" name="first-name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                               </div>
                               <div>
                                   <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                   <input type="text" id="last-name" name="last-name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                               </div>
                               <div className="sm:col-span-2">
                                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                   <input type="text" id="address" name="address" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                               </div>
                               {/* ... other address fields: city, state, zip */}
                           </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-medium text-gray-900">Payment details</h2>
                             <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
                                <div className="col-span-4">
                                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
                                    <input type="text" id="card-number" name="card-number" placeholder="XXXX XXXX XXXX XXXX" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                </div>
                                <div className="col-span-3">
                                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                                    <input type="text" id="expiration-date" name="expiration-date" placeholder="MM / YY" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input type="text" id="cvc" name="cvc" required placeholder="XXX" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                </div>
                             </div>
                        </div>
                    </section>
                    
                    {/* Order summary */}
                    <section className="mt-16 lg:mt-0 lg:col-span-5">
                         <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                            <ul className="divide-y divide-gray-200 mt-4">
                               {orderItems.map(item => (
                                   <li key={item.id} className="flex py-4 items-center justify-between">
                                       <p>{item.name} x{item.quantity}</p>
                                       <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                   </li>
                               ))}
                            </ul>
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                                <div className="flex justify-between text-sm"><p>Shipping</p><p>$10.00</p></div>
                                <div className="flex justify-between text-base font-medium"><p>Total</p><p>${total.toFixed(2)}</p></div>
                            </div>
                            <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Place Order</button>
                         </div>
                    </section>
                </form>
            </main>
        </div>
    );
};

export default CheckoutPage;