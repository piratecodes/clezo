"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Disclosure, Transition } from '@headlessui/react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Star, Check, ChevronUp 
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// STAGGER ANIMATIONS
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } }
};

const itemSlideRight = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
};

// GLOWING CORNERS MAGICAL COMPONENT (Glassmorphic Orbs)
const MagicCorners = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] z-0">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -left-10 w-24 h-24 bg-primary/30 blur-[30px] rounded-full" />
    <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -bottom-10 -right-10 w-24 h-24 bg-cyan-400/30 blur-[30px] rounded-full" />
  </div>
);

const SectionBadge = ({ badge, centered = false }) => {
  if (!badge?.text || badge.text.trim() === '') return null;
  const textColor = badge.color === 'secondary' ? 'text-blue-500 shadow-blue-500/20' : 'text-primary shadow-primary/20';
  
  return (
    <motion.span variants={itemFadeUp} className={`w-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] tracking-[0.1em] border border-white/40 bg-white/20 backdrop-blur-xl shadow-lg mb-3 ${textColor} ${centered ? 'mx-auto' : ''}`}>
      <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <Sparkles size={12} />
      </motion.div>
      {badge.text}
    </motion.span>
  );
};

const SectionHeading = ({ heading, centered = false }) => {
  if (!heading?.text || heading.text.trim() === '') return null;
  
  const words = heading.text.split(' ');
  const highlightCount = words.length > 3 ? 2 : 1;
  const highlight = words.length > 1 ? words.splice(-highlightCount).join(' ') : '';
  const restOfText = words.join(' ');

  const mainColor = heading.color === 'secondary' ? 'text-blue-600' : 'text-slate-800';

  return (
    <motion.h2 variants={itemFadeUp} className={`text-2xl md:text-3xl font-black leading-tight tracking-tight mb-3 whitespace-pre-line ${mainColor} ${centered ? 'text-center' : ''}`}>
      {restOfText} {highlight && <span className="text-primary italic font-serif relative inline-block">
        {highlight}
        <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full origin-left -z-10" />
      </span>}
    </motion.h2>
  );
};

const SectionDescription = ({ text, centered = false }) => {
  if (!text || text.trim() === '') return null;
  return (
    <motion.p variants={itemFadeUp} className={`text-slate-600 text-sm md:text-base font-medium leading-relaxed whitespace-pre-line mb-4 ${centered ? 'text-center mx-auto max-w-2xl' : ''}`}>
      {text}
    </motion.p>
  );
};

// Helper for dummy images
const fallbackImg = "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000&auto=format&fit=crop";

// Glass Card Wrapper
const GlassCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${className}`}>
    <MagicCorners />
    <div className="relative z-10 w-full h-full p-4 md:p-6">
      {children}
    </div>
  </div>
);

export default function DynamicSections({ sections, faqs }) {
  if (!sections || sections.length === 0) return null; 

  return (
    <div className="w-full font-sans text-slate-900 bg-transparent overflow-hidden">
      
      {sections.slice(0, 10).map((section, index) => {
        const layoutType = index % 4;

        if (layoutType === 0) {
          // Layout 0: Image Left, Text Right (Z-Pattern)
          return (
            <section key={index} className="py-6 md:py-10 relative z-10">
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                
                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="w-full">
                  <GlassCard className="p-2 md:p-2">
                    <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-white/20">
                      <Image draggable={false} src={section.image?.url || fallbackImg} alt={section.image?.alt || "Section Image"} width={600} height={400} className="w-full h-full object-cover" />
                    </div>
                  </GlassCard>
                </Tilt>
                
                <div className="flex flex-col">
                  <SectionBadge badge={section.badge} />
                  <SectionHeading heading={section.heading} />
                  <SectionDescription text={section.description} />
                  
                  {section.bullets && section.bullets.length > 0 && (
                    <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {section.bullets.map((bullet, i) => (
                        <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={1500}>
                          <motion.div variants={itemFadeUp} className="flex items-center gap-2 p-2.5 bg-white/20 backdrop-blur-xl border border-white/40 rounded-xl shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)]">
                            <CheckCircle2 className="text-primary shrink-0" size={16} />
                            <span className="text-slate-800 font-bold text-xs leading-tight">{bullet}</span>
                          </motion.div>
                        </Tilt>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </section>
          );
        }

        if (layoutType === 1) {
          // Layout 1: Center Text, Animated Card Grid
          return (
            <section key={index} className="py-6 md:py-10 relative z-10">
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="container mx-auto max-w-6xl px-4 text-center">
                
                <div className="max-w-2xl mx-auto mb-6 flex flex-col items-center">
                  <SectionBadge badge={section.badge} centered={true} />
                  <SectionHeading heading={section.heading} centered={true} />
                  <SectionDescription text={section.description} centered={true} />
                </div>
                
                {section.bullets && section.bullets.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 text-left">
                    {section.bullets.map((bullet, i) => (
                      <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03} transitionSpeed={2000}>
                        <motion.div variants={itemFadeUp} className="h-full">
                          <GlassCard className="p-4 flex flex-row gap-3 items-center group">
                            <div className="w-8 h-8 rounded-xl bg-white/40 border border-white/50 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                              <Star size={14} />
                            </div>
                            <p className="font-bold text-slate-800 text-xs md:text-sm leading-relaxed">{bullet}</p>
                          </GlassCard>
                        </motion.div>
                      </Tilt>
                    ))}
                  </div>
                )}
              </motion.div>
            </section>
          );
        }

        if (layoutType === 2) {
          // Layout 2: Text Left, Image Right
          return (
            <section key={index} className="py-6 md:py-10 relative z-10">
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                 
                 <div className="flex flex-col lg:order-1 order-2">
                    <SectionBadge badge={section.badge} />
                    <SectionHeading heading={section.heading} />
                    <SectionDescription text={section.description} />
                    
                    {section.bullets && section.bullets.length > 0 && (
                      <div className="space-y-2 pt-2">
                         {section.bullets.map((b, i) => (
                           <motion.div key={i} variants={itemSlideRight} className="flex items-center gap-2 group">
                              <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                <Check size={10} className="text-blue-500" strokeWidth={4} />
                              </div>
                              <span className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">{b}</span>
                           </motion.div>
                         ))}
                      </div>
                    )}
                 </div>

                 <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="w-full lg:order-2 order-1">
                   <GlassCard className="p-2 md:p-2">
                     <div className="relative aspect-video rounded-[1.5rem] overflow-hidden">
                       <Image draggable={false} src={section.image?.url || fallbackImg} alt={section.image?.alt || "Section Image"} width={600} height={400} className="w-full h-full object-cover" />
                     </div>
                   </GlassCard>
                 </Tilt>

              </motion.div>
            </section>
          );
        }

        if (layoutType === 3) {
          // Layout 3: Center Image (Compact)
          return (
            <section key={index} className="py-6 md:py-10 relative z-10">
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="container mx-auto max-w-5xl px-4 text-center flex flex-col items-center">
                
                <div className="max-w-2xl mx-auto mb-4">
                  <SectionBadge badge={section.badge} centered={true} />
                  <SectionHeading heading={section.heading} centered={true} />
                  <SectionDescription text={section.description} centered={true} />
                </div>

                {section.image?.url && (
                  <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={3000} className="w-full mb-6">
                    <GlassCard className="p-2 md:p-2">
                      <div className="w-full relative aspect-[21/7] rounded-[1.5rem] overflow-hidden">
                        <Image draggable={false} src={section.image.url} alt={section.image?.alt || "Visual"} width={1000} height={400} className="w-full h-full object-cover" />
                      </div>
                    </GlassCard>
                  </Tilt>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <div className="w-full grid sm:grid-cols-2 gap-3 text-left">
                     {section.bullets.map((b, i) => (
                       <Tilt key={i} tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={2000}>
                         <motion.div variants={itemFadeUp} className="bg-white/10 backdrop-blur-xl border border-white/30 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
                            <ShieldCheck className="text-primary shrink-0" size={16} />
                            <p className="font-bold text-slate-800 text-xs md:text-sm">{b}</p>
                         </motion.div>
                       </Tilt>
                     ))}
                  </div>
                )}

              </motion.div>
            </section>
          );
        }
        
        return null;
      })}

      {/* FAQs Section */}
      {faqs && faqs.length > 0 && (
        <section className="py-10 md:py-16 relative z-20">
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="container mx-auto max-w-3xl px-4">
            
            <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} transitionSpeed={4000}>
              <GlassCard className="!p-6 md:!p-8">
                <div className="text-center mb-6 relative z-10">
                  <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white/20 border border-white/40 text-primary rounded-full mb-3 font-bold text-[10px] uppercase tracking-widest mx-auto backdrop-blur-md">
                    Questions?
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-2 relative z-10">
                  {faqs.map((faq, i) => (
                    <motion.div key={i} variants={itemFadeUp}>
                      <Disclosure>
                        {({ open }) => (
                          <div className={`rounded-xl border backdrop-blur-md transition-all duration-300 overflow-hidden ${open ? 'bg-white/40 border-white/60 shadow-sm' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}>
                            <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left focus:outline-none">
                              <span className={`font-bold text-sm pr-4 transition-colors ${open ? 'text-primary' : 'text-slate-800'}`}>{faq.question}</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${open ? 'bg-white/60 text-primary' : 'bg-white/20 text-slate-500'}`}>
                                <ChevronUp className={`${open ? 'rotate-180 transform' : ''} w-3 h-3 transition-transform duration-300`} />
                              </div>
                            </Disclosure.Button>
                            <Transition
                              enter="transition duration-300 ease-out"
                              enterFrom="transform scale-95 opacity-0 -translate-y-2"
                              enterTo="transform scale-100 opacity-100 translate-y-0"
                              leave="transition duration-200 ease-out"
                              leaveFrom="transform scale-100 opacity-100 translate-y-0"
                              leaveTo="transform scale-95 opacity-0 -translate-y-2"
                            >
                              <Disclosure.Panel className="px-4 pb-4 text-slate-600 text-xs md:text-sm leading-relaxed">
                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} className="prose prose-sm prose-slate max-w-none" />
                              </Disclosure.Panel>
                            </Transition>
                          </div>
                        )}
                      </Disclosure>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </Tilt>
          </motion.div>
        </section>
      )}

    </div>
  );
}
