import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

const AdminDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: null,
        salesData: [],
        recentOrders: [],
        loading: true,
        error: null
    });

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                // Fetch all dashboard data in parallel
                const [statsResponse, salesResponse, ordersResponse] = await Promise.all([
                    fetch('/api/admin/dashboard/stats', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch('/api/admin/dashboard/sales', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch('/api/admin/dashboard/recent-orders', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                // Check if all requests were successful
                if (!statsResponse.ok || !salesResponse.ok || !ordersResponse.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                // Parse all responses
                const stats = await statsResponse.json();
                const salesData = await salesResponse.json();
                const recentOrders = await ordersResponse.json();

                setDashboardData({
                    stats,
                    salesData,
                    recentOrders,
                    loading: false,
                    error: null
                });

            } catch (error) {
                console.error('Dashboard fetch error:', error);
                setDashboardData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || 'Failed to load dashboard data'
                }));
            }
        };

        fetchDashboardData();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format percentage change
    const formatChange = (change, isPositive, isStock = false) => {
        if (isStock) {
            return `+${change} new items this week`;
        }
        const sign = isPositive ? '+' : '';
        return `${sign}${change}% from last month`;
    };

    // Get trend icon
    const getTrendIcon = (isPositive) => {
        return isPositive ? 
            <TrendingUp className="w-4 h-4 text-green-500" /> : 
            <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    // Loading state
    if (dashboardData.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Error state
    if (dashboardData.error) {
        return (
            <div className="space-y-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
                    <p className="text-red-600">{dashboardData.error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { stats, salesData, recentOrders } = dashboardData;

    // Create summary stats array
    const summaryStats = [
        {
            title: "Total Revenue",
            value: formatCurrency(stats?.totalRevenue?.value || 0),
            icon: <DollarSign className="text-green-500"/>,
            change: formatChange(stats?.totalRevenue?.change, stats?.totalRevenue?.isPositive),
            isPositive: stats?.totalRevenue?.isPositive
        },
        {
            title: "New Orders",
            value: (stats?.newOrders?.value || 0).toLocaleString(),
            icon: <ShoppingCart className="text-blue-500"/>,
            change: formatChange(stats?.newOrders?.change, stats?.newOrders?.isPositive),
            isPositive: stats?.newOrders?.isPositive
        },
        {
            title: "New Users",
            value: (stats?.newUsers?.value || 0).toLocaleString(),
            icon: <Users className="text-purple-500"/>,
            change: formatChange(stats?.newUsers?.change, stats?.newUsers?.isPositive),
            isPositive: stats?.newUsers?.isPositive
        },
        {
            title: "Products in Stock",
            value: (stats?.totalStock?.value || 0).toLocaleString(),
            icon: <Package className="text-orange-500"/>,
            change: formatChange(stats?.totalStock?.change, stats?.totalStock?.isPositive, true),
            isPositive: stats?.totalStock?.isPositive
        }
    ];

    return (
        <div className="space-y-8">
            {/* --- 1. KEY METRIC CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryStats.map(stat => (
                    <div key={stat.title} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
                            {getTrendIcon(stat.isPositive)}
                            <p className={`text-xs ml-1 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- 2. SALES OVERVIEW CHART --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Sales Overview (Last 6 Months)</h3>
                    {salesData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(79, 70, 229, 0.1)'}}
                                    formatter={(value) => [formatCurrency(value), 'Sales']}
                                />
                                <Legend />
                                <Bar dataKey="Sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            <p>No sales data available</p>
                        </div>
                    )}
                </div>

                {/* --- 3. RECENT ORDERS LIST --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-700">{order.customer}</p>
                                        <p className="text-sm text-gray-500">#{order.id}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="font-bold text-gray-800">{formatCurrency(order.amount)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">No recent orders</p>
                        )}
                    </div>
                    <Link 
                        to="/admin/orders" 
                        className="w-full mt-6 inline-flex items-center justify-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                        View All Orders <ArrowRight className="ml-2" size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;