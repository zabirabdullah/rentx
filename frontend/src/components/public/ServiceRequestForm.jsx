import { API_BASE_URL } from "../../config/api.js";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { auth } from '../../config/firebase';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ServiceRequestForm = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [serviceType, setServiceType] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [specialNote, setSpecialNote] = useState('');

  // Moving
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [storey, setStorey] = useState('');
  const [elevatorAvailable, setElevatorAvailable] = useState(false);
  const [furnitureName, setFurnitureName] = useState('');

  // Cleaning
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [spaceArea, setSpaceArea] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/companies/${companyId}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
          if (data.servicesOffered && data.servicesOffered.length > 0) {
            setServiceType(data.servicesOffered[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch company', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [user, navigate, companyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      
      const dateString = scheduledTime ? `${scheduledDate}T${scheduledTime}` : `${scheduledDate}T09:00`;
      
      const payload = {
        companyId,
        serviceType,
        scheduledDate: new Date(dateString).toISOString(),
        specialNote
      };

      if (serviceType === 'moving') {
        payload.fromAddress = fromAddress;
        payload.toAddress = toAddress;
        payload.storey = Number(storey);
        payload.elevatorAvailable = elevatorAvailable;
        // Sending a generic furniture item to satisfy schema requirements
        payload.furnitureItems = [{
          name: furnitureName || 'General Household Items',
          estimatedMassKg: 100,
          size: 'medium',
          requiresStairs: !elevatorAvailable,
          specialCare: false
        }];
      } else if (serviceType === 'cleaning') {
        payload.numberOfRooms = Number(numberOfRooms);
        payload.spaceArea = Number(spaceArea);
      }

      const res = await fetch(`${API_BASE_URL}/api/service-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Service requested successfully!');
        navigate('/dashboard/bookings'); // Navigate to tenant service bookings dashboard
      } else {
        const errData = await res.json();
        alert(`Failed to request service: ${errData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!company) return <div className="text-center py-20 text-red-500">Company not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900">Request Service from {company.businessName}</h1>
            <p className="mt-2 text-slate-600">Fill out the details below to get a quote.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <span className={`font-semibold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>1. Service Details</span>
              <span className="text-slate-600">→</span>
              <span className={`font-semibold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>2. Date & Notes</span>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Type</label>
                    <select 
                      value={serviceType} 
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 capitalize"
                    >
                      {company.servicesOffered?.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {serviceType === 'moving' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">From Address</label>
                          <input type="text" required value={fromAddress} onChange={e => setFromAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Pickup location" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">To Address</label>
                          <input type="text" required value={toAddress} onChange={e => setToAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Drop-off location" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Storey Level</label>
                          <input type="number" required value={storey} onChange={e => setStorey(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 3" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Main Items to Move</label>
                          <input type="text" required value={furnitureName} onChange={e => setFurnitureName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 2 Beds, 1 Sofa" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={elevatorAvailable} onChange={e => setElevatorAvailable(e.target.checked)} className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                          Elevator Available
                        </label>
                      </div>
                    </>
                  )}

                  {serviceType === 'cleaning' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Number of Rooms</label>
                        <input type="number" min="1" required value={numberOfRooms} onChange={e => setNumberOfRooms(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Area (sq ft)</label>
                        <input type="number" required value={spaceArea} onChange={e => setSpaceArea(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date</label>
                      <input type="date" required value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Time (Optional)</label>
                      <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Special Notes</label>
                    <textarea rows="3" value={specialNote} onChange={e => setSpecialNote(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Any specific requirements..."></textarea>
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
