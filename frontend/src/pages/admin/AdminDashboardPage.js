import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, ArrowRight } from 'lucide-react';

// --- MOCK DATA ---
// In a real application, you would fetch this data from your backend API.

// Data for the main summary cards
const summaryStats = [
    { title: "Total Revenue", value: "$45,231.89", icon: <DollarSign className="text-green-500"/>, change: "+20.1% from last month" },
    { title: "New Orders", value: "1,234", icon: <ShoppingCart className="text-blue-500"/>, change: "+12.5% from last month" },
    { title: "New Users", value: "230", icon: <Users className="text-purple-500"/>, change: "+5.2% from last month" },
    { title: "Products in Stock", value: "1,890", icon: <Package className="text-orange-500"/>, change: "-12 items from last week" },
];

// Data for the sales chart
const salesData = [
  { name: 'Jan', Sales: 4000 }, { name: 'Feb', Sales: 3000 }, { name: 'Mar', Sales: 5000 },
  { name: 'Apr', Sales: 4500 }, { name: 'May', Sales: 6000 }, { name: 'Jun', Sales: 5500 },
];

// Data for the recent orders list
const recentOrders = [
    { id: 'WU88191111', customer: 'John Doe', amount: 160.00, status: 'Shipped' },
    { id: 'WU88191112', customer: 'Jane Smith', amount: 45.00, status: 'Processing' },
    { id: 'WU88191113', customer: 'Mike Johnson', amount: 89.50, status: 'Delivered' },
];

const AdminDashboardPage = () => {
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
                        <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- 2. SALES OVERVIEW CHART --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Sales Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} />
                            <Legend />
                            <Bar dataKey="Sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* --- 3. RECENT ORDERS LIST --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-700">{order.customer}</p>
                                    <p className="text-sm text-gray-500">{order.id}</p>
                                </div>
                                <p className="font-bold text-gray-800">${order.amount.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/orders" className="w-full mt-6 inline-flex items-center justify-center text-indigo-600 font-semibold hover:text-indigo-800">
                        View All Orders <ArrowRight className="ml-2" size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;