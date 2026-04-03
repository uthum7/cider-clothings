import React from 'react';
import { FiRefreshCcw, FiDollarSign, FiBox, FiClock, FiAlertCircle, FiPhoneCall } from 'react-icons/fi';

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

const RefundPolicyPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Refund Policy
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        We want you to love what you wear. Here's everything you need to know about our simple, hassle-free return process.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PolicyCard 
                        icon={FiClock} 
                        title="14-Day Returns" 
                        content="Not quite right? Return any unused item in its original condition and packaging within 14 days of purchase for a full refund." 
                    />
                    <PolicyCard 
                        icon={FiDollarSign} 
                        title="Fast Refunds" 
                        content="Once we receive and inspect your return, we'll process your refund back to your original payment method within 7 business days." 
                    />
                    <PolicyCard 
                        icon={FiRefreshCcw} 
                        title="Easy Exchanges" 
                        content="Need a different size or color? Contact us within 14 days and we'll gladly help you swap it out for the perfect fit." 
                    />
                    <PolicyCard 
                        icon={FiBox} 
                        title="Return Shipping" 
                        content="You cover the return shipping costs, unless the item arrived damaged or we accidentally sent the wrong product." 
                    />
                    <PolicyCard 
                        icon={FiAlertCircle} 
                        title="Exceptions" 
                        content="For hygiene and safety reasons, we cannot accept returns on gift cards, personalized items, or intimate apparel." 
                    />
                    <PolicyCard 
                        icon={FiPhoneCall} 
                        title="Need Help?" 
                        content="If you received a damaged item or have any questions at all, our friendly support team is ready to assist you immediately." 
                    />
                </div>
            </div>
            
            <div className="max-w-3xl mx-auto mt-20 text-center px-4">
                <p className="text-gray-500 text-sm">
                    By shopping with Cider Clothing, you agree to these refund terms. Last updated: March 2026.
                </p>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
