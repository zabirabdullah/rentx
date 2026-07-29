import React, { useState } from 'react';

const mockProperties = [
  { id: 1, title: 'Modern 3BR Apartment', category: 'House', owner: 'Sarah Johnson', price: '$1,200/mo', status: 'Pending' },
  { id: 2, title: 'Downtown Office Space', category: 'Office', owner: 'John Smith', price: '$3,500/mo', status: 'Approved' },
  { id: 3, title: 'Warehouse Unit B', category: 'Godown', owner: 'Ahmed Khan', price: '$800/mo', status: 'Pending' },
  { id: 4, title: 'Retail Commercial Plaza', category: 'Commercial', owner: 'Li Wei', price: '$2,100/mo', status: 'Rejected' },
  { id: 5, title: 'Secure Parking Garage', category: 'Garage', owner: 'Alice Brown', price: '$150/mo', status: 'Approved' },
  { id: 6, title: 'ATM Corner Space', category: 'ATM Booth', owner: 'John Smith', price: '$500/mo', status: 'Pending' },
  { id: 7, title: 'Studio Flat - City Center', category: 'House', owner: 'Sarah Johnson', price: '$750/mo', status: 'Approved' },
];

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const categoryStyles = {
  House: 'bg-blue-50 text-blue-700',
  Office: 'bg-indigo-50 text-indigo-700',
  Godown: 'bg-orange-50 text-orange-700',
  Commercial: 'bg-teal-50 text-teal-700',
  Garage: 'bg-slate-100 text-slate-700',
  'ATM Booth': 'bg-purple-50 text-purple-700',
};

const PropertyApprovals = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [modalProperty, setModalProperty] = useState(null);

  const updateStatus = (id, newStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this listing permanently?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
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
        {['Pending', 'Approved', 'Rejected'].map(s => {
          const count = properties.filter(p => p.status === s).length;
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
              {properties.map(prop => (
                <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{prop.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[prop.category] || 'bg-gray-100 text-gray-700'}`}>{prop.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{prop.owner}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{prop.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[prop.status]}`}>{prop.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModalProperty(prop)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Review</button>
                      <button onClick={() => updateStatus(prop.id, 'Approved')} className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">Approve</button>
                      <button onClick={() => updateStatus(prop.id, 'Rejected')} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Reject</button>
                      <button onClick={() => handleDelete(prop.id)} className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
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
              {[['Title', modalProperty.title], ['Category', modalProperty.category], ['Owner', modalProperty.owner], ['Price', modalProperty.price]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500 font-medium">{k}</dt>
                  <dd className="text-slate-800 font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between">
                <dt className="text-slate-500 font-medium">Status</dt>
                <dd><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[modalProperty.status]}`}>{modalProperty.status}</span></dd>
              </div>
            </dl>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { updateStatus(modalProperty.id, 'Approved'); setModalProperty(null); }} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors">Approve</button>
              <button onClick={() => { updateStatus(modalProperty.id, 'Rejected'); setModalProperty(null); }} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-colors">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyApprovals;
