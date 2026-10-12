"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, PhoneCall, Calendar } from 'lucide-react';

export default function OfferCtaSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-[#002333] via-[#003852] to-[#002333] text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-3xl flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles size={13} className="text-primary" />
          Zero Hassle • 100% Live Hygiene Guarantee
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Experience Laundry Care You Can Trust. Claim Your Discount Today!
        </h2>

        <p className="text-slate-300 text-sm md:text-base font-medium mb-8 leading-relaxed max-w-2xl">
          Say goodbye to mixed drum washes and harsh chemicals. Book your doorstep pickup in Thane &amp; Pune and get clothes delivered sanitized and fresh within 24 hours.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#playstore-download"
            className="flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-8 py-4 rounded-full text-sm font-black uppercase tracking-wider transition-all shadow-[0_10px_30px_rgba(0,174,230,0.4)] hover:scale-105 cursor-pointer"
          >
            <span>Download &amp; Claim Offer</span>
            <ArrowRight size={16} />
          </a>

          <Link
            href="/contact"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-4 rounded-full text-sm font-bold transition-all backdrop-blur-md"
          >
            <PhoneCall size={16} className="text-emerald-400" />
            <span>Speak With Support</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
