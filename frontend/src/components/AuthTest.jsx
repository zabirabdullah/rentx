import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('tenant');
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const syncWithBackend = async (idToken, isNewUser) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: isNewUser ? name : undefined,
          phone: isNewUser ? phone : undefined,
          address: isNewUser ? address : undefined,
          role: isNewUser ? role : undefined
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sync with backend');
      
      setMongoUser(data);
      alert('Successfully synced with backend!');
    } catch (err) {
      setError('Backend Sync Error: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setError("Name, Phone, and Address are required for registration");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await syncWithBackend(idToken, true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await syncWithBackend(idToken, false);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMongoUser(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-center">Auth Test Panel</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      
      {user ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-800">✅ Firebase Authenticated</h3>
            <p className="text-sm">Email: {user.email}</p>
            <p className="text-sm truncate">UID: {user.uid}</p>
          </div>
          
          {mongoUser && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="font-bold text-blue-800">✅ MongoDB Synced</h3>
              <p className="text-sm">Name: {mongoUser.name}</p>
              <p className="text-sm">Role: {mongoUser.role}</p>
              <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded mt-2 overflow-x-auto">
                {JSON.stringify(mongoUser, null, 2)}
              </pre>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Name (Required for Register)" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="border p-2 rounded"
          />
          <input 
            type="text" 
            placeholder="Phone (e.g. 01XXXXXXXXX)" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="border p-2 rounded"
          />
          <input 
            type="text" 
            placeholder="Address (Required for Register)" 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            className="border p-2 rounded"
          />
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            className="border p-2 rounded bg-white"
          >
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
            <option value="company">Company</option>
          </select>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="border p-2 rounded"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="border p-2 rounded"
            required 
          />
          
          <div className="flex gap-3 mt-2">
            <button 
              onClick={handleRegister} 
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthTest;
