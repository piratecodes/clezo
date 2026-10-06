"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Users, Sparkles, Droplets, ShieldCheck, Globe } from 'lucide-react';

import Img from '@/assets/how.png';

export default function WhyChooseUsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const features = [
    {
      id: 1,
      title: "Legacy Experience",
      icon: UserCheck,
      description: "Operating for over a decade, handling diverse fabric and appliance care challenges with strictly standardized processes.",
      color: "from-blue-500/20 to-cyan-500/20",
      accent: "text-blue-500"
    },
    {
      id: 2,
      title: "Deep Expertise",
      icon: Sparkles,
      description: "Specialized in removing tough stains, delicate couture care, and deep-cleaning complex home appliances with zero damage risk.",
      color: "from-purple-500/20 to-pink-500/20",
      accent: "text-purple-500"
    },
    {
      id: 3,
      title: "Eco Handling",
      icon: Droplets,
      description: "Strict multi-stage sanitization, segregating garments by fabric type, using sustainable solvents instead of harsh chemicals.",
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-500"
    },
    {
      id: 4,
      title: "Verified Experts",
      icon: ShieldCheck,
      description: "Our trained, in-house specialists provide strict quality control, ensuring your items are treated with complete accountability.",
      color: "from-orange-500/20 to-amber-500/20",
      accent: "text-orange-500"
    },
    {
      id: 5,
      title: "Cost Clarity",
      icon: Users,
      description: "Transparent pricing based on garment type and appliance model, eliminating unexpected hidden charges completely.",
      color: "from-rose-500/20 to-red-500/20",
      accent: "text-rose-500"
    },
    {
      id: 6,
      title: "Rapid Network",
      icon: Globe,
      description: "Extensive network of sanitized care facilities ensuring rapid delivery without depending on unverified third-party cleaners.",
      color: "from-indigo-500/20 to-blue-500/20",
      accent: "text-indigo-500"
    }
  ];

  return (
    <section className="py-24 relative w-full overflow-hidden">
      <div className="container">
        
        {/* Animated Title Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 relative z-10">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-on-surface">Interactive Experience</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.1]"
            >
              Why Clezo Is The <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Gold Standard.</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-on-surface-variant font-medium text-lg max-w-sm pb-2"
          >
            Hover over the cards below to explore how we elevate fabric and appliance care beyond the ordinary.
          </motion.p>
        </div>

        {/* Horizontal Expansion Accordion */}
        <div className="flex flex-col md:flex-row h-[800px] md:h-[600px] w-full gap-4">
          {features.map((feature, index) => {
            const isActive = activeIndex === index;
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                onMouseEnter={() => { setActiveIndex(index); setIsPaused(true); }}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => { setActiveIndex(index); setIsPaused(true); }}
                animate={{ 
                  flex: isActive ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 5) : 1 
                }}
                transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
                className={`relative rounded-[2.5rem] overflow-hidden cursor-pointer border backdrop-blur-xl group transition-colors duration-500
                  ${isActive ? 'bg-white/60 border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)]' : 'bg-white/20 border-white/30 hover:bg-white/40'}
                `}
              >
                {/* Background Image (Only visible when active) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 z-0"
                    >
                      <Image 
                        src={Img} 
                        alt={feature.title} 
                        fill 
                        className="object-cover opacity-[0.08]" 
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-30`}></div>
                      {/* Clean gradient at the bottom to ensure text readability */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/90 via-white/40 to-transparent"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-8">
                  
                  {/* Top Icon */}
                  <motion.div 
                    layout
                    animate={{ y: isActive ? [-5, 5, -5] : 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-md border transition-all duration-500
                      ${isActive ? `bg-white border-white/80 ${feature.accent} scale-110 shadow-lg` : 'bg-white/30 border-white/50 text-on-surface-variant'}
                    `}
                  >
                    <Icon size={isActive ? 28 : 24} />
                  </motion.div>

                  {/* Bottom Text Area */}
                  <div className="relative flex-1 flex flex-col md:flex-row items-end md:items-end justify-end md:justify-start">
                    
                    {/* Active State Details */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(5px)" }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="w-full min-w-[200px] bg-white/40 backdrop-blur-lg rounded-2xl p-5 border border-white/60 shadow-sm"
                        >
                          <h3 className="text-2xl md:text-4xl font-black text-on-surface mb-2 md:mb-3 leading-tight drop-shadow-sm">
                            {feature.title}
                          </h3>
                          <p className="text-on-surface-variant text-sm md:text-lg font-medium leading-relaxed max-w-sm drop-shadow-sm">
                            {feature.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Inactive State Vertical Text (Desktop only) */}
                    <AnimatePresence mode="wait">
                      {!isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 hidden md:flex flex-col items-center justify-end pb-12 pointer-events-none"
                        >
                          <span 
                            className="text-xl font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap"
                            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                          >
                            {feature.title}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Inactive State Horizontal Text (Mobile only) */}
                    <AnimatePresence mode="wait">
                      {!isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-0 right-0 h-full md:hidden flex items-center justify-center pl-4"
                        >
                          <span className="text-sm font-bold text-on-surface-variant pr-2">
                            {feature.title}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}