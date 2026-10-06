import React from 'react';
import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Clezo | Premium Fabric & Appliance Care',
  description: 'Learn about Clezo, the gold standard in premium laundry, delicate couture dry cleaning, and certified home appliance maintenance services.',
};

const JsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Clezo Premium Care",
  "url": "https://clezo.com/",
  "image": "https://clezo.com/logo.png",
  "telephone": "+91 9830070983",
  "description": "Clezo is a premium, tech-driven care service offering eco-friendly laundry, specialized couture dry cleaning, and professional appliance maintenance.",
  "priceRange": "₹₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Clezo HQ",
    "addressLocality": "Kolkata",
    "addressRegion": "West Bengal",
    "postalCode": "700096",
    "addressCountry": "IN"
  }
};

export default function AboutPage() {
  return (
    <>
      {/* Add JSON-LD to your page for AEO/SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JsonLd) }} />
      
      {/* Render the highly animated Client Component */}
      <AboutClient />
    </>
  );
}