import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import shairt1_img from '../../assets/shairt1.jpg';
import shairt2_img from '../../assets/shairt2.jpg';

// Mock data
const orders = [
    {
        id: 'WU88191111',
        date: 'July 12, 2025',
        datetime: '2025-07-12',
        total: '160.00',
        status: 'Delivered',
        products: [
            { id: 1, name: 'Classic Denim Jacket', price: '79.99', image: shairt1_img },
            { id: 2, name: 'Organic Cotton Tee', price: '24.99', image: shairt2_img },
        ],
    },
    {
        id: 'WU88191102',
        date: 'July 5, 2025',
        datetime: '2025-07-05',
        total: '35.00',
        status: 'Shipped',
        products: [
            { id: 5, name: 'Wool Blend Scarf', price: '34.99', image: shairt2_img },
        ],
    },
];

const OrderHistoryPage = () => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shipped': return 'text-blue-600 bg-blue-100';
            case 'Delivered': return 'text-green-600 bg-green-100';
            case 'Cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Order History</h1>
                <p className="mt-2 text-gray-600">Check the status of recent orders, manage returns, and discover similar products.</p>

                <div className="mt-8 space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-4 sm:p-6 sm:flex sm:items-center sm:justify-between">
                                <div className="flex-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                                    <div>
                                        <dt className="font-medium text-gray-900">Order number</dt>
                                        <dd className="mt-1">{order.id}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-900">Date placed</dt>
                                        <dd className="mt-1"><time dateTime={order.datetime}>{order.date}</time></dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-900">Total amount</dt>
                                        <dd className="mt-1 font-medium text-gray-900">${order.total}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-900">Status</dt>
                                        <dd className={`mt-1 font-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>{order.status}</dd>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 sm:ml-4">
                                    <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="w-full sm:w-auto bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 text-sm">
                                        {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                            
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-200 p-6">
                                    <h3 className="font-semibold text-lg">Items</h3>
                                    <ul role="list" className="divide-y divide-gray-200 mt-4">
                                        {order.products.map((product) => (
                                            <li key={product.id} className="flex py-4">
                                                <img src={product.image} alt={product.name} className="w-16 h-24 rounded-md object-cover"/>
                                                <div className="ml-4 flex-1">
                                                    <p className="font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-gray-500">${product.price}</p>
                                                </div>
                                                <Link to={`/products/${product.id}`} className="text-indigo-600 hover:underline">View Product</Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-6 flex gap-4">
                                       <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Track Order</button>
                                       {order.status === 'Delivered' && <button className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50">Request Return</button>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;