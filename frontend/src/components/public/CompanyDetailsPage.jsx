import { API_BASE_URL } from "../../config/api.js";
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/companies/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading company details...</div>;
  if (!company) return <div className="text-center py-20 text-red-500">Company not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link to="/companies" className="text-green-600 hover:underline">Companies</Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-slate-600">{company.businessName}</span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="h-[300px] w-full relative bg-slate-800 flex items-center justify-center">
              <span className="text-8xl opacity-20 mix-blend-overlay">🏢</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 md:p-12">
                <div className="text-white">
                  <h1 className="text-4xl font-extrabold mb-3">{company.businessName}</h1>
                  <div className="flex flex-wrap gap-3">
                    {company.servicesOffered?.map(s => (
                      <span key={s} className="bg-green-500/20 backdrop-blur-md text-green-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About Us</h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  {company.description || "No description provided."}
                </p>

                <h2 className="text-xl font-bold text-slate-900 mb-4">Base Rates</h2>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  {company.baseRates && Object.keys(company.baseRates).length > 0 ? (
                    Object.entries(company.baseRates).map(([service, rate], index) => (
                      <div key={index} className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0 capitalize">
                        <span className="font-semibold text-slate-700">{service.replace('_', ' ')}</span>
                        <span className="font-bold text-green-600">
                          {rate !== '' && rate !== null && rate !== undefined && Number(rate) > 0 
                            ? `৳${rate}` 
                            : 'Custom Quote / On Request'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-slate-500">No rates specified. Contact for quote.</div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-80">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="text-center flex-1 border-r border-slate-100">
                      <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                        <span className="text-yellow-400">★</span> 5.0
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Rating</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-black text-slate-900 text-green-600">✓</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Verified</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => user ? navigate(`/request-service/${company._id}`) : navigate('/login')}
                    className="block text-center w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    Request Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyDetailsPage;
