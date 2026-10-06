import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TableOfContents from '@/components/blogs/TableOfContents';
import BlogFaq from '@/components/blogs/BlogFaq';

import GlareHover from '@/components/Glarehover'

export const revalidate = 300;
// 1. DYNAMIC METADATA ENGINE
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`);
    const data = await res.json();
    if (!data.success || !data.data?.blog) return {};

    const blog = data.data.blog;
    return {
      title: blog.seoMetaTitle || `${blog.title} | Clezo Express Laundry`,
      description: blog.seoMetaDescription || blog.excerpt || "Read our latest insights.",
      keywords: blog.seoMetaKeywords || "",
      alternates: {
        canonical: blog.seoCanonicalUrl || `https://clezo.com/blogs/${blog.slug}`,
      },
      robots: blog.seoIsNoIndex ? "noindex, nofollow" : "index, follow",
      openGraph: {
        title: blog.seoMetaTitle || blog.title,
        description: blog.seoMetaDescription || blog.excerpt,
        url: `https://clezo.com/blogs/${blog.slug}`,
        type: 'article',
        images: blog.coverImage ? [{ url: blog.coverImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.seoMetaTitle || blog.title,
        description: blog.seoMetaDescription || blog.excerpt,
        images: blog.coverImage ? [blog.coverImage] : [],
      }
    };
  } catch (error) {
    return {};
  }
}

// 2. SERVER COMPONENT PAGE
export default async function SingleBlogPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let blog = null;
  let similarBlogs = [];
  let allCategories = [];

  try {
    // Fetch Single Blog
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`);
    const data = await res.json();
    if (data.success && data.data?.blog) {
      blog = data.data.blog;

      // Fetch All Blogs (to filter for similar blogs and categories)
      const resAll = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
      const dataAll = await resAll.json();
      
      let allBlogsList = [];
      if (dataAll.success && Array.isArray(dataAll.data)) {
        allBlogsList = dataAll.data;
      } else if (dataAll.success && dataAll.data?.blogs) {
        allBlogsList = dataAll.data.blogs;
      }

      if (allBlogsList.length > 0) {
        const publishedBlogs = allBlogsList.filter(b => b.isPublished);
        allCategories = [...new Set(publishedBlogs.map(b => b.category))].filter(Boolean);
        similarBlogs = publishedBlogs.filter(b => b.category === blog.category && b.id !== blog.id).slice(0, 3);

        // Recommendation Engine Fallback: If no blogs in this exact category, show the latest published blogs
        if (similarBlogs.length === 0) {
          similarBlogs = publishedBlogs.filter(b => b.id !== blog.id).slice(0, 3);
        }
      }
    }
  } catch (err) {
    console.error("Fetch error", err);
  }

  if (!blog) return notFound();

  // Inject JSON-LD Schema
  const jsonLd = blog.seoJsonLdSchema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: blog.seoJsonLdSchema }}
    />
  ) : null;

  return (
    <main className="min-h-screen pt-2 pb-12">
      {jsonLd}

      <div className="container px-4 sm:px-6 lg:px-8">

        {/* HEADER SECTION */}
        <div className="max-w-6xl mx-auto text-center pt-[140px] pb-8 relative">
          {/* Ambient Header Glares */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

          {blog.category && (
            <Link href={`/blogs?category=${encodeURIComponent(blog.category)}`} className="inline-block bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 shadow-sm transition-all duration-300 z-10 relative">
              {blog.category}
            </Link>
          )}
          
          {/* Cool Left/Right Decorated Title */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 z-10 relative">
            <div className="hidden md:flex items-center gap-2 opacity-70">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-primary"></div>
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,174,230,0.8)] animate-pulse"></div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight max-w-4xl">
              {blog.title}
            </h1>

            <div className="hidden md:flex items-center gap-2 opacity-70">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,174,230,0.8)] animate-pulse"></div>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-primary"></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 z-10 relative">
            <span className="text-on-surface">{blog.customAuthor || blog.author?.name || 'Clezo Team'}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* FEATURED IMAGE */}
        {blog.coverImage && (
          <div className="max-w-6xl mx-auto relative mb-16 z-0">
            {/* The sweeping background color blast */}
            <div className="absolute -inset-4 md:-inset-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-secondary/10 to-transparent blur-[60px] rounded-[3rem] -z-10 animate-pulse"></div>

            <GlareHover glareColor="#00aee6" glareOpacity={0.4} glareAngle={-30} glareSize={400} transitionDuration={800} playOnce={false} className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 bg-white" >
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="100vw"
                priority
                className="object-cover object-top hover:scale-105 transition transform duration-[2s] ease-out"
              />
            </GlareHover>
          </div>
        )}

        {/* CONTENT GRID (TOC + ARTICLE + SIDEBAR) */}
        <div className="flex flex-col lg:flex-row gap-12 mt-16">

          {/* Main Article Content */}
          <article className="flex-1 min-w-0 z-10">
            {/* The blog-content class is used by TableOfContents to find headings */}
            <div
              className="blog-content prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:text-primary prose-headings:scroll-mt-28 prose-a:text-secondary hover:prose-a:opacity-80 prose-img:rounded-2xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Dynamic FAQs */}
            <BlogFaq faqs={blog.faqs} />
          </article>

          {/* Right Sidebar (TOC & Categories) */}
          <aside className="lg:w-80 shrink-0 sticky top-24 h-fit flex flex-col gap-8 z-10">
            <TableOfContents />

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 group-hover:scale-150 transition-all duration-700 pointer-events-none -z-10" />
              <h3 className="text-lg font-black text-on-surface mb-5 tracking-tight uppercase">Categories</h3>
              <ul className="space-y-3">
                {allCategories.map(cat => (
                  <li key={cat}>
                    <Link href={`/blogs?category=${encodeURIComponent(cat)}`} className="w-full flex items-center justify-between text-sm font-bold px-4 py-3 rounded-xl transition-all duration-300 text-on-surface-variant bg-white/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm hover:text-primary">
                      <span>{cat}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* SIMILAR BLOGS SECTION */}
        {similarBlogs.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <h3 className="text-3xl font-black text-on-surface mb-8 tracking-tight uppercase">Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarBlogs.map(similar => (
                <Link href={`/blogs/${similar.slug}`} key={similar.id} className="group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,174,230,0.15)] hover:bg-white/60 hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 flex flex-col h-full">
                  {/* Color Blast inside Card */}
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/40 group-hover:scale-150 transition-all duration-700 pointer-events-none -z-10" />

                  <div className="relative h-56 w-full overflow-hidden shrink-0 rounded-t-[2rem] border-b border-white/50">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10 pointer-events-none"></div>
                    <Image
                      src={similar.coverImage || '/default-placeholder.png'}
                      alt={similar.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                    <h4 className="text-xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">{similar.title}</h4>
                    <p className="text-on-surface-variant text-sm line-clamp-3 leading-relaxed font-medium">{similar.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
