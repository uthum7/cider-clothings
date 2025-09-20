import React, { useState, useEffect } from 'react';
import { Tag, Edit, Trash2, Shield, Image as ImageIcon, PlusCircle, Save, Upload } from 'lucide-react';
import axios from 'axios';

// --- Banner Management Component ---
const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        status: 'Active',
        order: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/settings/banners', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (editingBanner) {
                await axios.put(`/api/settings/banners/${editingBanner._id}`, submitData, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('/api/settings/banners', submitData, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            fetchBanners();
            resetForm();
            alert('Banner saved successfully!');
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Error saving banner. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            buttonText: banner.buttonText,
            buttonLink: banner.buttonLink,
            status: banner.status,
            order: banner.order
        });
        setShowForm(true);
    };

    const handleDelete = async (bannerId) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/settings/banners/${bannerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBanners();
                alert('Banner deleted successfully!');
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert('Error deleting banner. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            buttonText: 'Shop Now',
            buttonLink: '/products',
            status: 'Active',
            order: 0
        });
        setImageFile(null);
        setEditingBanner(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Homepage Banners</h3>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    <PlusCircle size={16} />
                    {showForm ? 'Cancel' : 'Add New Banner'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                        {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={formData.buttonText}
                                    onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Button Link</label>
                                <input
                                    type="text"
                                    value={formData.buttonLink}
                                    onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Banner Image {!editingBanner && '*'}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full border rounded-md p-2"
                                required={!editingBanner}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Banner'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {banners.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No banners found. Add your first banner!</p>
                ) : (
                    banners.map(banner => (
                        <div key={banner._id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={banner.imageUrl} 
                                    alt={banner.title} 
                                    className="w-20 h-12 object-cover rounded-md"
                                />
                                <div>
                                    <h4 className="font-semibold">{banner.title}</h4>
                                    {banner.subtitle && <p className="text-sm text-gray-600">{banner.subtitle}</p>}
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        banner.status === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {banner.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(banner)}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(banner._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Promotions Management Component ---
const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: 0,
        maxDiscount: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        applicableCategories: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPromotions();
        fetchCategories();
    }, []);

    const fetchPromotions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/settings/promotions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPromotions(response.data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            if (editingPromotion) {
                await axios.put(`/api/settings/promotions/${editingPromotion._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/settings/promotions', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            fetchPromotions();
            resetForm();
            alert('Promotion saved successfully!');
        } catch (error) {
            console.error('Error saving promotion:', error);
            alert(error.response?.data?.message || 'Error saving promotion. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        setFormData({
            code: promotion.code,
            description: promotion.description,
            discountType: promotion.discountType,
            discountValue: promotion.discountValue,
            minOrderValue: promotion.minOrderValue,
            maxDiscount: promotion.maxDiscount || '',
            startDate: new Date(promotion.startDate).toISOString().split('T')[0],
            endDate: new Date(promotion.endDate).toISOString().split('T')[0],
            usageLimit: promotion.usageLimit || '',
            applicableCategories: promotion.applicableCategories.map(cat => cat._id)
        });
        setShowForm(true);
    };

    const handleDelete = async (promotionId) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/settings/promotions/${promotionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchPromotions();
                alert('Promotion deleted successfully!');
            } catch (error) {
                console.error('Error deleting promotion:', error);
                alert('Error deleting promotion. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            minOrderValue: 0,
            maxDiscount: '',
            startDate: '',
            endDate: '',
            usageLimit: '',
            applicableCategories: []
        });
        setEditingPromotion(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Manage Promotions</h3>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    <PlusCircle size={16} />
                    {showForm ? 'Cancel' : 'Add New Promotion'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                        {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Promotion Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full border rounded-md p-2"
                                    placeholder="e.g., SUMMER25"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Discount Type</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Discount Value * ({formData.discountType === 'percentage' ? '%' : 'LKR'})
                                </label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Min Order Value (LKR)</label>
                                <input
                                    type="number"
                                    value={formData.minOrderValue}
                                    onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                    min="0"
                                />
                            </div>
                            {formData.discountType === 'percentage' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Discount (LKR)</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                                        className="w-full border rounded-md p-2"
                                        min="0"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-1">Usage Limit</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                    placeholder="Leave empty for unlimited"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date *</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date *</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full border rounded-md p-2"
                                rows="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Applicable Categories</label>
                            <select
                                multiple
                                value={formData.applicableCategories}
                                onChange={(e) => {
                                    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({...formData, applicableCategories: selectedValues});
                                }}
                                className="w-full border rounded-md p-2"
                                size="4"
                            >
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Hold Ctrl/Cmd to select multiple categories. Leave empty for all categories.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Promotion'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {promotions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No promotions found. Add your first promotion!</p>
                ) : (
                    promotions.map(promotion => (
                        <div key={promotion._id} className="p-4 bg-white border rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h4 className="font-bold text-lg">{promotion.code}</h4>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            promotion.isActive && new Date() >= new Date(promotion.startDate) && new Date() <= new Date(promotion.endDate)
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {promotion.isActive && new Date() >= new Date(promotion.startDate) && new Date() <= new Date(promotion.endDate) ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-2">{promotion.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-semibold">Discount:</span> 
                                            {promotion.discountType === 'percentage' ? `${promotion.discountValue}%` : `LKR ${promotion.discountValue}`}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Min Order:</span> LKR {promotion.minOrderValue}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Usage:</span> {promotion.usedCount}/{promotion.usageLimit || '∞'}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Valid:</span> {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {promotion.applicableCategories.length > 0 && (
                                        <div className="mt-2">
                                            <span className="text-sm font-semibold text-gray-600">Categories:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {promotion.applicableCategories.map(category => (
                                                    <span key={category._id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {category.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button 
                                        onClick={() => handleEdit(promotion)}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(promotion._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Site Settings Component ---
const SiteSettingsManagement = () => {
    const [settings, setSettings] = useState({
        privacyPolicy: '',
        returnPolicy: '',
        termsOfService: '',
        shippingPolicy: '',
        contactInfo: {
            email: '',
            phone: '',
            address: ''
        },
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: ''
        },
        paymentGateway: {
            provider: 'payhere',
            merchantId: '',
            merchantSecret: '',
            isLive: false
        },
        seoSettings: {
            metaTitle: '',
            metaDescription: '',
            keywords: []
        }
    });
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('policies');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/settings/site', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/settings/site', settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Error updating settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleDirectChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Site Settings</h3>
            
            <div className="flex gap-4 mb-6">
                {[
                    { id: 'policies', name: 'Policies' },
                    { id: 'contact', name: 'Contact Info' },
                    { id: 'payment', name: 'Payment Gateway' },
                    { id: 'seo', name: 'SEO Settings' }
                ].map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2 rounded-lg ${
                            activeSection === section.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {section.name}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg border">
                {activeSection === 'policies' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Privacy Policy</label>
                            <textarea
                                value={settings.privacyPolicy}
                                onChange={(e) => handleDirectChange('privacyPolicy', e.target.value)}
                                className="w-full border rounded-md p-3"
                                rows="8"
                                placeholder="Enter your privacy policy here..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Return Policy</label>
                            <textarea
                                value={settings.returnPolicy}
                                onChange={(e) => handleDirectChange('returnPolicy', e.target.value)}
                                className="w-full border rounded-md p-3"
                                rows="8"
                                placeholder="Enter your return policy here..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Terms of Service</label>
                            <textarea
                                value={settings.termsOfService}
                                onChange={(e) => handleDirectChange('termsOfService', e.target.value)}
                                className="w-full border rounded-md p-3"
                                rows="8"
                                placeholder="Enter your terms of service here..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Shipping Policy</label>
                            <textarea
                                value={settings.shippingPolicy}
                                onChange={(e) => handleDirectChange('shippingPolicy', e.target.value)}
                                className="w-full border rounded-md p-3"
                                rows="8"
                                placeholder="Enter your shipping policy here..."
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'contact' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={settings.contactInfo.email}
                                onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                                className="w-full border rounded-md p-2"
                                placeholder="contact@yourstore.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                                type="tel"
                                value={settings.contactInfo.phone}
                                onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                                className="w-full border rounded-md p-2"
                                placeholder="+94 11 123 4567"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <textarea
                                value={settings.contactInfo.address}
                                onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                                className="w-full border rounded-md p-2"
                                rows="3"
                                placeholder="Your business address"
                            />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Social Media Links</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Facebook</label>
                                    <input
                                        type="url"
                                        value={settings.socialMedia.facebook}
                                        onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
                                        className="w-full border rounded-md p-2"
                                        placeholder="https://facebook.com/yourstore"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Instagram</label>
                                    <input
                                        type="url"
                                        value={settings.socialMedia.instagram}
                                        onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                                        className="w-full border rounded-md p-2"
                                        placeholder="https://instagram.com/yourstore"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Twitter</label>
                                    <input
                                        type="url"
                                        value={settings.socialMedia.twitter}
                                        onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                                        className="w-full border rounded-md p-2"
                                        placeholder="https://twitter.com/yourstore"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'payment' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Payment Provider</label>
                            <select
                                value={settings.paymentGateway.provider}
                                onChange={(e) => handleInputChange('paymentGateway', 'provider', e.target.value)}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="payhere">PayHere</option>
                                <option value="stripe">Stripe</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Merchant ID</label>
                            <input
                                type="text"
                                value={settings.paymentGateway.merchantId}
                                onChange={(e) => handleInputChange('paymentGateway', 'merchantId', e.target.value)}
                                className="w-full border rounded-md p-2"
                                placeholder="Your merchant ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Merchant Secret</label>
                            <input
                                type="password"
                                value={settings.paymentGateway.merchantSecret}
                                onChange={(e) => handleInputChange('paymentGateway', 'merchantSecret', e.target.value)}
                                className="w-full border rounded-md p-2"
                                placeholder="Your merchant secret"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isLive"
                                checked={settings.paymentGateway.isLive}
                                onChange={(e) => handleInputChange('paymentGateway', 'isLive', e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="isLive" className="text-sm font-medium">
                                Live Environment (uncheck for sandbox)
                            </label>
                        </div>
                    </div>
                )}

                {activeSection === 'seo' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Title</label>
                            <input
                                type="text"
                                value={settings.seoSettings.metaTitle}
                                onChange={(e) => handleInputChange('seoSettings', 'metaTitle', e.target.value)}
                                className="w-full border rounded-md p-2"
                                placeholder="Your store name - Best clothing store"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Description</label>
                            <textarea
                                value={settings.seoSettings.metaDescription}
                                onChange={(e) => handleInputChange('seoSettings', 'metaDescription', e.target.value)}
                                className="w-full border rounded-md p-2"
                                rows="3"
                                placeholder="Describe your store in 150-160 characters"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Keywords</label>
                            <input
                                type="text"
                                value={settings.seoSettings.keywords ? settings.seoSettings.keywords.join(', ') : ''}
                                onChange={(e) => handleInputChange('seoSettings', 'keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                                className="w-full border rounded-md p-2"
                                placeholder="clothing, fashion, apparel, online store"
                            />
                            <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main SettingsPage Component ---
const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('banners');

    const renderContent = () => {
        switch (activeTab) {
            case 'banners':
                return <BannerManagement />;
            case 'promotions':
                return <PromotionsManagement />;
            case 'settings':
                return <SiteSettingsManagement />;
            default:
                return <BannerManagement />;
        }
    };

    const tabs = [
        { id: 'banners', name: 'Homepage Banners', icon: <ImageIcon /> },
        { id: 'promotions', name: 'Promotions', icon: <Tag /> },
        { id: 'settings', name: 'Site Settings', icon: <Shield /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings & Management</h2>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    <nav className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex flex-row lg:flex-col gap-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center w-full gap-3 p-3 rounded-lg text-left text-sm font-medium transition-colors ${
                                            activeTab === tab.id 
                                                ? 'bg-indigo-600 text-white shadow-lg' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:inline">{tab.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                    
                    <main className="lg:w-3/4">
                        <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px]">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;