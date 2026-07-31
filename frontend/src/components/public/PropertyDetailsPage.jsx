import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { auth } from '../../config/firebase';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [tenantNote, setTenantNote] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);
  const handleRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('http://localhost:5000/api/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId: property._id, tenantNote, message: tenantNote })
      });
      
      if (res.ok) {
        setRequestSent(true);
        setTenantNote('');
      } else {
        const errorData = await res.json();
        alert(`Failed to send request: ${errorData.message || 'Server Error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending the request.');
    }
  };

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reportReason.trim()) {
      alert('Please provide a reason for reporting.');
      return;
    }
    setReportSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          reason: reportReason.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Report submitted successfully to administration.');
        setShowReportModal(false);
        setReportReason('');
      } else {
        alert(data.message || 'Failed to submit report.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting the report.');
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 pt-32 text-center text-slate-500 font-medium">Loading property details...</div>;
  if (error || !property) return <div className="min-h-screen bg-slate-50 pt-32 text-center text-red-500 font-medium">Error: {error || 'Property not found'}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link to="/properties" className="text-green-600 hover:underline">Properties</Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-slate-600 capitalize">{property.category?.replace('_', ' ')}</span>
          </div>

          <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-slate-200">
            {/* Header Image (Use first image) */}
            <div className="h-[400px] w-full relative bg-slate-100 flex items-center justify-center">
              {property.images && property.images[0] && !property.images[0].includes('placeholder.com') ? (
                <img src={property.images[0]} alt={property.address} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 font-medium text-lg flex flex-col items-center gap-2">
                  <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  No images added
                </div>
              )}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-slate-800 shadow-sm capitalize">
                {property.category?.replace('_', ' ')}
              </div>
            </div>

            {/* If there are multiple images, display a small gallery thumbnail row */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50 border-b border-slate-200">
                {property.images.slice(1).map((img, idx) => (
                  <img key={idx} src={img} alt={`Gallery ${idx}`} className="h-20 w-32 object-cover rounded-lg border border-slate-200 shadow-sm shrink-0" />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{property.name || property.address}</h1>
                    <p className="text-slate-500 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {property.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-green-600 mb-1">৳{property.rentPrice?.toLocaleString()}/mo</div>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-md ${property.isAvailable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {property.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8 py-6 border-y border-slate-100">
                  <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Area</p>
                    <p className="font-bold text-slate-800">{property.area} sqft</p>
                  </div>
                  {property.category === 'house' && (
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Layout</p>
                      <p className="font-bold text-slate-800">{property.bedroom} Beds • {property.bathroom} Baths</p>
                    </div>
                  )}
                  {property.storey !== undefined && (
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Floor</p>
                      <p className="font-bold text-slate-800">{property.storey}</p>
                    </div>
                  )}
                  <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Elevator</p>
                    <p className="font-bold text-slate-800">{property.elevator ? 'Yes' : 'No'}</p>
                  </div>
                  {property.availableFrom && (
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Available From</p>
                      <p className="font-bold text-slate-800">{new Date(property.availableFrom).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-8">
                    {property.description || property.specs || "No description provided for this property."}
                  </p>
                  
                  {property.ownerId?.phone && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 inline-flex items-center gap-3">
                      <div className="bg-green-200 p-2 rounded-full text-green-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 font-bold uppercase tracking-wide">Owner Contact</p>
                        <p className="text-lg font-extrabold text-green-900">{property.ownerId.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full md:w-80">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">Interested in this property?</h3>
                  {!requestSent && property.isAvailable && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Message to Owner (Optional)</label>
                      <textarea 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 resize-none" 
                        rows="3" 
                        placeholder="Hi, I am interested in renting..."
                        value={tenantNote}
                        onChange={e => setTenantNote(e.target.value)}
                      ></textarea>
                    </div>
                  )}
                  <button 
                    onClick={handleRequest}
                    disabled={!property.isAvailable || requestSent}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all shadow-md mb-4 ${
                      requestSent ? 'bg-green-500' : property.isAvailable ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {requestSent ? 'Request Sent! ✓' : 'Request to Rent'}
                  </button>
                  <button 
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }
                      setShowReportModal(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Report Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Report Property
                </h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Please specify why you are reporting this listing. Administrations will review your submission.</p>
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <textarea
                    required
                    rows="4"
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    placeholder="Provide details (e.g. misleading information, fraudulent listing, inappropriate content)..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  ></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
