import { API_BASE_URL } from "../../config/api.js";
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CompaniesPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialService = queryParams.get('service') || 'all';

  const [filter, setFilter] = useState(initialService);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentService = queryParams.get('service');
    if (currentService) {
      setFilter(currentService);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/companies`);
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

  const filteredCompanies = filter === 'all' 
    ? companies 
    : companies.filter(c => c.servicesOffered?.includes(filter));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Service Companies</h1>
            <p className="mt-4 text-lg text-slate-600">Hire trusted professionals for moving, cleaning, and maintenance.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'moving', label: 'Moving' },
              { id: 'cleaning', label: 'Cleaning' },
              { id: 'electrician', label: 'Electrician' },
              { id: 'plumbing', label: 'Plumbing' },
              { id: 'painting', label: 'Painting' }
            ].map(service => (
              <button
                key={service.id}
                onClick={() => setFilter(service.id)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  filter === service.id 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {service.label}
              </button>
            ))}
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium">Loading companies...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredCompanies.map(company => (
                <div key={company._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                    <span className="text-6xl">🏢</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{company.businessName}</h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{company.description || "No description provided."}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.servicesOffered?.map(s => (
                          <span key={s} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
                        <span>Verified Partner</span>
                      </div>
                      <Link to={`/companies/${company._id}`} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCompanies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-slate-500">No companies found for this service type.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompaniesPage;
