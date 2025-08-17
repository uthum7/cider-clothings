import React, { useState } from 'react';
import { Tag, Edit, Trash2, Shield, Image as ImageIcon, PlusCircle } from 'lucide-react';

// --- Sub-components for each tab ---

const PromotionsTab = () => (
    <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Manage Promotions</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Discount Code</label>
                <input type="text" placeholder="e.g., SUMMER25" className="mt-1 w-full max-w-sm border rounded-md p-2"/>
            </div>
             <div>
                <label className="block text-sm font-medium">Discount Percentage</label>
                <input type="number" placeholder="e.g., 25" className="mt-1 w-full max-w-sm border rounded-md p-2"/>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Save Code</button>
        </div>
    </div>
);

const ContentManagementTab = () => {
    const mockBanners = [
        { id: 1, title: 'Summer Sale Banner', status: 'Active', imageUrl: 'https://via.placeholder.com/150x50.png?text=Summer+Sale' },
        { id: 2, title: 'New Arrivals - Men', status: 'Inactive', imageUrl: 'https://via.placeholder.com/150x50.png?text=New+Men' },
    ];
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Homepage Banners</h3>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-indigo-700">
                    <PlusCircle size={16} /> Add New Banner
                </button>
            </div>
            <ul className="space-y-3">
                {mockBanners.map(banner => (
                    <li key={banner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <img src={banner.imageUrl} alt={banner.title} className="w-32 h-auto rounded-md" />
                            <div>
                                <p className="font-semibold">{banner.title}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${banner.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                    {banner.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="text-gray-500 hover:text-indigo-600"><Edit size={18} /></button>
                            <button className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SecurityTab = () => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy Policy</h3>
        <textarea 
            rows="10" 
            className="w-full border rounded-md p-3"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
        />
        <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Save Policy</button>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Admin Access Logs</h3>
        <ul className="text-sm text-gray-600 space-y-2">
            <li><span className="font-semibold">jane.smith@example.com</span> updated order #WU88191111 - 2 hours ago</li>
            <li><span className="font-semibold">admin@cider.com</span> deleted product 'Old Scarf' - 1 day ago</li>
        </ul>
    </div>
);


// --- Main SettingsPage Component ---

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('promotions');

    const renderContent = () => {
        switch (activeTab) {
            case 'promotions': return <PromotionsTab />;
            case 'content': return <ContentManagementTab />;
            case 'security': return <SecurityTab />;
            default: return null;
        }
    };

    const tabs = [
        { id: 'promotions', name: 'Promotions', icon: <Tag /> },
        { id: 'content', name: 'Content', icon: <ImageIcon /> },
        { id: 'security', name: 'Security', icon: <Shield /> },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings & Management</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                <nav className="lg:w-1/4">
                    <div className="flex flex-row lg:flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center w-full gap-3 p-3 rounded-lg text-left text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-700'}`}
                            >
                                {tab.icon}
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </nav>
                <main className="lg:w-3/4">
                    <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;