import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginForm = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
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
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      
      const response = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
      // If backend fails but firebase succeeded, we should ideally sign out from firebase
      auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
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
          <Link to="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-500">
            Forgot your password?
          </Link>
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
        disabled={loading}
        className={`w-full mt-8 bg-green-600 text-white text-lg font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-green-500/30'}`}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
