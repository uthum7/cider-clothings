import React from 'react';
import { FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

const FaqItem = ({ question, answer }) => (
    <details className="py-4 border-b">
        <summary className="font-semibold cursor-pointer">{question}</summary>
        <p className="mt-2 text-gray-600">{answer}</p>
    </details>
);

const CustomerSupportPage = () => {
    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Customer Support</h1>
                    <p className="mt-4 text-lg text-gray-600">We're here to help. Find answers to your questions or get in touch with us.</p>
                </div>

                {/* Contact Form */}
                <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800">Send us a message</h2>
                    <form className="mt-6 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" rows="4" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Submit</button>
                    </form>
                </div>
                
                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Frequently Asked Questions</h2>
                    <div className="mt-8">
                        <FaqItem question="How do I track my order?" answer="You can track your order from the 'My Orders' page in your customer dashboard. You will also receive email and SMS notifications with tracking links once your order has shipped."/>
                        <FaqItem question="What is your return policy?" answer="We accept returns within 30 days of delivery for a full refund. Items must be in their original condition. To initiate a return, go to your order details on the 'My Orders' page."/>
                        <FaqItem question="How do I change my shipping address?" answer="You can manage your shipping addresses from the 'My Profile' page."/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSupportPage;