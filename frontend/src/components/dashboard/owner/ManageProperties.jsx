import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import LocationPickerMap from '../../LocationPickerMap';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const emptyForm = { title: '', category: 'house', price: '', salePrice: '', location: '', holdingNo: '', area: '', lat: '', lng: '', specs: '', status: 'Available', availableFrom: '', elevator: false, showPhone: false, existingImages: [] };
const categories = ['house', 'office', 'commercial_space', 'godown', "garage", "atm_booth"];
const statusColors = { Available: 'bg-green-100 text-green-700', Unavailable: 'bg-slate-100 text-slate-600' };

const ManageProperties = () => {
  const { user } = useUser();
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        if (!user || !user._id) return;
        const response = await fetch(`${API_BASE_URL}/api/properties?ownerId=${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, [user]);

  const openAdd = () => { setForm(emptyForm); setImageFiles([]); setEditingId(null); setShowModal(true); };
  const openEdit = (p) => { 
    setForm({ 
      title: p.title || p.name || '', 
      category: p.category, 
      price: p.rentPrice?.toString() || '', 
      salePrice: p.salePrice?.toString() || '',
      location: p.address || '', 
      holdingNo: p.holdingNo || '',
      area: p.area?.toString() || '',
      availableFrom: p.availableFrom ? new Date(p.availableFrom).toISOString().split('T')[0] : '',
      elevator: p.elevator || false,
      showPhone: p.showPhone || false,
      lat: p.lat?.toString() || '', 
      lng: p.lng?.toString() || '', 
      specs: p.specs || '', 
      status: p.isAvailable ? 'Available' : 'Unavailable',
      existingImages: p.images || []
    }); 
    setImageFiles([]);
    setEditingId(p._id); 
    setShowModal(true); 
  };

  const handleDelete = async (id) => { 
    if (window.confirm('Delete this listing?')) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setProperties(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        console.error('Delete failed', err);
      }
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();

      let uploadedImages = [...form.existingImages];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('image', file);
          const upRes = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          });
          if (upRes.ok) {
            const data = await upRes.json();
            uploadedImages.push(data.url);
          } else {
            console.error('Image upload failed', await upRes.text());
          }
        }
      }
      if (uploadedImages.length === 0) uploadedImages.push('https://via.placeholder.com/600?text=No+Image');

      const payload = {
        name: form.title,
        title: form.title,
        category: form.category.toLowerCase(),
        rentPrice: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        address: form.location,
        holdingNo: form.holdingNo || 'N/A',
        area: form.area ? parseFloat(form.area) : 0,
        availableFrom: form.availableFrom ? new Date(form.availableFrom) : undefined,
        storey: 1, // default
        elevator: form.elevator,
        showPhone: form.showPhone,
        lat: form.lat ? parseFloat(form.lat) : undefined,
        lng: form.lng ? parseFloat(form.lng) : undefined,
        specs: form.specs,
        isAvailable: form.status === 'Available',
        images: uploadedImages,
      };
      
      // Need bedroom/bathroom if house
      if (payload.category === 'house') {
        payload.bedroom = 1;
        payload.bathroom = 1;
      }

      if (editingId) {
        const res = await fetch(`${API_BASE_URL}/api/properties/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setProperties(prev => prev.map(p => p._id === editingId ? updated : p));
        } else {
          alert('Failed to update: ' + (await res.text()));
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setProperties(prev => [...prev, created]);
        } else {
          alert('Failed to create: ' + (await res.text()));
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      setSubmitting(false);
    }
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
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">Loading...</td></tr>
              ) : properties.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No properties yet.</td></tr>
              ) : properties.map(p => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{p.title || p.name}</td>
                  <td className="px-5 py-3.5 text-slate-600 capitalize">{p.category?.replace('_', ' ')}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">৳{p.rentPrice?.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-slate-500">{p.address}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.isAvailable ? 'Available' : 'Unavailable']}`}>{p.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Property' : 'Add New Property'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelClass}>Title</label><input required className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Modern 2BR Apartment" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Rent Price (Monthly)</label><input required type="number" className={inputClass} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="12000" /></div>
                  <div><label className={labelClass}>Sale Price (Optional)</label><input type="number" className={inputClass} value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} placeholder="5000000" /></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Holding No.</label><input required className={inputClass} value={form.holdingNo} onChange={e => setForm(f => ({ ...f, holdingNo: e.target.value }))} placeholder="e.g. 45/A" /></div>
                  <div><label className={labelClass}>Area (sqft)</label><input required type="number" className={inputClass} value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="1200" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Available From (Optional)</label><input type="date" className={inputClass} value={form.availableFrom} onChange={e => setForm(f => ({ ...f, availableFrom: e.target.value }))} /></div>
                  <div><label className={labelClass}>Specs (Short)</label><input className={inputClass} value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} placeholder="3 Beds, 2 Baths" /></div>
                </div>

                <div className="flex gap-6 items-center pt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.elevator} onChange={e => setForm(f => ({ ...f, elevator: e.target.checked }))} className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500" />
                    Has Elevator?
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.showPhone} onChange={e => setForm(f => ({ ...f, showPhone: e.target.checked }))} className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500" />
                    Show Phone Number on Details Page?
                  </label>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Location / Address</label>
                  <input required className={inputClass} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="123 Main St, City" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Images (Cloudinary)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {form.existingImages.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">Currently has {form.existingImages.length} image(s).</p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 h-[350px] mb-4">
                  <label className={labelClass}>Pinpoint on Map</label>
                  <LocationPickerMap 
                    initialLocation={{ lat: form.lat ? parseFloat(form.lat) : null, lng: form.lng ? parseFloat(form.lng) : null }}
                    onLocationSelect={(loc) => setForm(f => ({ ...f, lat: loc.lat.toString(), lng: loc.lng.toString() }))}
                  />
                  <p className="text-xs text-slate-500 mt-1">Click on the map to automatically fill GPS coordinates.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                  <div><label className={labelClass}>GPS Latitude</label><input className={inputClass} value={form.lat} readOnly placeholder="e.g. 22.3569" /></div>
                  <div><label className={labelClass}>GPS Longitude</label><input className={inputClass} value={form.lng} readOnly placeholder="e.g. 91.7832" /></div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-slate-100 mt-2">
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md disabled:opacity-50">{submitting ? 'Uploading Images & Saving...' : (editingId ? 'Save Changes' : 'Add Property')}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
