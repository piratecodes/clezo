"use client";

import React from 'react';
import { ShieldCheck, Droplets, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferSlugBody({ offer }) {
  const bodyText = offer.bodyText;

  const guaranteeItems = [
    {
      title: "Individual Machine Drums",
      desc: "Zero clothes mixing. Your garments are sanitized in dedicated individual cycles.",
      icon: ShieldCheck
    },
    {
      title: "German Eco-Friendly Solvents",
      desc: "Preserves delicate fabric fibers, protects colors, and leaves zero chemical odor.",
      icon: Droplets
    },
    {
      title: "24-Hour Express Turnaround",
      desc: "Wash, steam press, and airtight packing delivered back within 24 business hours.",
      icon: Clock
    },
    {
      title: "Live Video Feed & Hygiene Audit",
      desc: "Watch our transparent, certified clean wash room in Thane and Pune.",
      icon: Sparkles
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Light Ambient Glare */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Body Text */}
        {bodyText ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 bg-white/25 hover:bg-white/35 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-white/80 shadow-[0_15px_40px_rgba(0,35,51,0.05)] transition-all"
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/20">
                Offer Details &amp; Story
              </div>
            </div>
            <div 
              className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-slate-900 prose-ul:text-slate-600"
              dangerouslySetInnerHTML={{ __html: bodyText }}
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 bg-white/25 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-white/80 shadow-[0_15px_40px_rgba(0,35,51,0.05)]"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
              Premium Hygiene Laundry Delivered to Your Doorstep
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              At Clezo, we believe laundry shouldn&apos;t be a compromise on personal health or clothing longevity. Traditional laundry services bundle clothes from multiple households together, leading to cross-contamination, fiber wear, and dull fabrics. With this exclusive promotional offer, experience medical-grade drum isolation and eco-conscious care at an unbeatable discount.
            </p>
          </motion.div>
        )}

        {/* 4-Pillar Hygiene Guarantee Cards */}
        <div className="pt-4">
          <div className="text-center mb-10 flex flex-col items-center">
            <motion.h3 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-black text-slate-900"
            >
              The Clezo 4-Pillar Hygiene Guarantee
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-500 font-medium mt-1"
            >
              Included with every promotional order at zero extra charge.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guaranteeItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white/25 backdrop-blur-xl p-5 rounded-2xl border border-white/80 hover:border-primary/40 hover:-translate-y-1 transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
