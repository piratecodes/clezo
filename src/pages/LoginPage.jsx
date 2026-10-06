import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchClient } from '@/api/fetchClient';
import { useAuth } from '@/contexts/AuthContext';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import Tilt from 'react-parallax-tilt';
import logo from '@/assets/logo.png';

export default function LoginPage() {
  useDocumentMeta("Admin Login | Clezo Express Laundry", "Securely log in to the Clezo admin dashboard.");  
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading('Verifying secure credentials...');

    try {
      const response = await fetchClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      login(response.data.admin);
      toast.success(`Welcome back, ${response.data.admin.name}!`, { id: loadingToastId });
    } catch (error) {
      toast.error(error.message || 'Invalid credentials', { id: loadingToastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300">
      {/* Background Aesthetic Glares */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[150px] animate-pulse duration-[15000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite]" />
      </div>

      <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} transitionSpeed={1500} scale={1.01} className="relative z-10 w-full max-w-5xl">
        <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Side - Info */}
          <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-white/5 border-r border-white/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-1000"></div>
             
             <div>
                <img src={logo} alt="Clezo" className="h-12 w-auto mb-8 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
                  Welcome to Clezo OS
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  The ultimate enterprise command center. Manage your operations, track your services, and scale your laundry business securely.
                </p>
             </div>

             <div className="grid grid-cols-1 gap-4 mt-12 relative z-10">
               <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                 <div className="bg-primary/20 p-2 rounded-xl text-primary"><ShieldCheck size={24} /></div>
                 <div>
                   <h4 className="text-white font-bold text-sm">Bank-Grade Security</h4>
                   <p className="text-xs text-slate-500 mt-0.5">End-to-end encrypted sessions</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                 <div className="bg-primary/20 p-2 rounded-xl text-primary"><MapPin size={24} /></div>
                 <div>
                   <h4 className="text-white font-bold text-sm">Real-time Management</h4>
                   <p className="text-xs text-slate-500 mt-0.5">Track all orders instantly</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center bg-black/10">
             <div className="md:hidden flex justify-center mb-8">
               <img src={logo} alt="Clezo" className="h-12 w-auto drop-shadow-md" />
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-2">Admin Login</h3>
             <p className="text-slate-500 text-sm mb-8">Enter your credentials to access the portal.</p>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Username</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-slate-600 font-medium" placeholder="admin_username" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-slate-600 font-medium" placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-white transition-colors">Forgot Password?</Link>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-fixed-variant disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] flex justify-center items-center gap-2 hover:-translate-y-0.5">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Secure Login'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
             </form>

             <div className="mt-12 text-center text-xs font-medium text-slate-600 flex flex-col items-center justify-center gap-1">
               <p>Developed by <a href="https://subham.digital" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors font-bold">Subham.digital</a></p>
               <a href="https://straxcel.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-primary transition-colors font-bold">Straxcel Business Solutions</a>
             </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}