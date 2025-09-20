import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import axios from 'axios';

const AnalyticsPage = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [productAnalytics, setProductAnalytics] = useState({});
  const [orderAnalytics, setOrderAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Fetch all analytics data
      const [revenueRes, productRes, orderRes] = await Promise.all([
        axios.get('/api/admin/analytics/revenue', config),
        axios.get('/api/admin/analytics/products', config),
        axios.get('/api/admin/analytics/orders', config)
      ]);

      setRevenueData(revenueRes.data);
      setProductAnalytics(productRes.data);
      setOrderAnalytics(orderRes.data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={fetchAnalyticsData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Sales & Analytics</h2>
        <button 
          onClick={fetchAnalyticsData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Revenue Analytics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Revenue (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              name === 'revenue' ? `$${value}` : value,
              name === 'revenue' ? 'Revenue' : 'Orders'
            ]} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
              name="Revenue ($)"
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.6}
              name="Orders"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productAnalytics.bestSellers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `$${value}` : value,
                name === 'revenue' ? 'Revenue' : 'Units Sold'
              ]} />
              <Legend />
              <Bar dataKey="totalSold" fill="#8884d8" name="Units Sold" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderAnalytics.orderStatusStats || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {(orderAnalytics.orderStatusStats || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Order Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderAnalytics.monthlyOrderTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `$${value}` : name === 'avgOrderValue' ? `$${value}` : value,
                name === 'revenue' ? 'Revenue' : name === 'avgOrderValue' ? 'Avg Order Value' : 'Orders'
              ]} />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productAnalytics.categoryStats || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Product Count" />
              <Bar dataKey="totalStock" fill="#82ca9d" name="Total Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alert */}
      {productAnalytics.lowStockProducts && productAnalytics.lowStockProducts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            ⚠️ Low Stock Alert ({productAnalytics.lowStockProducts.length} products)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productAnalytics.lowStockProducts.map((product) => (
              <div key={product._id} className="border border-red-200 rounded p-4 bg-red-50">
                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-600">Category: {product.category?.name}</p>
                <p className="text-lg font-bold text-red-600">Stock: {product.stock} units</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Revenue (30 days)</h4>
          <p className="mt-2 text-3xl font-bold text-blue-900">
            ${revenueData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Orders (30 days)</h4>
          <p className="mt-2 text-3xl font-bold text-green-900">
            {revenueData.reduce((sum, day) => sum + day.orders, 0)}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h4 className="text-sm font-medium text-purple-600 uppercase tracking-wide">Best Seller</h4>
          <p className="mt-2 text-lg font-bold text-purple-900">
            {productAnalytics.bestSellers?.[0]?.name || 'N/A'}
          </p>
          <p className="text-sm text-purple-600">
            {productAnalytics.bestSellers?.[0]?.totalSold || 0} sold
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Avg Order Value</h4>
          <p className="mt-2 text-3xl font-bold text-yellow-900">
            ${orderAnalytics.monthlyOrderTrends?.length > 0 
              ? Math.round(orderAnalytics.monthlyOrderTrends.slice(-1)[0].avgOrderValue) 
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;