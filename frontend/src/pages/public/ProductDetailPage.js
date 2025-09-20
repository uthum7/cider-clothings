// src/pages/public/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const { addToCart, addToWishlist } = useCart();
    const { showSuccess, showError, showWarning } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Fetch product details
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`/api/products/${productId}`);
                const fetchedProduct = response.data;
                setProduct(fetchedProduct);
                if (fetchedProduct.images && fetchedProduct.images.length > 0) {
                    setSelectedImage(fetchedProduct.images[0]);
                }
                if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
                    setSelectedSize(fetchedProduct.sizes[0]);
                }
                if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
                    setSelectedColor(fetchedProduct.colors[0]);
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                let errorMessage = 'Failed to fetch product details.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        } else if (value === 0) {
            setQuantity(1);
        }
    };

    // Enhanced Handler for adding the product to the cart
    const handleAddToCart = async () => {
        if (!product) {
            showError("Product not loaded. Please try again.");
            return;
        }

        // Only check for required selections if the product actually has these options
        const hasRequiredSizes = product.sizes && product.sizes.length > 0;
        const hasRequiredColors = product.colors && product.colors.length > 0;

        if (hasRequiredSizes && !selectedSize) {
            showWarning("Please select a size before adding to cart.");
            return;
        }

        if (hasRequiredColors && !selectedColor) {
            showWarning("Please select a color before adding to cart.");
            return;
        }

        if (!authToken) {
            showWarning("Please sign in to add items to your cart.");
            navigate('/signin');
            return;
        }

        try {
            setAddingToCart(true);
            await addToCart(product._id, quantity);
            
            showSuccess(
                `${quantity} x ${product.name} added to your cart!`, 
                3000
            );
            
        } catch (err) {
            console.error("Add to Cart Error:", err);
            let errorMessage = 'Failed to add item to cart.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            showError(errorMessage);
        } finally {
            setAddingToCart(false);
        }
    };

    // Enhanced Handler for adding the product to the wishlist
    const handleAddToWishlist = async () => {
        if (!product) {
            showError("Product not loaded. Please try again.");
            return;
        }

        if (!authToken) {
            showWarning("Please sign in to add items to your wishlist.");
            navigate('/signin');
            return;
        }

        try {
            setAddingToWishlist(true);
            await addToWishlist(product._id);
            
            showSuccess(
                `${product.name} added to your wishlist!`,
                3000
            );
        } catch (err) {
            console.error("Add to Wishlist Error:", err);
            let errorMessage = 'Failed to add item to wishlist.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            showError(errorMessage);
        } finally {
            setAddingToWishlist(false);
        }
    };

    // Render loading state with beautiful spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Render error message if fetching failed
    if (error) {
        return (
            <div className="text-center py-20 text-red-600">
                <p>{error}</p>
                <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    // Render if product not found
    if (!product) {
        return (
             <div className="text-center py-20">
                <p>Product not found.</p>
                <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    // Render product details
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image gallery */}
                    <div>
                        <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
                            <img src={selectedImage || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png')} alt={product.name} className="w-full h-full object-center object-cover" />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleThumbnailClick(image)}
                                        className={`rounded-lg overflow-hidden border-2 p-0.5 ${selectedImage === image ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-center object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
                        <p className="text-3xl text-gray-900 mt-2">LKR {product.price?.toLocaleString()}</p>

                        <div className="mt-4 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                                ))}
                            </div>
                            <p className="ml-2 text-sm text-gray-500">{product.reviewsCount || 0} reviews</p>
                        </div>

                        <p className="mt-6 text-gray-600">{product.description}</p>

                        <div className="mt-6">
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {product.colors && product.colors.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm text-gray-900 font-medium">Color</h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedColor === color ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex items-center border rounded-md px-3 py-2">
                                <label htmlFor="quantity" className="mr-2 text-sm font-medium text-gray-700">Qty:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                    className="w-16 text-center border-none focus:ring-0 focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button,&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <button
                               onClick={handleAddToCart}
                               disabled={addingToCart || !product}
                               className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${
                                 addingToCart 
                                   ? 'bg-gray-400 cursor-not-allowed' 
                                   : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                               } text-white`}
                           >
                               {addingToCart ? (
                                   <>
                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                       Adding...
                                   </>
                               ) : (
                                   <>
                                       <FiShoppingCart /> Add to Cart
                                   </>
                               )}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                disabled={addingToWishlist || !product}
                                className={`p-3 border rounded-md transition-all ${
                                  addingToWishlist 
                                    ? 'bg-gray-100 cursor-not-allowed' 
                                    : 'hover:bg-gray-100 active:scale-95'
                                }`}
                            >
                                {addingToWishlist ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                                ) : (
                                    <FiHeart className="text-gray-600" />
                                )}
                           </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                        <div className="mt-6 space-y-6">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="p-4 border-b">
                                    <div className="flex items-center mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                        ))}
                                        <p className="ml-4 font-semibold">{review.user}</p>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;