"use client";

import React from 'react';
import Image from 'next/image';
import { 
  MapPin, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Star, Check
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';

/** * =========================================================================
 * 1. STRICT DATA-DRIVEN COMPONENTS (Zero Hardcoded Text)
 * ========================================================================= */

const SectionBadge = ({ badge }) => {
  if (!badge?.text || badge.text.trim() === '') return null;
  const textColor = badge.color === 'primary' ? 'text-primary' : 'text-secondary';
  
  return (
    <span className={`w-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs tracking-[0.2em] border border-slate-200/50 bg-white/40 backdrop-blur-md shadow-sm mb-6 ${textColor}`}>
      <Sparkles size={12} /> {badge.text}
    </span>
  );
};

const SectionHeading = ({ heading }) => {
  if (!heading?.text || heading.text.trim() === '') return null;
  
  const words = heading.text.split(' ');
  const highlightCount = words.length > 3 ? 2 : 1;
  const highlight = words.length > 1 ? words.splice(-highlightCount).join(' ') : '';
  const restOfText = words.join(' ');

  const mainColor = heading.color === 'secondary' ? 'text-secondary' : 'text-primary';

  return (
    <h2 className={`text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 whitespace-pre-line ${mainColor}`}>
      {restOfText} {highlight && <span className="text-secondary italic font-serif">{highlight}</span>}
    </h2>
  );
};

const SectionDescription = ({ text }) => {
  if (!text || text.trim() === '') return null;
  return (
    <p className="text-slate-600 text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line mb-8">
      {text}
    </p>
  );
};

/** * =========================================================================
 * 2. THE 10 BESPOKE LAYOUTS (Container without mx-auto)
 * ========================================================================= */

export default function DynamicSections({ cityData, pageData }) {
  const content = pageData?.page || pageData?.data?.page || pageData || {};
  const sections = content?.sections || [];
  const cityName = cityData?.cityName || "your city";
  const subLocations = cityData?.subLocations || cityData?.subTowns || [];

  if (!sections || sections.length === 0) return null; 

  const s0 = sections[0]; // Z-Pattern Intro
  const s1 = sections[1]; // Card Grid
  const s2 = sections[2]; // Image Right
  const s3 = sections[3]; // Center Cinematic
  const s4 = sections[4]; // Sticky Scroll
  const s5 = sections[5]; // Floating Offset
  const s6 = sections[6]; // Numbered Grid
  const s7 = sections[7]; // Image Left
  const s8 = sections[8]; // Minimalist Split
  const s9 = sections[9]; // Trust Conclusion

  return (
    <main className="w-full font-sans text-slate-900 bg-transparent overflow-hidden">

      {/* --- SECTION 0: THE Z-PATTERN INTRO --- */}
      {s0 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="relative group">
              <div className="absolute -inset-4 bg-secondary/20 blur-xl rounded-[2.5rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative aspect-4/3 rounded-4xl overflow-hidden shadow-2xl border border-white/30 bg-white/10 backdrop-blur-xl">
                <Image 
                  src={s0.image?.url || "https://dummyimage.com/800x600/112440/bfa83f&text=Fallback+Image"} 
                  alt={s0.image?.alt || `${cityName} Service`}
                  width={0} height={0} sizes="100vw"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Tilt>
            <div className="flex flex-col">
              <SectionBadge badge={s0.badge} />
              <SectionHeading heading={s0.heading} />
              <SectionDescription text={s0.description} />
              {s0.bullets && s0.bullets.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {s0.bullets.map((bullet, i) => (
                    <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={1500}>
                      <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <CheckCircle2 className="text-secondary shrink-0" size={20} />
                        <span className="text-primary font-bold text-lg md:text-xl leading-tight">{bullet}</span>
                      </div>
                    </Tilt>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 1: THE GLASS CARD GRID --- */}
      {s1 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 text-center">
            <div className="max-w-4xl mx-auto mb-16 flex flex-col items-center">
              <SectionBadge badge={s1.badge} />
              <SectionHeading heading={s1.heading} />
              <SectionDescription text={s1.description} />
            </div>
            {s1.bullets && s1.bullets.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
                {s1.bullets.map((bullet, i) => (
                  <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03} transitionSpeed={2000}>
                    <div className="bg-white/10 h-full flex flex-row space-x-3.5 items-center backdrop-blur-xl border border-white/20 rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-white/40 transition-all duration-300">
                      <div className="w-10 h-10 rounded-3xl bg-white/20 border border-white/30 flex items-center justify-center text-primary shadow-sm backdrop-blur-md">
                        <Star size={20} className="text-secondary" />
                      </div>
                      <p className="font-bold text-primary text-2xl leading-relaxed">{bullet}</p>
                    </div>
                  </Tilt>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- SECTION 2: TEXT LEFT, IMAGE RIGHT --- */}
      {s2 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             <div className="flex flex-col">
                <SectionBadge badge={s2.badge} />
                <SectionHeading heading={s2.heading} />
                <SectionDescription text={s2.description} />
                {s2.bullets && s2.bullets.length > 0 && (
                  <div className="space-y-4 pt-4">
                     {s2.bullets.map((b, i) => (
                       <div key={i} className="flex items-start gap-3">
                          <Check size={18} className="text-secondary mt-1 shrink-0" strokeWidth={3} />
                          <span className="font-bold text-primary text-2xl">{b}</span>
                       </div>
                     ))}
                  </div>
                )}
             </div>
             <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="relative aspect-video rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/30 bg-white/10 backdrop-blur-xl p-2">
                <div className="w-full h-full relative rounded-2xl overflow-hidden">
                  <Image 
                    src={s2.image?.url || "https://dummyimage.com/1280x720/112440/bfa83f&text=Fallback+Image"} 
                    alt={s2.image?.alt || `${cityName} Details`} 
                    width={0} height={0} sizes="100vw" 
                    className="w-full h-full object-cover" 
                  />
                </div>
             </Tilt>
          </div>
        </section>
      )}

      {/* --- SECTION 3: CENTERED CINEMATIC --- */}
      {s3 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 text-center flex flex-col items-center">
            <div className="max-w-4xl mx-auto">
              <SectionBadge badge={s3.badge} />
              <SectionHeading heading={s3.heading} />
              <SectionDescription text={s3.description} />
            </div>
            <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={3000} className="w-full max-w-6xl mx-auto my-16 relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/30 bg-white/10 backdrop-blur-xl p-2">
               <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden">
                 <Image 
                   src={s3.image?.url || "https://dummyimage.com/1200x500/112440/bfa83f&text=Fallback+Image"} 
                   alt={s3.image?.alt || `${cityName} Visual`} 
                   width={0} height={0} sizes="100vw" 
                   className="w-full h-full object-cover" 
                 />
               </div>
            </Tilt>
            {s3.bullets && s3.bullets.length > 0 && (
              <div className="w-full max-w-5xl mx-auto grid sm:grid-cols-2 gap-6 text-left">
                 {s3.bullets.map((b, i) => (
                   <Tilt key={i} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
                     <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <ShieldCheck className="text-secondary shrink-0" size={24} />
                        <p className="font-bold text-primary text-xl">{b}</p>
                     </div>
                   </Tilt>
                 ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- SECTION 4: THE STICKY SCROLL --- */}
      {s4 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-32">
              <SectionBadge badge={s4.badge} />
              <SectionHeading heading={s4.heading} />
              <SectionDescription text={s4.description} />
            </div>
            <div className="space-y-6">
              {s4.bullets && s4.bullets.map((b, i) => (
                <Tilt key={i} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={1500}>
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 flex items-start gap-5">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30 shadow-sm shrink-0">
                        <ArrowRight className="text-secondary" size={20} strokeWidth={3} />
                      </div>
                      <span className="text-primary font-bold text-2xl leading-snug">{b}</span>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 5: FLOATING OFFSET BOX --- */}
      {s5 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 relative">
            <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2500} className="relative aspect-[16/9] lg:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/30 bg-white/10 backdrop-blur-xl p-2">
               <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden">
                 <Image 
                   src={s5.image?.url || "https://dummyimage.com/1280x720/112440/bfa83f&text=Fallback+Image"} 
                   alt={s5.image?.alt || "Highlight"} 
                   width={0} height={0} sizes="100vw" 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                 />
               </div>
            </Tilt>
            <div className="lg:absolute lg:-bottom-12 lg:right-12 lg:w-[550px] bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/60 mt-8 lg:mt-0">
              <SectionBadge badge={s5.badge} />
              <SectionHeading heading={s5.heading} />
              <SectionDescription text={s5.description} />
              {s5.bullets && s5.bullets.length > 0 && (
                <div className="space-y-3 pt-2">
                   {s5.bullets.map((b, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                        <span className="font-bold text-primary text-xl">{b}</span>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 6: NUMBERED MASONRY GRID --- */}
      {s6 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6">
            <div className="mb-16 max-w-3xl">
              <SectionBadge badge={s6.badge} />
              <SectionHeading heading={s6.heading} />
              <SectionDescription text={s6.description} />
            </div>
            <div className="grid lg:grid-cols-3 gap-12 items-start">
               <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="lg:col-span-1 relative aspect-3/4 rounded-4xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/30 bg-white/10 backdrop-blur-xl p-2">
                 <div className="w-full h-full relative rounded-3xl overflow-hidden">
                    <Image 
                      src={s6.image?.url || "https://dummyimage.com/600x800/112440/bfa83f&text=Fallback+Image"} 
                      alt={s6.image?.alt || "Detail"} 
                      width={0} height={0} sizes="100vw" 
                      className="w-full h-full object-cover" 
                    />
                 </div>
               </Tilt>
               <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                 {s6.bullets && s6.bullets.map((b, i) => (
                   <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={1500}>
                     <div className="flex gap-5 bg-white/10 backdrop-blur-xl p-6 border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="w-10 h-10 bg-white/30 text-primary rounded-xl flex items-center justify-center font-black shrink-0 shadow-sm border border-white/40">{i+1}</div>
                        <p className="font-bold text-slate-700 text-xl leading-snug pt-1">{b}</p>
                     </div>
                   </Tilt>
                 ))}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 7: IMAGE LEFT, TEXT RIGHT --- */}
      {s7 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 flex flex-col lg:flex-row gap-16 items-center">
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="w-full lg:w-1/2 relative aspect-square lg:aspect-4/3 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/30 bg-white/10 backdrop-blur-xl p-2">
               <div className="w-full h-full relative rounded-4xl overflow-hidden">
                 <Image 
                   src={s7.image?.url || "https://dummyimage.com/800x600/112440/bfa83f&text=Fallback+Image"} 
                   alt={s7.image?.alt || "Process"} 
                   width={0} height={0} sizes="100vw" 
                   className="w-full h-full object-cover" 
                 />
               </div>
            </Tilt>
            <div className="w-full lg:w-1/2">
              <SectionBadge badge={s7.badge} />
              <SectionHeading heading={s7.heading} />
              <SectionDescription text={s7.description} />
              {s7.bullets && s7.bullets.length > 0 && (
                <div className="grid gap-4 pt-4">
                  {s7.bullets.map((b, i) => (
                    <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03} transitionSpeed={1500}>
                      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                        <span className="font-bold text-primary text-xl">{b}</span>
                      </div>
                    </Tilt>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 8: THE MINIMALIST SPLIT --- */}
      {s8 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <SectionBadge badge={s8.badge} />
              <SectionHeading heading={s8.heading} />
              <SectionDescription text={s8.description} />
            </div>
            {s8.bullets && s8.bullets.length > 0 && (
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2500}>
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                  {s8.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-4 hover:translate-x-2 transition-transform">
                       <ArrowRight className="text-secondary shrink-0 mt-1" size={20} />
                       <span className="text-slate-700 font-bold text-2xl">{b}</span>
                    </div>
                  ))}
                </div>
              </Tilt>
            )}
          </div>
        </section>
      )}

      {/* --- SECTION 9: THE CLOSING BADGES --- */}
      {s9 && (
        <section className="py-16 relative z-10 border-b border-slate-200/30">
          <div className="container px-6 flex flex-col items-center text-center">
            <SectionBadge badge={s9.badge} />
            <SectionHeading heading={s9.heading} />
            <SectionDescription text={s9.description} />
            
            {s9.bullets && s9.bullets.length > 0 && (
              <div className="w-full max-w-6xl grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
                 {s9.bullets.slice(0, 3).map((b, i) => (
                   <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05} transitionSpeed={2000}>
                     <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center">
                       <div className="w-16 h-16 bg-white/20 rounded-2xl shadow-lg border border-white/40 flex items-center justify-center mb-6 text-primary">
                          <CheckCircle2 size={32} />
                       </div>
                       <p className="font-black text-primary text-3xl leading-tight">{b}</p>
                     </div>
                   </Tilt>
                 ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================
          COVERAGE AREA (Uses strictly {cityName})
          ========================================= */}
      {subLocations.length > 0 && (
        <section className="py-16 relative z-10">
          <div className="container px-6">
            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10 mb-16 border-b border-slate-200/30 pb-10">
              <div className="w-full mx-auto text-center">
                <div className="w-auto inline-flex items-center mx-auto gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-slate-200/50 bg-white/40 backdrop-blur-md text-primary shadow-sm">
                  <MapPin size={14} className="text-secondary" /> Service Coverage
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-center text-primary tracking-tight leading-tight">
                   Relocation routes across <span className="text-secondary italic font-serif">{cityName}</span>
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {subLocations.map((loc, i) => (
                <div key={i} className="px-5 py-3 bg-white/50 backdrop-blur-xl border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 transition-all hover:border-secondary hover:text-secondary shadow-sm hover:-translate-y-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {loc}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- JSON-LD SCHEMA --- */}
      {content?.seo?.jsonLdSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: content.seo.jsonLdSchema }} />
      )}
    </main>
  );
}