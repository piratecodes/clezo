import React from 'react';
import { notFound } from 'next/navigation';
import ServiceTemplate from '@/components/templates/ServiceTemplate';

// --- 1. DATA FETCHER ---
async function getCategoryData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-categories/slug/${slug}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    if (!res.ok) return null;
    const json = await res.json();
    let categoryData = json.success ? json.data?.gallery || json.data?.category || json.data : (json.id ? json : null);
    
    // Fetch products (options) separately since categoryId might be null in the DB
    if (categoryData) {
      const optionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-options/service/${slug}`, {
        next: { revalidate: 60 }
      });
      if (optionsRes.ok) {
        const optionsJson = await optionsRes.json();
        categoryData.options = optionsJson.success ? optionsJson.data?.options : [];
      }
    }
    return categoryData;
  } catch (error) {
    return null;
  }
}

// --- 2. DYNAMIC SEO ENGINE ---
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.Services;
  
  const categoryData = await getCategoryData(slug);
  if (!categoryData) return {};

  return {
    title: categoryData.seoMetaTitle || `Clezo Express Laundry - ${categoryData.name}`,
    description: categoryData.seoMetaDescription || `Premium ${categoryData.name} services in Kolkata. Fast, reliable, and pristine.`,
    keywords: categoryData.seoMetaKeywords
      ? categoryData.seoMetaKeywords.split(',').map(k => k.trim())
      : [categoryData.name, 'laundry', 'dry cleaning', 'kolkata'],
    alternates: {
      canonical: categoryData.seoCanonicalUrl || `https://clezo.com/${slug}`,
    },
    robots: {
      index: !categoryData.seoIsNoIndex,
      follow: !categoryData.seoIsNoIndex,
    }
  };
}

// --- 3. THE PAGE COMPONENT ---
export default async function ServicePageRouter({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.Services;

  // Wait, if it has "-in-", it's an old legacy URL, we can 404 it or redirect. 
  // Let's just 404 anything that isn't a valid service slug.
  if (slug.includes('-in-')) {
    return notFound();
  }

  const categoryData = await getCategoryData(slug);
  
  if (!categoryData) {
    return notFound();
  }

  // 🌟 PASS DATA TO UNIFIED TEMPLATE
  return <ServiceTemplate categoryData={categoryData} />;
}