import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UpdateProfilePage = () => {
    // 1. CHANGE THIS LINE: Get 'updateUser' from the context instead of 'login'.
    const { user, authToken, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPreviewImage(user.profilePicture);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (profileImage) {
            formData.append('profilePicture', profileImage);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`,
                },
            };

            const { data } = await axios.put('/api/auth/profile', formData, config);
            
            // 2. CHANGE THIS LINE: Call the new, correct function.
            // This will safely update the user's data without touching the token.
            updateUser(data); 
            
            setSuccess('Profile updated successfully!');
            setTimeout(() => navigate('/profile'), 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Update Your Profile
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center space-y-4">
                            {/* 3. (Minor Improvement) Added a descriptive alt tag for accessibility */}
                            <img src={previewImage} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover" />
                            <div>
                                <label htmlFor="profile-image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                    Change Picture
                                </label>
                                <input id="profile-image-upload" name="profile-image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1">
                                <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>

                        {error && <p className="text-center text-sm text-red-600">{error}</p>}
                        {success && <p className="text-center text-sm text-green-600">{success}</p>}

                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => navigate('/profile')} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfilePage;