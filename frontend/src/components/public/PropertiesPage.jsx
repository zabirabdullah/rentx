import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All Categories';
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const currentCategory = queryParams.get('category');
    if (currentCategory) {
      setCategory(currentCategory);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => {
    const titleOrAddress = (p.name || '') + ' ' + (p.address || '');
    const matchesSearch = titleOrAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map UI categories to database categories
    const catMap = {
      'House': 'house', 'Office': 'office', 'Commercial': 'commercial_space',
      'Godown': 'godown', 'Garage': 'garage', 'ATM Booth': 'atm_booth'
    };
    const targetCategory = catMap[category] || category;
    
    const matchesCategory = category === 'All Categories' || p.category === targetCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Browse Properties</h1>
            <p className="mt-4 text-lg text-slate-600">Find the perfect space for your needs.</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 mx-auto max-w-4xl flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Search</label>
              <input 
                type="text" 
                placeholder="Search by title or address..." 
                className="w-full focus:outline-none text-slate-800 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Category</label>
              <select 
                className="w-full focus:outline-none text-slate-800 bg-transparent cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>House</option>
                <option>Office</option>
                <option>Commercial</option>
                <option>Godown</option>
                <option>Garage</option>
                <option>ATM Booth</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg">
              Filter
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium">Loading properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <Link to={`/properties/${property._id}`} key={property._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden bg-slate-100 flex justify-center items-center">
                    {property.images && property.images[0] && !property.images[0].includes('placeholder.com') ? (
                      <img src={property.images[0]} alt={property.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="text-slate-400 font-medium text-sm flex flex-col items-center gap-1">
                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        No image
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm capitalize">
                      {property.category?.replace('_', ' ')}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-green-600 px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-md">
                      ৳{property.rentPrice?.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors truncate">{property.name || property.address}</h3>
                    <p className="text-slate-500 flex items-center gap-2 mb-4 text-sm truncate">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {property.address}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="text-sm font-semibold text-slate-600">{property.area} sqft</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${property.isAvailable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {property.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-slate-500">No properties found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertiesPage;
