import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import ConfirmModal from './ConfirmModal';

const roleBadge = {
  admin: 'bg-violet-100 text-violet-700',
  owner: 'bg-blue-100 text-blue-700',
  tenant: 'bg-sky-100 text-sky-700',
  company: 'bg-orange-100 text-orange-700',
};

const UserManagement = () => {
  const { user: adminUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    if (adminUser) fetchUsers();
  }, [adminUser]);

  const requestDelete = (id) => {
    setConfirmModal({ isOpen: true, userId: id });
  };

  const confirmDelete = async () => {
    if (confirmModal.userId) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:5000/api/users/${confirmModal.userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(prev => prev.filter(u => u._id !== confirmModal.userId));
          setConfirmModal({ isOpen: false, userId: null });
        } else {
          const errData = await res.json();
          alert(`Failed to delete: ${errData.message || 'Unknown error'}`);
          setConfirmModal({ isOpen: false, userId: null });
        }
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete user');
        setConfirmModal({ isOpen: false, userId: null });
      }
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, userId: null });
  };

  // Filter out admin user from the list + apply search and role filter
  const filtered = users.filter(u => {
    // Never show the current admin in the list
    if (u._id === adminUser?._id) return false;

    const nameMatch = u.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(search.toLowerCase());
    const matchSearch = nameMatch || emailMatch;
    const matchRole = roleFilter === 'All' || (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">View, search, and manage platform users.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        >
          {['All', 'Owner', 'Tenant', 'Company'].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <span className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} users found</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No users found.</td></tr>
              ) : (
                filtered.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium text-slate-800">{user.name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{user.email}</td>
                    <td className="px-5 py-3.5 text-slate-500">{user.phone || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleBadge[user.role] || 'bg-slate-100'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => requestDelete(user._id)}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {users.filter(u => u._id !== adminUser?._id).length} users</span>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title="Delete User" 
        message="Are you sure you want to permanently delete this user? This action will also delete their properties or company profile and Firebase account."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
        confirmText="Delete" 
      />
    </div>
  );
};

export default UserManagement;
