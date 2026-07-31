import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  dismissed: 'bg-slate-100 text-slate-700',
  action_taken: 'bg-red-100 text-red-700',
};

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReport, setModalReport] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setProcessing(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNote })
      });

      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => (r._id === id ? { ...r, status: updated.status, adminNote: updated.adminNote } : r)));
        if (modalReport?._id === id) {
          setModalReport({ ...modalReport, status: updated.status, adminNote: updated.adminNote });
        }
        if (status === 'action_taken' || status === 'dismissed') {
            setModalReport(null); // Close on final action
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update report');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating report');
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (report) => {
    setModalReport(report);
    setAdminNote(report.adminNote || '');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Property Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Review user reports and take necessary moderation actions.</p>
      </div>

      <div className="flex gap-3">
        {Object.keys(statusStyles).map(status => {
          const count = reports.filter(r => r.status === status).length;
          return (
            <div key={status} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 capitalize ${statusStyles[status]}`}>
              <span>{status.replace('_', ' ')}</span>
              <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Reported By</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">Loading reports...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No reports found.</td></tr>
              ) : (
                reports.map(report => (
                  <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{report.reportedBy?.name || 'Unknown User'}</td>
                    <td className="px-5 py-3.5 text-slate-600 truncate max-w-[200px]">{report.propertyId?.address || 'Unknown Property'}</td>
                    <td className="px-5 py-3.5 text-slate-600 truncate max-w-[200px]">{report.reason}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[report.status] || 'bg-slate-100'}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => openModal(report)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Review Report</h2>
              <button onClick={() => setModalReport(null)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Reported By:</span>
                  <span className="font-semibold">{modalReport.reportedBy?.name} ({modalReport.reportedBy?.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Property Address:</span>
                  <span className="font-semibold text-right max-w-[60%]">{modalReport.propertyId?.address || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Report Date:</span>
                  <span className="font-semibold">{new Date(modalReport.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${statusStyles[modalReport.status]}`}>
                    {modalReport.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 mb-1">Report Reason:</p>
                <p className="text-slate-600 bg-white border border-slate-200 rounded-lg p-3">{modalReport.reason}</p>
              </div>

              {/* Property Image Context if available */}
              {modalReport.propertyId?.images && modalReport.propertyId.images.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Property Image (Context):</p>
                  <img src={modalReport.propertyId.images[0]} alt="Property" className="h-32 rounded-lg object-cover w-full border border-slate-200" />
                </div>
              )}

              <div className="mt-4 border-t border-slate-200 pt-4">
                <label className="block font-semibold text-slate-700 mb-2">Admin Internal Note:</label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a note about this report..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {modalReport.status === 'pending' && (
                <button
                  onClick={() => handleUpdateStatus(modalReport._id, 'reviewed')}
                  disabled={processing}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Mark as Reviewed
                </button>
              )}
              {modalReport.status !== 'dismissed' && (
                <button
                  onClick={() => handleUpdateStatus(modalReport._id, 'dismissed')}
                  disabled={processing}
                  className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Dismiss Report
                </button>
              )}
              {modalReport.status !== 'action_taken' && (
                <button
                  onClick={() => handleUpdateStatus(modalReport._id, 'action_taken')}
                  disabled={processing}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Action Taken (Ban/Delete)
                </button>
              )}
            </div>
            
            {(modalReport.status === 'reviewed' || modalReport.status === 'action_taken' || modalReport.status === 'dismissed') && (
              <div className="mt-2 text-center">
                 <button onClick={() => setModalReport(null)} className="text-slate-500 text-sm underline hover:text-slate-700">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
