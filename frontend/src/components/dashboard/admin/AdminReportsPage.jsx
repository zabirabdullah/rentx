import { API_BASE_URL } from "../../../config/api.js";
import React, { useState, useEffect } from 'react';
import { auth } from '../../../config/firebase';
import { Link } from 'react-router-dom';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id, status, adminNote = 'Reviewed by admin') => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status, adminNote })
      });
      
      if (response.ok) {
        const updatedReport = await response.json();
        setReports(prev => prev.map(r => r._id === id ? updatedReport : r));
      } else {
        alert('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Review Reports</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Reported Property</th>
                <th className="px-6 py-4 font-semibold text-sm">Reported By</th>
                <th className="px-6 py-4 font-semibold text-sm">Reason</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading reports...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No reports found.</td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {report.propertyId ? (
                        <Link to={`/properties/${report.propertyId._id || report.propertyId}`} className="text-green-600 hover:underline font-medium text-sm">
                          View Property ↗
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400">Deleted Property</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {report.reportedBy?.name || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800 max-w-xs">
                      {report.reason}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full
                        ${report.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                          report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {report.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(report._id, 'resolved', 'Property flagged and owner notified')}
                            className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm font-semibold transition-colors"
                          >
                            Resolve
                          </button>
                          <button 
                            onClick={() => handleAction(report._id, 'dismissed', 'Invalid report')}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-sm font-semibold transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
