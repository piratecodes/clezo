"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Bubbles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400/10 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container px-4 max-w-7xl mx-auto relative z-10 text-center">
        
        <div className="max-w-2xl mx-auto backdrop-blur-sm bg-white/40 p-12 rounded-[3rem] shadow-2xl border border-white/50">
          
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-8 relative"
          >
            <div className="relative z-10">
              <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center drop-shadow-lg mx-auto"
              >
                <AlertCircle className="w-12 h-12" strokeWidth={2.5} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight">
              A tough stain!
            </h1>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-bold text-slate-600 mb-4 tracking-tight"
          >
            Something went wrong while processing your request.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Our systems encountered a wrinkle. Don't worry, our engineers have been notified and will iron out this issue shortly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => reset()}
              className="px-8 py-4 bg-primary hover:bg-primary-hover hover:scale-105 text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/20 text-lg flex items-center justify-center gap-2 group"
            >
              <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform duration-300" /> Try Again
            </button>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-white/80 backdrop-blur-md border border-slate-200 hover:border-primary hover:text-primary hover:scale-105 text-slate-600 font-bold rounded-xl transition-all text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              Contact Support
            </Link>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
