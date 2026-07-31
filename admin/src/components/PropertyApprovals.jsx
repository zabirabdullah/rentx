import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import ConfirmModal from './ConfirmModal';

const statusStyles = {
  Available: 'bg-green-100 text-green-700',
  Unavailable: 'bg-slate-100 text-slate-700',
};

const categoryStyles = {
  house: 'bg-blue-50 text-blue-700',
  office: 'bg-indigo-50 text-indigo-700',
  godown: 'bg-orange-50 text-orange-700',
  commercial: 'bg-teal-50 text-teal-700',
  garage: 'bg-slate-100 text-slate-700',
  'atm booth': 'bg-purple-50 text-purple-700',
};

const PropertyApprovals = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProperty, setModalProperty] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, propertyId: null, error: false });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProperties();
  }, [user]);

  const requestDelete = (id) => {
    setConfirmModal({ isOpen: true, propertyId: id, error: false });
  };

  const confirmDelete = async () => {
    if (confirmModal.propertyId) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:5000/api/properties/${confirmModal.propertyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setProperties(prev => prev.filter(p => p._id !== confirmModal.propertyId));
          if (modalProperty?._id === confirmModal.propertyId) setModalProperty(null);
          setConfirmModal({ isOpen: false, propertyId: null, error: false });
        } else {
          setConfirmModal({ isOpen: true, propertyId: null, error: true });
        }
      } catch (error) {
        console.error('Delete error', error);
        setConfirmModal({ isOpen: true, propertyId: null, error: true });
      }
    } else if (confirmModal.error) {
      setConfirmModal({ isOpen: false, propertyId: null, error: false });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, propertyId: null, error: false });
  };

  const filtered = properties.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.owner?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Property Management</h1>
        <p className="text-sm text-slate-500 mt-1">Review and moderate all property listings on the platform.</p>
      </div>

      {/* Status Summary + Search */}
      <div className="flex flex-wrap items-center gap-3">
        {['Available', 'Unavailable'].map(s => {
          const isAvail = s === 'Available';
          const count = properties.filter(p => p.isAvailable === isAvail).length;
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${statusStyles[s]}`}>
              <span>{s}</span>
              <span className="font-bold">{count}</span>
            </div>
          );
        })}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Property Title', 'Category', 'Owner', 'Price', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-500">Loading properties...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400">No properties found.</td></tr>
              ) : filtered.map(prop => {
                const status = prop.isAvailable ? 'Available' : 'Unavailable';
                return (
                  <tr key={prop._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 max-w-[200px] truncate">{prop.title}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${categoryStyles[prop.category?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>{prop.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{prop.owner?.name || 'Unknown'}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">৳{prop.price?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>{status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModalProperty(prop)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Review</button>
                        <button onClick={() => requestDelete(prop._id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Remove</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 text-sm text-slate-500">
          Showing {filtered.length} of {properties.length} listings
        </div>
      </div>

      {/* Review Modal */}
      {modalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Listing Review</h2>
              <button onClick={() => setModalProperty(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Images */}
            {modalProperty.images && modalProperty.images.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto">
                {modalProperty.images.slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt={`Property ${i + 1}`} className="w-28 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                ))}
              </div>
            )}

            <dl className="space-y-3 text-sm">
              {[
                ['Title', modalProperty.title],
                ['Category', modalProperty.category],
                ['Owner', modalProperty.owner?.name || 'Unknown'],
                ['Owner Email', modalProperty.owner?.email || 'N/A'],
                ['Price', `৳${modalProperty.price?.toLocaleString()}`],
                ['Address', modalProperty.address || 'N/A'],
                ['Bedrooms', modalProperty.bedrooms || '-'],
                ['Bathrooms', modalProperty.bathrooms || '-'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500 font-medium">{k}</dt>
                  <dd className="text-slate-800 font-semibold text-right max-w-[60%] truncate">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between">
                <dt className="text-slate-500 font-medium">Status</dt>
                <dd><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[modalProperty.isAvailable ? 'Available' : 'Unavailable']}`}>{modalProperty.isAvailable ? 'Available' : 'Unavailable'}</span></dd>
              </div>
            </dl>

            {modalProperty.description && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-100 max-h-24 overflow-y-auto">{modalProperty.description}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { requestDelete(modalProperty._id); }}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg text-sm transition-colors"
              >
                Remove Listing
              </button>
              <button onClick={() => setModalProperty(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen && !confirmModal.error} 
        title="Remove Listing" 
        message="Are you sure you want to permanently remove this property listing? This action cannot be undone."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
        confirmText="Remove" 
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen && confirmModal.error} 
        title="Error" 
        message="Failed to delete property. Please try again later."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
        confirmText="Okay" 
        isDanger={false}
      />
    </div>
  );
};

export default PropertyApprovals;
