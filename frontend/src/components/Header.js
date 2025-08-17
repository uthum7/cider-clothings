import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext'; // You will create this later

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  
  // Placeholder for when you create a CartContext to manage cart state globally
  // const { cartItemCount } = useCart(); 
  const cartItemCount = 0; // Replace with real data later

  // Style for active NavLink
  const activeLinkStyle = {
    color: '#4f46e5', // This is indigo-600
    textDecoration: 'underline',
    textUnderlineOffset: '4px'
  };

  return (
    <header className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Cider
            </Link>
          </div>

          {/* Main Navigation - Updated to use NavLink for active styles */}
          <nav className="hidden md:flex md:space-x-8">
            <NavLink 
              to="/products" 
              className="text-gray-700 hover:text-indigo-600 font-medium"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Shop
            </NavLink>
            <NavLink 
              to="/products?category=men" // Example of a category link
              className="text-gray-700 hover:text-indigo-600 font-medium"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Men
            </NavLink>
            <NavLink 
              to="/products?category=women" // Example of a category link
              className="text-gray-700 hover:text-indigo-600 font-medium"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Women
            </NavLink>
          </nav>

          {/* Icon Navigation */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600" aria-label="Search">
              <Search size={22} />
            </button>

            {isLoggedIn ? (
              // --- Logged-In User Icons ---
              <>
                {/* Dashboard Link */}
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600" title="My Dashboard">
                  <User size={22} />
                </Link>
                {/* Wishlist Link - Only shown when logged in */}
                <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600" title="My Wishlist">
                    <Heart size={22} />
                </Link>
                {/* Logout Button */}
                <button onClick={logout} className="text-gray-600 hover:text-indigo-600" title="Sign Out">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              // --- Logged-Out User Icons ---
              <Link to="/signin" className="text-gray-600 hover:text-indigo-600" title="Sign In">
                <User size={22} />
              </Link>
            )}

            {/* Shopping Cart Link */}
            <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600" title="Shopping Cart">
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;