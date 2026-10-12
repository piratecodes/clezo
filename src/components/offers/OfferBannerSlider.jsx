"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { motion } from 'framer-motion';
import { 
  Tag, Sparkles, ArrowRight, Smartphone, ShieldCheck, 
  Copy, Check, Flame, Clock 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OfferBannerSlider({ offers = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const splideRef = useRef(null);

  // Sort active offers by most recently updated
  const activeOffers = [...offers].filter(o => o.isActive).sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Only display offers marked as featured/spotlight in banner slider; fallback to active if none marked
  const featuredOffers = activeOffers.filter(o => o.isFeatured);
  const bannerOffers = featuredOffers.length > 0 
    ? featuredOffers 
    : activeOffers.slice(0, 3);

  if (bannerOffers.length === 0) return null;

  const splideOptions = {
    type: 'fade',
    rewind: true,
    autoplay: true,
    interval: 6000,
    pauseOnHover: true,
    arrows: false,
    pagination: true,
    speed: 900,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="w-full relative overflow-hidden bg-[#001422] border-b border-white/10">
      
      {/* Dynamic Ambient Glow Orbs behind slider */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 right-1/4 w-[450px] h-[450px] bg-emerald-500/20 rounded-full blur-[120px]"
        />
      </div>

      <Splide 
        ref={splideRef}
        options={splideOptions} 
        onMove={(splide, index) => setActiveIndex(index)}
        className="offers-splide w-full relative z-10" 
        aria-label="Clezo Hero Banner Slider"
      >
        {bannerOffers.map((offer, idx) => {
          const bannerUrl = typeof offer.bannerImage === 'string' 
            ? offer.bannerImage 
            : (offer.bannerImage?.url || offer.imageUrl || offer.image);
          const bannerAlt = offer.bannerImageAlt || offer.title;
          const isActive = activeIndex === idx;
          const isCopied = copiedCode === offer.code;
          const isPermanent = offer.isLimitedTime === false;
          const claimRatio = Math.min(100, Math.round(((offer.claimedCount || 82) / (offer.maxClaims || 100)) * 100));

          return (
            <SplideSlide key={offer.id || offer.slug || idx}>
              <div className="relative w-full min-h-[480px] sm:min-h-[540px] md:min-h-[600px] lg:min-h-[660px] flex items-center pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20 sm:pb-24 overflow-hidden">
                
                {/* Background Banner Image with Ken Burns Zoom Effect */}
                {bannerUrl ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                    <Image
                      src={bannerUrl}
                      alt={bannerAlt}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                      className={`object-cover object-center transform transition-transform duration-[6500ms] ease-out ${
                        isActive ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {/* Modern Gradient Overlays for Readability Under Transparent Navbar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#001422]/95 via-[#001c2e]/85 to-transparent md:w-3/4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001422] via-transparent to-[#001422]/70" />
                  </div>
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#001a2c] via-[#002236] to-[#002e47] pointer-events-none">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px]" />
                  </div>
                )}

                {/* Banner Content Container (Edge space for mobile, container without mx-auto) */}
                <div className="container px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* LEFT COLUMN: Animated Headlines & CTAs */}
                    <div className="lg:col-span-7 text-white flex flex-col justify-center space-y-5">
                      
                      {/* Badges with Staggered Entrance */}
                      <motion.div 
                        initial={{ opacity: 0, y: -15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex flex-wrap items-center gap-2.5"
                      >
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-primary/25 text-primary border border-primary/40 backdrop-blur-md shadow-sm">
                          <Sparkles size={13} className="text-primary animate-pulse" />
                          {offer.badge || (isPermanent ? 'Evergreen Offer' : 'Limited Time Deal')}
                        </span>

                        {offer.discount && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-sm">
                            <Tag size={12} className="text-emerald-400" />
                            {offer.discount}
                          </span>
                        )}
                      </motion.div>

                      {/* Headline / Title with Staggered Entrance */}
                      <motion.h1 
                        initial={{ opacity: 0, y: 25 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white tracking-tight leading-[1.12] drop-shadow-md"
                      >
                        {offer.headline || offer.title}
                      </motion.h1>

                      {/* Teaser Description from Backend */}
                      {offer.description && (
                        <motion.p 
                          initial={{ opacity: 0, y: 15 }}
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                          transition={{ duration: 0.5, delay: 0.35 }}
                          className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 max-w-xl font-medium"
                        >
                          {offer.description}
                        </motion.p>
                      )}

                      {/* CTAs with Staggered Spring Entrance */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="flex flex-wrap items-center gap-3.5 pt-2"
                      >
                        <Link
                          href={`/offers/${offer.slug}`}
                          className="flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-[0_10px_25px_rgba(0,174,230,0.4)] hover:scale-105 active:scale-95"
                        >
                          <span>View Deal Details</span>
                          <ArrowRight size={16} />
                        </Link>

                        <a
                          href="#playstore-download"
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all backdrop-blur-md active:scale-95"
                        >
                          <Smartphone size={16} className="text-emerald-400" />
                          <span>Get App to Redeem</span>
                        </a>
                      </motion.div>

                      {/* Universal Subtext */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.55 }}
                        className="flex items-center gap-2 pt-2 text-[11px] sm:text-xs text-slate-400 font-medium"
                      >
                        <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                        <span>Doorstep hygiene pickup &amp; delivery via Clezo Mobile App</span>
                      </motion.div>

                    </div>

                    {/* RIGHT COLUMN: Floating Glassmorphic Voucher Ticket (Desktop Luxury Showcase) */}
                    <div className="lg:col-span-5 hidden lg:flex justify-end">
                      <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={isActive ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.95 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-sm relative"
                      >
                        {/* Sweeping ambient background glow behind card */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-emerald-500/25 blur-2xl rounded-3xl opacity-60 pointer-events-none" />

                        {/* Frosted Voucher Ticket Container */}
                        <div className="relative bg-white/10 hover:bg-white/15 rounded-3xl border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,20,34,0.6)] overflow-hidden">
                          
                          {/* Cutout notches for ticket illusion */}
                          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#001422] border-r border-white/20 pointer-events-none" />
                          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#001422] border-l border-white/20 pointer-events-none" />

                          {/* Header of voucher */}
                          <div className="flex items-center justify-between pb-4 border-b border-dashed border-white/20 mb-5">
                            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                              <Sparkles size={14} />
                              <span>Verified Campaign</span>
                            </div>
                            {offer.discount && (
                              <span className="px-3 py-1 rounded-xl bg-primary text-white text-xs font-black shadow-md">
                                {offer.discount}
                              </span>
                            )}
                          </div>

                          {/* Middle: Promo Code Box */}
                          {offer.showCouponCode !== false && offer.code ? (
                            <div className="border border-white/15 bg-black/25 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3 shadow-inner">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Coupon Code</span>
                                <div className="font-mono text-xl font-black text-white tracking-wider">
                                  {offer.code}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(offer.code)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                                  isCopied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-primary hover:bg-primary-fixed-variant text-white hover:scale-105 active:scale-95'
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <Check size={13} /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy size={13} /> Copy
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="border border-emerald-500/20 bg-emerald-500/10 rounded-2xl p-4 mb-4 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">App Exclusive</span>
                                <div className="text-xs font-bold text-white">Auto-applied in Clezo App</div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-400 bg-white/10 px-2.5 py-1 rounded-lg">
                                Auto Active
                              </span>
                            </div>
                          )}

                          {/* Scarcity meter */}
                          {!isPermanent ? (
                            <div className="space-y-1.5 mb-5 bg-white/5 p-3 rounded-2xl border border-white/10">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300 font-bold flex items-center gap-1 text-[11px]">
                                  <Flame size={13} className="text-amber-400" /> Daily Machine Capacity:
                                </span>
                                <span className="text-emerald-400 font-extrabold text-xs">
                                  {offer.claimedCount || 82}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-400 to-primary rounded-full transition-all duration-1000"
                                  style={{ width: `${claimRatio}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="mb-5 bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                              <Sparkles size={14} className="text-emerald-400 shrink-0" />
                              <span>Evergreen welcome deal — no expiration</span>
                            </div>
                          )}

                          {/* Action Link inside ticket */}
                          <Link
                            href={`/offers/${offer.slug}`}
                            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/20 hover:scale-[1.02]"
                          >
                            <span>Explore Deal Terms</span>
                            <ArrowRight size={14} />
                          </Link>

                        </div>
                      </motion.div>
                    </div>

                  </div>
                </div>

              </div>
            </SplideSlide>
          );
        })}
      </Splide>

      {/* Slide Auto-Play Cadence Indicator Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20 pointer-events-none">
        <motion.div
          key={activeIndex}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(0,174,230,0.9)]"
        />
      </div>

    </section>
  );
}
