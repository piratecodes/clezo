"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Disclosure, DisclosureButton, DisclosurePanel, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';

export default function UniversalOfferFaqs() {
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/7900004333?text=Hi%20Clezo,%20I%20have%20a%20question%20about%20your%20promotional%20offers");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    fetch(`${apiUrl}/contact/`)
      .then(res => res.json())
      .then(data => {
        const contact = data?.data?.contact;
        const phone = contact?.whatsappNumber || contact?.primaryPhone;
        if (phone) {
          const cleanPhone = phone.replace(/\D/g, '');
          setWhatsappUrl(`https://wa.me/${cleanPhone}?text=Hi%20Clezo,%20I%20have%20a%20question%20about%20your%20promotional%20offers`);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { name: "All FAQs", id: "all" },
    { name: "Redemption & App", id: "app" },
    { name: "Rules & Limits", id: "rules" },
    { name: "Services & Delivery", id: "services" },
  ];

  const faqs = [
    {
      q: "How do I apply a coupon code on my laundry order?",
      a: "Download the Clezo Mobile App, schedule your laundry or dry cleaning pickup, and on the order review / checkout screen, enter your coupon code into the 'Promo Code' box and tap Apply. Your discount will be deducted instantly.",
      category: "app"
    },
    {
      q: "Where can I download the official Clezo App?",
      a: "Clezo is available on the Google Play Store (Android) and Apple App Store (iOS). You can search for 'Clezo Express Laundry' or use the direct download buttons located on this page.",
      category: "app"
    },
    {
      q: "Can I use multiple coupon codes on a single booking?",
      a: "No, our billing system allows one promotional coupon code per order. However, you can select the coupon that offers you the highest discount for your specific cart value or garment category.",
      category: "rules"
    },
    {
      q: "Are pickup and delivery charges free when using a discount offer?",
      a: "Yes! Doorstep pickup and prompt delivery across our live service hubs in Thane and Pune are 100% complimentary on all qualifying orders above our basic threshold.",
      category: "services"
    },
    {
      q: "What happens if a coupon code shows 'Expired' or 'Limit Reached'?",
      a: "To ensure supreme hygiene and 24-hour turnaround, our live laundry machines have daily slot limits. If an offer has met its daily quota, you can check other ongoing seasonal codes or retry the next morning.",
      category: "rules"
    },
    {
      q: "Can promotional offers be used for delicate fabrics, shoe spa, or curtains?",
      a: "Yes! While some coupons like CLEZO30 are universal across wash, fold, and steam iron, others like CARE25 and EXPRESS150 are specifically formulated for shoe refurbishment, curtains, and express designer dry cleaning.",
      category: "services"
    }
  ];

  const renderFaqItem = (faq, idx) => {
    const indexNumber = String(idx + 1).padStart(2, '0');

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: idx * 0.05 }}
      >
        <Disclosure 
          defaultOpen={idx === 0} 
          as="div" 
          className="group border border-white/80 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 hover:border-primary/40 bg-white/25 backdrop-blur-xl data-[open]:border-primary/50 data-[open]:bg-white/35 data-[open]:shadow-[0_12px_35px_rgba(0,174,230,0.08)]"
        >
          {({ open }) => (
            <>
              <DisclosureButton className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-white/30 hover:bg-white/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                <div className="flex items-center gap-3.5 pr-2">
                  <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                    open 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}>
                    {indexNumber}
                  </span>
                  <span className="font-bold text-slate-900 text-sm md:text-base">
                    {faq.q}
                  </span>
                </div>
                <span className={`w-8 h-8 rounded-full bg-white/70 border border-slate-200/80 flex items-center justify-center shrink-0 transition-transform duration-300 ml-2 shadow-2xs ${
                  open ? 'rotate-180 text-primary border-primary/40 bg-primary/5' : 'text-slate-400'
                }`}>
                  <ChevronDown size={16} />
                </span>
              </DisclosureButton>

              <DisclosurePanel
                transition
                className="p-5 sm:p-6 pt-3 text-slate-600 text-xs sm:text-sm font-medium leading-relaxed border-t border-white/50 bg-white/40 transition duration-300 ease-out data-[closed]:opacity-0 data-[closed]:-translate-y-2"
              >
                {faq.a}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </motion.div>
    );
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Light Ambient Glare / Spotlight */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-3 border border-primary/20 backdrop-blur-xs"
          >
            <HelpCircle size={14} />
            Frequently Asked Questions
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight"
          >
            Got Questions About Our Offers?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium text-sm md:text-base mt-2 max-w-2xl mx-auto"
          >
            Everything you need to know about claiming, applying, and redeeming Clezo promotional vouchers.
          </motion.p>
        </div>

        {/* Headless UI Tab Categories & Accordions */}
        <TabGroup className="w-full">
          {/* Category Filter Pills */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabList className="flex gap-2 p-1.5 rounded-full bg-white/35 backdrop-blur-xl border border-white/80 shadow-xs">
              {categories.map((cat) => (
                <Tab
                  key={cat.id}
                  className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 outline-none cursor-pointer text-slate-600 hover:text-slate-900 data-[selected]:bg-primary data-[selected]:text-white data-[selected]:shadow-[0_4px_15px_rgba(0,174,230,0.35)]"
                >
                  {cat.name}
                </Tab>
              ))}
            </TabList>
          </div>

          {/* Tab Panels */}
          <TabPanels>
            {/* All FAQs */}
            <TabPanel className="space-y-4 focus:outline-none">
              {faqs.map((faq, idx) => renderFaqItem(faq, idx))}
            </TabPanel>

            {/* App & Redemption */}
            <TabPanel className="space-y-4 focus:outline-none">
              {faqs.filter(f => f.category === 'app').map((faq, idx) => renderFaqItem(faq, idx))}
            </TabPanel>

            {/* Rules & Limits */}
            <TabPanel className="space-y-4 focus:outline-none">
              {faqs.filter(f => f.category === 'rules').map((faq, idx) => renderFaqItem(faq, idx))}
            </TabPanel>

            {/* Services & Delivery */}
            <TabPanel className="space-y-4 focus:outline-none">
              {faqs.filter(f => f.category === 'services').map((faq, idx) => renderFaqItem(faq, idx))}
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Live Help Concierge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white/30 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <MessageSquare size={22} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base sm:text-lg">
                Still have questions regarding an offer or corporate booking?
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Our laundry concierge team is available live to assist your order across Thane &amp; Pune.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer hover:scale-105"
          >
            <span>Chat On WhatsApp</span>
            <ArrowRight size={14} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
