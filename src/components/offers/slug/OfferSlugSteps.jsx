"use client";

import React from 'react';
import { Smartphone, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferSlugSteps() {
  const steps = [
    {
      step: "01",
      title: "Download Clezo App",
      desc: "Install the official Clezo Express Laundry app from Google Play or Apple App Store and verify your mobile number.",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "02",
      title: "Select Pickup Slot",
      desc: "Choose a convenient pickup date & time. Our hygienic van rider collects your garments right at your doorstep.",
      icon: Calendar,
      color: "from-primary to-emerald-500"
    },
    {
      step: "03",
      title: "Discount Applied & Delivered",
      desc: "Apply the promo or enjoy automatic deduction. Receive sanitized, crisply pressed clothes in 24 hours.",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Light Ambient Glare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-14 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-black uppercase tracking-wider mb-2.5 border border-white/60 backdrop-blur-xs"
          >
            Easy 3-Step Process
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight"
          >
            How to Claim Your Offer in 60 Seconds
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="bg-white/25 hover:bg-white/35 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_10px_30px_rgba(0,35,51,0.05)] relative overflow-hidden group hover:border-primary/40 transition-all hover:-translate-y-1.5"
              >
                <div className="text-5xl font-black text-slate-100/80 absolute top-4 right-4 pointer-events-none group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
