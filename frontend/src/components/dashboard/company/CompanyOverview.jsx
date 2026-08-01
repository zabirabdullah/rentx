import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const CompanyOverview = () => {
  const { user } = useUser();
  const [stats, setStats] = useState([
    { label: 'Active Jobs', value: '0', icon: '💼', color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed Jobs', value: '0', icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Pending Requests', value: '0', icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Total Revenue', value: '৳0', icon: '💰', color: 'bg-purple-50 text-purple-600' },
  ]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return;
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/service-requests/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const requests = await res.json();
          
          const pending = requests.filter(r => r.status === 'pending');
          const completed = requests.filter(r => r.status === 'completed');
          const active = requests.filter(r => ['quoted', 'accepted', 'in_progress'].includes(r.status));
          
          let revenue = 0;
          completed.forEach(r => { if (r.estimatedCost) revenue += r.estimatedCost; });
          
          setStats([
            { label: 'Active Jobs', value: active.length.toString(), icon: '💼', color: 'bg-blue-50 text-blue-600' },
            { label: 'Completed Jobs', value: completed.length.toString(), icon: '✅', color: 'bg-green-50 text-green-600' },
            { label: 'Pending Requests', value: pending.length.toString(), icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Total Revenue', value: `৳${revenue.toLocaleString()}`, icon: '💰', color: 'bg-purple-50 text-purple-600' },
          ]);
          
          setRecentJobs(requests.slice(0, 5).map(r => ({
            id: r._id,
            client: r.requesterId?.name || 'Unknown',
            service: r.serviceType,
            date: new Date(r.createdAt).toLocaleDateString(),
            status: r.status
          })));
        }
      } catch (err) {
        console.error('Failed to fetch company overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Your business performance and incoming jobs at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{loading ? '-' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/services" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">Manage Services</Link>
        <Link to="/dashboard/jobs" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors">View Client Jobs</Link>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">Recent Jobs</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {loading ? (
            <li className="px-5 py-8 text-center text-slate-500">Loading jobs...</li>
          ) : recentJobs.length === 0 ? (
            <li className="px-5 py-8 text-center text-slate-500">No recent jobs.</li>
          ) : recentJobs.map(job => (
            <li key={job.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800 capitalize">{job.service.replace('_', ' ')} — <span className="text-slate-500">{job.client}</span></p>
                <p className="text-xs text-slate-400 mt-0.5">{job.date}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[job.status] || statusColors.pending}`}>{job.status.replace('_', ' ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyOverview;
