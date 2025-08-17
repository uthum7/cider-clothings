import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, name: 'Dashboard' },
    { to: '/admin/products', icon: <Package size={20} />, name: 'Products' },
    { to: '/admin/orders', icon: <ShoppingCart size={20} />, name: 'Orders' },
    { to: '/admin/users', icon: <Users size={20} />, name: 'Users' },
    { to: '/admin/analytics', icon: <BarChart2 size={20} />, name: 'Analytics' },
    { to: '/admin/settings', icon: <Settings size={20} />, name: 'Settings' },
];

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const activeLinkClass = "bg-gray-700 text-white";
    const inactiveLinkClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center px-4 bg-gray-900">
                    <Link to="/admin/dashboard" className="text-xl font-bold">Cider Admin</Link>
                </div>
                <nav className="flex-grow px-2 py-4 space-y-2">
                    {sidebarLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            // The 'end' prop is important for the dashboard link to not stay active on other pages
                            end={link.to === '/admin/dashboard'}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        <LogOut size={20}/>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
                    <div className="text-sm">Welcome, {user?.name || 'Admin'}!</div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {/* The content of each specific admin page will be rendered here via the <Outlet> */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;