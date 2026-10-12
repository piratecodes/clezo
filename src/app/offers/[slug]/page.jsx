import React from 'react';
import { notFound } from 'next/navigation';
import OfferDetailClient from './OfferDetailClient';

export const dynamic = 'force-dynamic';

async function fetchOfferBySlug(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/offers/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.offer || null;
  } catch (err) {
    console.error("Failed to fetch offer by slug:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const offer = await fetchOfferBySlug(slug);

  if (!offer) {
    return {
      title: 'Offer Not Found | Clezo Express Laundry',
      description: 'The requested laundry promotion could not be found or has expired.'
    };
  }

  const metaTitle = offer.seoMetaTitle || `${offer.headline || offer.title} | Clezo Offers`;
  const metaDesc = offer.seoMetaDescription || offer.description || 'Exclusive laundry discount promo on the Clezo Mobile App.';
  const canonicalUrl = offer.seoCanonicalUrl || `https://clezo.in/offers/${offer.slug}`;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: offer.seoMetaKeywords ? offer.seoMetaKeywords.split(',').map(k => k.trim()) : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: offer.seoIsNoIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      images: offer.bannerImage?.url ? [{ url: offer.bannerImage.url, alt: offer.bannerImageAlt || offer.title }] : [],
      type: 'article',
    }
  };
}

export default async function OfferSlugPage({ params }) {
  const { slug } = await params;
  const offer = await fetchOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  return (
    <>
      {/* Custom JSON-LD Schema generated in Admin SEO Engine */}
      {offer.seoJsonLdSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: offer.seoJsonLdSchema }}
        />
      )}
      <OfferDetailClient offer={offer} />
    </>
  );
}
