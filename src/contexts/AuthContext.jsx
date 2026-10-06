import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.png';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetchClient('/auth/me');
      if (res?.data?.admin) {
        setUser(res.data.admin);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleSessionExpired = () => {
      setUser(null);
      toast.dismiss(); // Clear any "failed to load" developer toasts from components
      toast.error('Your session has expired. Please log in again.', { 
        duration: 5000,
        id: 'session-expired-toast' // Prevent duplicate toasts
      });
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetchClient('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient Glare */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px] animate-pulse duration-1000" />
        </div>
        
        {/* Glassmorphic Loader Card */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10">
          <img src={logo} alt="Clezo" className="h-12 w-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse" />
          <div className="flex items-center gap-3 text-white">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="font-extrabold tracking-wide drop-shadow-md text-xl">Loading Clezo OS...</span>
          </div>
          <p className="text-slate-400 mt-4 text-xs font-medium uppercase tracking-widest">Securing Connection</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
