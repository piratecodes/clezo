"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden flex items-end justify-start pb-40 md:pb-56 bg-[#001b2e]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Text / Graphic behind the video */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden opacity-20 pointer-events-none"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 className="text-[20rem] font-black text-primary whitespace-nowrap opacity-30 select-none">
          CLEZO
        </h1>
      </motion.div>

      {/* Background Video with Transparency and Hover Scale */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        animate={{ 
          scale: isHovered ? 1.05 : 1.1,
          opacity: isHovered ? 0.7 : 0.4
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover z-10 mix-blend-overlay"
      >
        <source src="/assets/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Hero Content */}
      <div className="relative z-20 container px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-white/30 backdrop-blur-md bg-white/10 text-white text-xs font-bold tracking-[0.2em] uppercase shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Premium Care
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.9] mix-blend-difference"
        >
          Redefining <br />
          <span className="text-primary drop-shadow-[0_0_15px_rgba(0,174,230,0.5)]">Clean.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-medium drop-shadow-lg leading-relaxed border-l-4 border-primary pl-6"
        >
          Elevate your lifestyle with absolute precision care for your luxury garments and essential home appliances.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <Link href="/contact" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(0,174,230,0.5)] transition-all duration-300">
            Connect With Us
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </motion.div>
      </div>

      {/* Double Layered Wave Tide Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none translate-y-[1px]">
        <svg className="relative block w-full h-[100px] md:h-[160px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          {/* Layer 1 (Back, Tallest, Highly Transparent) */}
          <path d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 L1200,120 L0,120 Z" className="fill-white/20"></path>
          
          {/* Layer 2 (Middle, Medium, Semi-Transparent) */}
          <path d="M0,70 C250,120 450,20 650,70 C850,120 1050,20 1200,70 L1200,120 L0,120 Z" className="fill-white/40"></path>
          
          {/* Layer 3 (Front, Shortest, Solid Base) */}
          <path d="M0,90 C300,140 500,40 700,90 C900,140 1100,40 1200,90 L1200,120 L0,120 Z" className="fill-[#f8fafc]"></path>
        </svg>
      </div>

    </div>
  );
}