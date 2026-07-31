import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const mockProperties = [
  { id: 1, type: 'House', price: '$1,200/mo', title: 'Modern Family House', address: '123 Green St', specs: '3 Beds, 2 Baths • 1,500 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80' },
  { id: 2, type: 'Office', price: '$2,500/mo', title: 'Downtown Office Space', address: '45 Business Ave', specs: '5 Rooms • 2,000 sq ft', status: 'Rent Pending', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  { id: 3, type: 'Commercial', price: '$4,000/mo', title: 'Retail Shop', address: '78 High St', specs: 'Open Plan • 3,000 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1582005450386-52ccf6f0d141?auto=format&fit=crop&w=600&q=80' },
  { id: 4, type: 'Godown', price: '$1,800/mo', title: 'Secure Warehouse', address: '99 Industrial Blvd', specs: 'High Ceiling • 5,000 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=600&q=80' },
  { id: 5, type: 'Garage', price: '$200/mo', title: 'Covered Parking', address: '12 Park Ln', specs: '1 Space • 200 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80' },
  { id: 6, type: 'ATM Booth', price: '$450/mo', title: 'Prime Corner Booth', address: 'Corner of 1st & Main', specs: 'Secure • 50 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1563944648773-455b9deeb7a7?auto=format&fit=crop&w=600&q=80' }
];

const PropertiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');

  const filteredProperties = mockProperties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All Categories' || p.type.toLowerCase() === category.toLowerCase();
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

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <Link to={`/properties/${property.id}`} key={property.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {property.type}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-green-600 px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-md">
                    {property.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">{property.title}</h3>
                  <p className="text-slate-500 flex items-center gap-2 mb-4 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {property.address}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-600">{property.specs}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
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
