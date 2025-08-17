import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Tag, DollarSign, Package } from 'lucide-react';

// We import the mock data to find the product to edit.
// In a real app, you would fetch this product from your API using its ID.
import { mockProducts } from '../../data/mockDatabase';

const EditProductPage = () => {
    // 1. Get the productId from the URL (e.g., '3' from '/admin/products/edit/3')
    const { productId } = useParams();
    const navigate = useNavigate();

    // 2. Find the specific product from our mock data using the ID.
    // We use parseInt because the ID from the URL is a string.
    const productToEdit = mockProducts.find(p => p.id === parseInt(productId));

    // Handle case where the product isn't found
    if (!productToEdit) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <Link to="/admin/products" className="mt-4 inline-block text-indigo-600 hover:underline">
                    Return to Product List
                </Link>
            </div>
        );
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would gather form data and send a PUT or PATCH request
        // to your backend API to update the product in the database.
        alert(`(Simulation) Product "${productToEdit.name}" has been updated successfully!`);
        navigate('/admin/products'); // Go back to the product list after saving
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                    <p className="text-gray-500 mt-1">Updating details for: <span className="font-semibold">{productToEdit.name}</span></p>
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
                        <input type="text" id="product-name" className="mt-1 w-full border rounded-md p-2" defaultValue={productToEdit.name} />
                    </div>
                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="product-description" rows="6" className="mt-1 w-full border rounded-md p-2" defaultValue="A placeholder for the full product description..."></textarea>
                    </div>
                    {/* Image Management */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                        <div className="flex gap-4 mb-4">
                            {productToEdit.images.map((img, index) => (
                                <img key={index} src={img} alt={`Product thumbnail ${index+1}`} className="w-20 h-20 rounded-md object-cover border"/>
                            ))}
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Upload New Images</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-sm text-gray-600">Drag & drop or click to replace images</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Organization */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" id="price" className="w-full pl-9 pr-4 py-2 border rounded-md" defaultValue={productToEdit.price.toFixed(2)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <div className="relative mt-1">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="number" id="stock" className="w-full pl-9 pr-4 py-2 border rounded-md" defaultValue={productToEdit.stock} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select id="category" className="mt-1 w-full border rounded-md p-2 bg-white" defaultValue={productToEdit.category}>
                            <option>Men</option>
                            <option>Women</option>
                            <option>Unisex</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Product Status</label>
                        <div className="mt-2 space-y-2">
                           <label className="flex items-center"><input type="radio" name="status" defaultChecked={productToEdit.status === 'Active'} /> <span className="ml-2">Active</span></label>
                           <label className="flex items-center"><input type="radio" name="status" defaultChecked={productToEdit.status === 'Archived'} /> <span className="ml-2">Archived</span></label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Link to="/admin/products" className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Cancel</Link>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
            </div>
        </form>
    );
};

export default EditProductPage;