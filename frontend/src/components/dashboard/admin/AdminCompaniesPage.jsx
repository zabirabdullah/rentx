import React, { useState, useEffect } from 'react';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/companies');
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Registered Companies</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Company Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Service Types</th>
                <th className="px-6 py-4 font-semibold text-sm">Base Rate</th>
                <th className="px-6 py-4 font-semibold text-sm">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading companies...</td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No companies found.</td>
                </tr>
              ) : (
                companies.map(company => (
                  <tr key={company._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{company.companyName}</div>
                      <div className="text-xs text-slate-500 max-w-xs truncate">{company.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {company.serviceTypes.map(service => (
                          <span key={service} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs capitalize">
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {company.baseRate ? `৳${company.baseRate.toLocaleString()}` : 'Variable'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{company.contactPhone}</div>
                      <div className="text-xs text-slate-400">{company.operatingCities.join(', ')}</div>
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

export default AdminCompaniesPage;
