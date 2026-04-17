// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Sliders, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/cider.clo.wb.png';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const { cartItemCount, wishlistItemCount } = useCart();
  
  // Animation state for cart and wishlist icons
  const [cartAnimation, setCartAnimation] = useState(false);
  const [wishlistAnimation, setWishlistAnimation] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);
  const [prevWishlistCount, setPrevWishlistCount] = useState(0);

  // Animate icons when count changes
  useEffect(() => {
    if (cartItemCount > prevCartCount && prevCartCount > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 600);
    }
    setPrevCartCount(cartItemCount);
  }, [cartItemCount, prevCartCount]);

  useEffect(() => {
    if (wishlistItemCount > prevWishlistCount && prevWishlistCount >= 0) {
      setWishlistAnimation(true);
      setTimeout(() => setWishlistAnimation(false), 600);
    }
    setPrevWishlistCount(wishlistItemCount);
  }, [wishlistItemCount, prevWishlistCount]);

  // Style for active NavLink
  const activeLinkStyle = {
    color: '#4f46e5',
    textDecoration: 'underline',
    textUnderlineOffset: '4px'
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  
  return (
    <header className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-full">
            <Link to="/" className="flex items-center">
              <img src={logoImg} alt="Cider Clothing" className="h-12 w-auto scale-[1.4] origin-left object-contain mix-blend-multiply" />
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              style={location.pathname === '/products' && !categoryParam ? activeLinkStyle : undefined}
            >
              Unisex
            </Link>
            <Link 
              to="/products?category=men"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              style={location.pathname === '/products' && categoryParam === 'men' ? activeLinkStyle : undefined}
            >
              Men
            </Link>
            <Link 
              to="/products?category=women"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              style={location.pathname === '/products' && categoryParam === 'women' ? activeLinkStyle : undefined}
            >
              Women
            </Link>
          </nav>

          {/* Icon Navigation */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Sort">
              <Sliders size={22} />
            </button>

            {isLoggedIn ? (
              <>
                {/* Dashboard Link */}
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-indigo-600 transition-colors" 
                  title="My Dashboard"
                >
                  <User size={22} />
                </Link>

                {/* Wishlist Link with Counter and Animation */}
                <Link 
                  to="/wishlist" 
                  className={`relative text-gray-600 hover:text-indigo-600 transition-all ${
                    wishlistAnimation ? 'animate-bounce' : ''
                  }`}
                  title="My Wishlist"
                >
                  <Heart size={22} />
                  {wishlistItemCount > 0 && (
                    <span 
                      className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium transition-all ${
                        wishlistAnimation ? 'animate-pulse scale-110' : ''
                      }`}
                    >
                      {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                    </span>
                  )}
                  
                  {/* New item indicator - shows briefly when new item is added */}
                  {wishlistAnimation && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                  )}
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={logout} 
                  className="text-gray-600 hover:text-indigo-600 transition-colors" 
                  title="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <Link 
                to="/signin" 
                className="text-gray-600 hover:text-indigo-600 transition-colors" 
                title="Sign In"
              >
                <User size={22} />
              </Link>
            )}

            {/* Shopping Cart Link with Counter and Animation */}
            <Link 
              to="/cart" 
              className={`relative text-gray-600 hover:text-indigo-600 transition-all ${
                cartAnimation ? 'animate-bounce' : ''
              }`}
              title="Shopping Cart"
            >
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span 
                  className={`absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium transition-all ${
                    cartAnimation ? 'animate-pulse scale-110' : ''
                  }`}
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
              
              {/* New item indicator - shows briefly when new item is added */}
              {cartAnimation && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-ping"></div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;