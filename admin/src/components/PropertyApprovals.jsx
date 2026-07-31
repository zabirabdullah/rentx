import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

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

  const handleDelete = async (id) => {
    if (window.confirm('Remove this listing permanently?')) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setProperties(prev => prev.filter(p => p._id !== id));
        } else {
          alert('Failed to delete property');
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Property Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review and moderate all property listings submitted by owners.</p>
      </div>

      {/* Status Summary Pills */}
      <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Property Title', 'Category', 'Owner', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">Loading properties...</td></tr>
              ) : properties.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No properties found.</td></tr>
              ) : properties.map(prop => {
                const status = prop.isAvailable ? 'Available' : 'Unavailable';
                return (
                <tr key={prop._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{prop.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[prop.category?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>{prop.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{prop.owner?.name || 'Unknown'}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">৳{prop.price?.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>{status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModalProperty(prop)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Review</button>
                      <button onClick={() => handleDelete(prop._id)} className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Remove</button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {properties.length} listings</span>
          <div className="flex gap-1">
            {[1, 2].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === 1 ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {modalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Listing Review</h2>
              <button onClick={() => setModalProperty(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              {[['Title', modalProperty.title], ['Category', modalProperty.category], ['Owner', modalProperty.owner?.name || 'Unknown'], ['Price', `৳${modalProperty.price?.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500 font-medium">{k}</dt>
                  <dd className="text-slate-800 font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between">
                <dt className="text-slate-500 font-medium">Status</dt>
                <dd><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[modalProperty.isAvailable ? 'Available' : 'Unavailable']}`}>{modalProperty.isAvailable ? 'Available' : 'Unavailable'}</span></dd>
              </div>
            </dl>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setModalProperty(null); }} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyApprovals;
