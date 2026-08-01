import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const availableCategories = ['moving', 'cleaning', 'electrician', 'plumbing', 'painting'];

const ManageServices = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null); // If null, means profile doesn't exist yet

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    servicesOffered: [],
    baseRates: {}
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/companies/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setProfileId(data._id);
            setFormData({
              businessName: data.businessName || '',
              description: data.description || '',
              servicesOffered: data.servicesOffered || [],
              baseRates: data.baseRates || {}
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch company profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleToggleService = (category) => {
    setFormData((prev) => {
      const isOffered = prev.servicesOffered.includes(category);
      let newServices = [...prev.servicesOffered];
      let newRates = { ...prev.baseRates };

      if (isOffered) {
        newServices = newServices.filter((s) => s !== category);
        delete newRates[category];
      } else {
        newServices.push(category);
        newRates[category] = 0; // Default base rate
      }

      return { ...prev, servicesOffered: newServices, baseRates: newRates };
    });
  };

  const handleRateChange = (category, value) => {
    const num = value === '' ? '' : Math.max(0, Number(value));
    setFormData((prev) => ({
      ...prev,
      baseRates: {
        ...prev.baseRates,
        [category]: num
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const method = profileId ? 'PUT' : 'POST';
      const url = profileId 
        ? `${API_BASE_URL}/api/companies/${profileId}` 
        : `${API_BASE_URL}/api/companies`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setProfileId(data._id);
        alert('Company profile saved successfully!');
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  if (loading) return <div className="text-slate-500 pt-10 text-center font-medium">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Company Profile & Services</h2>
        <p className="text-sm text-slate-500 mt-1">Configure your business details and the services you offer.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Business Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Business Information</h3>
          <div>
            <label className={labelClass}>Business Name</label>
            <input 
              required
              type="text"
              className={inputClass} 
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="e.g. Acme Moving & Cleaning"
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea 
              className={inputClass} 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell clients about your company and expertise..."
            />
          </div>
        </div>

        {/* Services Offered */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Services Offered</h3>
          <p className="text-xs text-slate-500">Select the categories you provide and set your base starting rate for each.</p>
          
          <div className="grid gap-4 mt-4">
            {availableCategories.map(category => {
              const isOffered = formData.servicesOffered.includes(category);
              return (
                <div key={category} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${isOffered ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isOffered}
                      onChange={() => handleToggleService(category)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800 capitalize">{category}</span>
                  </label>

                  {isOffered && (
                    <div className="flex items-center gap-2 sm:ml-auto pl-8 sm:pl-0">
                      <label className="text-xs font-bold text-slate-500 uppercase">Base Rate (৳):</label>
                      <input 
                        type="number"
                        min="0"
                        className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                        value={formData.baseRates[category] ?? ''}
                        onChange={(e) => handleRateChange(category, e.target.value)}
                        placeholder="Optional (0)"
                      />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={saving || formData.servicesOffered.length === 0}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${
              saving || formData.servicesOffered.length === 0 
                ? 'bg-green-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
            }`}
          >
            {saving ? 'Saving...' : 'Save Profile & Services'}
          </button>
          {formData.servicesOffered.length === 0 && (
            <p className="text-xs text-red-500 mt-2 font-medium">Please select at least one service to save your profile.</p>
          )}
        </div>

      </form>
    </div>
  );
};

export default ManageServices;
