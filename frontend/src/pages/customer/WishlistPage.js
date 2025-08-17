import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiX } from 'react-icons/fi';

import shairt1_img from '../../assets/shairt1.jpg';
import shairt2_img from '../../assets/shairt2.jpg';

// Mock data
const initialWishlistItems = [
    { id: 4, name: 'Leather Ankle Boots', price: '129.99', image: shairt1_img },
    { id: 6, name: 'Vintage Graphic Hoodie', price: '65.00', image: shairt2_img },
];

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

    const handleRemove = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
        // You would also call an API to update the backend
    };
    
    const handleMoveToCart = (id) => {
        // Logic to add item to cart would go here
        console.log(`Moving item ${id} to cart`);
        handleRemove(id); // Remove from wishlist after moving
    };

    return (
        <div className="bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Wishlist</h1>
                <p className="mt-2 text-gray-600">Your saved items for later.</p>

                {wishlistItems.length === 0 ? (
                    <div className="text-center mt-12">
                        <p className="text-xl text-gray-600">Your wishlist is empty.</p>
                         <Link to="/products" className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlistItems.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md group relative">
                                <Link to={`/products/${item.id}`}>
                                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover group-hover:opacity-75" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm text-gray-700">{item.name}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">${item.price}</p>
                                    </div>
                                </Link>
                                <div className="p-4 border-t">
                                    <button onClick={() => handleMoveToCart(item.id)} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 text-sm">
                                        <FiShoppingCart /> Move to Cart
                                    </button>
                                </div>
                                <button onClick={() => handleRemove(item.id)} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100">
                                    <FiX className="text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;