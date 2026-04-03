import React from 'react';

const FaqPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">Frequently Asked Questions</h1>
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">How long will my delivery take?</h3>
                        <p className="text-gray-600">Typically, deliveries across Sri Lanka take between 2 to 5 business days from the date of dispatch. We process all orders within 24 hours.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Can I return my order if I change my mind?</h3>
                        <p className="text-gray-600">Yes! We offer a 14-day return policy. Items must be unworn, with all original tags attached. Please view our Refund Policy for exact conditions.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Do you ship internationally?</h3>
                        <p className="text-gray-600">Currently, Cider Clothing primarily operates within Sri Lanka. For special international requests, please use the Contact Us page!</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">My tracking says delivered, but I have not received it!</h3>
                        <p className="text-gray-600">Please check around your porch or with your neighbors. If you still can't find it, please contact our support team with your Order ID.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
