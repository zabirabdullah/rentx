import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const mockCompanies = [
  { id: 1, name: 'CleanPro Services', services: ['cleaning'], rating: '4.8', jobsCompleted: 142, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', description: 'Professional deep cleaning and sanitization services.' },
  { id: 2, name: 'Swift Movers', services: ['moving'], rating: '4.9', jobsCompleted: 315, image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=600&q=80', description: 'Reliable moving and packing for residential and commercial spaces.' },
  { id: 3, name: 'FixIt Plumbers', services: ['plumbing'], rating: '4.6', jobsCompleted: 89, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80', description: '24/7 emergency plumbing repairs and installations.' },
  { id: 4, name: 'All-Round Maintenance', services: ['electrician', 'painting', 'plumbing'], rating: '4.7', jobsCompleted: 210, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80', description: 'Your one-stop shop for all maintenance needs.' },
];

const CompaniesPage = () => {
  const [filter, setFilter] = useState('all');

  const filteredCompanies = filter === 'all' 
    ? mockCompanies 
    : mockCompanies.filter(c => c.services.includes(filter));

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredCompanies.map(company => (
              <div key={company.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-shadow duration-300">
                <div className="w-full sm:w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden">
                  <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{company.name}</h3>
                    <p className="text-slate-600 text-sm mb-4">{company.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.services.map(s => (
                        <span key={s} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span> {company.rating}
                      </span>
                      <span>{company.jobsCompleted} jobs</span>
                    </div>
                    <Link to={`/companies/${company.id}`} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
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
