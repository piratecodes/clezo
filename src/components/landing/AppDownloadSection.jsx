"use client";

import React from 'react';
import { 
  Smartphone, QrCode, Star, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, Download,
  Wifi, Battery, Droplets, MapPin, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppDownloadSection() {
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo";
  const appStoreUrl = "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943";

  return (
    <section id="app-download" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Light Ambient Spotlights behind section (lets wallpaper breathe) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white/45 via-white/20 to-white/40 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 border border-white/80 shadow-[0_25px_70px_rgba(0,174,230,0.12)] relative overflow-hidden"
        >
          {/* Subtle Ambient Specular Highlights */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.7),transparent_65%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            
            {/* Left Column: Copy, Features, Rating, Store CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-black uppercase tracking-wider w-fit shadow-xs">
                <Smartphone size={14} />
                Official Clezo Mobile App
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-[1.15]">
                Your Doorstep Laundry Care, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#007ba8]">
                  Now In Your Pocket.
                </span>
              </h2>

              {/* Supporting Subtitle */}
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                Experience live hygiene garment care right from your smartphone. Schedule doorstep pickups in 60 seconds, track individual wash drums in real-time, and get sanitized clothes delivered within 24 hours across Thane &amp; Pune.
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-1">
                {[
                  {
                    title: "60-Second Doorstep Booking",
                    desc: "Schedule pickups with 1 tap from home or office",
                    icon: Clock,
                    color: "text-primary"
                  },
                  {
                    title: "100% Individual Wash Drums",
                    desc: "Zero clothes mixing — dedicated drum sanitization",
                    icon: ShieldCheck,
                    color: "text-emerald-500"
                  },
                  {
                    title: "Live Garment Stage Tracking",
                    desc: "Watch real-time wash, steam press & delivery",
                    icon: Droplets,
                    color: "text-blue-500"
                  },
                  {
                    title: "Complimentary Pickup & Drop",
                    desc: "Zero delivery fees on qualifying laundry orders",
                    icon: CheckCircle2,
                    color: "text-amber-500"
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-xs hover:bg-white/70 transition-colors"
                    >
                      <div className={`p-2 rounded-xl bg-white shadow-xs ${item.color} shrink-0`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800 leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Store Ratings Trust Proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-slate-600 font-bold">
                  4.9 / 5.0 Star Rating across 12,000+ households in Thane &amp; Pune
                </span>
              </div>

              {/* Two Official Store Download Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                
                {/* Google Play Button */}
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#002333] hover:bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-slate-900/15 cursor-pointer group"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.503 1.503 0 01-.61-.926V2.74c0-.36.143-.702.61-.926z" fill="#00C1A6"/>
                    <path d="M17.477 8.316L14.79 11l-1 1 1 1 2.688 2.685 3.037-1.75c.87-.5.87-1.32 0-1.82l-3.038-1.75z" fill="#FFBA00"/>
                    <path d="M3.609 1.814L14.79 11l-1 1-10.18-10.186c.394-.213.847-.213 1.242 0z" fill="#00D2FF"/>
                    <path d="M3.609 22.186L14.79 13l-1-1L3.61 22.186c.394.213.847.213 1.242 0z" fill="#FF3A44"/>
                  </svg>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-300 group-hover:text-white/80 leading-none">
                      Get it on
                    </div>
                    <div className="text-base font-black leading-tight">
                      Google Play
                    </div>
                  </div>
                </a>

                {/* Apple App Store Button */}
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/85 hover:bg-white text-slate-900 border border-slate-200/90 hover:border-primary/40 px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-slate-200/50 cursor-pointer backdrop-blur-md group"
                >
                  <svg className="w-6 h-6 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.58.67-1.08 1.76-.95 2.8.03.02 1.05.08 2.68-1.27z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 leading-none">
                      Download on the
                    </div>
                    <div className="text-base font-black leading-tight">
                      App Store
                    </div>
                  </div>
                </a>

              </div>

            </div>

            {/* Right Column: 3D App UI Mockup Frame with Live App Experience */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-white/20 rounded-[2.5rem] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,35,51,0.25)] overflow-hidden group">
                
                {/* Phone Top Speaker & Dynamic Island */}
                <div className="flex items-center justify-between px-3 mb-3 text-[10px] text-slate-400 font-bold">
                  <span>09:41</span>
                  <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto border border-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Wifi size={11} />
                    <Battery size={11} />
                  </div>
                </div>

                {/* Phone Screen Mockup Content */}
                <div className="bg-[#0f172a] rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3.5">
                  
                  {/* Mock App Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center font-black text-white text-xs shadow-md">
                        C
                      </div>
                      <span className="font-black text-white text-sm">Clezo Express</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stores
                    </span>
                  </div>

                  {/* Scheduled Doorstep Pickup Card */}
                  <div className="bg-primary/10 border border-primary/30 p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/20 px-1.5 py-0.2 rounded">
                        Pickup Confirmed
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">60s Booking</span>
                    </div>
                    <div className="text-xs font-black text-white">Tomorrow • 10:00 AM</div>
                    <div className="text-[10px] text-slate-300">Live Wash, Steam Press &amp; Fold</div>
                  </div>

                  {/* Dedicated Wash Drum Hygiene Pill */}
                  <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-[11px] font-black text-white">Individual Drum Sanitization</div>
                        <div className="text-[9px] text-emerald-400/90 font-medium">100% Isolated • No Mixed Washes</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Order Stage Tracker */}
                  <div className="bg-slate-900/90 border border-white/5 p-2.5 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span>Order #CLZ-9812</span>
                      <span className="text-primary font-bold">In Sanitization Drum</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-emerald-400 h-full w-4/5 rounded-full" />
                    </div>
                  </div>

                  {/* Desktop QR Scanner Chip */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <Download size={11} className="text-primary" />
                        Scan to Install
                      </div>
                      <div className="text-[9px] text-slate-400">Point mobile camera</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg shadow-md group-hover:scale-105 transition-transform">
                      <QrCode size={34} className="text-slate-950" />
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
