import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

const MyRentals = () => {
  const { user } = useUser();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        if (!user) return;
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('http://localhost:5000/api/rental-requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRentals(data);
        }
      } catch (err) {
        console.error('Failed to fetch rentals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this rental request?')) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/rental-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        const updated = await res.json();
        setRentals(prev => prev.map(r => r._id === id ? updated : r));
      } else {
        alert('Failed to cancel request: ' + (await res.text()));
      }
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Rentals</h2>
        <p className="text-sm text-slate-500 mt-1">All properties you have requested to rent.</p>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-3">
        {['approved', 'pending', 'rejected', 'cancelled'].map(s => {
          const count = rentals.filter(r => r.status === s).length;
          if (count === 0 && s !== 'approved') return null; // keep approved even if 0
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 capitalize ${statusColors[s]}`}>
              {s} <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Property', 'Category', 'Owner', 'Price', 'Requested On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-500">Loading rentals...</td></tr>
              ) : rentals.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400">You haven't requested any properties yet.</td></tr>
              ) : rentals.map(r => (
                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{r.propertyId?.address || 'Unknown Property'}</td>
                  <td className="px-5 py-3.5 text-slate-500 capitalize">{r.propertyId?.category?.replace('_', ' ') || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.ownerId?.name || 'Unknown Owner'}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">৳{r.propertyId?.rentPrice?.toLocaleString() || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[r.status] || statusColors.pending}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {r.status === 'pending' && (
                      <button onClick={() => handleCancel(r._id)} className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;
