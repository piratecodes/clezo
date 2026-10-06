import React, { Suspense } from 'react';
import BlogClientGrid from '@/components/blogs/BlogClientGrid';

export const metadata = {
  title: "Blogs & Insights",
  description: "Read our latest articles, moving tips, and company news to help you plan your next relocation smoothly.",
};
export const revalidate = 300;
export default async function BlogsPage() {
  let blogs = [];
  let categories = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1'}/blogs`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      blogs = data.data.filter(b => b.isPublished);
    } else if (data.success && data.data?.blogs) {
      blogs = data.data.blogs.filter(b => b.isPublished);
    }

    // Extract unique categories from published blogs
    categories = [...new Set(blogs.map(b => b.category))].filter(Boolean);
  } catch (err) {
    console.error("Failed to fetch blogs", err);
  }

  return (
    <main className="min-h-screen pb-12 overflow-hidden">
      <div className="py-24 px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Ambient Color Blasts */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-on-surface mb-6 tracking-tight uppercase">
            Clezo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">Insights</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Expert advice, comprehensive care guides, and the latest news from the standard in premium hygiene and maintenance.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <BlogClientGrid initialBlogs={blogs} categories={categories} />
      </Suspense>
    </main>
  );
}
