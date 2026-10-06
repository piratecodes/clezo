"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {

  useEffect(() => {
    // 1. CLEANUP GUARD: Check if script already exists to prevent double loading
    if (document.getElementById("shapo-embed-js")) return;

    const script = document.createElement("script");
    script.id = "shapo-embed-js";
    script.type = "text/javascript";
    script.src = "https://cdn.shapo.io/js/embed.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // 2. THOROUGH CLEANUP: Remove script and clear widget content on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const widget = document.getElementById('shapo-widget-d6f8501f3c1eb4f1c301');
      if (widget) widget.innerHTML = "";
    };
  }, []);

  return (
    <section className="py-24 relative z-10 overflow-hidden">

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="container px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 text-secondary rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Direct Proof
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tight"
          >
            What People <span className="text-secondary italic drop-shadow-sm">Say</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg md:text-xl font-medium leading-relaxed mt-4 max-w-2xl"
          >
            Directly synced 5-star reviews from our Google Business Profile.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white/10 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden w-full min-h-[500px]"
        >

          {/* FULL WIDTH: Shapo Widget with "Healed" Container */}
          <div className="w-full p-6 lg:p-12 flex flex-col justify-center bg-white/10 backdrop-blur-md relative">

            <div className="relative w-full overflow-hidden rounded-2xl">
              {/* The Widget - Inside a wrapper to control the height better */}
              <div id="shapo-widget-d6f8501f3c1eb4f1c301" className="w-full -z-10"></div>

              {/* THE SHIELD: Responsive White Block 
                Try changing 'h-12' to 'h-16' or 'h-20' if the logo still peeps out.
                'bg-slate-50/50' matches your background color exactly for a seamless hide. */}
              <div className="absolute bottom-[5px] left-0 right-0 h-16 bg-white z-50 pointer-events-none"></div>
            </div>

            <style jsx global>{`
            /* Force the widget to not create duplicate layouts */
            #shapo-widget-d6f8501f3c1eb4f1c301 > div:nth-child(n+2) {
              display: none !important;
            }

            #shapo-widget-d6f8501f3c1eb4f1c301:empty::before {
              content: "Synchronizing Reviews...";
              display: block;
              text-align: center;
              font-weight: 800;
              color: #112440;
              font-size: 12px;
              letter-spacing: 0.1em;
            }
          `}</style>
          </div>
        </motion.div>

        {/* Google Verified Business Badge */}
        {/* <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-70 hover:opacity-100 transition-all duration-500">
         <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-gray-100 text-xl">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-primary font-black text-sm leading-none">Google Verified</span>
              <span className="text-secondary font-bold text-[10px] uppercase tracking-widest mt-1 text-center">Professional Business</span>
            </div>
         </div>
      </div> */}
      </div>
    </section>
  );
}