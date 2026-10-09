"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsConditionsPage() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['service', 'delivery', 'payment', 'general'];
      const scrollPosition = window.scrollY + 250; // Offset for sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 relative bg-slate-50" role="main">
      {/* Background Magic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 relative z-10 mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase">
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Conditions</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Operational guidelines, garment care policies, and service agreements for Clezo Express Laundry.
          </p>
          <p className="text-sm text-slate-400 mt-6 font-bold tracking-widest uppercase">Effective Date: March 2026</p>
        </div>

        {/* Layout: Sticky Sidebar + Content Box */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block w-1/4 sticky top-32 shrink-0">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white">
              <h4 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Table of Contents
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><Link href="#service" className={`transition-colors block ${activeId === 'service' ? 'text-primary font-black' : 'hover:text-primary'}`}>1. Service</Link></li>
                <li><Link href="#delivery" className={`transition-colors block ${activeId === 'delivery' ? 'text-primary font-black' : 'hover:text-primary'}`}>2. Delivery</Link></li>
                <li><Link href="#payment" className={`transition-colors block ${activeId === 'payment' ? 'text-primary font-black' : 'hover:text-primary'}`}>3. Payment</Link></li>
                <li><Link href="#general" className={`transition-colors block ${activeId === 'general' ? 'text-primary font-black' : 'hover:text-primary'}`}>4. General</Link></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Box */}
          <section className="w-full lg:w-3/4 bg-white/70 backdrop-blur-2xl p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white">
            <div className="space-y-16 text-slate-600 leading-relaxed text-lg font-medium">
              
              {/* SECTION 1: Service */}
              <div id="service" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">1</span>
                  Service
                </h2>
                <div className="pl-14 space-y-6">
                  <p>
                    While Clezo strives to provide the best professional cleaning services; All articles are accepted at the customer's risk. Clezo will not be liable for damage arising during the cleaning process.
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>Clezo accepts no responsibility for colour bleeding during Dry Cleaning, Wet cleaning or Laundry process.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>We cannot guarantee that damage if any can be identified at the time garments drop off at our store or picked up from home. We examine each garment at our factory once we receive them and inform the customer of any damage if identified. However, we don't guarantee that every damage will be identified before processing.</p>
                    </li>
                    <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-secondary font-bold shrink-0 text-xl mt-0.5">✦</span>
                      <p>Any damage must be brought to notice within 24 hours of receipt of the garment.</p>
                    </li>
                    <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-secondary font-bold shrink-0 text-xl mt-0.5">✦</span>
                      <p>In case of misplacement or damage in process or damage due to any other causes of the garment, a maximum liability will be 5 times the cost of processing that garment.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>Clezo will not be responsible for loss or damage due to natural calamities and Fire.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>Clezo shall not be held responsible whatsoever for garments not collected within 30 days of the delivery date. We will do our best to contact the customer of such garments.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>Clezo shall not be held responsible for loss or damage of any personal effects left in garments or bags handed in for cleaning like money, jewellery or any such valuables.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>Clezo is proud of our professional expertise and we will do our best to remove stains. However, there is no guarantee for stain removal.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0 text-xl">•</span>
                      <p>Cleaning charges apply in case stains cannot be removed despite our best efforts.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION 2: Delivery */}
              <div id="delivery" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl shrink-0">2</span>
                  Delivery
                </h2>
                <div className="pl-14">
                  <ul className="grid gap-4">
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold shrink-0 text-xl">•</span>
                      <p>Regular Cleaning service delivery is within 3 working days.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold shrink-0 text-xl">•</span>
                      <p>Urgent delivery (extra charges applicable) is by the next day evening 7 pm.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold shrink-0 text-xl">•</span>
                      <p>Public Holidays or Company annual holiday/ training days are not counted while arriving at the delivery date.</p>
                    </li>
                    <li className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mt-4">
                      <span className="text-3xl shrink-0">🚚</span>
                      <p className="text-sm font-bold text-emerald-800 self-center">
                        Minimum billing of Rs. 500 is required for free home pickup and delivery.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION 3: Payment */}
              <div id="payment" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl shrink-0">3</span>
                  Payment
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    All customer bills are in the name of Clezo India Private Limited. We accept payment by cash or online link sent via SMS for home-delivered orders, and for walk-in customers by cash, card, or online.
                  </p>
                  
                  <ul className="space-y-4 mt-6">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold shrink-0 text-xl">•</span>
                      <p>The facilitation fee for the use of a Credit Card or digital card payment gateway is 2% + GST wherever applicable and will be borne by customers.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold shrink-0 text-xl">•</span>
                      <p>All home picked-up orders will be billed at the store and a bill sent to the customer via e-mail or WhatsApp.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold shrink-0 text-xl">•</span>
                      <p>Prices are subject to change without prior notice.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION 4: General */}
              <div id="general" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">4</span>
                  General
                </h2>
                <div className="pl-14">
                  <ul className="grid gap-4">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 font-bold shrink-0 text-xl">•</span>
                      <p>Terms and conditions are subject to change without prior notice.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 font-bold shrink-0 text-xl">•</span>
                      <p>No employee or agent of Clezo has the authority to alter these terms and conditions in any manner whatsoever.</p>
                    </li>
                    <li className="flex items-start gap-3 bg-primary/5 p-6 rounded-2xl border border-primary/10 mt-4">
                      <span className="text-xl shrink-0 mt-1">⚖️</span>
                      <p className="font-bold text-slate-800">
                        The terms and conditions on this site are subject to the Indian Laws and Jurisdiction of Mumbai Courts only.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}