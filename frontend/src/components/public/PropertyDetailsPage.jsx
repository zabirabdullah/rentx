import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const mockProperties = [
  { id: 1, type: 'House', price: '$1,200/mo', title: 'Modern Family House', address: '123 Green St', specs: '3 Beds, 2 Baths • 1,500 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', description: 'A beautiful modern family house featuring a spacious open-plan living area, a fully equipped kitchen with stainless steel appliances, and a large backyard perfect for entertaining. Located in a quiet, family-friendly neighborhood near top-rated schools.' },
  { id: 2, type: 'Office', price: '$2,500/mo', title: 'Downtown Office Space', address: '45 Business Ave', specs: '5 Rooms • 2,000 sq ft', status: 'Rent Pending', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', description: 'Premium downtown office space with floor-to-ceiling windows offering panoramic city views. Includes a reception area, a conference room, and open workspaces. Easy access to public transportation and numerous dining options.' },
  // fallback for other ids
];

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === parseInt(id)) || { 
    ...mockProperties[0], 
    id: parseInt(id), 
    title: 'Commercial Property', 
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1582005450386-52ccf6f0d141?auto=format&fit=crop&w=1200&q=80'
  };
  const [requestSent, setRequestSent] = useState(false);

  const handleRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link to="/properties" className="text-green-600 hover:underline">Properties</Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-slate-600">{property.type}</span>
          </div>

          <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-slate-200">
            {/* Header Image */}
            <div className="h-[400px] w-full relative">
              <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-slate-800 shadow-sm">
                {property.type}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{property.title}</h1>
                    <p className="text-slate-500 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {property.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-green-600 mb-1">{property.price}</div>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-md ${property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {property.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8 py-6 border-y border-slate-100">
                  <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Key Specs</p>
                    <p className="font-bold text-slate-800">{property.specs}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
                  <p className="text-slate-600 leading-relaxed">
                    {property.description || "This is a wonderful property offering great amenities and an excellent location. Perfect for anyone looking for convenience and comfort in a vibrant community."}
                  </p>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full md:w-80">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">Interested in this property?</h3>
                  <button 
                    onClick={handleRequest}
                    disabled={property.status !== 'Available' || requestSent}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all shadow-md mb-4 ${
                      requestSent ? 'bg-green-500' : property.status === 'Available' ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {requestSent ? 'Request Sent! ✓' : 'Request to Rent'}
                  </button>
                  <button className="w-full py-3 px-4 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Report Property
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

export default PropertyDetailsPage;
