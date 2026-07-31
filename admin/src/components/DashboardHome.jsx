import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    pendingReports: 0,
    companies: 0,
    rentalRequests: 0,
    serviceRequests: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, propsRes, reportsRes, companiesRes] = await Promise.all([
          fetch('http://localhost:5000/api/users', { headers }),
          fetch('http://localhost:5000/api/properties'),
          fetch('http://localhost:5000/api/reports', { headers }),
          fetch('http://localhost:5000/api/companies'),
        ]);

        const [usersData, propsData, reportsData, companiesData] = await Promise.all([
          usersRes.ok ? usersRes.json() : [],
          propsRes.ok ? propsRes.json() : [],
          reportsRes.ok ? reportsRes.json() : [],
          companiesRes.ok ? companiesRes.json() : [],
        ]);

        setStats({
          users: Array.isArray(usersData) ? usersData.length : 0,
          properties: Array.isArray(propsData) ? propsData.length : 0,
          pendingReports: Array.isArray(reportsData) ? reportsData.filter(r => r.status === 'pending').length : 0,
          companies: Array.isArray(companiesData) ? companiesData.length : 0,
        });

        // Show last 5 reports as recent activity
        if (Array.isArray(reportsData)) {
          setRecentReports(reportsData.slice(0, 5));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const metrics = [
    {
      label: 'Total Users',
      value: stats.users.toString(),
      subtitle: 'Registered Accounts',
      color: 'bg-blue-50 text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending Reports',
      value: stats.pendingReports.toString(),
      subtitle: stats.pendingReports === 0 ? 'All Clear' : 'Requires Action',
      color: stats.pendingReports > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'Active Listings',
      value: stats.properties.toString(),
      subtitle: 'Platform Wide',
      color: 'bg-green-50 text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Service Companies',
      value: stats.companies.toString(),
      subtitle: 'Registered Providers',
      color: 'bg-purple-50 text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const reportStatusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    dismissed: 'bg-slate-100 text-slate-600',
    action_taken: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name || 'Admin'}. Here's what's happening on RentX.</p>
      </div>

      {loading ? (
        <div className="text-slate-500 py-8">Loading dashboard metrics...</div>
      ) : (
        <>
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
                  <p className={`text-xs mt-1 font-medium ${stats.pendingReports > 0 && m.label === 'Pending Reports' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {m.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Recent Reports</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest property reports submitted by users</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {recentReports.length === 0 ? (
                <li className="px-6 py-8 text-center text-slate-400 text-sm">No reports submitted yet. The platform is clean!</li>
              ) : (
                recentReports.map((report) => (
                  <li key={report._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${reportStatusColor[report.status] || 'bg-slate-100'}`}>
                      {report.status === 'pending' ? '!' : '✓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {report.reason}
                      </p>
                      <p className="text-xs text-slate-500">
                        Reported by <span className="font-semibold">{report.reportedBy?.name || 'Unknown'}</span>
                        {report.propertyId?.address && ` · Property: ${report.propertyId.address}`}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${reportStatusColor[report.status] || 'bg-slate-100'}`}>
                      {report.status?.replace('_', ' ')}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
