import React from 'react';
import ContactClient from './ContactClient';

export const revalidate = 600; // revalidate every 10 minutes

export const metadata = {
  title: 'Contact Clezo Express Laundry',
  description: 'Get in touch with Clezo Express Laundry for premium garment care and dry cleaning services. Contact our support team today.',
  alternates: {
    canonical: 'https://clezo.com/contact',
  }
};

async function getContactData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1'}/contact/`, {
      next: { revalidate: 600 }
    });
    const data = await res.json();
    if (data.success && data.data && data.data.contact) {
      return data.data.contact;
    }
  } catch (error) {
    console.error("Failed to fetch contact data", error);
  }
  return null;
}

export default async function ContactPage() {
  const contactData = await getContactData();

  // Build JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://clezo.com/contact",
    "url": "https://clezo.com/contact",
    "name": "Contact Clezo Express Laundry",
    "description": metadata.description,
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Clezo Express Laundry",
      "url": "https://clezo.com",
      "image": "https://clezo.com/logo.png",
      ...(contactData?.primaryPhone && { "telephone": contactData.primaryPhone }),
      ...(contactData?.supportEmail && { "email": contactData.supportEmail }),
      ...(contactData?.headOfficeAddress && {
        "address": {
          "@type": "PostalAddress",
          "streetAddress": contactData.headOfficeAddress,
        }
      }),
      "sameAs": [
        contactData?.facebookUrl,
        contactData?.instagramUrl,
        contactData?.twitterUrl,
        contactData?.linkedinUrl,
      ].filter(Boolean)
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient contactData={contactData} />
    </>
  );
}