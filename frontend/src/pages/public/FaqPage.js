import React from 'react';
import { FiTruck, FiRefreshCcw, FiGlobe, FiHelpCircle } from 'react-icons/fi';

const FaqCard = ({ icon: Icon, question, answer }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mb-6">
        <div className="flex items-center space-x-4 mb-5">
            <div className="bg-slate-100 p-4 rounded-xl text-slate-800">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{question}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed text-base">{answer}</p>
    </div>
);

const FaqPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Have questions? We're here to help. Find answers to our most common questions below.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <FaqCard 
                    icon={FiTruck}
                    question="How long will my delivery take?"
                    answer="Typically, deliveries across Sri Lanka take between 2 to 5 business days from the date of dispatch. We process all orders within 24 hours."
                />
                <FaqCard 
                    icon={FiRefreshCcw}
                    question="Can I return my order if I change my mind?"
                    answer="Yes! We offer a 14-day return policy. Items must be unworn, with all original tags attached. Please view our Refund Policy for exact conditions."
                />
                <FaqCard 
                    icon={FiGlobe}
                    question="Do you ship internationally?"
                    answer="Currently, Cider Clothing primarily operates within Sri Lanka. For special international requests, please use the Contact Us page!"
                />
                <FaqCard 
                    icon={FiHelpCircle}
                    question="My tracking says delivered, but I have not received it!"
                    answer="Please check around your porch or with your neighbors. If you still can't find it, please contact our support team with your Order ID."
                />
            </div>
        </div>
    );
};

export default FaqPage;
