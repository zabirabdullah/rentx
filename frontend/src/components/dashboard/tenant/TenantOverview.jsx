import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Rentals', value: '2', icon: '🔑', color: 'bg-sky-50 text-sky-600' },
  { label: 'Pending Requests', value: '1', icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Service Bookings', value: '3', icon: '🛠️', color: 'bg-purple-50 text-purple-600' },
  { label: 'Total Spent', value: '$3,600', icon: '💳', color: 'bg-green-50 text-green-600' },
];

const recentActivity = [
  { id: 1, text: 'Rental approved for Modern 3BR Apartment', time: '1 hr ago', type: 'approved' },
  { id: 2, text: 'Cleaning service booked for Aug 2nd', time: '3 hr ago', type: 'service' },
  { id: 3, text: 'Moving request sent to MoveIt LLC', time: '2 days ago', type: 'service' },
];

const typeColors = { approved: 'bg-green-100 text-green-700', service: 'bg-purple-100 text-purple-700' };

const TenantOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Your rentals and service bookings at a glance.</p>
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

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/rentals" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">View My Rentals</Link>
        <Link to="/dashboard/bookings" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors">Service Bookings</Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {recentActivity.map(item => (
            <li key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm text-slate-700 font-medium">{item.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
              <span className={`ml-4 px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[item.type]}`}>
                {item.type === 'approved' ? 'Approved' : 'Service'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TenantOverview;
