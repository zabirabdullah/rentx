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

const ServiceManagement = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, companyId: null });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCompanies();
  }, [user]);

  const requestDelete = (id) => {
    setConfirmModal({ isOpen: true, companyId: id });
  };

  const confirmDelete = async () => {
    if (confirmModal.companyId) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:5000/api/companies/${confirmModal.companyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setCompanies(prev => prev.filter(c => c._id !== confirmModal.companyId));
          setConfirmModal({ isOpen: false, companyId: null });
        } else {
          const errData = await res.json();
          alert(`Failed to delete: ${errData.message || 'Unknown error'}`);
          setConfirmModal({ isOpen: false, companyId: null });
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete company profile.');
        setConfirmModal({ isOpen: false, companyId: null });
      }
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, companyId: null });
  };

  // Summary: count companies offering each service
  const serviceCounts = {};
  companies.forEach(c => {
    c.servicesOffered?.forEach(s => {
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Service Companies</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor and manage registered service companies on the RentX platform.</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {['moving', 'cleaning', 'electrician', 'plumbing', 'painting'].map(cat => (
          <div key={cat} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium capitalize">{cat}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {serviceCounts[cat] || 0} <span className="text-sm font-medium text-slate-400">companies</span>
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Company Name', 'Owner', 'Services Offered', 'Base Rates', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">Loading companies...</td></tr>
              ) : companies.length === 0 ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">No companies registered yet.</td></tr>
              ) : (
                companies.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-semibold text-slate-800">{c.businessName}</span>
                        {c.description && (
                          <p className="text-xs text-slate-400 mt-0.5 max-w-[200px] truncate">{c.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <div>
                        <span className="font-medium">{c.userId?.name || 'Unknown'}</span>
                        <p className="text-xs text-slate-400">{c.userId?.email || '-'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.servicesOffered?.map(s => (
                          <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${categoryColors[s] || 'bg-gray-100 text-gray-700'}`}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {c.baseRates && Object.keys(c.baseRates).length > 0 ? (
                        <div className="text-xs space-y-0.5">
                          {Object.entries(c.baseRates).map(([service, rate]) => (
                            <div key={service} className="capitalize">
                              {service}: <span className="font-semibold text-slate-800">{rate > 0 ? `৳${rate}` : 'Custom'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Not set</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => requestDelete(c._id)}
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
        <div className="px-5 py-3 border-t border-slate-100 text-sm text-slate-500">
          Showing {companies.length} registered companies
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title="Delete Company Profile" 
        message="Are you sure you want to permanently delete this company profile? This action cannot be undone."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
        confirmText="Delete" 
      />
    </div>
  );
};

export default ServiceManagement;
