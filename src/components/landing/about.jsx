"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Map, Award, Sparkles, Droplets, Wind } from 'lucide-react';

import AboutImage from "@/assets/hero.png";

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="py-32 relative z-10 w-full bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/50 to-transparent overflow-hidden">
      
      {/* Light Rays Gradient (Matches reference image) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] flex justify-center opacity-70 pointer-events-none">
         <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1000px] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-secondary/20 to-transparent blur-[100px]"
         ></motion.div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* BENTO GRID LAYOUT */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
        >
          
          {/* TILE 1: Main Typography (Spans 2 cols, 2 rows) */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 row-span-2 rounded-[2.5rem] bg-white/30 backdrop-blur-2xl border border-white/60 p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden group shadow-[0_10px_40px_rgba(0,174,230,0.05)] hover:shadow-[0_20px_50px_rgba(0,174,230,0.15)] transition-all duration-700">
            {/* Color Splash / Rays Glare */}
            <motion.div 
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -left-10 w-[150%] h-[150%] bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-primary/40 via-secondary/20 to-transparent blur-[80px] rounded-full -z-10"
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/30 blur-[100px] rounded-full -z-10"
            />
            
            <div className="relative z-10 mb-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/60 border border-white/80 rounded-full w-max shadow-sm mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[#020b14] font-bold text-[10px] uppercase tracking-[0.3em]">The Clezo Standard</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#020b14] leading-[1.1] tracking-tight uppercase">
                Premium <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">Care</span> & <br/>
                Hygiene.
              </h2>
            </div>

            <div className="relative z-10 space-y-6 text-gray-700 text-base md:text-lg font-medium leading-relaxed">
              <p>
                Our legacy reflects how our deep-cleaning processes continuously evolve, how hygiene standards are refined, and how garment and appliance care is strictly improved.
              </p>
              <p>
                <strong className="text-primary font-bold tracking-widest uppercase text-xs drop-shadow-sm">Clezo</strong> makes your daily life effortless by offering structured, highly reliable, and experience-driven laundry and maintenance services.
              </p>
            </div>
          </motion.div>

          {/* TILE 2: Image (Spans 2 cols, 2 rows) */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-2 row-span-2 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 relative overflow-hidden group min-h-[400px] shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            {/* Ambient Glare behind image */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-secondary/30 blur-[60px] -z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020b14]/80 via-transparent to-transparent z-10 transition-opacity duration-500 group-hover:opacity-60"></div>
            <Image 
              src={AboutImage} alt="Premium Care by Clezo" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
              className="object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out z-0"
            />
            
            {/* Floating Glass Stats inside the image tile */}
            <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-wrap gap-4">
               <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-4 flex-1 min-w-[120px] flex flex-col gap-1 items-center justify-center text-center transform hover:-translate-y-2 transition-transform shadow-lg">
                  <Wind className="text-white w-6 h-6 mb-2 drop-shadow-md" />
                  <span className="text-white font-black text-xl drop-shadow-md">100k+</span>
                  <span className="text-white/80 font-bold text-[9px] uppercase tracking-widest">Delivered</span>
               </div>
               <div className="bg-primary/40 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 flex-1 min-w-[120px] flex flex-col gap-1 items-center justify-center text-center transform hover:-translate-y-2 transition-transform shadow-[0_0_20px_rgba(0,174,230,0.4)]">
                  <ShieldCheck className="text-white w-6 h-6 mb-2 drop-shadow-md" />
                  <span className="text-white font-black text-xl drop-shadow-md">4</span>
                  <span className="text-white/80 text-[9px] uppercase tracking-widest font-bold">Sectors</span>
               </div>
            </div>
          </motion.div>

          {/* TILE 3: Experience Badge (Spans 1 col, 1 row) */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1 row-span-1 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-[0_10px_30px_rgba(0,174,230,0.1)] hover:shadow-[0_20px_50px_rgba(0,174,230,0.2)] transition-all duration-500">
            {/* Radiant Glare */}
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/50 via-primary/20 to-transparent blur-[40px] -z-10"
            />
            
            <h3 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary drop-shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500">
              45+
            </h3>
            <p className="text-[#020b14]/70 font-bold uppercase tracking-[0.2em] text-xs">
              Years of <br/> <span className="text-[#020b14]">Excellence</span>
            </p>
          </motion.div>

          {/* TILE 4: Quality Statement (Spans 2 cols, 1 row) */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 row-span-1 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 p-10 flex items-center justify-between group overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,174,230,0.15)] hover:border-primary/40 hover:-translate-y-2 transition-all duration-500">
            {/* Sweeping Glare */}
            <motion.div 
              animate={{ x: [0, -60, 0], scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-96 h-96 bg-primary/30 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 -z-10"
            />

            <div className="max-w-md relative z-10">
              <h3 className="text-2xl font-black text-[#020b14] mb-3 uppercase tracking-wide">
                Uncompromising <span className="text-primary drop-shadow-sm">Hygiene</span>
              </h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                Every garment and appliance goes through rigorous multi-stage sanitization processes, ensuring 99% customer satisfaction across all our services.
              </p>
            </div>
            <div className="hidden sm:flex w-20 h-20 rounded-full bg-white/80 border border-white shadow-lg items-center justify-center flex-shrink-0 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
              <Award className="w-10 h-10 text-primary drop-shadow-md" />
            </div>
          </motion.div>

          {/* TILE 5: Extra Highlight (Spans 1 col, 1 row) */}
          <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-1 row-span-1 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 p-8 flex flex-col justify-center gap-4 group transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)] hover:border-emerald-500/40 hover:-translate-y-2 relative overflow-hidden">
             {/* Emerald Glare */}
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.9, 0.5] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/30 blur-[50px] rounded-full -z-10"
             />

            <Droplets className="w-10 h-10 text-emerald-500 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 drop-shadow-sm" />
            <div className="relative z-10">
              <span className="block text-[#020b14] font-black text-xl mb-1">Eco-Friendly</span>
              <span className="block text-gray-600 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                Using sustainable solvents & deep-cleaning.
              </span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}