import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { auth } from '../../../config/firebase';

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setProperties(prev => prev.filter(p => p._id !== id));
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An error occurred while deleting.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Platform Properties</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Title</th>
                <th className="px-6 py-4 font-semibold text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-sm">Price/Month</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading properties...</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No properties found.</td>
                </tr>
              ) : (
                properties.map(property => (
                  <tr key={property._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 truncate max-w-xs">{property.title}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{property.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{property.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">৳{property.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full
                        ${property.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {property.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(property._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
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
      </div>
    </div>
  );
};

export default AdminPropertiesPage;
