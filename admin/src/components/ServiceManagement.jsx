import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

const categoryColors = {
  cleaning: 'bg-sky-100 text-sky-700',
  moving: 'bg-orange-100 text-orange-700',
  electrician: 'bg-yellow-100 text-yellow-700',
  painting: 'bg-pink-100 text-pink-700',
  plumbing: 'bg-blue-100 text-blue-700',
};

const statusStyles = {
  Active: 'bg-green-100 text-green-700',
  Suspended: 'bg-red-100 text-red-700',
};

const ServiceManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editService, setEditService] = useState(null);
  const [editRate, setEditRate] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/companies');
        if (res.ok) {
          const data = await res.json();
          // Add default status
          setServices(data.map(c => ({ ...c, status: 'Active' })));
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCompanies();
  }, [user]);

  const toggleSuspend = (id) => {
    setServices(prev => prev.map(s => s._id === id ? { ...s, status: s.status === 'Suspended' ? 'Active' : 'Suspended' } : s));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service permanently?')) {
      setServices(prev => prev.filter(s => s._id !== id));
    }
  };

  const openEdit = (service) => {
    setEditService(service);
    setEditRate(service.baseRate || '');
  };

  const saveEdit = () => {
    setServices(prev => prev.map(s => s._id === editService._id ? { ...s, baseRate: editRate } : s));
    setEditService(null);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Service Management</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor and manage company services on the RentX platform.</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Cleaning', 'Moving', 'Electrician', 'Plumbing'].map(cat => {
          const count = services.filter(s => s.category === cat && s.status === 'Active').length;
          return (
            <div key={cat} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">{cat}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{count} <span className="text-sm font-medium text-green-600">active</span></p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Company Name', 'Service Category', 'Base Rate', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">Loading companies...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">No companies found.</td></tr>
              ) : (
              services.map(svc => (
                <tr key={svc._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{svc.companyName}</td>
                  <td className="px-5 py-3.5 flex flex-wrap gap-1">
                    {svc.serviceTypes?.map(st => (
                      <span key={st} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[st.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>{st}</span>
                    ))}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{svc.baseRate ? `৳${svc.baseRate.toLocaleString()}` : 'Variable'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[svc.status]}`}>{svc.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(svc)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit Rates</button>
                      <button
                        onClick={() => toggleSuspend(svc._id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${svc.status === 'Suspended' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'}`}
                      >
                        {svc.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                      <button onClick={() => handleDelete(svc._id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {services.length} services</span>
          <div className="flex gap-1">
            {[1, 2].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === 1 ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Rate Modal */}
      {editService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Edit Base Rate</h2>
            <p className="text-sm text-slate-500 mb-5">{editService.companyName} — {editService.serviceTypes?.join(', ')}</p>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Base Rate</label>
            <input
              type="text"
              value={editRate}
              onChange={e => setEditRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              placeholder="e.g. $70/hr"
            />
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors">Save Changes</button>
              <button onClick={() => setEditService(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
