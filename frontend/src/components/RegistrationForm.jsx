import React, { useState } from 'react';
import RoleSelector from './RoleSelector';

const RegistrationForm = () => {
  const [role, setRole] = useState('tenant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, role };
    console.log('Submitting to POST /api/auth/register:', payload);
    alert('Registration successful! Check the console for the payload.');
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit}>
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
          <label className={labelClass} htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+1 (555) 000-0000"
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
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-6"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegistrationForm;
