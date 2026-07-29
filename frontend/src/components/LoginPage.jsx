import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* 1. Logo Section */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">RentX</h2>
        </div>
        
        {/* 2. Welcome Back Text */}
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 mb-8">
          Please enter your details to sign in.
        </p>

        {/* 3. <LoginForm /> */}
        <LoginForm />

        {/* 4. Footer Links */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition-colors">
              Create a RentX Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
