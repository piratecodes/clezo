import React from 'react';
import Hero from '@/components/services/Hero';
import DynamicSection from '@/components/services/DynamicSections';
import ServiceProducts from '@/components/services/ServiceProducts';
import Testimonials from '@/components/landing/testimonials';

export default function ServiceTemplate({ categoryData }) {
  // Extract fields from categoryData
  const { headerTitle, headerIntroText, name, sections, faqs } = categoryData;

  return (
    <main className="bg-slate-50/30 overflow-hidden">
      
      {/* 1. HERO */}
      <Hero
        title={headerTitle || name}
        introText={headerIntroText || `Experience the best ${name} services with premium garment care.`}
      />

      {/* 2. DYNAMIC CONTENT (Sections + FAQs) */}
      <DynamicSection sections={sections} faqs={faqs} />

      {/* 3. DYNAMIC PRODUCTS */}
      {categoryData.options && categoryData.options.length > 0 && (
        <ServiceProducts products={categoryData.options} />
      )}

      {/* 4. STATIC SECTIONS */}
      <Testimonials />

    </main>
  );
}