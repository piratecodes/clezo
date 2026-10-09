"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CsrBanner() {
  return (
    <section className="py-6 relative z-10 mt-10">
      <div className="container px-4 max-w-8xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-white/80 overflow-hidden relative group hover:shadow-xl hover:border-emerald-200/50 transition-all duration-500"
        >
          {/* Transparent Glare Effects */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-1000 ease-out" />
          <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="flex items-center gap-5 md:gap-6 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
              <HeartHandshake size={32} className="text-emerald-500" />
            </div>
            <div>
              <div className="text-emerald-600/80 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1">Corporate Social Responsibility</div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight tracking-tight">
                The <span className="text-emerald-500">Give & Share</span> Initiative
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-1 max-w-lg hidden md:block leading-relaxed">
                Donate your old clothes with your laundry order, and we'll ensure they reach those in need. Let's build a compassionate community together.
              </p>
            </div>
          </div>
          
          <Link 
            href="/about#csr"
            className="relative z-10 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 md:py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all duration-300 shrink-0 w-full md:w-auto justify-center group/btn shadow-sm hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
          >
            Learn More
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
