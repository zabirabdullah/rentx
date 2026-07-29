import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Jobs', value: '5', icon: '💼', color: 'bg-blue-50 text-blue-600' },
  { label: 'Completed Jobs', value: '42', icon: '✅', color: 'bg-green-50 text-green-600' },
  { label: 'Pending Requests', value: '3', icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Total Revenue', value: '$8,250', icon: '💰', color: 'bg-purple-50 text-purple-600' },
];

const recentJobs = [
  { id: 1, client: 'Ahmed Khan', service: 'Cleaning', date: 'Aug 2, 2025', status: 'Confirmed' },
  { id: 2, client: 'Sarah Johnson', service: 'Moving', date: 'Aug 10, 2025', status: 'Pending' },
  { id: 3, client: 'Li Wei', service: 'Cleaning', date: 'Jul 29, 2025', status: 'Completed' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

const CompanyOverview = () => {
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
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
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
          {recentJobs.map(job => (
            <li key={job.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">{job.service} — <span className="text-slate-500">{job.client}</span></p>
                <p className="text-xs text-slate-400 mt-0.5">{job.date}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[job.status]}`}>{job.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyOverview;
