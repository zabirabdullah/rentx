import React, { useState } from 'react';

const initialBookings = [
  { id: 1, company: 'CleanPro Co.', service: 'Cleaning', scheduledDate: 'Aug 2, 2025', rate: '$50/hr', status: 'Confirmed' },
  { id: 2, company: 'MoveIt LLC', service: 'Moving', scheduledDate: 'Aug 10, 2025', rate: '$120/hr', status: 'Pending' },
  { id: 3, company: 'PipeFix Solutions', service: 'Plumbing', scheduledDate: 'Jul 30, 2025', rate: '$80/hr', status: 'Completed' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const serviceEmoji = { Cleaning: '🧹', Moving: '📦', Plumbing: '🔧', Electrician: '⚡', Painting: '🎨' };

const MyServiceBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);

  const cancel = (id) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Service Bookings</h2>
        <p className="text-sm text-slate-500 mt-1">Track all your service requests and their status.</p>
      </div>

      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                {serviceEmoji[b.service] || '🛠️'}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{b.service} — <span className="text-slate-600">{b.company}</span></p>
                <p className="text-xs text-slate-400 mt-0.5">Scheduled: {b.scheduledDate} · Rate: {b.rate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>{b.status}</span>
              {(b.status === 'Pending' || b.status === 'Confirmed') && (
                <button onClick={() => cancel(b.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Cancel</button>
              )}
            </div>
          </div>
        ))}
        {bookings.length === 0 && <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">No service bookings yet.</div>}
      </div>
    </div>
  );
};

export default MyServiceBookings;
