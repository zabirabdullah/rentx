import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { auth } from '../../../config/firebase';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Manage Users</h2>
        <span className="bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full text-sm">
          {users.length} Total Users
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Email</th>
                <th className="px-6 py-4 font-semibold text-sm">Role</th>
                <th className="px-6 py-4 font-semibold text-sm">Phone</th>
                <th className="px-6 py-4 font-semibold text-sm">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                          {user.name ? user.name.charAt(0) : '?'}
                        </div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'company' ? 'bg-orange-100 text-orange-700' :
                          'bg-sky-100 text-sky-700'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.address || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
