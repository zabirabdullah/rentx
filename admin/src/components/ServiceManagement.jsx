import React, { useState } from 'react';

const mockServices = [
  { id: 1, company: 'CleanPro Co.', category: 'Cleaning', baseRate: '$50/hr', status: 'Active' },
  { id: 2, company: 'MoveIt LLC', category: 'Moving', baseRate: '$120/hr', status: 'Active' },
  { id: 3, company: 'SparkWire Electricals', category: 'Electrician', baseRate: '$75/hr', status: 'Suspended' },
  { id: 4, company: 'PaintMasters', category: 'Painting', baseRate: '$60/hr', status: 'Active' },
  { id: 5, company: 'PipeFix Solutions', category: 'Plumbing', baseRate: '$80/hr', status: 'Active' },
  { id: 6, company: 'QuickMove Bros', category: 'Moving', baseRate: '$100/hr', status: 'Suspended' },
  { id: 7, company: 'BrightClean Services', category: 'Cleaning', baseRate: '$45/hr', status: 'Active' },
];

const categoryColors = {
  Cleaning: 'bg-sky-100 text-sky-700',
  Moving: 'bg-orange-100 text-orange-700',
  Electrician: 'bg-yellow-100 text-yellow-700',
  Painting: 'bg-pink-100 text-pink-700',
  Plumbing: 'bg-blue-100 text-blue-700',
};

const statusStyles = {
  Active: 'bg-green-100 text-green-700',
  Suspended: 'bg-red-100 text-red-700',
};

const ServiceManagement = () => {
  const [services, setServices] = useState(mockServices);
  const [editService, setEditService] = useState(null);
  const [editRate, setEditRate] = useState('');

  const toggleSuspend = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Suspended' ? 'Active' : 'Suspended' } : s));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service permanently?')) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const openEdit = (service) => {
    setEditService(service);
    setEditRate(service.baseRate);
  };

  const saveEdit = () => {
    setServices(prev => prev.map(s => s.id === editService.id ? { ...s, baseRate: editRate } : s));
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
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{svc.company}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[svc.category] || 'bg-gray-100 text-gray-700'}`}>{svc.category}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{svc.baseRate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[svc.status]}`}>{svc.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(svc)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit Rates</button>
                      <button
                        onClick={() => toggleSuspend(svc.id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${svc.status === 'Suspended' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'}`}
                      >
                        {svc.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                      <button onClick={() => handleDelete(svc.id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
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
            <p className="text-sm text-slate-500 mb-5">{editService.company} — {editService.category}</p>
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
