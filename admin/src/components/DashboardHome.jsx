import React from 'react';

const metrics = [
  {
    label: 'Total Users',
    value: '1,284',
    change: '+12% this month',
    positive: true,
    color: 'bg-blue-50 text-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Pending Approvals',
    value: '47',
    change: '8 added today',
    positive: false,
    color: 'bg-yellow-50 text-yellow-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Active Listings',
    value: '3,518',
    change: '+5% this week',
    positive: true,
    color: 'bg-green-50 text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: 'Service Requests',
    value: '892',
    change: '+23 this week',
    positive: true,
    color: 'bg-purple-50 text-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const recentActivity = [
  { id: 1, action: 'New owner registered', user: 'Sarah Johnson', time: '2 min ago', type: 'user' },
  { id: 2, action: 'Property listing submitted for review', user: 'Ahmed Khan', time: '14 min ago', type: 'property' },
  { id: 3, action: 'Service request completed', user: 'CleanPro Co.', time: '32 min ago', type: 'service' },
  { id: 4, action: 'User account banned', user: 'spammer123', time: '1 hr ago', type: 'ban' },
  { id: 5, action: 'New ATM Booth listing approved', user: 'Admin', time: '2 hr ago', type: 'property' },
  { id: 6, action: 'Painting service suspended', user: 'Admin', time: '3 hr ago', type: 'service' },
  { id: 7, action: 'New tenant registered', user: 'Li Wei', time: '5 hr ago', type: 'user' },
];

const activityColors = {
  user: 'bg-blue-100 text-blue-600',
  property: 'bg-green-100 text-green-600',
  service: 'bg-purple-100 text-purple-600',
  ban: 'bg-red-100 text-red-600',
};

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, Admin. Here's what's happening on RentX.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm">
            <div className={`p-3 rounded-lg flex-shrink-0 ${m.color}`}>
              {m.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{m.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{m.value}</p>
              <p className={`text-xs mt-1 font-medium ${m.positive ? 'text-green-600' : 'text-yellow-600'}`}>
                {m.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
          <p className="text-xs text-slate-500 mt-0.5">Latest actions across the platform</p>
        </div>
        <ul className="divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <li key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${activityColors[item.type]}`}>
                {item.user.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{item.action}</p>
                <p className="text-xs text-slate-500">by <span className="font-semibold">{item.user}</span></p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
