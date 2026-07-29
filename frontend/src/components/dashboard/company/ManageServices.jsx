import React, { useState } from 'react';

const initialServices = [
  { id: 1, name: 'Deep Cleaning', category: 'Cleaning', baseRate: '$50/hr', available: true },
  { id: 2, name: 'Full Apartment Cleaning', category: 'Cleaning', baseRate: '$80/hr', available: true },
  { id: 3, name: 'Local Moving', category: 'Moving', baseRate: '$120/hr', available: false },
];

const categories = ['Cleaning', 'Moving', 'Electrician', 'Plumbing', 'Painting'];

const ManageServices = () => {
  const [services, setServices] = useState(initialServices);
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', category: 'Cleaning', baseRate: '' });

  const openEdit = (svc) => setEditItem({ ...svc });
  const saveEdit = () => {
    setServices(prev => prev.map(s => s.id === editItem.id ? editItem : s));
    setEditItem(null);
  };
  const toggleAvailable = (id) => setServices(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s));
  const deleteService = (id) => { if (window.confirm('Delete this service?')) setServices(prev => prev.filter(s => s.id !== id)); };
  const addService = (e) => {
    e.preventDefault();
    setServices(prev => [...prev, { ...newForm, id: Date.now(), available: true }]);
    setNewForm({ name: '', category: 'Cleaning', baseRate: '' });
    setShowAdd(false);
  };

  const inputClass = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Services</h2>
          <p className="text-sm text-slate-500 mt-1">Set your service offerings and pricing.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">+ Add Service</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Service Name', 'Category', 'Base Rate', 'Available', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{svc.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{svc.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{svc.baseRate}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleAvailable(svc.id)} className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${svc.available ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${svc.available ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(svc)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit Rates</button>
                      <button onClick={() => deleteService(svc.id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Service</h3>
            <div className="space-y-4">
              <div><label className={labelClass}>Service Name</label><input className={inputClass} value={editItem.name} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className={labelClass}>Base Rate</label><input className={inputClass} value={editItem.baseRate} onChange={e => setEditItem(p => ({ ...p, baseRate: e.target.value }))} /></div>
              <div><label className={labelClass}>Category</label>
                <select className={inputClass} value={editItem.category} onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors">Save</button>
              <button onClick={() => setEditItem(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Service</h3>
            <form onSubmit={addService} className="space-y-4">
              <div><label className={labelClass}>Service Name</label><input required className={inputClass} value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Deep Cleaning" /></div>
              <div><label className={labelClass}>Category</label>
                <select className={inputClass} value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Base Rate</label><input required className={inputClass} value={newForm.baseRate} onChange={e => setNewForm(f => ({ ...f, baseRate: e.target.value }))} placeholder="$60/hr" /></div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors">Add</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
