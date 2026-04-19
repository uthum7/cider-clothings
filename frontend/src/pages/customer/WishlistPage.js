// src/pages/customer/WishlistPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiX } from 'react-icons/fi'; // Icons for cart and remove
import axios from 'axios'; // Import axios for API calls
import { useAuth } from '../../context/AuthContext'; // Import useAuth for token
import { useCart } from '../../context/CartContext'; // Import useCart
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/currencyFormatter';

const WishlistPage = () => {
    // State for wishlist items, loading, and error
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get auth token from context
    const { authToken } = useAuth();
    const { addToCart, removeFromWishlist } = useCart();
    const { showConfirm } = useModal();
    const { showSuccess, showError } = useToast();

    // Function to fetch wishlist items (defined outside useEffect to be reusable)
    const fetchWishlist = async () => {
        setLoading(true);
        setError(''); // Clear previous errors
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

            // Make API call to fetch user's wishlist
            const response = await axios.get('/api/users/wishlist', config);
            setWishlistItems(response.data);

        } catch (err) {
            console.error("Fetch Wishlist API Error:", err);
            let errorMessage = 'Failed to fetch wishlist.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            setWishlistItems([]); // Clear wishlist on error
        } finally {
            setLoading(false);
        }
    };

    // Fetch wishlist items when the component mounts or when authToken changes
    useEffect(() => {
        fetchWishlist();
    }, [authToken]); // Re-fetch if auth token changes

    // Handle removing an item from the wishlist
    const handleRemove = async (productId) => {
        const confirmed = await showConfirm(
            'Remove from Wishlist',
            'Are you sure you want to remove this item from your wishlist?'
        );
        if (!confirmed) return;

        try {
            // Call context to remove item from wishlist
            await removeFromWishlist(productId);

            // Update state to remove item from UI immediately
            setWishlistItems(wishlistItems.filter(item => item._id !== productId));
            showSuccess('Item removed from wishlist!');

        } catch (err) {
            console.error("Remove from Wishlist API Error:", err);
            let errorMessage = 'Failed to remove item from wishlist. Please try again.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };
    
    // Handle moving an item to the cart - FIXED IMPLEMENTATION
    const handleMoveToCart = async (productId) => {
        try {
            // Use context to add to cart to update global state
            await addToCart(productId, 1);
            console.log(`Item ${productId} added to cart successfully`);
            
            // Call context to remove from wishlist
            await removeFromWishlist(productId);
            
            // Update the wishlist state to remove the item
            setWishlistItems(wishlistItems.filter(item => item._id !== productId));
            
            showSuccess('Item moved to cart successfully!');

        } catch (err) {
            console.error("Move to Cart API Error:", err);
            let errorMessage = 'Failed to move item to cart. Please try again.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            showError(errorMessage);
        }
    };

    // Handle loading, error, and empty states
    if (loading) {
        return <div className="text-center py-12">Loading wishlist...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Wishlist</h1>
                <p className="mt-2 text-gray-600">Your saved items for later.</p>

                {wishlistItems.length === 0 ? (
                    // Message when wishlist is empty
                    <div className="text-center mt-12">
                        <p className="text-xl text-gray-600">Your wishlist is empty.</p>
                         <Link to="/products" className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    // Grid to display wishlist items
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlistItems.map(item => (
                            <div key={item._id} className="bg-white rounded-lg shadow-md group relative">
                                <Link to={`/products/${item._id}`}>
                                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg overflow-hidden">
                                        <img src={item.image || '/placeholder-image.png'} alt={item.name} className="w-full h-full object-center object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm text-gray-700">{item.name}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">{formatCurrency(item.price)}</p>
                                    </div>
                                </Link>
                                <div className="p-4 border-t">
                                    <button onClick={() => handleMoveToCart(item._id)} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 text-sm">
                                        <FiShoppingCart /> Move to Cart
                                    </button>
                                </div>
                                <button onClick={() => handleRemove(item._id)} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100">
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