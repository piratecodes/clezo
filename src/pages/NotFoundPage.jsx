import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300">
      {/* Background Aesthetic Glares */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} transitionSpeed={1500} scale={1.02} className="relative z-10 w-full max-w-2xl">
        <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 p-12 text-center relative overflow-hidden group">
          
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/40 transition-colors duration-1000"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-red-500/20 p-6 rounded-full border border-red-500/30">
              <AlertTriangle size={64} className="text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 drop-shadow-lg"
          >
            404
          </motion.h1>

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white tracking-tight mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-10"
          >
            The route you are looking for has drifted into the void. It might have been moved, deleted, or never existed in the first place.
          </motion.p>

          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5"
          >
            <Home size={18} />
            Return to Dashboard
          </motion.button>

        </div>
      </Tilt>
    </div>
  );
}
