"use client";

import React from 'react';
import OfferBannerSlider from '@/components/offers/OfferBannerSlider';
import OfferUrgencyTicker from '@/components/offers/OfferUrgencyTicker';
import OfferCardGrid from '@/components/offers/OfferCardGrid';
import UniversalOfferTerms from '@/components/offers/UniversalOfferTerms';
import UniversalOfferFaqs from '@/components/offers/UniversalOfferFaqs';
import OfferAppBannerCard from '@/components/offers/OfferAppBannerCard';
import OfferCtaSection from '@/components/offers/OfferCtaSection';

const FALLBACK_OFFERS = [
  {
    id: 1,
    title: "Flat 30% Off On Your First Live Laundry Order",
    headline: "Flat 30% Off On Your First Live Laundry Order in Thane & Pune",
    slug: "flat-30-off-first-order",
    badge: "Most Popular",
    code: "CLEZO30",
    showCouponCode: true,
    discount: "30% OFF",
    discountType: "PERCENTAGE",
    description: "Experience premium live laundry hygiene with an instant 30% flat discount on delicate dry cleaning, wash & iron, and steam sanitization.",
    terms: [
      "Valid exclusively for bookings made via the Clezo Mobile App",
      "Applicable on first order across Thane & Pune live stores",
      "Minimum order value ₹499",
      "Cannot be combined with other promotional coupons"
    ],
    bannerImage: {
      url: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80",
      alt: "Clezo Live Laundry Offer"
    },
    bannerImageAlt: "Clezo Live Laundry Offer",
    appStoreUrl: "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo",
    endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    claimedCount: 84,
    maxClaims: 100,
    isActive: true,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Instant ₹150 Flat Off On Express Dry Cleaning",
    headline: "Save ₹150 Flat On Designer & Formal Dry Cleaning",
    slug: "flat-150-off-express-dry-cleaning",
    badge: "Limited Slots",
    code: "EXPRESS150",
    showCouponCode: true,
    discount: "₹150 FLAT",
    discountType: "FIXED",
    description: "Get lightning-fast 24-hour turnaround on premium designer garments, suits, lehengas, and silk sarees.",
    terms: [
      "Redeemable on the Clezo Android App & Store Pickup",
      "Minimum order value ₹799",
      "Free doorstep pickup and prompt express drop included"
    ],
    bannerImage: {
      url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80",
      alt: "Express Dry Cleaning Offer"
    },
    bannerImageAlt: "Express Dry Cleaning Offer",
    appStoreUrl: "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo",
    endDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    claimedCount: 62,
    maxClaims: 75,
    isActive: true,
    isFeatured: false,
  },
  {
    id: 3,
    title: "Home Hygiene Festival: Flat 25% Off Curtains & Shoes",
    headline: "Refresh Your Home & Shoes With 25% Off Sanitization",
    slug: "festival-curtains-shoes-care",
    badge: "Weekend Special",
    code: "CARE25",
    showCouponCode: true,
    discount: "25% OFF",
    discountType: "PERCENTAGE",
    description: "Deep ultrasonic shoe refurbishment and chemical-free steam sanitization for living room curtains and carpets.",
    terms: [
      "Exclusive to Clezo Mobile App orders",
      "Valid on Shoe Spa and Home Furnishing categories",
      "Includes anti-bacterial germ shield treatment at zero extra charge"
    ],
    bannerImage: {
      url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1200&q=80",
      alt: "Shoe & Curtain Care Special"
    },
    bannerImageAlt: "Shoe & Curtain Care Special",
    appStoreUrl: "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo",
    endDate: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    claimedCount: 45,
    maxClaims: 50,
    isActive: true,
    isFeatured: false,
  }
];

export default function OffersClient({ initialOffers }) {
  const rawOffers = Array.isArray(initialOffers) ? initialOffers : FALLBACK_OFFERS;
  const offers = [...rawOffers].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });
  const firstTargetEndDate = offers.find(o => o.endDate)?.endDate;

  return (
    <div className="min-h-screen text-slate-800 selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      
      {/* 1. Splide Banner Slider (No arrows, custom theme dots) */}
      <OfferBannerSlider offers={offers} />

      {/* 2. Urgency & Scarcity Live IST Ticker */}
      <OfferUrgencyTicker offers={offers} targetEndDate={firstTargetEndDate} />

      {/* 3. Active Offers Cards Grid */}
      <OfferCardGrid offers={offers} />

      {/* 4. Universal Terms & Conditions */}
      <UniversalOfferTerms />

      {/* 5. Universal FAQs Accordion */}
      <UniversalOfferFaqs />

      {/* 6. Mobile & App Store Download Card */}
      <OfferAppBannerCard offers={offers} />

      {/* 7. Conversion CTA Banner */}
      <OfferCtaSection />

    </div>
  );
}
