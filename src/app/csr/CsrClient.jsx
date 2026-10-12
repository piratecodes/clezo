"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Sparkles, 
  Shirt, 
  PackageCheck, 
  Truck, 
  Users, 
  Leaf, 
  Droplets, 
  ArrowRight, 
  CheckCircle2, 
  Quote, 
  Gift, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export default function CsrClient() {
  const donationSteps = [
    {
      number: "01",
      icon: <Shirt className="text-emerald-500" size={26} />,
      title: "Pack Pre-Loved Apparel",
      desc: "Gather clean, wearable garments from your wardrobe that can bring warmth and dignity to someone in need."
    },
    {
      number: "02",
      icon: <Truck className="text-primary" size={26} />,
      title: "Hand Over At Pickup",
      desc: "Hand your donation bundle to our Clezo express pilot during your regular laundry pickup, or drop it off at any store."
    },
    {
      number: "03",
      icon: <Sparkles className="text-emerald-500" size={26} />,
      title: "Complimentary Sanitization",
      desc: "Clezo plant specialists sort, wash, and steam-sanitize every donated garment completely free of cost."
    },
    {
      number: "04",
      icon: <PackageCheck className="text-primary" size={26} />,
      title: "Distributed With Dignity",
      desc: "Neatly packed and routed to vetted local shelter homes, community centers, and underprivileged families."
    }
  ];

  const pillars = [
    {
      icon: <Gift className="text-emerald-500" size={28} />,
      title: "The 'Give & Share' Drive",
      desc: "Extending garment life cycles through conscious donation, ensuring wearable clothes reach families who truly need them.",
      tag: "Community Care"
    },
    {
      icon: <Users className="text-primary" size={28} />,
      title: "Women Empowerment",
      desc: "Our store operations and care facilities actively train, employ, and promote skilled women professionals across Maharashtra.",
      tag: "Gender Equality"
    },
    {
      icon: <Leaf className="text-emerald-500" size={28} />,
      title: "Toxin-Free Chemistry",
      desc: "We exclusively employ biodegradable, skin-safe, non-toxic detergents and European ozone sanitization to protect people and waterways.",
      tag: "Green Technology"
    },
    {
      icon: <Droplets className="text-primary" size={28} />,
      title: "Water & Energy Stewardship",
      desc: "State-of-the-art live store machinery consumes up to 40% less water and energy compared to conventional commercial laundries.",
      tag: "Eco Conservation"
    }
  ];

  const impactStats = [
    { value: "100%", label: "Free Sanitization", desc: "Every donated piece washed & steam-pressed" },
    { value: "2", label: "Metro Cities", desc: "Thane & Pune stores accepting daily donations" },
    { value: "70%+", label: "Women Workforce", desc: "Trained female fabric professionals" },
    { value: "0", label: "Fabric Landfill Goal", desc: "Wearable garments repurposed with dignity" }
  ];

  return (
    <main className="min-h-screen pb-24 overflow-hidden bg-transparent">
      
      {/* =========================================================
          1. HERO SECTION (Matching Services Hero Ambient Background)
         ========================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-slate-200/50">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-150 h-150 bg-primary/20 rounded-full blur-[100px] mix-blend-multiply"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-36 -right-20 w-130 h-130 bg-emerald-400/20 rounded-full blur-[100px] mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container relative z-10 px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-sm mb-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <HeartHandshake size={16} className="text-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Corporate Social Responsibility</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black text-slate-800 leading-[1.1] tracking-tight mb-6"
            >
              Clothes that Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-secondary drop-shadow-sm">
                Lives that Change.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto mb-8"
            >
              At Clezo, we believe every garment carries value. Through purposeful recycling, ethical workforce employment, and our signature &quot;Give &amp; Share&quot; initiative, we bring warmth and dignity to those in need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
              >
                <HeartHandshake size={18} />
                Donate With Next Order
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 bg-white/80 hover:bg-white text-slate-700 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
              >
                How It Works
                <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. THE "GIVE & SHARE" INITIATIVE (Client Core Copy Card)
         ========================================================= */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="bg-white/70 backdrop-blur-2xl border border-white/90 rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,174,230,0.06)] relative overflow-hidden group hover:shadow-[0_25px_60px_rgba(16,185,129,0.12)] hover:border-emerald-200/60 transition-all duration-500"
          >
            {/* Subtle Glare Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[90px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column: Official Client Text */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-black uppercase tracking-wider w-fit">
                  <Sparkles size={14} className="text-emerald-500" />
                  The &quot;Give &amp; Share&quot; Initiative
                </div>

                <div className="relative">
                  <Quote size={48} className="text-emerald-400/20 absolute -top-6 -left-3 pointer-events-none" />
                  <div className="space-y-4 text-slate-700 text-lg md:text-xl font-medium leading-relaxed relative z-10">
                    <p>
                      At Clezo, we&apos;re not just about premium laundry services; we&apos;re committed to making a positive impact.
                    </p>
                    <p>
                      Join our <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/40">&quot;Give &amp; Share&quot;</span> initiative – donate your old clothes with your laundry order, and we&apos;ll ensure they reach those in need. Together, let&apos;s create a more sustainable and compassionate community.
                    </p>
                    <p className="text-slate-600 font-semibold">
                      Thank you for being a part of our commitment to social responsibility.
                    </p>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg tracking-tight">— Team Clezo</h4>
                    <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Clezo Express Laundry</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Commitments Card */}
              <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-900 text-white p-7 md:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
                
                <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck size={22} className="text-emerald-400" />
                  Our Donation Promise
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  We treat every donated garment with the exact same gold-standard care as our premium clientele orders.
                </p>

                <div className="space-y-3 pt-3">
                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-white">100% Free Steam Sanitization</h5>
                      <p className="text-xs text-slate-400 font-medium">Every garment is washed, disinfected, and ironed before donation.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-white">Zero Extra Trips Required</h5>
                      <p className="text-xs text-slate-400 font-medium">Hand it directly to our pilot when they arrive for your scheduled order.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-white">Direct-to-Community Reach</h5>
                      <p className="text-xs text-slate-400 font-medium">Delivered to vetted local shelter homes, orphanages, and disaster relief.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          3. HOW IT WORKS (4 Step Effortless Flow)
         ========================================================= */}
      <section id="how-it-works" className="py-16 md:py-24 border-y border-slate-200/50 relative bg-white/40">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-3">
              Effortless Participation
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              How the Donation Works
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-base md:text-lg">
              Making a tangible difference doesn&apos;t require extra time or errands. Here is how your clothes reach those in need:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationSteps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/80 backdrop-blur-xl border border-white/90 p-7 rounded-3xl shadow-sm hover:shadow-xl hover:border-emerald-300/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      {step.icon}
                    </div>
                    <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-500/40 transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. PILLARS OF RESPONSIBILITY (4 Core Impact Pillars)
         ========================================================= */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-wider mb-3">
              Holistic Citizenship
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Pillars of Clezo&apos;s Social Impact
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-base md:text-lg">
              Our responsibility goes far beyond laundry baskets into clean operations and human dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      {pillar.tag}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 mt-2 mb-2 group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. IMPACT IN NUMBERS (Milestones)
         ========================================================= */}
      <section className="py-16 md:py-20 border-t border-slate-200/50 bg-gradient-to-b from-white/40 to-emerald-50/20 relative">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white/80 backdrop-blur-xl border border-white/90 p-8 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary mb-2">
                  {stat.value}
                </div>
                <h4 className="text-base font-black text-slate-800 mb-1">{stat.label}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. JOIN THE MOVEMENT (Inspiring Bottom CTA)
         ========================================================= */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-900 via-[#002333] to-slate-900 text-white rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden text-center flex flex-col items-center"
          >
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner border border-white/20">
                <HeartHandshake size={32} className="text-emerald-400" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                Have Clothes to Share? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">
                  Spread Warmth Today.
                </span>
              </h2>

              <p className="text-slate-300 font-medium text-base md:text-lg leading-relaxed mb-8">
                Simply place your pre-loved wearable garments in a separate bag marked &quot;Give &amp; Share&quot; during your next Clezo pickup. We will take care of the rest.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
                >
                  <HeartHandshake size={18} />
                  Book Laundry &amp; Donate
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-white/20 transition-all"
                >
                  <Building2 size={18} />
                  Find Our Live Stores
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
