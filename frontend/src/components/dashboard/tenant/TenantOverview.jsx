import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const typeColors = { approved: 'bg-green-100 text-green-700', service: 'bg-purple-100 text-purple-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

const TenantOverview = () => {
  const { user } = useUser();
  const [stats, setStats] = useState([
    { label: 'Active Rentals', value: '0', icon: '🔑', color: 'bg-sky-50 text-sky-600' },
    { label: 'Pending Requests', value: '0', icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Service Bookings', value: '0', icon: '🛠️', color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Spent', value: '৳0', icon: '💳', color: 'bg-green-50 text-green-600' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const token = await auth.currentUser?.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [rentalsRes, servicesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/rental-requests/my`, { headers }),
          fetch(`${API_BASE_URL}/api/service-requests/my`, { headers })
        ]);

        if (rentalsRes.ok && servicesRes.ok) {
          const rentals = await rentalsRes.json();
          const services = await servicesRes.json();

          const activeRentals = rentals.filter(r => r.status === 'approved');
          const pendingRentals = rentals.filter(r => r.status === 'pending');
          
          let totalSpent = 0;
          activeRentals.forEach(r => {
            if (r.propertyId && r.propertyId.rentPrice) totalSpent += r.propertyId.rentPrice;
          });
          services.forEach(s => {
            if (s.status === 'completed' && s.estimatedCost) totalSpent += s.estimatedCost;
          });

          setStats([
            { label: 'Active Rentals', value: activeRentals.length.toString(), icon: '🔑', color: 'bg-sky-50 text-sky-600' },
            { label: 'Pending Requests', value: pendingRentals.length.toString(), icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Service Bookings', value: services.length.toString(), icon: '🛠️', color: 'bg-purple-50 text-purple-600' },
            { label: 'Monthly Est. Spent', value: `৳${totalSpent.toLocaleString()}`, icon: '💳', color: 'bg-green-50 text-green-600' },
          ]);

          // Combine and sort activities
          const combined = [
            ...rentals.map(r => ({
              id: `r-${r._id}`,
              text: `Rental ${r.status} for ${r.propertyId?.address || 'property'}`,
              time: new Date(r.updatedAt || r.createdAt),
              type: r.status
            })),
            ...services.map(s => ({
              id: `s-${s._id}`,
              text: `${s.serviceType} service ${s.status} with ${s.companyId?.businessName || 'company'}`,
              time: new Date(s.updatedAt || s.createdAt),
              type: 'service'
            }))
          ];
          
          combined.sort((a, b) => b.time - a.time);
          setRecentActivity(combined.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch tenant overview', err);
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
        <p className="text-sm text-slate-500 mt-1">Your rentals and service bookings at a glance.</p>
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
          {loading ? (
            <li className="px-5 py-8 text-center text-slate-500">Loading activity...</li>
          ) : recentActivity.length === 0 ? (
            <li className="px-5 py-8 text-center text-slate-500">No recent activity.</li>
          ) : recentActivity.map(item => (
            <li key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm text-slate-700 font-medium capitalize">{item.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time.toLocaleDateString()}</p>
              </div>
              <span className={`ml-4 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${typeColors[item.type] || typeColors.pending}`}>
                {item.type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TenantOverview;
