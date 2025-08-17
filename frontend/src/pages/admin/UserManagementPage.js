import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
// Import data from the central mock database
import { mockUsers } from '../../data/mockDatabase';

const UserManagementPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
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
            {mockUsers.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div>{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.joinedDate}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit Role"><Edit size={18} /></button>
                  <button className="text-red-600 hover:text-red-900" title="Delete User"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;