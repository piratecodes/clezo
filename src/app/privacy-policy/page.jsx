"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';


export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'collection', 'usage', 'third-party', 'retention', 'security', 'contact'];
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
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Policy</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            How we collect, protect, and manage your data while providing you with pristine garment care.
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
                Contents
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#introduction" className={`transition-colors block ${activeId === 'introduction' ? 'text-primary font-black' : 'hover:text-primary'}`}>1. Introduction</a></li>
                <li><a href="#collection" className={`transition-colors block ${activeId === 'collection' ? 'text-primary font-black' : 'hover:text-primary'}`}>2. Information We Collect</a></li>
                <li><a href="#usage" className={`transition-colors block ${activeId === 'usage' ? 'text-primary font-black' : 'hover:text-primary'}`}>3. How We Use Data</a></li>
                <li><a href="#third-party" className={`transition-colors block ${activeId === 'third-party' ? 'text-primary font-black' : 'hover:text-primary'}`}>4. Third-Party Tracking</a></li>
                <li><a href="#retention" className={`transition-colors block ${activeId === 'retention' ? 'text-primary font-black' : 'hover:text-primary'}`}>5. Data Retention</a></li>
                <li><a href="#security" className={`transition-colors block ${activeId === 'security' ? 'text-primary font-black' : 'hover:text-primary'}`}>6. Data Security</a></li>
                <li><a href="#contact" className={`transition-colors block ${activeId === 'contact' ? 'text-primary font-black' : 'hover:text-primary'}`}>7. Contact Us</a></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Box */}
          <section className="w-full lg:w-3/4 bg-white/70 backdrop-blur-2xl p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white">
            <div className="space-y-16 text-slate-600 leading-relaxed text-lg font-medium">
              
              <div id="introduction" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">1</span>
                  Introduction
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    At <strong className="text-slate-800">Clezo Express Laundry</strong>, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy outlines how we handle the information collected through our website, mobile application, and in-store interactions.
                  </p>
                  <p>
                    By browsing our website, booking a pickup, or using our garment care services, you consent to the data collection and usage practices described in this document.
                  </p>
                </div>
              </div>

              <div id="collection" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl">2</span>
                  Information We Collect
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    To provide you with seamless laundry and dry cleaning services, we collect necessary information to process orders and ensure accurate delivery. This includes:
                  </p>
                  <ul className="grid gap-4 mt-6">
                    <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                      <span className="text-primary text-xl mt-1">✦</span>
                      <div>
                        <strong className="text-slate-800 block mb-1">Personal Details</strong>
                        Your name, email address, and primary phone/WhatsApp number submitted during registration or booking.
                      </div>
                    </li>
                    <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                      <span className="text-primary text-xl mt-1">✦</span>
                      <div>
                        <strong className="text-slate-800 block mb-1">Service Data</strong>
                        Pickup and delivery addresses, specific garment care instructions, fabric allergies, and service preferences.
                      </div>
                    </li>
                    <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                      <span className="text-primary text-xl mt-1">✦</span>
                      <div>
                        <strong className="text-slate-800 block mb-1">Automated Usage Data</strong>
                        Your IP address, browser type, device type, and app usage patterns collected via cookies to optimize your experience.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div id="usage" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">3</span>
                  How We Use Your Data
                </h2>
                <div className="pl-14 space-y-4">
                  <p>The data collected on our platform is strictly used to:</p>
                  <ul className="list-disc pl-6 space-y-3 text-slate-500">
                    <li>Schedule and execute timely laundry pickups and deliveries.</li>
                    <li>Process payments and provide transparent billing statements.</li>
                    <li>Ensure specific garment care instructions (e.g., dry clean only, starching preferences) are met.</li>
                    <li>Communicate order status, delays, or promotional offers via SMS/Email.</li>
                  </ul>
                </div>
              </div>

              <div id="third-party" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">4</span>
                  Third-Party Integrations
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    To provide you with a premium experience, we integrate trusted third-party tools. Your data may be processed by:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                      <strong className="text-slate-800 block mb-2">Payment Gateways</strong>
                      <span className="text-sm">Secure processors (like Razorpay/Stripe) handle your transactions. We never store raw credit card details.</span>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                      <strong className="text-slate-800 block mb-2">Delivery Partners</strong>
                      <span className="text-sm">Logistics partners receive only your address and phone number for delivery routing.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div id="retention" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">5</span>
                  Data Retention & Privacy
                </h2>
                <div className="pl-14 space-y-4">
                  <p>
                    We retain your order history to provide loyalty benefits, quick re-booking options, and personalized care recommendations for your returning garments.
                  </p>
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                    <strong className="text-primary block mb-2">Your Right to Erase</strong>
                    If you wish to close your account and delete your data permanently from our systems, you may request full data deletion at any time by contacting our support desk. We do not sell your personal data to external marketers.
                  </div>
                </div>
              </div>

              <div id="security" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl">6</span>
                  Data Security
                </h2>
                <div className="pl-14">
                  <p>
                    We implement industry-standard digital security measures, including 256-bit SSL encryption, to ensure your contact and payment data is transmitted securely. Access to user data is strictly limited to authorized Clezo personnel required to fulfill your orders.
                  </p>
                </div>
              </div>

              <div id="contact" className="scroll-mt-32 group">
                <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-xl">7</span>
                  Contact Us
                </h2>
                <div className="pl-14 space-y-6">
                  <p>
                    If you have any questions about this Privacy Policy, our data practices, or wish to exercise your privacy rights, please reach out:
                  </p>
                  <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 rounded-2xl border border-slate-100 inline-block transition-transform hover:-translate-y-1 duration-300">
                    <p className="font-black text-slate-800 text-lg mb-2">Clezo Data Protection Team</p>
                    <a href="mailto:privacy@clezo.com" className="flex items-center gap-3 text-primary font-bold hover:text-secondary transition-colors">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">✉️</span> 
                      privacy@clezo.com
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}