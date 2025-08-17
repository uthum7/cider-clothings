import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
// Import the icons we will use
import { FiUser, FiBox, FiHeart, FiShoppingCart, FiMessageSquare, FiLogOut, FiArrowRight } from 'react-icons/fi';

const CustomerDashboardPage = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    // Array for the main dashboard navigation links
    const dashboardLinks = [
        { to: '/profile', icon: <FiUser size={30} />, title: 'My Profile', description: 'Edit personal info & addresses.' },
        { to: '/orders', icon: <FiBox size={30} />, title: 'My Orders', description: 'Track, return, or buy items again.' },
        { to: '/wishlist', icon: <FiHeart size={30} />, title: 'My Wishlist', description: 'View your saved items for later.' },
        { to: '/cart', icon: <FiShoppingCart size={30} />, title: 'Shopping Cart', description: 'Review and edit items in your cart.' },
        { to: '/support', icon: <FiMessageSquare size={30} />, title: 'Customer Support', description: 'Get help with orders or other issues.' },
        { action: logout, icon: <FiLogOut size={30} />, title: 'Logout', description: 'Sign out of your account securely.' }
    ];

    // --- NEW: Mock data for the "Latest Products" section ---
    // In a real app, you would fetch this from your backend.
    const latestProducts = [
        { id: 101, name: 'Urban Explorer Jacket', price: '129.99', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=300&h=400&auto=format&fit=crop' },
        { id: 102, name: 'Sunset Orange Hoodie', price: '69.99', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&h=400&auto=format&fit=crop' },
        { id: 103, name: 'Essential Cotton Tee', price: '29.99', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&h=400&auto=format&fit=crop' },
        { id: 104, name: 'Retro High-Top Sneakers', price: '99.99', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=300&h=400&auto=format&fit=crop' },
    ];

    // Dummy banner image from Unsplash
    const bannerImageUrl = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop';

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                
                {/* --- Attractive Banner Section --- */}
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-lg mb-10">
                    <img src={bannerImageUrl} alt="Fashion Banner" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Welcome, {user.name}!</h1>
                        <p className="mt-2 text-lg text-gray-200 max-w-lg">Your personal space to manage all your account activity.</p>
                    </div>
                </div>
                
                {/* --- Dashboard Links Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardLinks.map((link) => {
                        const cardContent = (
                            <>
                                <div className="text-indigo-600 mr-5 flex-shrink-0 pt-1">{link.icon}</div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-800">{link.title}</h2>
                                    <p className="mt-1 text-gray-500">{link.description}</p>
                                </div>
                                <FiArrowRight className="text-gray-300 group-hover:text-indigo-500 transition-colors ml-4" size={24} />
                            </>
                        );

                        if (link.action) {
                            return (
                                <button key={link.title} onClick={link.action} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-center w-full text-left group">
                                    {cardContent}
                                </button>
                            );
                        }

                        return (
                            <Link key={link.to} to={link.to} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-center group">
                                {cardContent}
                            </Link>
                        );
                    })}
                </div>

                {/* --- NEW: Latest Products Section --- */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">New Arrivals For You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestProducts.map((product) => (
                            <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
                                <div className="w-full h-64">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-lg font-bold text-indigo-600 mt-1">${product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerDashboardPage;