// src/pages/admin/ProductManagementPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
// Remove: import axios from 'axios';
import apiClient from '../../api/axiosConfig'; // <-- Import your configured axios instance
import { useAuth } from '../../context/AuthContext';

// ... (FilterSection component remains the same) ...

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
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

        // *** Make the API call using apiClient ***
        const response = await apiClient.get('/api/admin/products', config); // <-- Use apiClient
        setProducts(response.data);

      } catch (err) {
        console.error("Fetch Products API Error:", err);
        let errorMessage = 'Failed to fetch products.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authToken]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }

    try {
        const token = authToken || localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found. Please sign in.");
            return;
        }
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Make API call to delete the product using apiClient
        await apiClient.delete(`/api/admin/products/${productId}`, config); // <-- Use apiClient

        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully!');

    } catch (err) {
        console.error("Delete Product API Error:", err);
        let errorMessage = 'Failed to delete product. Please try again.';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }
        setError(errorMessage);
    }
  };

  // ... (rest of the component is the same) ...
  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <Link to="/admin/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <PlusCircle size={20} />
          Add New Product
        </Link>
      </div>
      <div className="relative mb-6">
         <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
         />
         <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Product Name</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <img src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? 'text-red-500 font-bold' : ''}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagementPage;