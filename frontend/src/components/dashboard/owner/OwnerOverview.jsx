import React from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const stats = [
  { label: 'Total Properties', value: '12', icon: '🏠', color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Tenants', value: '8', icon: '👤', color: 'bg-green-50 text-green-600' },
  { label: 'Pending Requests', value: '3', icon: '📋', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Monthly Revenue', value: '$9,600', icon: '💰', color: 'bg-purple-50 text-purple-600' },
];

const recentActivity = [
  { id: 1, text: 'Ahmed Khan requested rental for Modern Apartment', time: '5 min ago', status: 'Pending' },
  { id: 2, text: 'Office Space on 5th Ave — lease renewed', time: '2 hr ago', status: 'Approved' },
  { id: 3, text: 'New inquiry on Downtown Garage listing', time: '1 day ago', status: 'Pending' },
];

const statusColors = { Pending: 'text-yellow-700 bg-yellow-50', Approved: 'text-green-700 bg-green-50' };

const OwnerOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Here's a snapshot of your properties and activity.</p>
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
        <Link to="/dashboard/properties" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">+ Add Property</Link>
        <Link to="/dashboard/requests" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors">View Requests</Link>
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
              <span className={`ml-4 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[item.status]}`}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnerOverview;
