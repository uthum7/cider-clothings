// src/pages/admin/EditProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, DollarSign, Package } from 'lucide-react';
import axios from 'axios'; // Import axios
import { useAuth } from '../../context/AuthContext'; // To get the token
import { getColorCode } from '../../utils/colorHelper';

const EditProductPage = () => {
    const { productId } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const { authToken } = useAuth(); // Get the auth token

    // State for form fields
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [sizes, setSizes] = useState('');
    const [colors, setColors] = useState('');
    const [status, setStatus] = useState('Active');
    const [images, setImages] = useState([]); // For new images
    const [previewImages, setPreviewImages] = useState([]); // For image previews
    const [currentImages, setCurrentImages] = useState([]); // To store existing image URLs

    // Error and success messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // --- Fetch Categories for the dropdown ---
    const [availableCategories, setAvailableCategories] = useState([]);
    const [categoryError, setCategoryError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Ensure this API endpoint is correct and working
                const response = await axios.get('/api/products/categories'); // Use public route for categories
                if (response.data && Array.isArray(response.data)) {
                    setAvailableCategories(response.data);
                } else {
                    console.error("Unexpected response format for categories:", response.data);
                    setCategoryError("Failed to load categories.");
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                let errorMessage = 'Failed to load categories.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setCategoryError(errorMessage);
            }
        };
        fetchCategories();
    }, []);
    // --- End Fetch Categories ---

    // Fetch product details when the component mounts or productId changes
    useEffect(() => {
        const fetchProductDetails = async () => {
            setError(''); // Clear previous errors

            // Validate token availability
            const token = authToken || localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found. Please sign in.");
                navigate('/signin'); // Redirect if no token
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                // Make API call to get product details
                const response = await axios.get(`/api/admin/products/${productId}`, config); // <-- Adjust API path if needed, assuming GET /api/admin/products/:id
                const fetchedProduct = response.data;

                // Populate form fields with fetched data
                setProductName(fetchedProduct.name);
                setDescription(fetchedProduct.description);
                setPrice(fetchedProduct.price.toFixed(2)); // Format price
                setStock(fetchedProduct.stock);
                setCategory(fetchedProduct.category._id); // Set category ID
                setSizes(fetchedProduct.sizes?.join(', ') || '');
                setColors(fetchedProduct.colors?.join(', ') || '');
                setStatus(fetchedProduct.status);
                setCurrentImages(fetchedProduct.images || []); // Set current images

            } catch (err) {
                console.error(`Error fetching product ${productId}:`, err);
                let errorMessage = `Failed to fetch product details for ID ${productId}.`;
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            }
        };

        if (productId) { // Only fetch if productId is valid
            fetchProductDetails();
        }
    }, [productId, authToken, navigate]); // Dependencies for the effect

    // Handles changes to the file input for images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files); // Store the new files selected
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(filePreviews); // Create previews for display
    };

    // Handles form submission to update the product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic client-side validation
        if (!productName || !description || !price || !stock || !category) {
            setError('Please fill in all required fields.');
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
        formData.append('sizes', sizes);
        formData.append('colors', colors);
        formData.append('status', status);

        // Append new images if any were selected
        images.forEach(image => {
            formData.append('images', image); // Append each new image file
        });

        try {
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

            // Make the API call to update the product
            const response = await axios.put(`/api/admin/products/${productId}`, formData, config); // Use PUT request to update

            setSuccess('Product updated successfully!');
            // Redirect to the product management page after a short delay
            setTimeout(() => {
                navigate('/admin/products');
            }, 1500);

        } catch (err) {
            console.error("Update Product API Error:", err);
            let errorMessage = 'Failed to update product. Please try again.';
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
                    <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                    <p className="text-gray-500 mt-1">Updating details for: <span className="font-semibold">{productName || 'Product'}</span></p>
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
                            type="text" id="product-name" className="mt-1 w-full border rounded-md p-2"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="product-description" rows="6" className="mt-1 w-full border rounded-md p-2"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    {/* Image Management */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {/* Display current images */}
                            {currentImages.map((img, index) => (
                                <img key={index} src={img} alt={`Current product image ${index + 1}`} className="w-20 h-20 rounded-md object-cover border"/>
                            ))}
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Upload New Images (or Replace)</label>
                        <input
                            type="file"
                            id="product-images-upload"
                            multiple // Allow multiple files
                            accept="image/*" // Accept only image files
                            onChange={handleImageChange}
                            className="hidden" // Hide the default input
                        />
                        {/* This label makes the dashed area clickable */}
                        <label htmlFor="product-images-upload" className="mt-1 block cursor-pointer">
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">Drag & drop or click to replace images</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            </div>
                        </label>
                        {/* Display Previews of New Uploaded Images */}
                        {previewImages.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {previewImages.map((preview, index) => (
                                    <img key={index} src={preview} alt={`New preview ${index + 1}`} className="w-20 h-20 rounded-md object-cover border"/>
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
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text" id="price" className="w-full pl-9 pr-4 py-2 border rounded-md"
                                value={price} onChange={(e) => setPrice(e.target.value)} required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <div className="relative mt-1">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="number" id="stock" className="w-full pl-9 pr-4 py-2 border rounded-md"
                                value={stock} onChange={(e) => setStock(e.target.value)} required min="0"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            className="mt-1 w-full border rounded-md p-2 bg-white"
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
                        <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Available Sizes (comma-separated)</label>
                        <input
                            type="text" id="sizes" className="mt-1 w-full border rounded-md p-2"
                            value={sizes} onChange={(e) => setSizes(e.target.value)}
                        />
                    </div>
                     <div>
                        <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Available Colors (comma-separated)</label>
                        <input
                            type="text" id="colors" className="mt-1 w-full border rounded-md p-2"
                            value={colors} onChange={(e) => setColors(e.target.value)}
                        />
                        {colors && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {colors.split(',').map(c => c.trim()).filter(Boolean).map((color, index) => (
                                    <div key={index} className="flex flex-col items-center gap-1 group">
                                        <div 
                                            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: getColorCode(color) }}
                                            title={color}
                                        />
                                        <span className="text-[10px] text-gray-500 truncate max-w-[60px]">{color}</span>
                                    </div>
                                ))}
                            </div>
                        )}
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
                    // Disable button if essential fields are empty, or category fetch failed
                    disabled={!productName || !price || !stock || !category || availableCategories.length === 0}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default EditProductPage;