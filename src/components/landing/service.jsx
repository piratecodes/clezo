"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function ServicesSection() {
  const collections = [
    {
      title: "Men's Couture",
      subtitle: "Bespoke Care",
      description: "Expert dry cleaning and premium care tailored for suits, ties, and everyday menswear. We preserve fabric integrity and sharp silhouettes.",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      features: ["Crisp Ironing", "Stain Removal", "Fabric Preservation"]
    },
    {
      title: "Women's Fashion",
      subtitle: "Delicate Handling",
      description: "Hygienic and highly specialized cleaning for delicate women's wear, designer dresses, and couture. Safe for silk, chiffon, and lace.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      features: ["Embellishment Safe", "Color Protection", "Odor Removal"]
    },
    {
      title: "Kids' Clothing",
      subtitle: "Gentle & Hygienic",
      description: "Extremely safe, hypoallergenic cleaning that removes the toughest childhood stains while remaining perfectly gentle on sensitive skin.",
      image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&q=80",
      features: ["Hypoallergenic", "Tough on Mud", "Sanitization"]
    },
    {
      title: "Home Appliances",
      subtitle: "Deep Maintenance",
      description: "Professional deep cleaning and mechanical servicing for washing machines, ACs, and microwaves to ensure peak operational efficiency.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      features: ["Certified Techs", "Filter Cleaning", "Performance Boost"]
    }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      
      {/* Living Ambient Glares in Background */}
      <motion.div 
        animate={{ x: [-100, 100, -100], scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/30 blur-[150px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ x: [100, -100, 100], scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/20 blur-[150px] rounded-full pointer-events-none -z-10"
      />

      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface mb-4 md:mb-6 tracking-tight uppercase"
          >
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_15px_rgba(0,174,230,0.6)]">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-on-surface-variant text-base md:text-xl font-medium leading-relaxed max-w-2xl px-4"
          >
            Explore our expertly handled cleaning and maintenance services, designed for uncompromising hygiene and care.
          </motion.p>
        </div>

        {/* 2x2 Premium Glass Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 px-4 md:px-8 lg:px-0">
          {collections.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="group flex flex-col sm:flex-row items-stretch gap-5 sm:gap-6 p-3 sm:p-4 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,174,230,0.2)] hover:bg-white/50 hover:border-primary/40 transition-all duration-700 overflow-hidden relative"
            >
              {/* Continuous Living Glare inside the card */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2], rotate: [0, 90, 0] }}
                transition={{ duration: 8 + index * 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -right-20 w-64 h-64 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-secondary/10 to-transparent blur-[40px] rounded-full pointer-events-none -z-10 group-hover:from-primary/60 transition-colors duration-700"
              />

              {/* Left Image Area */}
              <div className="w-full sm:w-2/5 h-56 sm:h-auto sm:min-h-[250px] relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shrink-0 shadow-inner">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
              </div>

              {/* Right Content Area */}
              <div className="w-full sm:w-3/5 flex flex-col justify-center px-3 sm:px-0 py-2 sm:py-4 sm:pr-4 relative z-10">
                <span className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">
                  {item.subtitle}
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-black text-on-surface mb-2 sm:mb-3 tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-on-surface-variant font-medium text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                  {item.description}
                </p>
                
                {/* Micro Features */}
                <div className="flex flex-col gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                  {item.features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
                      className="flex items-center gap-2 group/feature"
                    >
                      <CheckCircle2 size={12} className="text-secondary group-hover/feature:scale-125 transition-transform sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider group-hover/feature:text-on-surface transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}