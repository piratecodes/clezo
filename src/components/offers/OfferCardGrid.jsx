"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Copy, Check, Sparkles, Flame, ChevronDown, 
  ArrowRight, Smartphone, Clock, Tag, ShieldCheck 
} from 'lucide-react';
import { 
  Disclosure, DisclosureButton, DisclosurePanel, 
  TabGroup, TabList, Tab, TabPanels, TabPanel 
} from '@headlessui/react';
import toast from 'react-hot-toast';
import { formatISTDate } from '@/utils/istTime';

export default function OfferCardGrid({ offers = [] }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Sort offers by recent updates first (reverse chronological order of updatedAt)
  const activeOffers = [...offers]
    .filter(o => o.isActive)
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

  const limitedTimeOffers = activeOffers.filter(o => o.isLimitedTime !== false);
  const permanentOffers = activeOffers.filter(o => o.isLimitedTime === false);

  // Dynamic tabs: dynamically construct tabs based on active categories
  const dynamicTabs = [
    {
      id: 'all',
      label: 'All Promotions',
      icon: null,
      count: activeOffers.length,
      offers: activeOffers,
    },
    ...(limitedTimeOffers.length > 0 ? [{
      id: 'limited',
      label: 'Limited-Time Specials',
      icon: Clock,
      count: limitedTimeOffers.length,
      offers: limitedTimeOffers,
    }] : []),
    ...(permanentOffers.length > 0 ? [{
      id: 'permanent',
      label: 'Welcome & Lifetime Deals',
      icon: Sparkles,
      count: permanentOffers.length,
      offers: permanentOffers,
    }] : []),
  ];

  // Only display tabs if there is more than 1 distinct category (i.e. both limited and permanent deals exist).
  // If there are no limited-time deals, it is NOT mentioned on tabs, and simply renders the clean grid directly.
  const showTabs = limitedTimeOffers.length > 0 && permanentOffers.length > 0;

  if (activeOffers.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="text-lg font-bold text-slate-700">No active promotions available right now.</p>
        <p className="text-sm">Please check back soon for seasonal laundry offers!</p>
      </div>
    );
  }

  const renderOfferCard = (offer, idx) => {
    const claimRatio = Math.min(100, Math.round(((offer.claimedCount || 80) / (offer.maxClaims || 100)) * 100));
    const isCopied = copiedCode === offer.code;
    const bannerUrl = typeof offer.bannerImage === 'string' 
      ? offer.bannerImage 
      : (offer.bannerImage?.url || offer.imageUrl || offer.image);
    const isPermanent = offer.isLimitedTime === false;

    return (
      <motion.div
        key={offer.id || offer.slug || idx}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.45, delay: idx * 0.08 }}
        className="bg-white/25 hover:bg-white/35 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_15px_40px_rgba(0,35,51,0.06)] hover:shadow-[0_25px_60px_rgba(0,174,230,0.16)] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5"
      >
        <div>
          
          {/* Card Banner Image or Themed Top Header */}
          {bannerUrl ? (
            <div className="relative w-full h-44 overflow-hidden bg-slate-900">
              <Image
                src={bannerUrl}
                alt={offer.bannerImageAlt || offer.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              
              {/* Badge Floating */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                  isPermanent 
                    ? 'bg-emerald-500/90 text-white' 
                    : 'bg-white/90 text-slate-900'
                }`}>
                  {offer.badge || (isPermanent ? 'Lifetime Welcome Deal' : 'Limited Time Deal')}
                </span>
              </div>

              {/* Discount Pill Floating */}
              {offer.discount && (
                <div className="absolute bottom-3 right-3 bg-primary text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg">
                  {offer.discount}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 pb-0 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                isPermanent 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}>
                {offer.badge || (isPermanent ? 'Lifetime Welcome Deal' : 'Limited Time Deal')}
              </span>
              {offer.discount && (
                <span className="text-xl font-black text-primary">
                  {offer.discount}
                </span>
              )}
            </div>
          )}

          {/* Body Content */}
          <div className="p-6">
            
            {/* Deal Title */}
            <h3 className="text-lg md:text-xl font-black text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              <Link href={`/offers/${offer.slug}`}>
                {offer.title}
              </Link>
            </h3>

            {/* Short Description */}
            {offer.description && (
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 mb-4">
                {offer.description}
              </p>
            )}

            {/* Scarcity Meter or Permanent Status Banner */}
            {isPermanent ? (
              <div className="bg-emerald-50/70 border border-emerald-100/80 p-3 rounded-2xl mb-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-800">Permanent Welcome Deal</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  No Expiry
                </span>
              </div>
            ) : (
              <div className="bg-slate-50/70 backdrop-blur-xs border border-slate-100/80 p-3 rounded-2xl mb-5">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                    <Flame size={13} className="text-amber-500" /> Daily Slots Claimed:
                  </span>
                  <span className="text-emerald-600 font-extrabold text-xs">
                    {offer.claimedCount || 84} / {offer.maxClaims || 100}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all duration-1000"
                    style={{ width: `${claimRatio}%` }}
                  />
                </div>
                {offer.endDate && (
                  <p className="text-[10px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                    <Clock size={11} className="text-amber-500" />
                    <span>Expires: {formatISTDate(offer.endDate, false)}</span>
                  </p>
                )}
              </div>
            )}

            {/* Coupon Code Box */}
            {offer.showCouponCode !== false && offer.code ? (
              <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-5">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-primary/70">Promo Code</div>
                  <div className="font-mono text-lg font-black text-slate-800 tracking-wider">
                    {offer.code}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(offer.code)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-primary hover:bg-primary-fixed-variant text-white hover:scale-105'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check size={13} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-3 flex items-center justify-between gap-2 mb-5">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700">App Exclusive</div>
                  <div className="text-xs font-bold text-slate-700">Auto-applied in Clezo App</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Auto-Applied
                </span>
              </div>
            )}

            {/* Collapsible Terms with Headless UI */}
            {offer.terms && offer.terms.length > 0 && (
              <div className="border-t border-slate-200/50 pt-2.5">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <DisclosureButton className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-primary py-1 transition-colors cursor-pointer focus:outline-none">
                        <span>Key Terms</span>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-200 ${open ? 'rotate-180 text-primary' : 'text-slate-400'}`}>
                          <ChevronDown size={14} />
                        </span>
                      </DisclosureButton>

                      <DisclosurePanel
                        transition
                        className="space-y-1 text-xs text-slate-600 pt-2 pb-1 pl-2.5 border-l-2 border-primary/40 transition duration-200 ease-out data-[closed]:opacity-0 data-[closed]:-translate-y-1"
                      >
                        {offer.terms.map((term, tIdx) => (
                          <div key={tIdx} className="leading-relaxed">
                            • {term}
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>
            )}

          </div>
        </div>

        {/* Card Action Footer */}
        <div className="p-6 pt-0 space-y-2">
          <Link
            href={`/offers/${offer.slug}`}
            className="w-full flex items-center justify-center gap-2 bg-[#002333] hover:bg-primary text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group/btn cursor-pointer"
          >
            <span>View Deal Page</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#playstore-download"
            className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-primary py-1.5 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <Smartphone size={13} className="text-emerald-500" />
            <span>Get App to Redeem</span>
          </a>
        </div>

      </motion.div>
    );
  };

  return (
    <section id="offers-showcase" className="py-16 md:py-24 relative overflow-hidden">
      {/* Light Ambient Glare / Spotlight behind Section (Lets background bubbles pattern shine through) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mb-12 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-500/20 backdrop-blur-xs"
          >
            <Sparkles size={13} />
            Verified Promo Coupons
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight"
          >
            Select Your Offer &amp; Claim in App
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium mt-3 text-base md:text-lg"
          >
            Choose any deal below, copy the coupon or tap to view exclusive ad details and terms.
          </motion.p>
        </div>

        {/* Headless UI Category Segmentation Tabs */}
        {showTabs ? (
          <TabGroup className="w-full">
            {/* Filter Tabs Bar */}
            <div className="flex justify-center mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabList className="flex gap-2 p-1.5 rounded-full bg-white/35 backdrop-blur-xl border border-white/80 shadow-xs">
                {dynamicTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tab
                      key={tab.id}
                      className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 outline-none cursor-pointer text-slate-600 hover:text-slate-900 data-[selected]:bg-primary data-[selected]:text-white data-[selected]:shadow-[0_4px_15px_rgba(0,174,230,0.35)] flex items-center gap-1.5"
                    >
                      {Icon && <Icon size={13} className="shrink-0" />}
                      <span>{tab.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-black">
                        {tab.count}
                      </span>
                    </Tab>
                  );
                })}
              </TabList>
            </div>

            {/* Tab Panels */}
            <TabPanels>
              {dynamicTabs.map((tab) => (
                <TabPanel key={tab.id} className="focus:outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tab.offers.map((offer, idx) => renderOfferCard(offer, idx))}
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        ) : (
          /* Plain Grid fallback if only one type exists */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeOffers.map((offer, idx) => renderOfferCard(offer, idx))}
          </div>
        )}

      </div>
    </section>
  );
}
