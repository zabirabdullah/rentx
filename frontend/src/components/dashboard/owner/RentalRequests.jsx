import React, { useState } from 'react';

const initialRequests = [
  { id: 1, tenant: 'Ahmed Khan', property: 'Modern 3BR Apartment', date: 'Jul 28, 2025', message: 'Interested in a 6-month lease.', status: 'Pending' },
  { id: 2, tenant: 'Li Wei', property: 'Downtown Office', date: 'Jul 27, 2025', message: 'Need the space from Aug 1st.', status: 'Pending' },
  { id: 3, tenant: 'John Smith', property: 'Secure Garage', date: 'Jul 25, 2025', message: 'Long-term rental preferred.', status: 'Approved' },
  { id: 4, tenant: 'Alice Brown', property: 'ATM Corner Space', date: 'Jul 20, 2025', message: 'Bank branch placement request.', status: 'Rejected' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const RentalRequests = () => {
  const [requests, setRequests] = useState(initialRequests);

  const updateStatus = (id, status) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Rental Requests</h2>
        <p className="text-sm text-slate-500 mt-1">Review and respond to incoming rental requests from tenants.</p>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap gap-3">
        {['Pending', 'Approved', 'Rejected'].map(s => {
          const count = requests.filter(r => r.status === s).length;
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${statusColors[s]}`}>
              {s} <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {req.tenant.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{req.tenant}</p>
                  <p className="text-xs text-slate-500 mt-0.5">for <span className="font-medium text-slate-700">{req.property}</span></p>
                  <p className="text-xs text-slate-400 mt-1">{req.date}</p>
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">"{req.message}"</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>{req.status}</span>
                {req.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(req.id, 'Approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">Approve</button>
                    <button onClick={() => updateStatus(req.id, 'Rejected')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">Reject</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">No rental requests yet.</div>}
      </div>
    </div>
  );
};

export default RentalRequests;
