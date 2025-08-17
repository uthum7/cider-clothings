import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Tag, DollarSign, Package } from 'lucide-react';

const AddNewProductPage = () => {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would gather form data and send it to your backend API
        alert('(Simulation) Product has been added successfully!');
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
                        <input type="text" id="product-name" className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Classic Denim Jacket" />
                    </div>
                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="product-description" rows="6" className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" placeholder="Describe the product..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Images</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-sm text-gray-600">Drag & drop files here or click to browse</p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                            </div>
                        </div>
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
                            <input type="text" id="price" className="w-full pl-9 pr-4 py-2 border rounded-md" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <div className="relative mt-1">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Package className="text-gray-400" size={16} />
                            </div>
                            <input type="number" id="stock" className="w-full pl-9 pr-4 py-2 border rounded-md" placeholder="0" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select id="category" className="mt-1 w-full border rounded-md p-2 bg-white">
                            <option>Men</option>
                            <option>Women</option>
                            <option>Unisex</option>
                            <option>Kids</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Product Status</label>
                        <div className="mt-2 space-y-2">
                           <label className="flex items-center"><input type="radio" name="status" className="h-4 w-4" defaultChecked /> <span className="ml-2">Active</span></label>
                           <label className="flex items-center"><input type="radio" name="status" className="h-4 w-4" /> <span className="ml-2">Archived</span></label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Link to="/admin/products" className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Cancel</Link>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Product</button>
            </div>
        </form>
    );
};

export default AddNewProductPage;