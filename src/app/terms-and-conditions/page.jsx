"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsConditionsPage() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['acceptance', 'service-scope', 'pricing', 'client-duties', 'garment-care', 'payment-terms', 'governing-law'];
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
                <li><Link href="#acceptance" className={`transition-colors block ${activeId === 'acceptance' ? 'text-primary font-black' : 'hover:text-primary'}`}>1. Acceptance of Terms</Link></li>
                <li><Link href="#service-scope" className={`transition-colors block ${activeId === 'service-scope' ? 'text-primary font-black' : 'hover:text-primary'}`}>2. Service Scope</Link></li>
                <li><Link href="#pricing" className={`transition-colors block ${activeId === 'pricing' ? 'text-primary font-black' : 'hover:text-primary'}`}>3. Quotations & Pricing</Link></li>
                <li><Link href="#client-duties" className={`transition-colors block ${activeId === 'client-duties' ? 'text-primary font-black' : 'hover:text-primary'}`}>4. Client Responsibilities</Link></li>
                <li><Link href="#garment-care" className={`transition-colors block ${activeId === 'garment-care' ? 'text-primary font-black' : 'hover:text-primary'}`}>5. Garment Care & Liability</Link></li>
                <li><Link href="#payment-terms" className={`transition-colors block ${activeId === 'payment-terms' ? 'text-primary font-black' : 'hover:text-primary'}`}>6. Payment Terms & Billing</Link></li>
                <li><Link href="#governing-law" className={`transition-colors block ${activeId === 'governing-law' ? 'text-primary font-black' : 'hover:text-primary'}`}>7. Governing Law</Link></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Box */}
          <section className="w-full lg:w-3/4 bg-white/70 backdrop-blur-2xl p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white">
            <div className="space-y-16 text-slate-600 leading-relaxed text-lg font-medium">
              
              {/* SECTION 1 */}
              <div id="acceptance" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">1</span>
                  Acceptance of Terms
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    Welcome to <strong className="text-slate-800">Clezo Express Laundry</strong>. By accessing our website, booking a service, or entrusting us with your garments, you agree to comply with and be bound by the following Terms and Conditions. 
                  </p>
                  <p>
                    These terms govern both your use of our digital platforms and the physical execution of our laundry and dry-cleaning services. Please review them carefully to ensure a seamless and pristine experience.
                  </p>
                </div>
              </div>

              {/* SECTION 2 */}
              <div id="service-scope" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl">2</span>
                  Service Scope
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    Clezo Express Laundry provides comprehensive garment care, including washing, dry cleaning, ironing, stain removal, and shoe care. We are deeply committed to conducting our operations with the utmost respect for your wardrobe and the environment.
                  </p>
                  <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mt-6">
                    <span className="text-3xl">🌿</span>
                    <p className="text-sm font-bold text-emerald-800">
                      Eco-Friendly Initiative: We use premium, environmentally safe solvents that protect both your delicate fabrics and the planet's waterways.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3 */}
              <div id="pricing" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">3</span>
                  Quotations & Pricing
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    All initial estimates provided via our website or app are preliminary. Final pricing is established once your garments arrive at our facility and are physically inspected by our fabric experts. 
                  </p>
                  <p>
                    Please note that heavily soiled items, delicate fabrics (like silk or leather), and garments requiring extensive stain treatments may incur specialized care charges. We will always notify you of any price adjustments before proceeding with the cleaning.
                  </p>
                </div>
              </div>

              {/* SECTION 4 */}
              <div id="client-duties" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">4</span>
                  Client Responsibilities
                </h2>
                <div className="pl-14 space-y-4">
                  <p>To facilitate a flawless cleaning process, we ask our clients to follow these guidelines:</p>
                  <ul className="grid gap-4 mt-4">
                    <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-secondary text-xl mt-0.5">✦</span>
                      <p><strong className="text-slate-800 block mb-1">Check Your Pockets:</strong> Clients must empty all pockets prior to handing over garments. We are not responsible for damage to clothing caused by items left in pockets (e.g., pens, lipsticks) or the loss of valuables left inside.</p>
                    </li>
                    <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-secondary text-xl mt-0.5">✦</span>
                      <p><strong className="text-slate-800 block mb-1">Care Instructions:</strong> Please inform our pickup executives of any specific fabric sensitivities, existing tears, or unique care labels attached to your premium garments.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION 5 */}
              <div id="garment-care" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">5</span>
                  Garment Care & Liability
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    We exercise the utmost care in processing articles entrusted to us and use processes which, in our professional opinion, are best suited to the nature and condition of each individual article.
                  </p>
                  <ul className="space-y-4 mt-6">
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold shrink-0 text-xl">•</span>
                      <p><strong className="text-slate-800">Limitations of Liability:</strong> We cannot assume responsibility for inherent weaknesses or defects in materials which were not visible prior to processing. This applies particularly, but not exclusively, to suedes, leathers, silks, satins, double-face fabrics, vinyls, and polyurethanes.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold shrink-0 text-xl">•</span>
                      <p><strong className="text-slate-800">Compensation:</strong> In the highly unlikely event of damage or loss caused by our negligence, our liability is strictly limited to a maximum of 10 times the cleaning charge for that specific item, regardless of brand or original value.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION 6 */}
              <div id="payment-terms" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl">6</span>
                  Payment Terms & Billing
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    Payment is due in full prior to or at the time of delivery. Invoices are generated once processing is complete and the final garment weight or piece-count is verified.
                  </p>
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 mt-6">
                    <h4 className="font-bold text-primary mb-3">Accepted Payment Modes</h4>
                    <p className="text-sm">We accept all major Credit/Debit cards, UPI, and Cash on Delivery. For corporate accounts, monthly billing cycles can be arranged upon approval.</p>
                  </div>
                </div>
              </div>

              {/* SECTION 7 */}
              <div id="governing-law" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-xl">7</span>
                  Governing Law
                </h2>
                <div className="pl-14">
                  <p>
                    These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.
                  </p>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}