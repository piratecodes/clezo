"use client";

import React from 'react';
import { 
  Smartphone, Download, QrCode, Star, Sparkles, 
  CheckCircle2, Clock, Zap, Gift, ShieldCheck, ArrowRight,
  Wifi, Battery, Bell, Calendar, Truck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferAppBannerCard({ offers = [] }) {
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo";
  const appStoreUrl = "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943";

  // Filter ONLY real, active offers from database — NEVER fabricate fake deals
  const activeOffers = Array.isArray(offers) ? offers.filter(o => o.isActive) : [];
  const permanentDeal = activeOffers.find(o => o.isLimitedTime === false);
  const flashDeal = activeOffers.find(o => o.isLimitedTime === true);

  const hasPermanent = Boolean(permanentDeal);
  const hasFlash = Boolean(flashDeal);
  const hasAnyDeal = hasPermanent || hasFlash;

  // Dynamic headings & copy based strictly on active promotions
  let badgeText = "Smart Garment Care";
  let headingText = "Experience Seamless Live Hygiene Laundry on the Clezo App";
  let descriptionText = "Schedule doorstep pickups in 60 seconds, track individual wash cycles in real-time, and enjoy transparent pricing with zero delivery fees across Thane and Pune.";

  if (hasPermanent && hasFlash) {
    badgeText = "App-Exclusive Promotions";
    headingText = "Claim Welcome Deals & Live Flash Specials on the Clezo App";
    descriptionText = "Redeem your welcome discount and catch limited-time machine capacity specials directly inside the Clezo mobile app. Schedule pickups in 60 seconds with live drum tracking.";
  } else if (hasPermanent) {
    badgeText = "App-Exclusive Welcome Perk";
    headingText = `Unlock ${permanentDeal.discount || 'Your Welcome Discount'} on the Clezo Mobile App`;
    descriptionText = `Redeem coupon ${permanentDeal.code} directly inside the Clezo mobile app. Schedule pickups in 60 seconds and enjoy 100% individual wash drum hygiene.`;
  } else if (hasFlash) {
    badgeText = "Live Flash Promotion";
    headingText = `Claim ${flashDeal.discount || 'Exclusive Flash Deals'} on the Clezo Mobile App`;
    descriptionText = `Catch coupon ${flashDeal.code} before daily machine capacity slots fill up. Schedule doorstep pickups in 60 seconds with real-time order tracking.`;
  }

  return (
    <section id="playstore-download" className="py-16 md:py-24 relative overflow-hidden">
      {/* Light Ambient Spotlights behind section */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#001f33] via-slate-900 to-[#001724] text-white rounded-3xl md:rounded-[3rem] p-8 sm:p-12 md:p-16 border border-white/10 shadow-[0_30px_80px_rgba(0,35,51,0.4)] relative overflow-hidden"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Feature / Deal Pillars & Store Download CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider w-fit">
                <Sparkles size={14} />
                {badgeText}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {headingText}
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                {descriptionText}
              </p>

              {/* Two Feature / Promotion Pillars (Only shows deals if they ACTUALLY exist) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                
                {/* Pillar 1: Permanent Deal OR Individual Hygiene Guarantee */}
                {hasPermanent ? (
                  <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                        <Gift size={11} />
                        Welcome Deal
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">Zero Expiry</span>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2">
                      {permanentDeal.discount ? `${permanentDeal.discount} (${permanentDeal.code})` : permanentDeal.title}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{permanentDeal.title}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span>Auto-applied in cart on app booking</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-wider">
                        <ShieldCheck size={11} />
                        Live Hygiene
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">100% Isolated</span>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2">
                      Dedicated Wash Drums
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-primary shrink-0" />
                        <span>Zero clothes mixing with others</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-primary shrink-0" />
                        <span>Eco-friendly German sanitizing solvents</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Pillar 2: Flash Deal OR Express Turnaround */}
                {hasFlash ? (
                  <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                        <Zap size={11} />
                        Flash Special
                      </span>
                      <span className="text-[11px] font-bold text-amber-300">Limited Capacity</span>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2">
                      {flashDeal.discount ? `${flashDeal.discount} (${flashDeal.code})` : flashDeal.title}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{flashDeal.title}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                        <span>Push alerts before daily slots fill up</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                        <Truck size={11} />
                        Doorstep Delivery
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">24hr Turnaround</span>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2">
                      Prompt Doorstep Service
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span>Zero delivery fees on qualifying orders</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span>Live real-time garment status tracking</span>
                      </li>
                    </ul>
                  </div>
                )}

              </div>

              {/* Rating Proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-bold">
                  4.9 / 5.0 Star Rating across 12,000+ households in Thane &amp; Pune
                </span>
              </div>

              {/* Official Store Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Google Play */}
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-lg cursor-pointer"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.503 1.503 0 01-.61-.926V2.74c0-.36.143-.702.61-.926z" fill="#00C1A6"/>
                    <path d="M17.477 8.316L14.79 11l-1 1 1 1 2.688 2.685 3.037-1.75c.87-.5.87-1.32 0-1.82l-3.038-1.75z" fill="#FFBA00"/>
                    <path d="M3.609 1.814L14.79 11l-1 1-10.18-10.186c.394-.213.847-.213 1.242 0z" fill="#00D2FF"/>
                    <path d="M3.609 22.186L14.79 13l-1-1L3.61 22.186c.394.213.847.213 1.242 0z" fill="#FF3A44"/>
                  </svg>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 leading-none">Get it on</div>
                    <div className="text-base font-black leading-tight">Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.58.67-1.08 1.76-.95 2.8.03.02 1.05.08 2.68-1.27z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Download on the</div>
                    <div className="text-base font-black leading-tight">App Store</div>
                  </div>
                </a>
              </div>

            </div>

            {/* Right Column: 3D App UI Frame with verified live deals or real app booking view */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-white/20 rounded-[2.5rem] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden group">
                
                {/* Phone Top Speaker & Dynamic Island */}
                <div className="flex items-center justify-between px-3 mb-3 text-[10px] text-slate-400 font-bold">
                  <span>09:41</span>
                  <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto border border-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Wifi size={11} />
                    <Battery size={11} />
                  </div>
                </div>

                {/* Phone Screen Mockup */}
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

                  {/* Deals in cart (rendered ONLY if verified active in database) */}
                  {hasAnyDeal ? (
                    <div className="space-y-2.5">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Active App Promotions
                      </div>

                      {/* Real Permanent Deal Card */}
                      {hasPermanent && (
                        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                                ♾️ Lifetime Deal
                              </span>
                              <span className="text-[10px] text-slate-400">Auto-Applied</span>
                            </div>
                            <div className="text-xs font-black text-white mt-1">
                              {permanentDeal.code} • {permanentDeal.discount}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-bold truncate max-w-[190px]">
                              {permanentDeal.title}
                            </div>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckCircle2 size={14} />
                          </div>
                        </div>
                      )}

                      {/* Real Limited-Time Flash Deal Card */}
                      {hasFlash && (
                        <div className="bg-gradient-to-r from-primary/15 to-slate-900 border border-primary/35 p-3 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/20 px-1.5 py-0.2 rounded">
                              ⚡ Flash Deal
                            </span>
                            <span className="text-[10px] font-black text-amber-300 flex items-center gap-1">
                              <Clock size={10} />
                              Active Quota
                            </span>
                          </div>
                          <div className="text-xs font-black text-white mt-1">
                            {flashDeal.code} • {flashDeal.discount}
                          </div>
                          <div className="text-[10px] text-slate-300 truncate max-w-[210px] mt-0.5 font-medium">
                            {flashDeal.title}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* When NO deals are active, show real Pickup Booking status */
                    <div className="space-y-2.5">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Doorstep Service
                      </div>
                      <div className="bg-primary/10 border border-primary/30 p-3 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/20 px-1.5 py-0.2 rounded">
                            Pickup Scheduled
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">Confirmed</span>
                        </div>
                        <div className="text-xs font-black text-white">Tomorrow • 10:00 AM</div>
                        <div className="text-[10px] text-slate-300">Eco Wash, Steam Iron &amp; Fold</div>
                      </div>
                    </div>
                  )}

                  {/* Real Live Laundry Tracking Bar */}
                  <div className="bg-slate-900/80 border border-white/5 p-2.5 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span>Order #CLZ-9812</span>
                      <span className="text-primary font-bold">In Sanitization Drum</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-emerald-400 h-full w-3/4 rounded-full" />
                    </div>
                  </div>

                  {/* QR Code Quick Desktop Scan */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <Download size={11} className="text-primary" />
                        Scan to Install
                      </div>
                      <div className="text-[9px] text-slate-400">Android &amp; iOS auto-redirect</div>
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
