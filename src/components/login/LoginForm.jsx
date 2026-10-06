import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Truck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchClient } from '@/api/fetchClient';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 🌟 FIX: Updated to a generic, highly professional security message
    const loadingToastId = toast.loading('Verifying secure credentials...');

    try {
      // 1. Await the response directly from our custom fetchClient
      const response = await fetchClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // 2. Set user in AuthContext to instantly update the UI globally
      login(response.data.admin);
      
      // 3. Update the toast to Success
      toast.success(`Welcome back, ${response.data.admin.name}!`, {
        id: loadingToastId, // This replaces the loading spinner with the checkmark
      });

      // 4. Force the navigation NOW (Removed to prevent race condition since GuestGuard auto-redirects!)
      // navigate('/');
      
    } catch (error) {
      console.error("Login Error:", error);
      // Update the toast to Error
      toast.error(error.message || 'Invalid credentials', {
        id: loadingToastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🌟 Added 'relative' and 'flex-col' to carefully position the footer without moving the form
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50 relative">
      
      {/* The Form Card */}
      <div className="w-full max-w-md bg-white p-10 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative z-10">
        
        {/* Mobile Logo (Only shows on phones since Hero is hidden) */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary rounded-xl shadow-md">
            <Truck size={24} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">Clezo Express Laundry</h2>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Sign in to the Admin Portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input Group */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Username</label>
            <div className="relative transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                required
                className="pl-12 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-800 font-medium"
                placeholder="superboss"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input Group */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="password"
                required
                className="pl-12 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-800 font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-secondary transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-600 hover:bg-[#112440] disabled:bg-slate-400 text-white font-bold text-lg p-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Secure Login <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
          
        </form>
      </div>

      {/* 🌟 NEW: Absolute positioned developer credit for the login screen */}
      <div className="absolute bottom-6 left-0 right-0 text-center px-4">
        <p className="text-xs md:text-sm text-gray-400 font-medium">
          Developed by:{' '}
          <a 
            href="https://straxcel.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-bold text-gray-500 hover:text-primary transition-colors"
          >
            Straxcel Business Solutions
          </a>
        </p>
      </div>

    </div>
  );
}