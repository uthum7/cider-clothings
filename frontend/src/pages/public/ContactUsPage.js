import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const ContactUsPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Contact Us
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        We'd love to hear from you! Please fill out the form below.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="bg-slate-100 p-4 rounded-xl text-slate-800">
                            <FiMessageSquare size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
                    </div>
                    
                    <form action="https://formsubmit.co/uthumwijenayake@gmail.com" method="POST" className="space-y-6">
                        {/* Disable Captcha for better UX */}
                        <input type="hidden" name="_captcha" value="false" />
                        {/* Add a generic auto-reply */}
                        <input type="hidden" name="_autoresponse" value="Thank you for contacting Cider Clothing! We have received your message and will get back to you shortly." />
                        {/* Return to the same page after submission */}
                        <input type="hidden" name="_next" value={window.location.href} />
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-semibold mb-2">Full Name</label>
                            <input type="text" id="name" required className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-slate-800 focus:border-slate-800 p-3 border bg-slate-50 transition-colors focus:bg-white focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-semibold mb-2">Email Address</label>
                            <input type="email" name="email" id="email" required className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-slate-800 focus:border-slate-800 p-3 border bg-slate-50 transition-colors focus:bg-white focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 font-semibold mb-2">Subject</label>
                            <input type="text" name="_subject" id="subject" required className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-slate-800 focus:border-slate-800 p-3 border bg-slate-50 transition-colors focus:bg-white focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 font-semibold mb-2">Message</label>
                            <textarea id="message" name="message" rows="5" required className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-slate-800 focus:border-slate-800 p-3 border bg-slate-50 transition-colors focus:bg-white focus:outline-none"></textarea>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors mt-8">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="max-w-3xl mx-auto mt-20 text-center px-4">
                <p className="text-gray-500 text-sm">
                    Usually replies within 24 hours. Connect with us on social media for quicker support.
                </p>
            </div>
        </div>
    );
};

export default ContactUsPage;
