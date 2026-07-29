import React, { useState } from 'react';

const initialJobs = [
  { id: 1, client: 'Ahmed Khan', clientType: 'Tenant', service: 'Cleaning', date: 'Aug 2, 2025', location: '12 Park Ave, NY', note: 'Full apartment — 3 rooms.', status: 'Pending' },
  { id: 2, client: 'Sarah Johnson', clientType: 'Owner', service: 'Moving', date: 'Aug 10, 2025', location: '50 Broadway, NY', note: 'Moving between floors in the same building.', status: 'Pending' },
  { id: 3, client: 'Li Wei', clientType: 'Tenant', service: 'Cleaning', date: 'Jul 29, 2025', location: '8 Oak Street, NY', note: 'Post-move deep clean.', status: 'Completed' },
  { id: 4, client: 'John Smith', clientType: 'Owner', service: 'Plumbing', date: 'Jul 25, 2025', location: '22 Elm St, NY', note: 'Leaking pipe in bathroom.', status: 'Declined' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Declined: 'bg-red-100 text-red-700',
};

const clientTypeColors = { Tenant: 'bg-sky-100 text-sky-700', Owner: 'bg-blue-100 text-blue-700' };
const serviceEmoji = { Cleaning: '🧹', Moving: '📦', Plumbing: '🔧', Electrician: '⚡', Painting: '🎨' };

const ClientJobs = () => {
  const [jobs, setJobs] = useState(initialJobs);

  const updateStatus = (id, status) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client Jobs</h2>
        <p className="text-sm text-slate-500 mt-1">View and respond to incoming service requests from clients.</p>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-3">
        {['Pending', 'Accepted', 'Completed', 'Declined'].map(s => {
          const count = jobs.filter(j => j.status === s).length;
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${statusColors[s]}`}>
              {s} <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {serviceEmoji[job.service] || '🛠️'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">{job.service} Request</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${clientTypeColors[job.clientType]}`}>{job.clientType}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">From <span className="font-medium text-slate-700">{job.client}</span> · {job.date}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {job.location}</p>
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">"{job.note}"</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[job.status]}`}>{job.status}</span>
                {job.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(job.id, 'Accepted')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">Accept</button>
                    <button onClick={() => updateStatus(job.id, 'Declined')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">Decline</button>
                  </div>
                )}
                {job.status === 'Accepted' && (
                  <button onClick={() => updateStatus(job.id, 'Completed')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">Mark Done</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientJobs;
