// src/pages/public/ProductListPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiStar } from 'react-icons/fi';

// --- 1. IMPORT YOUR LOCAL IMAGES ---
import shairt1_img from '../../assets/shairt1.jpg';
import shairt2_img from '../../assets/shairt2.jpg';
import shairt3_img from '../../assets/shairt3.webp';
import shairt4_img from '../../assets/shairt4.webp';
import shairt5_img from '../../assets/shairt5.webp';
import shairt6_img from '../../assets/shairt6.webp';

// --- 2. UPDATE THE products ARRAY WITH THE IMPORTED IMAGES ---
const products = [
    { id: 1, name: 'Classic Blue Shirt', price: '45.00', image: shairt1_img, rating: 4 },
    { id: 2, name: 'Striped Casual Shirt', price: '55.00', image: shairt2_img, rating: 5 },
    { id: 3, name: 'Formal White Shirt', price: '60.00', image: shairt1_img, rating: 4 },
    { id: 4, name: 'Linen Summer Shirt', price: '49.99', image: shairt1_img, rating: 5 },
    { id: 5, name: 'Flannel Checkered Shirt', price: '65.50', image: shairt2_img, rating: 5 },
    { id: 6, name: 'Vintage Graphic Tee', price: '35.00', image: shairt1_img, rating: 4 },
];

const FilterSection = ({ title, options }) => (
    <div className="py-4 border-b">
        <h3 className="font-semibold text-gray-800 flex justify-between items-center cursor-pointer">
            {title}
            <FiChevronDown />
        </h3>
        <div className="mt-2 space-y-2">
            {options.map(option => (
                <label key={option} className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-3 text-gray-600">{option}</span>
                </label>
            ))}
        </div>
    </div>
);

const ProductListPage = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="pb-6 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Our Collection</h1>
                    <p className="mt-4 text-base text-gray-500">
                        Explore our curated selection of high-quality clothing.
                    </p>
                </header>

                <div className="flex pt-8">
                    {/* Filters */}
                    <aside className="hidden lg:block w-64 pr-8">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <div className="mt-4">
                            <FilterSection title="Category" options={['Shirts', 'T-Shirts', 'Pants', 'Jackets']} />
                            <FilterSection title="Size" options={['XS', 'S', 'M', 'L', 'XL']} />
                            <FilterSection title="Color" options={['Black', 'White', 'Blue', 'Red']} />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="relative mb-6">
                             <input 
                                type="text"
                                placeholder="Search for products..."
                                className="w-full pl-10 pr-4 py-2 border rounded-md"
                             />
                             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                            {products.map((product) => (
                                <Link to={`/products/${product.id}`} key={product.id} className="group">
                                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover group-hover:opacity-75" />
                                    </div>
                                    <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                    <div className="flex items-center mt-1">
                                       {[...Array(5)].map((_, i) => <FiStar key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'} />)}
                                    </div>
                                    <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                                </Link>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;