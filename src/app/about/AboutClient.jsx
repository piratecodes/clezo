"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Microscope, BadgeCheck, ArrowRight, Sparkles } from 'lucide-react';

// Custom Magnetic Button Component
const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default function AboutClient() {
  return (
    <main className="bg-transparent relative overflow-hidden" role="main">
      
      {/* Global Ambient Background Orbs */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* 1. CREATIVE HERO (Non-Glassmorphic, pure layout) */}
      <section className="pt-32 pb-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-end gap-10">
            <div className="w-full lg:w-2/3">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm mb-8">
                <Sparkles size={14} className="text-secondary" />
                <span className="text-primary">About Us</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-[0.9]">
                Engineering the <br /> Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Care.</span>
              </h1>
            </div>
            <div className="w-full lg:w-1/3">
              <p className="text-lg text-on-surface-variant font-medium leading-relaxed border-l-2 border-secondary pl-6">
                We started Clezo to replace outdated, harsh chemical cleaning with advanced, eco-conscious fabric engineering and precision appliance maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CLEZO STANDARD (Restored to Glassmorphic) */}
      <section className="py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Content Card */}
            <div className="w-full lg:w-1/2 bg-white/40 backdrop-blur-xl border border-white/60 p-10 md:p-14 rounded-[3rem] shadow-sm flex flex-col justify-center">
              <span className="text-secondary font-black text-xs uppercase tracking-[0.2em] mb-4 block">Our Foundation</span>
              <h2 className="text-3xl md:text-4xl font-black text-on-surface mb-8 leading-tight">
                Built on clinical precision, <br/> not guesswork.
              </h2>
              
              <div className="space-y-6 text-on-surface-variant leading-relaxed font-medium">
                <p>
                  Traditional dry cleaners rely on aggressive industrial solvents that silently degrade the microscopic fibers of your clothing over time. We saw an industry that was stuck in the past and decided to rebuild it from the ground up.
                </p>
                <p>
                  At Clezo, we employ textile experts and utilize 100% biodegradable, hypoallergenic solutions. Every garment undergoes a meticulous multi-stage inspection before it even touches a cleaning agent.
                </p>
                <p>
                  Beyond garments, we brought the same level of rigorous certification to home appliances, ensuring your machines are serviced by highly trained mechanical technicians to extend their lifespan significantly.
                </p>
              </div>
            </div>

            {/* Right Images (Glass Bento Grid) */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="h-64 rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60">
                  <img src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80" alt="Fabric Inspection" className="w-full h-full object-cover" />
                </div>
                <div className="h-48 rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-primary font-black text-3xl leading-none mb-2">1.2M+</span>
                  <span className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Garments Restored</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-secondary font-black text-3xl leading-none mb-2">100%</span>
                  <span className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Eco-Solvents</span>
                </div>
                <div className="h-64 rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60">
                  <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80" alt="Appliance Care" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR APPROACH (Restored to Glassmorphic) */}
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[3rem] shadow-sm hover:bg-white/60 transition-colors">
              <div className="w-14 h-14 bg-white border border-white/80 shadow-sm text-primary rounded-2xl flex items-center justify-center mb-6">
                <Microscope size={24} />
              </div>
              <h3 className="text-xl font-black text-on-surface mb-4">Scientific Profiling</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                We don't use a universal bleach. Every stain is chemically profiled and treated with a specific organic solvent designed to dissolve it without touching the surrounding dye.
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[3rem] shadow-sm hover:bg-white/60 transition-colors">
              <div className="w-14 h-14 bg-white border border-white/80 shadow-sm text-secondary rounded-2xl flex items-center justify-center mb-6">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-black text-on-surface mb-4">Zero-Toxin Guarantee</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Our entire facility is completely free of PERC and hazardous petrochemicals used in standard dry cleaning, making your clothes perfectly safe for sensitive skin.
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[3rem] shadow-sm hover:bg-white/60 transition-colors">
              <div className="w-14 h-14 bg-white border border-white/80 shadow-sm text-primary rounded-2xl flex items-center justify-center mb-6">
                <BadgeCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-on-surface mb-4">Certified Technicians</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                When we service your home appliances, we deploy brand-certified mechanical technicians equipped with diagnostic tools to guarantee performance and longevity.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MISSION STATEMENT (Dark Contrast Block) */}
      <section className="py-10">
        <div className="container">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
            {/* Subtle glow inside the dark card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
            
            <ShieldCheck size={48} className="text-primary mx-auto mb-8 drop-shadow-sm" />
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto mb-8">
              "To permanently elevate the global standard of domestic care, proving that luxury service and strict environmental responsibility must coexist."
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">— The Clezo Mission</p>
          </div>
        </div>
      </section>

      {/* 5. SPLIT CTA WITH MAGNETIC BUTTON */}
      <section className="py-10 pb-32">
        <div className="container">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[4rem] p-12 md:p-20 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Background Details */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent opacity-50 blur-2xl pointer-events-none"></div>

            {/* Left Content */}
            <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.4em] mb-6 bg-white/60 border border-white/80 shadow-sm px-5 py-2 rounded-full">
                <Sparkles size={14} /> Ready to upgrade?
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-on-surface leading-[1.1] tracking-tighter">
                Experience the New <br /> Standard of Care.
              </h2>
            </div>

            {/* Right Content - Massive Magnetic Button */}
            <div className="w-full lg:w-1/2 relative z-10 flex justify-center lg:justify-end">
              <MagneticButton className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-black uppercase tracking-widest text-sm flex flex-col items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,174,230,0.3)] hover:shadow-[0_20px_60px_rgba(0,174,230,0.5)] transition-all duration-300 group">
                Schedule <br/> Pickup
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </MagneticButton>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
