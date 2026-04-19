// src/pages/public/ProductListPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { formatCurrency } from '../../utils/currencyFormatter';

const FilterSection = ({ title, options, onFilterChange }) => {
    const [selected, setSelected] = useState([]);

    const handleCheckboxChange = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        setSelected(newSelected);
        onFilterChange(title.toLowerCase(), newSelected); // Pass the filter change up
    };

    return (
        <div className="py-4 border-b">
            <h3 className="font-semibold text-gray-800 flex justify-between items-center cursor-pointer">
                {title}
                <FiChevronDown />
            </h3>
            <div className="mt-2 space-y-2">
                {options.map(option => (
                    <label key={option} className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selected.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                        />
                        <span className="ml-3 text-gray-600">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false); // Separate loading for filters
    const [error, setError] = useState('');
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterState, setFilterState] = useState({ category: [], size: [], color: [] });
    const location = useLocation();

    // Centralized fetch function
    const fetchProductsData = async (shouldShowMainLoader = false) => {
        if (shouldShowMainLoader) setLoading(true);
        else setFilterLoading(true);

        try {
            const params = new URLSearchParams();
            
            // Get category from URL or filter state
            const categoryFromUrl = new URLSearchParams(location.search).get('category');
            if (filterState.category.length > 0) {
                params.append('category', filterState.category[0]);
            } else if (categoryFromUrl) {
                params.append('category', categoryFromUrl);
            }

            if (filterState.size.length > 0) params.append('sizes', filterState.size.join(','));
            if (filterState.color.length > 0) params.append('colors', filterState.color.join(','));
            if (searchTerm.trim()) params.append('search', searchTerm.trim());

            const response = await axios.get(`/api/products?${params.toString()}`);
            setProducts(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.response?.data?.message || err.message || 'Failed to load products.');
        } finally {
            setLoading(false);
            setFilterLoading(false);
        }
    };

    // Initial fetch for products and filters
    useEffect(() => {
        const fetchFilters = async () => {
             try {
                const filtersResponse = await axios.get('/api/products/filters');
                if (filtersResponse.data) {
                    const { categories, sizes, colors } = filtersResponse.data;
                    setAvailableCategories(categories.map(cat => cat.name));
                    setAvailableSizes(sizes);
                    setAvailableColors(colors);
                }
            } catch (err) {
                console.error("Error fetching filters:", err);
            }
        };
        fetchFilters();
        fetchProductsData(true);
    }, [location.search]);

    // Recalculate when filters change
    useEffect(() => {
        // Skip initial mount as it's handled by location effect
        if (!loading) {
            fetchProductsData();
        }
    }, [filterState]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loading) fetchProductsData();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilterChange = (filterType, values) => {
        setFilterState(prev => ({ ...prev, [filterType]: values }));
    };

    // Main loading state with beautiful spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center py-20 text-red-600">
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
                            <FilterSection title="Category" options={availableCategories} onFilterChange={handleFilterChange} />
                            {availableSizes.length > 0 && <FilterSection title="Size" options={availableSizes} onFilterChange={handleFilterChange} />}
                            {availableColors.length > 0 && <FilterSection title="Color" options={availableColors} onFilterChange={handleFilterChange} />}
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="relative mb-6">
                             <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                             />
                             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Filter Loading State */}
                        {filterLoading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!filterLoading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <Link to={`/products/${product._id}`} key={product._id} className="group">
                                            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                                <img 
                                                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.png';
                                                    }}
                                                />
                                            </div>
                                            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                            <div className="flex items-center mt-1">
                                               {product.rating && [...Array(5)].map((_, i) => (
                                                   <FiStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400 w-4 h-4' : 'text-gray-300 w-4 h-4'} />
                                               ))}
                                               {product.rating && (
                                                   <span className="ml-2 text-xs text-gray-500">
                                                       ({product.reviewsCount || 0})
                                                   </span>
                                               )}
                                            </div>
                                            <p className="mt-1 text-lg font-medium text-gray-900">
                                                {formatCurrency(product.price)}
                                            </p>
                                            {product.category && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {product.category.name}
                                                </p>
                                            )}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                No products match your current filters.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;