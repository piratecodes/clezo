import React from 'react';
import OffersClient from './OffersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Special Offers & App Coupons | Clezo Express Laundry',
  description: 'Unlock exclusive laundry and dry cleaning promo coupons on the Clezo Mobile App. Save up to 30% on live hygiene garment care across Thane and Pune.',
};

const JsonLd = {
  "@context": "https://schema.org",
  "@type": "SpecialAnnouncement",
  "name": "Clezo Mobile App Exclusive Offers",
  "text": "Exclusive promo discounts on live laundry, express dry cleaning, and delicate fabric care across Thane and Pune.",
  "category": "https://schema.org/OnlineEventAttendanceMode",
  "url": "https://clezo.in/offers",
};

async function getOffers() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/offers`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.offers || [];
  } catch (err) {
    console.error("Failed to fetch public offers:", err);
    return [];
  }
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JsonLd) }} />
      <OffersClient initialOffers={offers} />
    </>
  );
}
