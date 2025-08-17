import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBag, Edit } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout, authToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/signin');
        }
    }, [authToken, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    // ==========================================
    // --- THIS IS THE FIX ---
    // This function will be called if the primary profile picture fails to load.
    // It replaces the broken image source with a dynamically generated default avatar.
    // ==========================================
    const handleImageError = (e) => {
        // Replace spaces in the user's name with '+' for the URL
        const formattedName = user.name.replace(/\s/g, '+');
        // Set the image source to a default avatar from ui-avatars.com
        e.target.src = `https://ui-avatars.com/api/?name=${formattedName}&background=c7d2fe&color=3730a3&bold=true`;
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                       <div className="flex flex-col items-center">
                           
                            {/*
                                ==========================================
                                --- THIS IS THE UPDATED IMAGE TAG ---
                                We've added the `onError` attribute. If `user.profilePicture` is invalid,
                                it will call our `handleImageError` function to load the default avatar.
                                ==========================================
                            */}
                            <img
                                src={user.profilePicture} 
                                onError={handleImageError}
                                alt="User Profile"
                                className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover bg-gray-200" // Added a background color for loading
                            />

                            <div className="mt-4 text-center">
                                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                                <p className="text-md text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 md:p-8 border-t">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/profile/update" className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition">
                                <Edit className="text-indigo-500" size={20} />
                                <span className="ml-3 font-medium text-gray-700">Update Profile</span>
                            </Link>
                            <Link to="/orders" className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition">
                                <ShoppingBag className="text-indigo-500" size={20} />
                                <span className="ml-3 font-medium text-gray-700">My Orders</span>
                            </Link>
                            <button onClick={handleLogout} className="md:col-span-2 flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg shadow-sm transition">
                                <LogOut className="text-red-500" size={20} />
                                <span className="ml-3 font-medium text-red-600">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;