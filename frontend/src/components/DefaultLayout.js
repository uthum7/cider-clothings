import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * DefaultLayout serves as the main template for all public and customer-facing pages.
 * It includes the site's Header and Footer, and renders the specific page content
 * via the <Outlet /> component provided by React Router.
 */
const DefaultLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* The Header will appear on every page that uses this layout */}
      <Header />
      
      {/* 
        The 'flex-grow' class ensures this main section expands to fill all 
        available space, pushing the footer to the bottom of the page.
      */}
      <main className="flex-grow">
        
        {/* 
          This is the magic part. React Router will replace this <Outlet /> 
          with the actual page component that matches the current URL 
          (e.g., HomePage, ProductListPage, CustomerDashboardPage, etc.).
        */}
        <Outlet />

      </main>
      
      {/* The Footer will appear on every page that uses this layout */}
      <Footer />
      
    </div>
  );
};

export default DefaultLayout;