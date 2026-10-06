"use client";
import React from 'react';
import Link from 'next/link';
import { Shirt, Search } from 'lucide-react'; 
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Bubbles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container px-4 max-w-7xl mx-auto relative z-10 text-center">
        
        <div className="max-w-2xl mx-auto backdrop-blur-sm bg-white/40 p-12 rounded-[3rem] shadow-2xl border border-white/50">
          
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex justify-center mb-8 relative"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Shirt className="w-24 h-24 text-primary drop-shadow-lg" strokeWidth={1.5} />
              </motion.div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              className="absolute -bottom-2 -right-4"
            >
              <Search className="w-12 h-12 text-blue-500 drop-shadow-md" />
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-cyan-400 drop-shadow-sm">
              404
            </h1>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight"
          >
            Lost in the wash.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-10"
          >
            We are experts at premium garment care... but it seems this page got mixed up in the laundry. We can't find it anywhere in our basket.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/" 
              className="px-8 py-4 bg-primary hover:bg-primary-hover hover:scale-105 text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/20 text-lg flex items-center justify-center gap-2"
            >
              Back to Homepage
            </Link>
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