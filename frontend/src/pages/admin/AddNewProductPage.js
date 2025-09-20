// src/pages/admin/AddNewProductPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Tag, DollarSign, Package } from 'lucide-react';
// import axios from 'axios'; // Remove this import
import apiClient from '../../api/axiosConfig'; // <-- Import your configured axios instance
import { useAuth } from '../../context/AuthContext';

const AddNewProductPage = () => {
    // State variables for form inputs
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState(''); // To store the selected category ID
    const [status, setStatus] = useState('Active');
    const [images, setImages] = useState([]); // To hold the actual file objects
    const [previewImages, setPreviewImages] = useState([]); // For displaying image previews

    // Error and success messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Hooks for navigation and authentication
    const navigate = useNavigate();
    const { authToken } = useAuth(); // Ensure this hook provides the token correctly

    // --- Fetch Categories for the dropdown ---
    const [availableCategories, setAvailableCategories] = useState([]);
    const [categoryError, setCategoryError] = useState(''); // Specific error for category fetching

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Use apiClient for the request
                const response = await apiClient.get('/api/products/categories'); // <-- Use apiClient
                if (response.data && Array.isArray(response.data)) {
                    setAvailableCategories(response.data);
                } else {
                    console.error("Unexpected response format for categories:", response.data);
                    setCategoryError("Received invalid data for categories.");
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                let errorMessage = 'Failed to load categories.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setCategoryError(errorMessage); // Set specific category fetching error
            }
        };
        fetchCategories();
    }, []);
    // --- End Fetch Categories ---

    // Handles changes to the file input for images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(filePreviews);
    };

    // Handles form submission to add a new product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages

        // Basic client-side validation
        if (!productName || !description || !price || !stock || !category || images.length === 0) {
            setError('Please fill in all fields and upload at least one image.');
            return;
        }
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock, 10);
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Price must be a valid positive number.');
            return;
        }
        if (isNaN(stockNum) || stockNum < 0) {
            setError('Stock quantity must be a valid non-negative number.');
            return;
        }

        // Prepare data for API request (FormData for file uploads)
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category); // Sending the selected category ID
        formData.append('status', status);

        images.forEach(image => {
            formData.append('images', image); // Append each image file
        });

        try {
            // Get the authentication token. Prefer using context if available.
            const token = authToken || localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found. Please sign in.");
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            // Make the API call to create the product using apiClient
            await apiClient.post('/api/admin/products', formData, config); // <-- Use apiClient

            setSuccess('Product added successfully!');
            // Redirect to the product management page after a short delay
            setTimeout(() => {
                navigate('/admin/products');
            }, 1500);

        } catch (err) {
            console.error("Add Product API Error:", err);
            let errorMessage = 'Failed to add product. Please try again.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
                    <p className="text-gray-500 mt-1">Fill in the details below to add a new item to your store.</p>
                </div>
                <Link to="/admin/products" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600">
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Details */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text" id="product-name" className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Classic Denim Jacket"
                            value={productName} onChange={(e) => setProductName(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="product-description" rows="6" className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" placeholder="Describe the product..."
                            value={description} onChange={(e) => setDescription(e.target.value)} required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Images</label>
                        <input
                            type="file"
                            id="product-images"
                            multiple // Allows multiple file selection
                            accept="image/*" // Restrict to image files
                            onChange={handleImageChange}
                            className="hidden" // Hide the default file input
                        />
                        {/* This label makes the dashed area clickable to open the file picker */}
                        <label htmlFor="product-images" className="mt-1 block cursor-pointer">
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">Drag & drop files here or click to browse</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            </div>
                        </label>
                        {/* Display Image Previews */}
                        {previewImages.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {previewImages.map((preview, index) => (
                                    <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-20 h-20 rounded-md object-cover border"/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Pricing & Organization */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="text-gray-400" size={16} />
                            </div>
                            <input
                                type="text" id="price" className="w-full pl-9 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="0.00"
                                value={price} onChange={(e) => setPrice(e.target.value)} required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <div className="relative mt-1">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Package className="text-gray-400" size={16} />
                            </div>
                            <input
                                type="number" id="stock" className="w-full pl-9 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="0"
                                value={stock} onChange={(e) => setStock(e.target.value)} required min="0"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            className="mt-1 w-full border rounded-md p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            value={category} // Controlled component
                            onChange={(e) => setCategory(e.target.value)} // e.target.value will be the category ID
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {/* Render categories fetched from API */}
                            {availableCategories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        {/* Display error if category fetching failed */}
                        {categoryError && <p className="text-xs text-red-500 mt-1">{categoryError}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Product Status</label>
                        <div className="mt-2 space-y-2">
                           <label className="flex items-center">
                               <input
                                   type="radio" name="status" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" value="Active"
                                   checked={status === 'Active'} onChange={(e) => setStatus(e.target.value)}
                               />
                               <span className="ml-2">Active</span>
                           </label>
                           <label className="flex items-center">
                               <input
                                   type="radio" name="status" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" value="Archived"
                                   checked={status === 'Archived'} onChange={(e) => setStatus(e.target.value)}
                               />
                               <span className="ml-2">Archived</span>
                           </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Display generic form error or success message */}
            {error && <p className="text-center text-red-600">{error}</p>}
            {success && <p className="text-center text-green-600">{success}</p>}

            <div className="flex justify-end gap-4">
                <Link to="/admin/products" className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Cancel</Link>
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    // Disable button if essential fields are empty, no images selected, or category fetch failed
                    disabled={!productName || !price || !stock || !category || images.length === 0 || availableCategories.length === 0}
                >
                    Save Product
                </button>
            </div>
        </form>
    );
};

export default AddNewProductPage;