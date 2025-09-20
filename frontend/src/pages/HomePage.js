import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [homepageData, setHomepageData] = useState({
    banners: [],
    newArrivals: [],
    featuredProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (homepageData.banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prev => 
          prev === homepageData.banners.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [homepageData.banners.length]);

  const fetchHomepageData = async () => {
    try {
      const response = await axios.get('/api/settings/homepage');
      setHomepageData(response.data);
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      // Fallback to empty data if API fails
      setHomepageData({
        banners: [],
        newArrivals: [],
        featuredProducts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentBannerIndex(index);
  };

  const goToPrevious = () => {
    setCurrentBannerIndex(prev => 
      prev === 0 ? homepageData.banners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentBannerIndex(prev => 
      prev === homepageData.banners.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner Section */}
      {homepageData.banners.length > 0 ? (
        <section className="relative h-[80vh] overflow-hidden">
          {/* Banner Images */}
          <div className="relative w-full h-full">
            {homepageData.banners.map((banner, index) => (
              <div
                key={banner._id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  {/* Banner Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp">
                        {banner.title}
                      </h1>
                      {banner.subtitle && (
                        <p className="text-lg md:text-xl mb-8 animate-fadeInUp animation-delay-200">
                          {banner.subtitle}
                        </p>
                      )}
                      <Link
                        to={banner.buttonLink}
                        className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors animate-fadeInUp animation-delay-400"
                      >
                        {banner.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Controls */}
          {homepageData.banners.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {homepageData.banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentBannerIndex
                        ? 'bg-white'
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        // Fallback banner if no banners are configured
        <section className="relative h-[80vh] bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Cider Clothing
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover Your Perfect Style
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {homepageData.newArrivals.length > 0 && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                New Arrivals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our latest collection of trendy and stylish clothing
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {homepageData.newArrivals.map((product) => (
                <div key={product._id} className="group relative">
                  <div className="w-full h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 transition-opacity">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-center object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {/* New Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-700">
                        {/* UPDATED: Changed from /product/ to /products/ to match ProductDetailPage route */}
                        <Link to={`/products/${product._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category?.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      LKR {product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {homepageData.featuredProducts.length > 0 && (
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked favorites from our collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {homepageData.featuredProducts.map((product) => (
                <div key={product._id} className="group relative">
                  <div className="w-full h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 transition-opacity">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-center object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {/* Featured Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-700">
                        {/* UPDATED: Changed from /product/ to /products/ to match ProductDetailPage route */}
                        <Link to={`/products/${product._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category?.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      LKR {product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;