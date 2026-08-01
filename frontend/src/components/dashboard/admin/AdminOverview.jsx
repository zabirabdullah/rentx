import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { auth } from '../../../config/firebase';

const AdminOverview = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        
        // Fetch users, properties, and reports in parallel
        const [usersRes, propsRes, reportsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/properties`),
          fetch(`${API_BASE_URL}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [usersData, propsData, reportsData] = await Promise.all([
          usersRes.ok ? usersRes.json() : [],
          propsRes.ok ? propsRes.json() : [],
          reportsRes.ok ? reportsRes.json() : [],
        ]);

        setStats({
          users: Array.isArray(usersData) ? usersData.length : 0,
          properties: Array.isArray(propsData) ? propsData.length : 0,
          reports: Array.isArray(reportsData) ? reportsData.length : 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome to the Admin Portal</h2>
        <p className="text-purple-100">Monitor platform health and manage system resources securely.</p>
      </div>

      <h3 className="text-lg font-bold text-slate-800">Platform Overview</h3>
      
      {loading ? (
        <div className="text-slate-500">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={stats.users} icon="👥" color="bg-blue-500" />
          <StatCard title="Active Properties" value={stats.properties} icon="🏢" color="bg-green-500" />
          <StatCard title="Pending Reports" value={stats.reports} icon="⚠️" color="bg-orange-500" />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-2xl text-white shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-800">{value}</h3>
    </div>
  </div>
);

export default AdminOverview;
