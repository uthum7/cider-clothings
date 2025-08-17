import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
// Import data from the central mock database
import { mockProducts } from '../../data/mockDatabase';

const ProductManagementPage = () => {

  const handleDelete = (productId) => {
    // In a real app, you would make an API call to the backend
    console.log(`SIMULATING API CALL: Deleting product with ID ${productId}`);
    alert(`(Simulation) Product ${productId} deleted.`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <Link to="/admin/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <PlusCircle size={20} />
          Add New Product
        </Link>
      </div>
      {/* Search Input */}
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
            {mockProducts.map((product) => (
              <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  <span className={product.stock < 10 ? 'text-red-500 font-bold' : ''}>{product.stock} units</span>
                </td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                    <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit">
                    <Edit size={18} />
                  </Link>

                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagementPage;