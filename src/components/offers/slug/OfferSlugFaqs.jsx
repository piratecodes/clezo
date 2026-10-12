"use client";

import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

export default function OfferSlugFaqs({ offer }) {
  const defaultFaqs = [
    {
      question: `How do I redeem the ${offer.discount || 'discount'} on the Clezo app?`,
      answer: `Download the Clezo App, add your garments to the bag, and on the checkout summary screen, enter promo code ${offer.code || 'CLEZO30'} or tap Apply. Your discount will be deducted automatically.`
    },
    {
      question: "Are doorstep pickup and express drop included with this offer?",
      answer: "Yes, free doorstep pickup and prompt 24h delivery across our live service hubs in Thane and Pune are fully included."
    },
    {
      question: "Can I combine this code with other loyalty rewards?",
      answer: "This promotion offers an exclusive flat discount and cannot be combined with other promotional vouchers on the same booking."
    },
    {
      question: "What if my address is in an apartment complex or gated society?",
      answer: "Our riders regularly service top societies across Thane and Pune (e.g. Hiranandani Estate, Lodha Amara, Rustomjee, Amanora, Magarpatta). Simply mention your tower/flat number in the app."
    }
  ];

  const faqs = (Array.isArray(offer.faqs) && offer.faqs.length > 0)
    ? offer.faqs
    : defaultFaqs;

  // Structured Data Schema for Google FAQ rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question || f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof (f.answer || f.a) === 'string' ? (f.answer || f.a).replace(/<[^>]*>?/gm, ' ') : ''
      }
    }))
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Inject FAQ Schema for SEO / Ads */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Light Ambient Glare */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2.5 border border-primary/20 backdrop-blur-xs"
          >
            <HelpCircle size={14} />
            Questions &amp; Answers
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium text-xs sm:text-sm mt-1"
          >
            Common questions regarding this specific deal and delivery process.
          </motion.p>
        </div>

        {/* Headless UI Disclosure Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const questionText = faq.question || faq.q;
            const answerContent = faq.answer || faq.a;
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
                            {questionText}
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
                        {typeof answerContent === 'string' && answerContent.startsWith('<') ? (
                          <div 
                            className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-primary"
                            dangerouslySetInnerHTML={{ __html: answerContent }} 
                          />
                        ) : (
                          <p>{answerContent}</p>
                        )}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
