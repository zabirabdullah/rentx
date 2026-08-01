import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-blue-100 text-blue-700',
  accepted: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const serviceEmoji = { moving: '📦', cleaning: '🧹', electrician: '⚡', plumbing: '🔧', painting: '🎨' };

const MyServiceBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) return;
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/service-requests/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/service-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b._id === id ? updated : b));
      } else {
        alert('Failed to update booking: ' + (await res.text()));
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const cancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      handleStatusChange(id, 'cancelled');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Service Bookings</h2>
        <p className="text-sm text-slate-500 mt-1">Track all your service requests and their status.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">No service bookings yet.</div>
        ) : bookings.map(b => (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {serviceEmoji[b.serviceType] || '🛠️'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm capitalize">{b.serviceType?.replace('_', ' ')} — <span className="text-slate-600">{b.companyId?.businessName || 'Unknown Company'}</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">Scheduled: {new Date(b.scheduledDate || b.createdAt).toLocaleDateString()} · Est. Cost: <span className="font-bold text-slate-700">৳{b.estimatedCost || '-'}</span></p>
                  
                  {b.companyNote && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-xs text-blue-900">
                      <span className="font-bold text-blue-950">Company Note: </span>"{b.companyNote}"
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status] || 'bg-slate-100 text-slate-700'}`}>{b.status?.replace('_', ' ')}</span>
                
                {b.status === 'quoted' && (
                  <button onClick={() => handleStatusChange(b._id, 'accepted')} className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    Accept Quote
                  </button>
                )}
                {(b.status === 'pending' || b.status === 'quoted') && (
                  <button onClick={() => cancel(b._id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Cancel</button>
                )}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MyServiceBookings;
