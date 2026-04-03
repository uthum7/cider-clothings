import React from 'react';

const ContactUsPage = () => {

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-500">We'd love to hear from you! Please fill out the form below.</p>
                </div>
                
                <div className="mt-16 bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 max-w-xl mx-auto">
                    <form action="https://formsubmit.co/uthumwijenayake@gmail.com" method="POST" className="space-y-6">
                        {/* Disable Captcha for better UX */}
                        <input type="hidden" name="_captcha" value="false" />
                        {/* Add a generic auto-reply */}
                        <input type="hidden" name="_autoresponse" value="Thank you for contacting Cider Clothing! We have received your message and will get back to you shortly." />
                        {/* Return to the same page after submission */}
                        <input type="hidden" name="_next" value={window.location.href} />
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" id="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                            <input type="text" name="_subject" id="subject" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" name="message" rows="5" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"></textarea>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
