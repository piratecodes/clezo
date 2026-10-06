import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import Tilt from 'react-parallax-tilt';
import logo from '@/assets/logo.png';

export default function ForgotPassword() {
  useDocumentMeta("Forgot Password | Clezo Express Laundry", "Reset your admin password by receiving a secure link in your email.");
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetchClient('/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      setIsSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Error sending email. Check if the address is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300">
      {/* Background Aesthetic Glares */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse duration-[10000ms]" />
      </div>

      <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} perspective={1000} scale={1.01} className="relative z-10 w-full max-w-md">
        <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none rounded-full"></div>

          <div className="flex justify-center mb-8 relative z-10">
            <img src={logo} alt="Clezo" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          </div>

          <h2 className="text-2xl font-extrabold text-center text-white mb-2 drop-shadow-md">Reset Password</h2>
          
          {isSent ? (
            <div className="text-center relative z-10">
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl mb-6">
                <p className="font-medium text-sm">We've sent a secure reset link to <span className="font-bold text-white">{email}</span>. Please check your inbox.</p>
              </div>
              <Link to="/login" className="text-primary font-bold hover:text-white transition-colors flex justify-center items-center gap-2">
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-center text-slate-400 mb-8 text-sm leading-relaxed">Enter your registered admin email address and we'll send you a secure link to reset your password.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-slate-600 font-medium" placeholder="admin@clezo.com" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-fixed-variant disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] flex justify-center items-center gap-2 hover:-translate-y-0.5">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {isLoading ? 'Verifying...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-8 text-center">
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-primary font-bold transition-colors">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </Tilt>
    </div>
  );
}