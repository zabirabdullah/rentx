import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const mockCompanies = [
  { id: 1, name: 'CleanPro Services', services: ['cleaning'], rating: '4.8', jobsCompleted: 142, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80', description: 'Professional deep cleaning and sanitization services.', rates: { 'Basic Cleaning': '$50/hr', 'Deep Cleaning': '$80/hr' } },
  { id: 2, name: 'Swift Movers', services: ['moving'], rating: '4.9', jobsCompleted: 315, image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1200&q=80', description: 'Reliable moving and packing for residential and commercial spaces.', rates: { 'Local Move': '$100/hr', 'Interstate Move': 'Custom Quote' } },
  // fallback for other ids
];

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const company = mockCompanies.find(c => c.id === parseInt(id)) || {
    ...mockCompanies[0],
    id: parseInt(id),
    name: 'Generic Company',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link to="/companies" className="text-green-600 hover:underline">Companies</Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-slate-600">{company.name}</span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="h-[300px] w-full relative bg-slate-800">
              <img src={company.image} alt={company.name} className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 md:p-12">
                <div className="text-white">
                  <h1 className="text-4xl font-extrabold mb-3">{company.name}</h1>
                  <div className="flex flex-wrap gap-3">
                    {company.services.map(s => (
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
                  {company.description} With years of experience and a commitment to excellence, we ensure the highest quality of service for every job we undertake.
                </p>

                <h2 className="text-xl font-bold text-slate-900 mb-4">Base Rates</h2>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  {Object.entries(company.rates || {}).map(([service, rate], index) => (
                    <div key={index} className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0">
                      <span className="font-semibold text-slate-700">{service}</span>
                      <span className="font-bold text-green-600">{rate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="text-center flex-1 border-r border-slate-100">
                      <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                        <span className="text-yellow-400">★</span> {company.rating}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Rating</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-black text-slate-900">{company.jobsCompleted}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Jobs</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => user ? navigate(`/request-service/${company.id}`) : navigate('/login')}
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
