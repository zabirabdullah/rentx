import { API_BASE_URL } from "../config/api.js";
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch(`${API_BASE_URL}/api/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => setUser(userData);
  
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading RentX...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
