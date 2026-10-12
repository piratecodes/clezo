"use client";

import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferSlugTerms({ offer }) {
  const terms = Array.isArray(offer.terms) && offer.terms.length > 0
    ? offer.terms
    : [
        "Valid exclusively for bookings made via the Clezo Mobile App",
        "Applicable on first order across live stores in Thane and Pune",
        "Minimum order cart threshold ₹499",
        "Cannot be combined with other ongoing promotional coupons",
        "Subject to daily machine sanitization capacity limits"
      ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Light Ambient Glare */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/25 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-white/80 shadow-[0_15px_40px_rgba(0,35,51,0.05)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Terms &amp; Conditions For This Offer
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Please review the specific redemption guidelines below before ordering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {terms.map((term, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/50 backdrop-blur-xs border border-white/80 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed shadow-2xs hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{term}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
