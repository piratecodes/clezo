"use client";

import React from 'react';
import OfferSlugHero from '@/components/offers/slug/OfferSlugHero';
import OfferSlugSteps from '@/components/offers/slug/OfferSlugSteps';
import OfferSlugBody from '@/components/offers/slug/OfferSlugBody';
import OfferSlugTerms from '@/components/offers/slug/OfferSlugTerms';
import OfferSlugFaqs from '@/components/offers/slug/OfferSlugFaqs';
import OfferSlugAppBanner from '@/components/offers/slug/OfferSlugAppBanner';
import OfferStickyMobileCta from '@/components/offers/slug/OfferStickyMobileCta';

export default function OfferDetailClient({ offer }) {
  if (!offer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Offer Not Found</h2>
        <p className="text-slate-500 mb-6">This promotion may have expired or is currently unavailable.</p>
        <a 
          href="/offers" 
          className="bg-primary hover:bg-primary-fixed-variant text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all"
        >
          View All Live Offers
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      
      {/* 1. Hero with next/image banner, IST countdown, title, discount badge & coupon box */}
      <OfferSlugHero offer={offer} />

      {/* 2. 3-Step "How to Avail in 60s" Visual Flow */}
      <OfferSlugSteps />

      {/* 3. Rich Editorial Body Text & 4-Pillar Hygiene Guarantee */}
      <OfferSlugBody offer={offer} />

      {/* 4. Deal-Specific Terms & Conditions Checklist */}
      <OfferSlugTerms offer={offer} />

      {/* 5. Deal-Specific FAQs Accordion + FAQPage JSON-LD Schema */}
      <OfferSlugFaqs offer={offer} />

      {/* 6. App Store & Play Store Download Showcase */}
      <OfferSlugAppBanner offer={offer} />

      {/* 7. Persistent Sticky Mobile Conversion Bar */}
      <OfferStickyMobileCta offer={offer} />

    </div>
  );
}
