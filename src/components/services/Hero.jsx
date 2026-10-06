"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PhoneCall, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero({ title, introText }) {
  // Prevent iframe from auto-focusing and jumping page on load
  const [loadIframe, setLoadIframe] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadIframe(true);
    }, 1500);

    // FIX: Prevent iframe from stealing focus and scrolling page on tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (document.activeElement?.tagName === 'IFRAME') {
          document.activeElement.blur();
          window.focus(); // Shift focus back to main window
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section className="relative py-24 md:py-36 overflow-hidden border-b border-slate-200/50">

      {/* --- AMAZING ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 -left-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply"
        />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* --- LEFT COLUMN: Narrative --- */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left xl:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm mb-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Premium Garment Care</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-slate-800 leading-[1.15] tracking-tight mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                {title}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl"
            >
              {introText}
            </motion.p>

          </div>

          {/* --- RIGHT COLUMN: Floating Glass Panel --- */}
          <div className="lg:col-span-5 xl:col-span-5 relative w-full lg:mt-0 mt-8 flex justify-center lg:justify-end" id="book">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="relative w-full max-w-[420px] lg:max-w-[440px] mx-auto lg:mr-0"
            >
              {/* Glass Panel Frame */}
              <div className="relative rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_-12px_rgba(0,174,230,0.2)] overflow-hidden flex flex-col mx-auto w-full h-[580px] p-2.5">

                {/* Decorative header dots (mac style) */}
                <div className="absolute top-4 left-6 flex gap-1.5 z-20 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80" />
                </div>

                {/* Inner Screen */}
                <div className="w-full h-full bg-white relative overflow-hidden rounded-[2rem] shadow-inner">
                  {/* Decorative Loader Background */}
                  <AnimatePresence>
                    {!loadIframe && (
                      <motion.div
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center text-primary z-10"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <Loader2 className="absolute inset-0 m-auto w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <span className="mt-4 text-xs font-bold tracking-widest uppercase text-primary/70 animate-pulse">Initializing Terminal</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* The Iframe */}
                  {loadIframe && (
                    <motion.iframe
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src="https://pickup-scheduler.quickdrycleaning.com/en/ClezoExpress/pickup"
                      className="absolute inset-0 w-full h-full border-none bg-white pt-8"
                      title="Schedule Pickup"
                    />
                  )}
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [10, 15, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 md:top-4 md:-right-8 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg blur-[2px] opacity-60 hidden md:block"
              />
              <motion.div
                animate={{ y: [10, -10, 10], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 md:bottom-12 md:-left-8 w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full shadow-lg blur-[2px] opacity-50 hidden md:block"
              />

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}