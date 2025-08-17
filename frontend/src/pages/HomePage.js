import React from 'react';
import { Link } from 'react-router-dom';

// Import your images from the correct path relative to this file
import bannerImage from '../assets/cider0.jpg';
import product1 from '../assets/product1.jpg';
import product2 from '../assets/product2.jpeg';
import product3 from '../assets/product3.jpg';
import product4 from '../assets/product4.jpeg';

const products = [
  { id: 1, name: 'Classic Crew Neck Tee', price: '$25.00', image: product1 },
  { id: 2, name: 'Urban Slim Fit Jeans', price: '$75.00', image: product2 },
  { id: 3, name: 'Vintage Logo Hoodie', price: '$60.00', image: product3 },
  { id: 4, name: 'Summer Floral Dress', price: '$85.00', image: product4 },
];

// This component ONLY returns the main content for the home page.
// NO Header or Footer here.
const HomePage = () => {
  return (
    <>
      {/* Hero Banner Section */}
      <section
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
      
        
      </section>

      {/* Available Designs Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Available Designs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="w-full h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;