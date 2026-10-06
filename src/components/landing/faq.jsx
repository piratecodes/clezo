"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "What makes Clezo's services premium?",
    answer: "We use industry-leading, hospital-grade eco-friendly products combined with highly trained professionals to deliver an unmatched standard of cleanliness and hygiene."
  },
  {
    id: 2,
    question: "Are your products safe for pets and children?",
    answer: "Absolutely. All our proprietary cleaning agents are 100% biodegradable, hypoallergenic, and strictly tested to be safe for your entire family."
  },
  {
    id: 3,
    question: "Do you offer subscription-based management?",
    answer: "Yes, we offer flexible B2B and B2C subscriptions ranging from weekly deep cleans to complete daily facility management."
  },
  {
    id: 4,
    question: "How fast is your e-commerce delivery?",
    answer: "Products ordered from our premium e-commerce store are dispatched within 24 hours and delivered nationwide with expedited shipping."
  },
  {
    id: 5,
    question: "Are there any hidden costs in your quotes?",
    answer: "Never. We believe in absolute transparency. The quote you receive includes all equipment, labor, and premium solvents."
  },
  {
    id: 6,
    question: "What if I am not satisfied with a service?",
    answer: "We have a 100% Satisfaction Guarantee. If our service doesn't meet your standard, we will re-service the area completely free of charge."
  }
];

export default function FaqSection() {
  // Generate FAQ Schema for AEO/SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Subtle quirky rotations for desktop only
  const rotations = [
    "md:-rotate-2", 
    "md:rotate-1", 
    "md:-rotate-1", 
    "md:rotate-2", 
    "md:-rotate-2", 
    "md:rotate-1"
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-32 relative w-full overflow-hidden">
        
        {/* Ambient Backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="container">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-24 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm"
            >
              <HelpCircle size={14} className="text-secondary animate-bounce" />
              <span className="text-on-surface">Knowledge Base</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-on-surface tracking-tighter leading-tight"
            >
              Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Questions.</span>
            </motion.h2>
          </div>

          {/* Quirky Floating Glass Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                className={`
                  relative bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] 
                  transition-all duration-500 ease-out group
                  hover:!rotate-0 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,174,230,0.2)] hover:bg-white/70 hover:border-primary/40
                  ${rotations[index % rotations.length]}
                `}
              >
                {/* Decorative blob inside card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/30 group-hover:scale-150 transition-all duration-700" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start gap-5 mb-4">
                    <div className="shrink-0 w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">?</span>
                    </div>
                    <h3 className="font-black text-xl text-on-surface leading-tight pt-2 group-hover:text-primary transition-colors tracking-tight">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <div className="mt-auto flex items-stretch gap-5 pt-2">
                    <div className="shrink-0 w-12 flex justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-[2px] h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full"></div>
                    </div>
                    <p className="text-on-surface-variant font-medium text-sm leading-relaxed pb-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}