import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

const roleBadge = {
  admin: 'bg-violet-100 text-violet-700',
  owner: 'bg-blue-100 text-blue-700',
  tenant: 'bg-sky-100 text-sky-700',
  company: 'bg-orange-100 text-orange-700',
};

const statusBadge = {
  Active: 'bg-green-100 text-green-700',
  Banned: 'bg-red-100 text-red-700',
};

const UserManagement = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Add default status if missing for the UI
          const usersWithStatus = data.map(u => ({ ...u, status: 'Active' }));
          setUsers(usersWithStatus);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const handleBan = (id) => {
    // Simple UI ban toggle for demonstration (real implementation requires backend PUT)
    setUsers(prev => prev.map(u => u._id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u._id !== id));
      // Missing backend DELETE call intentionally kept simple
    }
  };

  const filtered = users.filter(u => {
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
        <p className="text-sm text-slate-500 mt-1">View, search, ban, or delete platform users.</p>
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
          {['All', 'Admin', 'Owner', 'Tenant', 'Company'].map(r => (
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
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
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
                          {user.name ? user.name.charAt(0) : '?'}
                        </div>
                        <span className="font-medium text-slate-800">{user.name || 'Unnamed'}</span>
                      </div>
                    </td>
                  <td className="px-5 py-3.5 text-slate-500">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[user.role] || 'bg-slate-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[user.status]}`}>{user.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{user.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">View</button>
                      <button
                        onClick={() => handleBan(user._id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${user.status === 'Banned' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'}`}
                      >
                        {user.status === 'Banned' ? 'Unban' : 'Ban'}
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {/* Pagination UI */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {users.length} users</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === 1 ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
