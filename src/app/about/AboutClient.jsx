"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Microscope, BadgeCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Custom Magnetic Button Component
const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Increased magnetism multiplier from 0.3 to 0.6
    setPosition({ x: middleX * 0.6, y: middleY * 0.6 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 100, damping: 10, mass: 0.1 }}
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default function AboutClient() {
  const router = useRouter();
  return (
    <main className="bg-transparent relative overflow-hidden" role="main">
      
      {/* Global Ambient Background Orbs */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* 1. CREATIVE HERO (Non-Glassmorphic, pure layout) */}
      <section className="pt-32 pb-10">
        <div className="container px-4 md:px-8 lg:px-0">
          <div className="flex flex-col lg:flex-row items-center lg:items-end text-center lg:text-left gap-8 lg:gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-2/3 flex flex-col items-center lg:items-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-primary/10 border border-primary/20 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-sm mb-6 md:mb-8">
                <Sparkles size={14} className="text-secondary" />
                <span className="text-primary">About Us</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-[0.9]">
                Engineering the <br className="hidden sm:block" /> Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Care.</span>
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/3"
            >
              <p className="text-base md:text-lg text-on-surface-variant font-medium leading-relaxed border-l-2 border-secondary pl-4 md:pl-6 max-w-md mx-auto lg:mx-0 text-left">
                We started Clezo to replace outdated, harsh chemical cleaning with advanced, eco-conscious fabric engineering and precision appliance maintenance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE CLEZO STANDARD (Restored to Glassmorphic) */}
      <section className="py-10">
        <div className="container px-4 md:px-8 lg:px-0">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            
            {/* Left Content Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2 bg-white/40 backdrop-blur-xl border border-white/60 p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col justify-center text-center lg:text-left"
            >
              <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4 block">Our Foundation</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface mb-6 md:mb-8 leading-tight">
                Built on clinical precision, <br className="hidden sm:block"/> not guesswork.
              </h2>
              
              <div className="space-y-4 md:space-y-6 text-on-surface-variant leading-relaxed font-medium text-sm md:text-base text-left">
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
            </motion.div>

            {/* Right Images (Glass Bento Grid) */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-4 md:space-y-6 pt-8 md:pt-12"
              >
                <div className="h-48 md:h-64 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60">
                  <img src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80" alt="Fabric Inspection" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="h-32 md:h-48 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 text-center hover:bg-white/60 transition-colors">
                  <span className="text-primary font-black text-2xl md:text-3xl leading-none mb-1 md:mb-2">1.2M+</span>
                  <span className="text-[10px] md:text-sm text-on-surface-variant font-bold uppercase tracking-widest">Garments Restored</span>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="space-y-4 md:space-y-6"
              >
                <div className="h-32 md:h-48 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 text-center hover:bg-white/60 transition-colors">
                  <span className="text-secondary font-black text-2xl md:text-3xl leading-none mb-1 md:mb-2">100%</span>
                  <span className="text-[10px] md:text-sm text-on-surface-variant font-bold uppercase tracking-widest">Eco-Solvents</span>
                </div>
                <div className="h-48 md:h-64 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60">
                  <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80" alt="Appliance Care" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR APPROACH (Restored to Glassmorphic) */}
      <section className="py-10">
        <div className="container px-4 md:px-8 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:bg-white/60 transition-colors text-center md:text-left"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-white/80 shadow-sm text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Microscope size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-on-surface mb-3 md:mb-4">Scientific Profiling</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium text-sm md:text-base">
                We don't use a universal bleach. Every stain is chemically profiled and treated with a specific organic solvent designed to dissolve it without touching the surrounding dye.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
              className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:bg-white/60 transition-colors text-center md:text-left"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-white/80 shadow-sm text-secondary rounded-xl md:rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Leaf size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-on-surface mb-3 md:mb-4">Zero-Toxin Guarantee</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium text-sm md:text-base">
                Our entire facility is completely free of PERC and hazardous petrochemicals used in standard dry cleaning, making your clothes perfectly safe for sensitive skin.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
              className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:bg-white/60 transition-colors text-center md:text-left"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-white/80 shadow-sm text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <BadgeCheck size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-on-surface mb-3 md:mb-4">Certified Technicians</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium text-sm md:text-base">
                When we service your home appliances, we deploy brand-certified mechanical technicians equipped with diagnostic tools to guarantee performance and longevity.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. MISSION STATEMENT (Dark Contrast Block) */}
      <section className="py-10">
        <div className="container px-4 md:px-8 lg:px-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 border-2 border-slate-800 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Subtle glow inside the dark card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
            
            <ShieldCheck size={40} className="text-primary mx-auto mb-6 md:mb-8 drop-shadow-sm md:w-[48px] md:h-[48px]" />
            <h2 className="text-xl sm:text-2xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto mb-6 md:mb-8">
              "To permanently elevate the global standard of domestic care, proving that luxury service and strict environmental responsibility must coexist."
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">— The Clezo Mission</p>
          </motion.div>
        </div>
      </section>

      {/* 5. SPLIT CTA WITH MAGNETIC BUTTON */}
      <section className="py-10 pb-32">
        <div className="container px-4 md:px-8 lg:px-0">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12"
          >
            
            {/* Background Details */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent opacity-50 blur-2xl pointer-events-none"></div>

            {/* Left Content */}
            <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 md:mb-6 bg-white/60 border border-white/80 shadow-sm px-4 md:px-5 py-2 rounded-full">
                <Sparkles size={14} /> Ready to upgrade?
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-on-surface leading-[1.1] tracking-tighter">
                Experience the New <br className="hidden sm:block" /> Standard of Care.
              </h2>
            </div>

            {/* Right Content - Massive Magnetic Button */}
            <div className="w-full lg:w-1/2 relative z-10 flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="relative group/magnetic p-4">
                {/* Magnetic Button Outer Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-90 group-hover/magnetic:scale-110 group-hover/magnetic:bg-primary/40 transition-all duration-500 z-0"></div>
                
                <MagneticButton 
                  onClick={() => router.push('/contact')}
                  className="relative z-10 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-primary via-[#00c6ff] to-secondary rounded-full text-white font-black uppercase tracking-widest text-xs md:text-sm flex flex-col items-center justify-center gap-2 md:gap-3 shadow-[0_15px_40px_rgba(0,174,230,0.4)] group border border-white/20 ring-4 ring-white/10 hover:ring-white/30 transition-all duration-300"
                >
                  <span className="relative z-10 drop-shadow-md text-center">Schedule <br/> Pickup</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform md:w-[24px] md:h-[24px] drop-shadow-md" />
                </MagneticButton>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

    </main>
  );
}
