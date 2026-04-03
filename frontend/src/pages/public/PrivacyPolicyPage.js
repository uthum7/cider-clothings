import React from 'react';
import { FiShield, FiDatabase, FiLock, FiShare2, FiEye, FiSettings } from 'react-icons/fi';

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

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Your privacy matters to us. Learn how we securely protect and manage your personal data when you shop with us.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PolicyCard 
                        icon={FiDatabase} 
                        title="Data We Collect" 
                        content="We collect basic details like your name, email, and shipping address to fulfill your orders, alongside anonymized browsing data to improve our store layout." 
                    />
                    <PolicyCard 
                        icon={FiSettings} 
                        title="How We Use It" 
                        content="Your data is strictly used to ship your clothing, provide customer support, and optionally send you personalized promotions if you subscribe." 
                    />
                    <PolicyCard 
                        icon={FiLock} 
                        title="Payment Security" 
                        content="We never store your full credit card details. All payments are securely processed through trusted and encrypted third-party payment gateways." 
                    />
                    <PolicyCard 
                        icon={FiShare2} 
                        title="Information Sharing" 
                        content="We do not sell your data. We only share necessary info with trusted partners (like shipping carriers) required to get your order to your doorstep." 
                    />
                    <PolicyCard 
                        icon={FiShield} 
                        title="Data Protection" 
                        content="We employ industry-standard encryption, secure server hosting, and constant monitoring to protect your personal information from unauthorized access." 
                    />
                    <PolicyCard 
                        icon={FiEye} 
                        title="Your Tracking Choices" 
                        content="We use cookies to remember your cart and preferences. You can easily manage or disable these cookies through your browser settings at any time." 
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-20 text-center px-4">
                <p className="text-gray-500 text-sm">
                    By shopping with Cider Clothing, you agree to this privacy policy. Last updated: March 2026.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
