import React from 'react';
import GalleryShowcase from '@/components/gallery/GalleryShowcase'; // 🚨 Note: Check your folder spelling here!

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Photo Gallery Clezo Express Laundry',
  description: 'Explore Clezo Express Laundry gallery to see our packing, moving, car shifting, and storage solution services in action across multiple cities.',
};

async function getGalleries() {
  try {
    // Fallback URL just in case your .env is missing or misspelled
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    console.log("🚀 [SERVER FETCH] Requesting from:", `${apiUrl}/gallery`);

    const res = await fetch(`${apiUrl}/gallery`, {
      cache: 'no-store' // 🌟 KILL THE CACHE TEMPORARILY FOR TESTING
    });

    if (!res.ok) {
      console.error("❌ [SERVER FETCH ERROR] Backend returned status:", res.status);
      return [];
    }

    const json = await res.json();
    console.log("✅ [SERVER FETCH SUCCESS] Albums found:", json?.data?.galleries?.length);
    return json?.data?.galleries || [];
  } catch (error) {
    console.error("💥 [SERVER FETCH CRASH]:", error.message);
    return [];
  }
}

export default async function PhotoGalleryPage() {
  const albums = await getGalleries();

  return (
    <main className="min-h-screen w-full pt-24 pb-32" role="main" aria-label="Photo Gallery of Clezo Express Laundry">
      <div className="container px-6 mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-center text-primary tracking-tight mb-4">
          Our <span className="text-secondary italic font-serif">Gallery</span>
        </h1>
        <p className="mx-auto text-center text-lg font-medium text-slate-500 max-w-2xl">
          A visual journey through our recent relocations, secure packaging, and successful transit operations.
        </p>
      </div>

      {/* 🌟 PASS DATA TO CLIENT INTERACTIVE COMPONENT 🌟 */}
      <GalleryShowcase albums={albums} />
    </main>
  );
}