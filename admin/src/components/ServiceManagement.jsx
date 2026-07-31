import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import ConfirmModal from './ConfirmModal';

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

  // Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, serviceId: null });

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

  const requestDelete = (id) => {
    setConfirmModal({ isOpen: true, serviceId: id });
  };

  const confirmDelete = () => {
    if (confirmModal.serviceId) {
      setServices(prev => prev.filter(s => s._id !== confirmModal.serviceId));
      setConfirmModal({ isOpen: false, serviceId: null });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, serviceId: null });
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
                      <button
                        onClick={() => toggleSuspend(svc._id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${svc.status === 'Suspended' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'}`}
                      >
                        {svc.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                      <button onClick={() => requestDelete(svc._id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title="Delete Service" 
        message="Are you sure you want to permanently delete this service? This action cannot be undone."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
        confirmText="Delete" 
      />
    </div>
  );
};

export default ServiceManagement;
