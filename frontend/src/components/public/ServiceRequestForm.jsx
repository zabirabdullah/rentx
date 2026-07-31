import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ServiceRequestForm = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const [serviceType, setServiceType] = useState('moving');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/bookings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900">Request Service</h1>
            <p className="mt-2 text-slate-600">Fill out the details below to get a quote.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <span className={`font-semibold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>1. Service Details</span>
              <span className="text-slate-600">→</span>
              <span className={`font-semibold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>2. Date & Time</span>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Type</label>
                    <select 
                      value={serviceType} 
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="moving">Moving</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="plumbing">Plumbing / Electrician</option>
                    </select>
                  </div>

                  {serviceType === 'moving' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">From Address</label>
                          <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Pickup location" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">To Address</label>
                          <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Drop-off location" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                          Elevator Available
                        </label>
                      </div>
                    </>
                  )}

                  {serviceType === 'cleaning' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Number of Rooms</label>
                        <input type="number" min="1" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Area (sq ft)</label>
                        <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Special Notes</label>
                    <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Any specific requirements..."></textarea>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date</label>
                    <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Time</label>
                    <input type="time" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {step === 2 ? (
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Back
                  </button>
                ) : <div></div>}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}`}
                >
                  {isSubmitting ? 'Submitting...' : step === 1 ? 'Next Step' : 'Request Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceRequestForm;
