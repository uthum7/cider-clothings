import React from 'react';
import { FiCheckCircle, FiShoppingCart, FiCreditCard, FiTruck, FiAlertTriangle, FiFileText } from 'react-icons/fi';

const PolicyCard = ({ icon: Icon, title, content }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center space-x-4 mb-5">
            <div className="bg-slate-100 p-4 rounded-xl text-slate-800">
                <Icon size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-base">{content}</p>
    </div>
);

const TermsConditionsPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Terms & Conditions
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        The ground rules for using our platform. Clear, fair, and straightforward agreements for a great shopping experience.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PolicyCard 
                        icon={FiCheckCircle} 
                        title="Website Usage" 
                        content="You must be at least 18 years old to make purchases. Please ensure your account details remain confidential and accurate." 
                    />
                    <PolicyCard 
                        icon={FiShoppingCart} 
                        title="Store Products" 
                        content="We strive for accurate descriptions and pricing. However, prices and promotions can change, and we reserve the right to correct any errors." 
                    />
                    <PolicyCard 
                        icon={FiCreditCard} 
                        title="Purchases" 
                        content="Placing an order acts as an offer to purchase. We maintain the right to cancel orders due to stock issues or suspected fraudulent activity." 
                    />
                    <PolicyCard 
                        icon={FiTruck} 
                        title="Shipping Expectations" 
                        content="Delivery dates are estimates dependent on carriers. We work hard to get your clothes to you fast, but cannot guarantee exact arrival times." 
                    />
                    <PolicyCard 
                        icon={FiFileText} 
                        title="Intellectual Property" 
                        content="All photos, logos, and clothing designs belong to Cider Clothing. Do not reproduce or distribute our content without written permission." 
                    />
                    <PolicyCard 
                        icon={FiAlertTriangle} 
                        title="Liability Limitations" 
                        content="Cider Clothing is not liable for indirect damages arising from the use of our site. We provide our products and platform 'as is'." 
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-20 text-center px-4">
                <p className="text-gray-500 text-sm">
                    By shopping with Cider Clothing, you agree to these terms. Last updated: March 2026.
                </p>
            </div>
        </div>
    );
};

export default TermsConditionsPage;
