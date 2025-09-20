// src/pages/admin/OrderManagementPage.js
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
// Remove mock data import
// import { mockOrders } from '../../data/mockDatabase'; // Mock data is no longer used
import axios from 'axios'; // Import axios
import { useAuth } from '../../context/AuthContext'; // Import useAuth for token

const getStatusClass = (status) => {
  switch (status) {
    case 'Shipped': return 'bg-blue-100 text-blue-800';
    case 'Processing': return 'bg-yellow-100 text-yellow-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderManagementPage = () => {
  // State for orders, loading, and error
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get auth token
  const { authToken } = useAuth();

  // Fetch orders when the component mounts or authToken changes
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        if (!authToken) {
          setError("Authentication token not found. Please sign in.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include token
          },
        };

        // Make API call to fetch orders from the backend
        const response = await axios.get('/api/admin/orders', config); // Use admin route for orders
        setOrders(response.data); // Set fetched orders to state

      } catch (err) {
        console.error("Fetch Orders API Error:", err);
        let errorMessage = 'Failed to fetch orders.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setOrders([]); // Clear orders on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]); // Re-fetch if auth token changes

  // Handle status change (simulation, would be API call in real app)
  const handleStatusChange = async (orderId, newStatus) => {
    // In a real app, this would be an API call to PATCH /api/orders/:orderId/status
    console.log(`SIMULATING API CALL: Updating order ${orderId} status to "${newStatus}"`);
    alert(`(Simulation) Order ${orderId} status updated to ${newStatus}.`);

    // Optionally, refetch or update state to reflect the change immediately
    // For simplicity, we're not refetching here, but you might want to:
    // await fetchOrders(); // Or update the specific order in state
  };

  // Handle loading, error, and empty states
  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>
      {/* Search Input */}
      <div className="relative mb-6">
         <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
         />
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Using Lucide Search */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="bg-white border-b hover:bg-gray-50"> {/* Use order._id */}
                  <td className="px-6 py-4 font-medium text-indigo-600">{order.id}</td> {/* Display order ID */}
                  <td className="px-6 py-4">
                    <div>{order.user?.name || 'N/A'}</div> {/* Safely access user name */}
                    <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div> {/* Safely access user email */}
                  </td>
                  <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td> {/* Use totalPrice from fetched order */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Status change dropdown */}
                    <select
                      defaultValue={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)} // Use order._id for the call
                      className="border border-gray-300 rounded-md p-1 text-xs focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              // Message if no orders are found
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementPage;