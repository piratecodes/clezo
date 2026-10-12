"use client";

import React from 'react';
import { Smartphone, QrCode, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferSlugAppBanner({ offer }) {
  const playStoreUrl = offer?.playStoreUrl || "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo";
  const appStoreUrl = offer?.appStoreUrl || "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943";

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#002333] via-slate-900 to-[#001724] text-white rounded-3xl md:rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider">
                <Sparkles size={13} />
                Instant App Activation
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Claim {offer?.discount || "Your Discount"} In The Clezo Mobile App
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                Download the Clezo Express Laundry App on your Android or iPhone. Book free pickup in Thane and Pune, track each wash cycle live, and receive sanitized clothes in 24 hours.
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-bold">
                  4.9 ★ Rating across 12,000+ app orders
                </span>
              </div>

              {/* Official Store Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {/* Google Play */}
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all hover:scale-105 shadow-md cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.503 1.503 0 01-.61-.926V2.74c0-.36.143-.702.61-.926z" fill="#00C1A6"/>
                    <path d="M17.477 8.316L14.79 11l-1 1 1 1 2.688 2.685 3.037-1.75c.87-.5.87-1.32 0-1.82l-3.038-1.75z" fill="#FFBA00"/>
                    <path d="M3.609 1.814L14.79 11l-1 1-10.18-10.186c.394-.213.847-.213 1.242 0z" fill="#00D2FF"/>
                    <path d="M3.609 22.186L14.79 13l-1-1L3.61 22.186c.394.213.847.213 1.242 0z" fill="#FF3A44"/>
                  </svg>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 leading-none">Get it on</div>
                    <div className="text-sm font-black leading-tight">Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.58.67-1.08 1.76-.95 2.8.03.02 1.05.08 2.68-1.27z"/>
                  </svg>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400 leading-none">Download on the</div>
                    <div className="text-sm font-black leading-tight">App Store</div>
                  </div>
                </a>
              </div>

            </div>

            {/* Right Card: QR Code & Live Verification */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-3 w-full max-w-xs shadow-xl">
                <div className="p-2.5 bg-white rounded-2xl shadow-md">
                  <QrCode size={110} className="text-slate-950" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Scan with Phone Camera</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Instantly opens the Clezo download page</p>
                </div>
                <div className="w-full pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 size={13} />
                  <span>Verified Safe Official App</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
