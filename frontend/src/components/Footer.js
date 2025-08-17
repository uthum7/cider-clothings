import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold tracking-wider uppercase">Your Shop</h3>
            <p className="mt-4 text-gray-400 text-sm">
              The best place to find your style. Unique designs for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/men" className="text-gray-400 hover:text-white">Men</Link></li>
              <li><Link to="/women" className="text-gray-400 hover:text-white">Women</Link></li>
              <li><Link to="/collections" className="text-gray-400 hover:text-white">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Support</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-semibold tracking-wider uppercase">Newsletter</h4>
             <p className="mt-4 text-gray-400 text-sm">Subscribe to get the latest on sales.</p>
             <form className="mt-4 flex">
                <input type="email" placeholder="Your email" className="w-full px-2 py-1 text-gray-800 rounded-l-md" />
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-r-md">Go</button>
             </form>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">© 2025 Your Clothing Shop. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;