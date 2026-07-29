import React, { useState } from 'react';

const initialRentals = [
  { id: 1, property: 'Modern 3BR Apartment', category: 'House', owner: 'Sarah Johnson', price: '$1,200/mo', requestedOn: 'Jul 20, 2025', status: 'Approved' },
  { id: 2, property: 'Downtown Office', category: 'Office', owner: 'John Smith', price: '$3,500/mo', requestedOn: 'Jul 28, 2025', status: 'Pending' },
  { id: 3, property: 'City Godown Unit A', category: 'Godown', owner: 'Alice Brown', price: '$800/mo', requestedOn: 'Jul 15, 2025', status: 'Rejected' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const MyRentals = () => {
  const [rentals] = useState(initialRentals);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Rentals</h2>
        <p className="text-sm text-slate-500 mt-1">All properties you have requested to rent.</p>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-3">
        {['Approved', 'Pending', 'Rejected'].map(s => {
          const count = rentals.filter(r => r.status === s).length;
          return (
            <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${statusColors[s]}`}>
              {s} <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Property', 'Category', 'Owner', 'Price', 'Requested On', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{r.property}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.category}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.owner}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{r.price}</td>
                  <td className="px-5 py-3.5 text-slate-400">{r.requestedOn}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;
