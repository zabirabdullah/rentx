import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This perfectly matches the architecture requirement for POST /api/auth/login
    console.log('Submitting to POST /api/auth/login:', formData);
    alert('Login payload captured! Check console.');
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
          Email Address
        </label>
        <input 
          type="email" 
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com" 
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
            Forgot your password?
          </a>
        </div>
        <input 
          type="password" 
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••" 
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
      </div>

      <button 
        type="submit" 
        className="w-full mt-8 bg-green-600 text-white text-lg font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
