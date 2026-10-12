"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Sparkles, Clock, Flame, Copy, Check, Smartphone, 
  ArrowRight, ShieldCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlareHover from '@/components/Glarehover';
import { calculateRemainingTime, formatISTDate } from '@/utils/istTime';

export default function OfferSlugHero({ offer }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40, isExpired: false });

  const bannerUrl = typeof offer.bannerImage === 'string' 
    ? offer.bannerImage 
    : (offer.bannerImage?.url || offer.imageUrl || offer.image);
  const bannerAlt = offer.bannerImageAlt || offer.headline || offer.title || "Clezo Offer Banner";
  const claimRatio = Math.min(100, Math.round(((offer.claimedCount || 84) / (offer.maxClaims || 100)) * 100));
  const isPermanent = offer.isLimitedTime === false;

  const playStoreUrl = offer.playStoreUrl || "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo";
  const appStoreUrl = offer.appStoreUrl || "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943";

  // Real-time IST countdown for limited-time offers
  useEffect(() => {
    if (isPermanent) return;

    const updateTime = () => {
      if (offer.endDate) {
        const remaining = calculateRemainingTime(offer.endDate);
        setTimeLeft({
          hours: remaining.days * 24 + remaining.hours,
          minutes: remaining.minutes,
          seconds: remaining.seconds,
          isExpired: remaining.isExpired
        });
      } else {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return { hours: 23, minutes: 59, seconds: 59, isExpired: false };
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [offer.endDate, isPermanent]);

  const handleCopy = () => {
    if (!offer.code) return;
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    toast.success(`Coupon code ${offer.code} copied!`);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden border-b border-slate-200/50">
      
      {/* --- ANIMATED SPOTLIGHT BACKGROUND (Like Services Hero) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[110px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 -left-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 right-1/3 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[120px] mix-blend-multiply"
        />

        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Luxury Showcase Frame with GlareHover + Sweeping Glow + Auto-Zoom Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-5"
          >
            {/* The sweeping background color blast (from blog slug) */}
            <div className="relative group">
              <div className="absolute -inset-4 md:-inset-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/35 via-emerald-500/20 to-transparent blur-[60px] rounded-[3rem] -z-10 animate-pulse pointer-events-none" />

              {/* GlareHover with Auto-Zoom on Hover */}
              <GlareHover
                glareColor="#00aee6"
                glareOpacity={0.45}
                glareAngle={-30}
                glareSize={400}
                transitionDuration={800}
                playOnce={false}
                className="group w-full aspect-[16/10] sm:aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/80 bg-white/20 backdrop-blur-md relative cursor-pointer"
              >
                {bannerUrl ? (
                  <Image
                    src={bannerUrl}
                    alt={bannerAlt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                    className="object-cover object-center group-hover:scale-105 hover:scale-105 transition transform duration-[2s] ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#002236] via-[#001724] to-[#002f4d] flex items-center justify-center p-8 text-center w-full h-full">
                    <div className="space-y-2">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                        {offer.discount || 'Special Offer'}
                      </span>
                      <p className="text-white text-base font-bold">{offer.title}</p>
                    </div>
                  </div>
                )}

                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 text-slate-900 shadow-lg backdrop-blur-md border border-white/40">
                    {offer.badge || (isPermanent ? 'Evergreen Offer' : 'Limited Time Deal')}
                  </span>
                </div>

                {offer.discount && (
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <span className="px-4 py-1.5 rounded-xl text-sm font-black bg-primary text-white shadow-xl">
                      {offer.discount}
                    </span>
                  </div>
                )}

                {/* Bottom Shadow Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-10" />

                {/* Caption Banner */}
                <div className="absolute bottom-5 left-5 right-5 text-white z-20 pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                    <ShieldCheck size={15} />
                    <span>Verified Clezo App Campaign</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200 line-clamp-1 drop-shadow-sm">
                    Doorstep Live Hygiene Garment Care in Thane &amp; Pune
                  </p>
                </div>
              </GlareHover>
            </div>

            {/* Scarcity Progress Bar or Permanent Evergreen Notice */}
            {isPermanent ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-50/50 backdrop-blur-xl border border-emerald-200/80 p-5 rounded-3xl space-y-1.5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                  <Sparkles size={16} className="text-emerald-500" />
                  <span>Permanent / Lifetime Offer</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                  This welcome discount is available anytime for eligible users on the Clezo Mobile App. No daily quota expiration applies.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/25 backdrop-blur-xl p-5 rounded-3xl border border-white/80 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Flame size={16} className="text-amber-500 animate-pulse" />
                    <span>Daily Machine Slots:</span>
                  </span>
                  <span className="text-emerald-600 font-extrabold">
                    {offer.claimedCount || 84} of {offer.maxClaims || 100} Claimed
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all duration-1000"
                    style={{ width: `${claimRatio}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                  <span>Hurry! {(offer.maxClaims || 100) - (offer.claimedCount || 84)} slots remaining for today</span>
                  {offer.endDate && <span>Expiry: {formatISTDate(offer.endDate, false)}</span>}
                </div>
              </motion.div>
            )}

          </motion.div>

          {/* RIGHT COLUMN: Headline, Real-Time Countdown / Lifetime Badge, Coupon Box & App CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Badge with Shimmer Sweep */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary shadow-xs mb-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <Sparkles size={14} className="animate-pulse text-primary" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {offer.badge || 'Verified Promotion'}
                </span>
              </motion.div>

              {/* H1 Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.15] mb-4"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
                  {offer.headline || offer.title}
                </span>
              </motion.h1>

              {/* Description */}
              {offer.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="text-slate-600 text-sm md:text-base font-medium leading-relaxed mb-6"
                >
                  {offer.description}
                </motion.p>
              )}

              {/* Countdown Timer (IST) OR Evergreen Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {isPermanent ? (
                  <div className="bg-gradient-to-r from-[#001f33] to-[#002f4d] text-white p-5 rounded-3xl border border-white/10 shadow-lg space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Sparkles size={14} />
                      <span>Always Active Welcome Deal</span>
                    </div>
                    <p className="text-sm text-slate-200 font-semibold leading-relaxed">
                      Redeemable on your first app booking anytime across all live stores in Thane &amp; Pune.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#001c2e]/90 backdrop-blur-xl text-white p-5 rounded-3xl border border-white/15 shadow-xl space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} className="text-amber-400 animate-spin-slow" />
                        Deal Expires In (IST):
                      </span>
                      <span className="text-[10px] bg-white/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        Live Deal
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center font-mono font-black">
                      <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                        <div className="text-xl sm:text-2xl text-amber-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hours</div>
                      </div>
                      <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                        <div className="text-xl sm:text-2xl text-amber-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mins</div>
                      </div>
                      <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                        <div className="text-xl sm:text-2xl text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secs</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Coupon Box */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {offer.showCouponCode !== false && offer.code ? (
                  <div className="border-2 border-dashed border-primary/40 bg-white/30 backdrop-blur-xl rounded-3xl p-5 flex items-center justify-between gap-4 mb-6 shadow-sm">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/80">Promo Coupon Code</div>
                      <div className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                        {offer.code}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Enter code during checkout on Clezo App
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                        copied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary hover:bg-primary-fixed-variant text-white hover:scale-105 active:scale-95'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={15} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={15} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="border border-emerald-500/20 bg-emerald-50/50 backdrop-blur-xl rounded-3xl p-5 flex items-center justify-between gap-3 mb-6 shadow-sm">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">App Exclusive Promo</div>
                      <div className="text-sm font-bold text-slate-800">Auto-applied in Clezo App</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">No coupon code entry required</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                      Auto-Applied
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Official Store Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-3"
              >
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-fixed-variant text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_25px_rgba(0,174,230,0.35)] hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <Smartphone size={18} />
                  <span>Download on Google Play &amp; Claim</span>
                  <ArrowRight size={16} />
                </a>

                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#001f33] hover:bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>Download on Apple App Store</span>
                </a>
              </motion.div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
