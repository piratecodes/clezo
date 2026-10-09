"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, CalendarDays, Truck, Sparkles as SparklesIcon, PackageCheck, Loader2 } from 'lucide-react';

export default function ServicesClient() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        } else if (Array.isArray(data)) {
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const steps = [
    { icon: <CalendarDays size={24} />, title: "Book", desc: "Schedule a time" },
    { icon: <Truck size={24} />, title: "Pickup", desc: "We collect your items" },
    { icon: <SparklesIcon size={24} />, title: "We Clean", desc: "Expert sanitization" },
    { icon: <PackageCheck size={24} />, title: "Delivery", desc: "Fresh & ready" }
  ];

  return (
    <main className="min-h-screen pt-24 pb-32 overflow-hidden bg-transparent">
      
      {/* 1. IMPRESSIVE HERO SECTION */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-slate-200/50">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 -right-20 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container relative z-10 px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm mb-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Premium Garment & Home Care</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-800 leading-[1.1] tracking-tight mb-8"
            >
              The New Standard of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">
                Professional Cleaning
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              From bespoke couture care to deep home sanitization, discover our complete catalog of services engineered for uncompromising hygiene.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Client Flow) */}
      <section className="py-20 border-b border-slate-100/50 relative">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">How It Works</h2>
            <p className="text-slate-500 font-medium mt-3">Seamless convenience from start to finish.</p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-8 max-w-5xl mx-auto relative z-10">
            
            {/* The String (Desktop: Horizontal) */}
            <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-slate-200/60 z-0 rounded-full">
               {/* Moving Energy Particle 1 */}
               <motion.div 
                 animate={{ left: ["0%", "100%"] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 -translate-y-1/2 w-16 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(0,174,230,0.8)] rounded-full"
               />
               {/* Moving Energy Particle 2 */}
               <motion.div 
                 animate={{ left: ["0%", "100%"] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1.25 }}
                 className="absolute top-1/2 -translate-y-1/2 w-24 h-[3px] bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_20px_rgba(150,50,230,0.8)] rounded-full"
               />
            </div>

            {/* The String (Mobile: Vertical) */}
            <div className="md:hidden absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[2px] bg-slate-200/60 z-0 rounded-full">
               <motion.div 
                 animate={{ top: ["0%", "100%"] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute left-1/2 -translate-x-1/2 w-[3px] h-20 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(0,174,230,0.8)] rounded-full"
               />
            </div>

            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, type: "spring" }}
                className="w-full md:w-1/4 bg-white/70 backdrop-blur-md border border-white/80 rounded-[2rem] p-8 text-center shadow-sm hover:shadow-[0_20px_40px_rgba(0,174,230,0.12)] hover:-translate-y-2 transition-all duration-500 group relative z-10 flex flex-col"
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-transparent relative z-10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-sm font-medium text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section className="py-24 container px-4 relative">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Our Services
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
             <CheckCircle2 size={16} className="text-secondary" />
             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">100% Satisfaction</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading premium services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500 font-medium">No services currently available. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1, type: "spring", stiffness: 100 }}
                className="group flex flex-col bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative p-6 min-h-[300px]"
              >
                {/* Animated Background Gradients & Orbs */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 group-hover:to-primary/10 transition-colors duration-500 pointer-events-none" />
                
                <motion.div 
                  animate={{ y: [-5, 5, -5], scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[20px] group-hover:bg-primary/20 group-hover:scale-125 transition-all duration-700 pointer-events-none" 
                />

                <motion.div 
                  animate={{ y: [5, -5, 5], scale: [1, 1.1, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                  className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/5 rounded-full blur-[20px] group-hover:bg-secondary/10 group-hover:scale-125 transition-all duration-700 pointer-events-none" 
                />

                {/* Faded Icon in Background */}
                <div className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-primary/10 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 pointer-events-none z-0">
                  <Sparkles size={120} strokeWidth={1} />
                </div>

                {/* Top Icon Box */}
                <div className="relative z-10 w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary mb-6 group-hover:scale-105 group-hover:border-primary/20 transition-all duration-500">
                  <Sparkles size={20} className="group-hover:animate-pulse" />
                </div>
                
                {/* Text Content */}
                <div className="relative z-10 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  
                  <p className="text-slate-500 font-medium text-sm leading-relaxed flex-grow">
                    {service.description || `Professional and premium care for all your ${service.name.toLowerCase()} needs.`}
                  </p>
                </div>
                
                {/* Bottom CTA */}
                <div className="relative z-10 mt-6">
                  <Link 
                    href={`/services/${service.slug}`}
                    className="relative flex items-center justify-between w-full px-5 py-3 bg-slate-50 group-hover:bg-primary text-slate-600 group-hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm group-hover:shadow-[0_8px_25px_rgba(0,174,230,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,174,230,0.5)] group/btn overflow-hidden"
                  >
                    {/* Hover Gradient Sweep Layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out z-0" />
                    
                    <span className="relative z-10">Explore Service</span>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-slate-200/50 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300 group-hover/btn:bg-white/40">
                      <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
