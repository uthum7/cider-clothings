import React from 'react';
import { Search } from 'lucide-react';
// Import data from the central mock database
import { mockOrders } from '../../data/mockDatabase';

const getStatusClass = (status) => {
  // Same styling function as before
  switch (status) {
    case 'Shipped': return 'bg-blue-100 text-blue-800';
    case 'Processing': return 'bg-yellow-100 text-yellow-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderManagementPage = () => {

  const handleStatusChange = (orderId, newStatus) => {
    // In a real app, this would be an API call to PATCH /api/orders/:orderId
    console.log(`SIMULATING API CALL: Updating order ${orderId} status to "${newStatus}"`);
    alert(`(Simulation) Order ${orderId} status updated to ${newStatus}. The customer will now see this new status in their order history.`);
    // You would then refetch the orders data to see the change
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>
      {/* Search Input */}
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
            {mockOrders.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-indigo-600">{order.id}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <select 
                    defaultValue={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementPage;