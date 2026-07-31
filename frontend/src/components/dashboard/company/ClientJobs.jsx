import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-blue-100 text-blue-700',
  accepted: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-100 text-slate-700'
};

const serviceEmoji = { cleaning: '🧹', moving: '📦', plumbing: '🔧', electrician: '⚡', painting: '🎨' };

const ClientJobs = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user) return;
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('http://localhost:5000/api/service-requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  const updateStatus = async (id, status) => {
    let estimatedCost;
    if (status === 'quoted') {
      const costStr = window.prompt("Enter your estimated cost quote (৳):");
      if (!costStr) return; // cancelled
      estimatedCost = parseFloat(costStr);
      if (isNaN(estimatedCost)) return alert('Invalid cost amount');
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/service-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, estimatedCost })
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j._id === id ? updated : j));
      } else {
        alert('Failed to update: ' + (await res.text()));
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client Jobs</h2>
        <p className="text-sm text-slate-500 mt-1">View and respond to incoming service requests from clients.</p>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(statusColors).map(s => {
          const count = jobs.filter(j => j.status === s).length;
          if (count === 0 && s !== 'pending') return null;
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 capitalize ${statusColors[s]}`}>
              {s.replace('_', ' ')} <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">No client jobs yet.</div>
        ) : jobs.map(job => (
          <div key={job._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {serviceEmoji[job.serviceType] || '🛠️'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm capitalize">{job.serviceType.replace('_', ' ')} Request</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">From <span className="font-medium text-slate-700">{job.requesterId?.name || 'Unknown'}</span> · {new Date(job.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {job.fromAddress || job.toAddress || 'Location specified in notes'}</p>
                  {job.specialNote && <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">"{job.specialNote}"</p>}
                  {job.estimatedCost && <p className="text-sm font-semibold text-green-700 mt-2">Quote: ৳{job.estimatedCost}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[job.status]}`}>{job.status.replace('_', ' ')}</span>
                
                {job.status === 'pending' && (
                  <button onClick={() => updateStatus(job._id, 'quoted')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">Provide Quote</button>
                )}
                {job.status === 'accepted' && (
                  <button onClick={() => updateStatus(job._id, 'in_progress')} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors">Start Job</button>
                )}
                {job.status === 'in_progress' && (
                  <button onClick={() => updateStatus(job._id, 'completed')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">Mark Completed</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientJobs;
