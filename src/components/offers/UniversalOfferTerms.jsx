"use client";

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UniversalOfferTerms() {
  const universalTerms = [
    {
      title: "One Coupon Per Order",
      desc: "Promotional coupon codes cannot be stacked or clubbed with other ongoing offers, store credits, or loyalty tier discounts."
    },
    {
      title: "Minimum Order Thresholds",
      desc: "Certain offers (e.g., Flat 30% Off or ₹150 Flat Off) require a minimum net cart value (typically ₹499) before discounts are applied."
    },
    {
      title: "Mobile App Exclusivity",
      desc: "Most seasonal codes are redeemable exclusively on the official Clezo Mobile App (Android & iOS) to verify customer phone numbers."
    },
    {
      title: "Geographic Service Coverage",
      desc: "Offers are valid across all live serviced neighborhoods in Thane and Pune. Deliveries outside live cluster radius may incur standard zone rates."
    },
    {
      title: "No Cash Equivalency",
      desc: "Discount values, promotional credits, and coupons are non-transferable and cannot be exchanged for cash, cheques, or refund balances."
    },
    {
      title: "Validity & Daily Quota",
      desc: "Offers are subject to daily machine capacity slots and can be modified or paused once daily quota is reached to maintain live wash hygiene."
    }
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Light Ambient Glare / Spotlight */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-black uppercase tracking-wider mb-3 border border-white/60 backdrop-blur-xs"
          >
            <ShieldCheck size={14} className="text-primary" />
            General Promotion Policy
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight"
          >
            Universal Offer Terms &amp; Conditions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium text-sm md:text-base mt-2"
          >
            The following standard policy applies across all promotional coupons, festive deals, and app-exclusive vouchers at Clezo.
          </motion.p>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universalTerms.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white/25 hover:bg-white/35 backdrop-blur-xl p-6 rounded-2xl border border-white/80 shadow-xs hover:border-primary/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
