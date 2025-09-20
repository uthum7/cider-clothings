// src/pages/admin/UserManagementPage.js
import React, { useState, useEffect } from 'react';
// Import icons from lucide-react and react-icons
import { Edit, Trash2 } from 'lucide-react'; // Keep lucide icons
import { FiSearch } from 'react-icons/fi'; // <-- Import FiSearch from react-icons/fi
// Remove unused imports:
// import { mockUsers } from '../../data/mockDatabase'; // Mock data is no longer used
import axios from 'axios'; // Import axios for API calls
import { useAuth } from '../../context/AuthContext'; // To get the token

const UserManagementPage = () => {
  // State for users, loading, and error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get auth token from context
  const { authToken } = useAuth();

  // Fetch users when the component mounts or when authToken changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        if (!authToken) {
          setError("Authentication token not found. Please sign in.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include token in headers
          },
        };

        // Make API call to fetch users from the backend
        // Ensure the path is correct (e.g., /api/admin/users)
        const response = await axios.get('/api/admin/users', config);
        setUsers(response.data); // Set fetched users to state

      } catch (err) {
        console.error("Fetch Users API Error:", err);
        let errorMessage = 'Failed to fetch users.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setUsers([]); // Clear users on error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken]); // Re-fetch if auth token changes

  // Function to handle user deletion (simulation or API call)
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return; // User cancelled
    }

    try {
        const token = authToken || localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found. Please sign in.");
            return;
        }
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Make API call to delete the user
        await axios.delete(`/api/admin/users/${userId}`, config); // Use userId which is _id from backend

        // Remove the user from the state to update the UI
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully!'); // Provide user feedback

    } catch (err) {
        console.error("Delete User API Error:", err);
        let errorMessage = 'Failed to delete user. Please try again.';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }
        setError(errorMessage);
    }
  };

  // Handle loading, error, and empty states for the user list
  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
      {/* Search Input */}
      <div className="relative mb-6">
         <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
         />
         {/* FiSearch icon for the search input */}
         <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Date Joined</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div>{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.joinedDate}</td> {/* Assuming joinedDate is available on user object */}
                  <td className="px-6 py-4 text-center">
                    {/* Button to edit user role */}
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit Role">
                      <Edit size={18} />
                    </button>
                    {/* Button to delete user */}
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900" title="Delete User">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Message if no users are found
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;