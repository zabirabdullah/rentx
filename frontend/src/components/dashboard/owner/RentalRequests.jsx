import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

const RentalRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('http://localhost:5000/api/rental-requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Sort pending first, then by date desc
          data.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setRequests(data);
        }
      } catch (err) {
        console.error('Failed to fetch rental requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/rental-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r._id === id ? updated : r));
      } else {
        alert('Failed to update request: ' + (await res.text()));
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Rental Requests</h2>
        <p className="text-sm text-slate-500 mt-1">Review and respond to incoming rental requests from tenants.</p>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap gap-3">
        {['pending', 'approved', 'rejected', 'cancelled'].map(s => {
          const count = requests.filter(r => r.status === s).length;
          if (count === 0 && s !== 'pending') return null; // Hide empty non-pending pills
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 capitalize ${statusColors[s]}`}>
              {s} <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">No rental requests yet.</div>
        ) : requests.map(req => (
          <div key={req._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {(req.tenantId?.name || 'T').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{req.tenantId?.name || 'Unknown Tenant'} <span className="text-xs text-slate-500 font-normal">({req.tenantId?.email || ''})</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">for <span className="font-medium text-slate-700">{req.propertyId?.address || 'Deleted Property'}</span></p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                  {req.message && <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">"{req.message}"</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[req.status] || statusColors.pending}`}>{req.status}</span>
                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(req._id, 'approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">Approve</button>
                    <button onClick={() => updateStatus(req._id, 'rejected')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">Reject</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalRequests;
