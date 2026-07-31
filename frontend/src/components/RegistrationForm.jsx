import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import RoleSelector from './RoleSelector';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [role, setRole] = useState('tenant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      
      // 2. Sync to Backend
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        role: role
      };
      
      const response = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const userData = await response.json();
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      <RoleSelector selectedRole={role} onSelectRole={setRole} />

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">Phone Number <span className="text-xs text-gray-400 font-normal ml-1">(e.g., 01712345678)</span></label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            pattern="^01\d{9}$"
            title="Must be an 11-digit Bangladeshi number starting with 01"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className={inputClass}
            placeholder="123 Main St, Dhaka"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 mt-6 ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}`}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegistrationForm;
