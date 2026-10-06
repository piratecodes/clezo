import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import Tilt from 'react-parallax-tilt';
import logo from '@/assets/logo.png';

export default function ResetPassword() {
  useDocumentMeta("Set New Password | Clezo Express Laundry", "Create a new secure password for your admin account.");
  
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match!");
    if (password.length < 8) return toast.error("Password must be at least 8 characters long.");

    setIsLoading(true);
    try {
      await fetchClient(`/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      setIsSuccess(true);
      toast.success('Password reset successfully!');
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300">
      {/* Background Aesthetic Glares */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} perspective={1000} scale={1.01} className="relative z-10 w-full max-w-md">
        <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 p-10 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none rounded-full"></div>

          <div className="flex justify-center mb-8 relative z-10">
            <img src={logo} alt="Clezo" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          </div>

          {isSuccess ? (
            <div className="text-center py-8 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle size={48} className="text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3 drop-shadow-md">Password Updated!</h2>
              <p className="text-slate-400 mb-8 text-sm">Your password has been successfully reset. Redirecting you to login...</p>
              <Loader2 size={24} className="animate-spin text-primary mx-auto" />
            </div>
          ) : (
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold text-center text-white mb-2 drop-shadow-md">Create New Password</h2>
              <p className="text-center text-slate-400 mb-8 text-sm leading-relaxed">Your new password must be different from previous used passwords and at least 8 characters long.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full pl-11 pr-12 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-slate-600 font-medium" 
                      placeholder="••••••••" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-slate-600 font-medium" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-fixed-variant disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] flex justify-center items-center gap-2 mt-4 hover:-translate-y-0.5">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {isLoading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/login" className="text-sm text-slate-500 hover:text-primary font-bold transition-colors">
                  Cancel and return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </Tilt>
    </div>
  );
}