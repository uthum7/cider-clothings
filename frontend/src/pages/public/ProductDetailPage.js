import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';

import shairt1_img from '../../assets/shairt1.jpg';
import shairt2_img from '../../assets/shairt2.jpg';
import shairt6_img from '../../assets/shairt6.webp';

// Mock data - in a real app, you'd fetch this based on the product ID from the URL
const product = {
    id: 1,
    name: 'Classic Denim Jacket',
    price: '79.99',
    images: [
        shairt1_img,    // Main front view
        shairt2_img,    // Different angle or detail shot
        shairt6_img,    // Lifestyle or context shot
    ],
    rating: 4.5,
    reviewsCount: 12,
    description: 'A timeless denim jacket made from 100% premium cotton. Features a classic button-front closure, chest pockets, and a comfortable fit for all-day wear.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black', 'Washed Grey'],
    reviews: [
        { user: 'Jane D.', rating: 5, comment: 'Absolutely love this jacket! Fits perfectly.' },
        { user: 'John S.', rating: 4, comment: 'Great quality, but runs a little small.' },
    ]
};

const ProductDetailPage = () => {
    const { productId } = useParams(); // Gets the ID from the URL like /products/1
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image gallery */}
                    <div>
                        <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
                            <img src={selectedImage} alt="Main product" className="w-full h-full object-center object-cover" />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {product.images.map((image, index) => (
                                <button key={index} onClick={() => setSelectedImage(image)} className={`rounded-lg overflow-hidden ${selectedImage === image ? 'ring-2 ring-indigo-500' : ''}`}>
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-center object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product info */}
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
                        <p className="text-3xl text-gray-900 mt-2">${product.price}</p>
                        
                        {/* Reviews summary */}
                        <div className="mt-4 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />)}
                            </div>
                            <p className="ml-2 text-sm text-gray-500">{product.reviewsCount} reviews</p>
                        </div>

                        <p className="mt-6 text-gray-600">{product.description}</p>
                        
                        {/* Options */}
                        <div className="mt-6">
                            {/* Sizes */}
                            <div>
                                <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                                <div className="mt-2 flex gap-2">
                                    {product.sizes.map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md text-sm ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-300'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             {/* Colors */}
                            <div className="mt-6">
                                <h3 className="text-sm text-gray-900 font-medium">Color</h3>
                                <div className="mt-2 flex gap-2">
                                    {product.colors.map(color => (
                                        <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border rounded-md text-sm ${selectedColor === color ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-300'}`}>
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add to cart */}
                        <div className="mt-8 flex gap-4">
                           <button className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <FiShoppingCart /> Add to Cart
                           </button>
                           <button className="p-3 border rounded-md hover:bg-gray-100">
                                <FiHeart className="text-gray-600" />
                           </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                    <div className="mt-6 space-y-6">
                        {product.reviews.map((review, index) => (
                            <div key={index} className="p-4 border-b">
                                <div className="flex items-center mb-1">
                                    {[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />)}
                                    <p className="ml-4 font-semibold">{review.user}</p>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;