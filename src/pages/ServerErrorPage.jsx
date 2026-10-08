import { motion } from 'framer-motion';
import { useNavigate, useRouteError } from 'react-router-dom';
import { RefreshCw, ServerCrash, Home } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export default function ServerErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError(); // From React Router

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300">
      {/* Background Aesthetic Glares */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[60%] h-[60%] bg-red-500/10 rounded-full blur-[150px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={1000} transitionSpeed={1500} scale={1.01} className="relative z-10 w-full max-w-2xl">
        <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 p-12 text-center relative overflow-hidden group">
          
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-red-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-red-500/30 transition-colors duration-1000"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-red-500/20 p-6 rounded-full border border-red-500/30">
              <ServerCrash size={64} className="text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-500 mb-2 drop-shadow-lg"
          >
            500
          </motion.h1>

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white tracking-tight mb-4"
          >
            System Failure
          </motion.h2>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-6"
          >
            A critical error occurred in the command center. Our engineers have been notified of the anomaly.
          </motion.p>

          {error && error.message && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-black/30 border border-red-500/20 rounded-lg p-3 mb-8 max-w-md mx-auto overflow-auto text-left"
            >
              <code className="text-xs text-red-300/80 font-mono">
                {error.status} {error.statusText}
                <br/>
                {error.message}
              </code>
            </motion.div>
          )}

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
            >
              <RefreshCw size={18} />
              Reboot System
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5"
            >
              <Home size={18} />
              Return Home
            </button>
          </motion.div>

        </div>
      </Tilt>
    </div>
  );
}
