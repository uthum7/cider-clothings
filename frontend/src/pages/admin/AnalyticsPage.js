import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Import data from the central mock database
import { mockOrders, mockProducts } from '../../data/mockDatabase';

const AnalyticsPage = () => {
    // In a real app, you'd calculate this data on the backend
    const revenueData = mockOrders.map(order => ({ name: order.date, revenue: order.total }));
    const bestSellers = mockProducts.map(p => ({ name: p.name, stock: p.stock })).sort((a,b) => b.stock - a.stock).slice(0, 5);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Sales & Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Per Order</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Stock Levels</h3>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellers} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="stock" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;