import React, { useState } from 'react';

const initialProperties = [
  { id: 1, title: 'Modern 3BR Apartment', category: 'House', price: '$1,200/mo', location: 'Green St, NY', status: 'Active' },
  { id: 2, title: 'Downtown Office', category: 'Office', price: '$3,500/mo', location: '5th Ave, NY', status: 'Active' },
  { id: 3, title: 'Secure Garage', category: 'Garage', price: '$150/mo', location: 'West Side, NY', status: 'Inactive' },
  { id: 4, title: 'ATM Corner Space', category: 'ATM Booth', price: '$500/mo', location: 'Broadway, NY', status: 'Active' },
];

const emptyForm = { title: '', category: 'House', price: '', location: '', lat: '', lng: '', specs: '', status: 'Active' };
const categories = ['House', 'Office', 'Commercial', 'Godown', 'Garage', 'ATM Booth'];
const statusColors = { Active: 'bg-green-100 text-green-700', Inactive: 'bg-slate-100 text-slate-600' };

const ManageProperties = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditingId(p.id); setShowModal(true); };
  const handleDelete = (id) => { if (window.confirm('Delete this listing?')) setProperties(prev => prev.filter(p => p.id !== id)); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProperties(prev => prev.map(p => p.id === editingId ? { ...form, id: editingId } : p));
    } else {
      setProperties(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const inputClass = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Properties</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all your property listings.</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
          <span>+</span> Add Property
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Title', 'Category', 'Price', 'Location', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{p.title}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{p.price}</td>
                  <td className="px-5 py-3.5 text-slate-500">{p.location}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No properties yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Property' : 'Add New Property'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className={labelClass}>Title</label><input required className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Modern 2BR Apartment" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className={labelClass}>Price</label><input required className={inputClass} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$1,200/mo" /></div>
              </div>
              <div><label className={labelClass}>Location / Address</label><input required className={inputClass} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="123 Main St, City" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>GPS Latitude</label><input className={inputClass} value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="e.g. 40.7128" /></div>
                <div><label className={labelClass}>GPS Longitude</label><input className={inputClass} value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="e.g. -74.0060" /></div>
              </div>
              <div><label className={labelClass}>Specs</label><input className={inputClass} value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} placeholder="3 Beds, 2 Baths • 1,500 sq ft" /></div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors">{editingId ? 'Save Changes' : 'Add Property'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
