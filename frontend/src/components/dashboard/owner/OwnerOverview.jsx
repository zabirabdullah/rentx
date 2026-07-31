import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const statusColors = { pending: 'text-yellow-700 bg-yellow-50', approved: 'text-green-700 bg-green-50', rejected: 'text-red-700 bg-red-50', cancelled: 'text-slate-700 bg-slate-50' };

const OwnerOverview = () => {
  const { user } = useUser();
  const [stats, setStats] = useState([
    { label: 'Total Properties', value: '0', icon: '🏠', color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Tenants', value: '0', icon: '👤', color: 'bg-green-50 text-green-600' },
    { label: 'Pending Requests', value: '0', icon: '📋', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Monthly Revenue', value: '৳0', icon: '💰', color: 'bg-purple-50 text-purple-600' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user._id) return;
        const token = await auth.currentUser?.getIdToken();
        
        const [propsRes, reqsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/properties?ownerId=${user._id}`),
          fetch('http://localhost:5000/api/rental-requests/my', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (propsRes.ok && reqsRes.ok) {
          const properties = await propsRes.json();
          const requests = await reqsRes.json();

          const approvedRequests = requests.filter(r => r.status === 'approved');
          const pendingRequests = requests.filter(r => r.status === 'pending');
          
          let revenue = 0;
          approvedRequests.forEach(req => {
            if (req.propertyId && req.propertyId.rentPrice) {
              revenue += req.propertyId.rentPrice;
            }
          });

          setStats([
            { label: 'Total Properties', value: properties.length.toString(), icon: '🏠', color: 'bg-blue-50 text-blue-600' },
            { label: 'Active Tenants', value: approvedRequests.length.toString(), icon: '👤', color: 'bg-green-50 text-green-600' },
            { label: 'Pending Requests', value: pendingRequests.length.toString(), icon: '📋', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Monthly Revenue', value: `৳${revenue.toLocaleString()}`, icon: '💰', color: 'bg-purple-50 text-purple-600' },
          ]);

          const activities = requests.slice(0, 5).map(req => ({
            id: req._id,
            text: `${req.tenantId?.name || 'Someone'} requested rental for ${req.propertyId?.address || 'a property'}`,
            time: new Date(req.createdAt).toLocaleDateString(),
            status: req.status
          }));
          setRecentActivity(activities);
        }
      } catch (err) {
        console.error('Failed to fetch owner overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

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
              <p className="text-xl font-bold text-slate-900">{loading ? '-' : s.value}</p>
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
          {loading ? (
             <li className="px-5 py-8 text-center text-slate-500">Loading activity...</li>
          ) : recentActivity.length === 0 ? (
             <li className="px-5 py-8 text-center text-slate-500">No recent activity.</li>
          ) : recentActivity.map(item => (
            <li key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm text-slate-700 font-medium">{item.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
              <span className={`ml-4 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap capitalize ${statusColors[item.status]}`}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnerOverview;
