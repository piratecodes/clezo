import React from 'react';
import CsrClient from './CsrClient';

export const metadata = {
  title: 'Corporate Social Responsibility (CSR) | Clezo Express Laundry',
  description: 'Learn about Clezo\'s Give & Share initiative, women empowerment, eco-friendly laundry practices, and community care commitments.',
};

const JsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Clezo Give & Share Initiative",
  "url": "https://clezo.in/csr",
  "description": "Clezo's Give & Share initiative invites customers to donate pre-loved clothes with their laundry orders for free sanitization and distribution to those in need.",
  "parentOrganization": {
    "@type": "LocalBusiness",
    "name": "Clezo Express Laundry"
  }
};

export default function CsrPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JsonLd) }} />
      <CsrClient />
    </>
  );
}
