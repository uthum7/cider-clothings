import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency } from '../utils/currencyFormatter';

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
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent flex items-end justify-center md:justify-start px-6 md:px-16 pb-16 md:pb-24">
                    <div className="max-w-7xl w-full animate-fadeInUp">
                      {/* Skewed Accent Badge */}
                      <div className="inline-block bg-indigo-600 text-white font-bold tracking-widest text-xs md:text-sm uppercase px-4 py-1.5 mb-6 transform -skew-x-12 shadow-lg">
                        <span className="inline-block transform skew-x-12">New Season Drop</span>
                      </div>
                      
                      <h1 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
                        {banner.title}
                      </h1>
                      
                      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-t border-white/20 pt-8 mt-10">
                          {banner.subtitle && (
                            <p className="text-xl md:text-2xl font-medium text-gray-300 max-w-2xl leading-relaxed">
                              {banner.subtitle}
                            </p>
                          )}
                          <Link
                            to={banner.buttonLink}
                            className="shrink-0 inline-flex items-center justify-center bg-white text-black px-12 py-5 text-lg md:text-xl font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-300 group shadow-2xl"
                          >
                            {banner.buttonText}
                            <svg className="w-6 h-6 ml-4 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </Link>
                      </div>
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
            <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">
                New Arrivals
              </h2>
              <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                Discover our latest collection of trendy and stylish clothing
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {homepageData.newArrivals.map((product) => (
                <div key={product._id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden pb-6">
                  <div className="w-full h-80 bg-gray-100 overflow-hidden relative">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {/* New Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gray-900/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 px-4 flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                        <Link to={`/products/${product._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                        {product.category?.name}
                    </p>
                    <p className="text-base font-extrabold text-indigo-600">
                      {formatCurrency(product.price)}
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
            <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">
                Featured Products
              </h2>
              <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                Handpicked favorites from our collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {homepageData.featuredProducts.map((product) => (
                <div key={product._id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden pb-6">
                  <div className="w-full h-80 bg-gray-100 overflow-hidden relative">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 px-4 flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                        <Link to={`/products/${product._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                        {product.category?.name}
                    </p>
                    <p className="text-base font-extrabold text-indigo-600">
                      {formatCurrency(product.price)}
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