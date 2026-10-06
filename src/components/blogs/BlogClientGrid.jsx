"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import GlareHover from '@/components/Glarehover';
import { motion } from 'framer-motion';

export default function BlogClientGrid({ initialBlogs, categories }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Sync state with URL
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    if (cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams, selectedCategory]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    router.push(cat ? `/blogs?category=${encodeURIComponent(cat)}` : '/blogs', { scroll: false });
  };

  const filteredBlogs = initialBlogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const recent5Blogs = initialBlogs.slice(0, 5);
  const isDefaultView = !searchQuery && !selectedCategory;

  // Category Counts
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = initialBlogs.filter(b => b.category === cat).length;
    return acc;
  }, {});


  // Main Card Component to avoid duplication
  const BlogCard = ({ blog, index = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="h-full z-10"
    >
      <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,174,230,0.15)] hover:bg-white/60 hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 flex flex-col h-full">
        {/* Color Blast inside Card */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/40 group-hover:scale-150 transition-all duration-700 pointer-events-none -z-10" />

        <div className="relative h-56 w-full overflow-hidden shrink-0 rounded-t-[2rem] border-b border-white/50">
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10 pointer-events-none"></div>
          <Image
            src={blog.coverImage || '/default-placeholder.png'}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
          {blog.category && <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-3 bg-primary/10 border border-primary/20 w-max px-3 py-1 rounded-full">{blog.category}</span>}
          <h3 className="text-xl md:text-2xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">{blog.title}</h3>
          <p className="text-on-surface-variant text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-medium">{blog.excerpt}</p>
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold pt-5 border-t border-gray-200/50 mt-auto uppercase tracking-wider">
            <span className="text-on-surface">{blog.customAuthor || blog.author?.name || 'Clezo Team'}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0">

          {/* Default View: Hero + Category Rows */}
          {isDefaultView ? (
            <div className="space-y-16">

              {/* HERO FEATURE */}
              {initialBlogs.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12 relative"
                >
                  {/* Hero Ambient Glare */}
                  <div className="absolute -top-10 -left-10 w-[80%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-secondary/10 to-transparent blur-[80px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

                  <h2 className="text-3xl font-black text-on-surface mb-8 tracking-tight uppercase">Featured <span className="text-primary">Insight</span></h2>
                  <Link href={`/blogs/${initialBlogs[0].slug}`} className="group relative rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_rgba(0,174,230,0.2)] hover:-translate-y-2 transition-all duration-500 block bg-white h-[450px] md:h-[550px]">
                    <GlareHover glareColor="#00aee6" glareOpacity={0.4} glareAngle={-30} glareSize={400} transitionDuration={800} playOnce={false} className="w-full h-full rounded-[2.5rem]">
                      <figure className="w-full h-[450px] md:h-[550px] relative rounded-[2.5rem] overflow-hidden" >
                        <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10 pointer-events-none"></div>
                        <Image
                          src={initialBlogs[0].coverImage || '/default-placeholder.png'} alt={initialBlogs[0].title}
                          fill sizes="100vw" priority className="object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out"
                        />
                      </figure>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020b14]/90 via-[#020b14]/40 to-transparent z-10 rounded-[2.5rem]" />
                      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4 z-20">
                        {initialBlogs[0].category && (
                          <span className="inline-block bg-primary/20 backdrop-blur-md border border-primary/50 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 shadow-[0_0_15px_rgba(0,174,230,0.5)]">
                            {initialBlogs[0].category}
                          </span>
                        )}
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight">{initialBlogs[0].title}</h3>
                        <p className="text-white/80 text-base md:text-lg mb-6 line-clamp-2 font-medium">{initialBlogs[0].excerpt}</p>
                        <div className="flex items-center text-white/60 text-xs font-bold uppercase tracking-widest">
                          <span className="text-white">{initialBlogs[0].customAuthor || initialBlogs[0].author?.name || 'Clezo Team'}</span>
                          <span className="mx-3">•</span>
                          <span>{new Date(initialBlogs[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </GlareHover>
                  </Link>
                </motion.div>
              )}

              {/* CATEGORY ROWS */}
              {categories.map(cat => {
                const catBlogs = initialBlogs.filter(b => b.category === cat && b.id !== initialBlogs[0]?.id).slice(0, 4);
                if (catBlogs.length === 0) return null;

                return (
                  <div key={cat} className="pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">{cat}</h3>
                      <button onClick={() => handleCategorySelect(cat)} className="text-xs font-bold uppercase tracking-widest text-primary hover:animate-pulse hover:cursor-pointer flex items-center gap-1 transition-colors z-10 bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white">
                        Show More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 z-10 relative">
                      {catBlogs.map((blog, idx) => <BlogCard key={blog.id} blog={blog} index={idx} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (

            /* FILTERED / SEARCH VIEW */
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredBlogs.length} posts</span>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[40px] rounded-full pointer-events-none -z-10" />
                  <p className="text-2xl font-black text-on-surface">No articles found.</p>
                  <p className="text-on-surface-variant font-medium mt-2">Try adjusting your search or category filter.</p>
                  <button onClick={() => { setSearchQuery(''); handleCategorySelect(''); }} className="mt-8 bg-[#020b14] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filteredBlogs.map((blog, idx) => <BlogCard key={blog.id} blog={blog} index={idx} />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:w-80 shrink-0 sticky top-24 h-fit flex-col gap-8 hidden lg:flex z-10">

          {/* SEARCH BOX */}
          <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700 pointer-events-none -z-10" />
            <h3 className="text-lg font-black text-on-surface mb-5 tracking-tight uppercase">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200/60 rounded-xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm text-on-surface font-medium placeholder-gray-400"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSearchQuery(''); }} className="mt-3 text-[10px] uppercase font-bold tracking-widest text-primary hover:text-[#020b14] w-full text-right transition-colors">
                Clear Search
              </button>
            )}
          </div>

          {/* CATEGORIES AUTO */}
          <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 group-hover:scale-150 transition-all duration-700 pointer-events-none -z-10" />
            <h3 className="text-lg font-black text-on-surface mb-5 tracking-tight uppercase">Categories</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full flex items-center justify-between text-sm font-bold px-4 py-3 rounded-xl transition-all duration-300 ${!selectedCategory ? 'bg-[#020b14] text-white shadow-md' : 'text-on-surface-variant bg-white/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm'}`}
                >
                  <span>All Articles</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${!selectedCategory ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {initialBlogs.length}
                  </span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between text-sm font-bold px-4 py-3 rounded-xl transition-all duration-300 ${selectedCategory === cat ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-on-surface-variant bg-white/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm'}`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RECENT 5 POSTS */}
          <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <h3 className="text-lg font-black text-on-surface mb-5 tracking-tight uppercase">Recent Posts</h3>
            <div className="space-y-5">
              {recent5Blogs.map(blog => (
                <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group flex items-center gap-4 hover:bg-white p-3 -mx-3 rounded-2xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-100">
                  <figure className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                    <Image src={blog.coverImage || '/default-placeholder.png'} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </figure>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">{blog.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1.5 block">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>

        {/* MOBILE SIDEBAR (Visible only on smaller screens, no sticky) */}
        <aside className="w-full shrink-0 space-y-8 lg:hidden flex flex-col gap-8">
          {/* SEARCH BOX */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Search Articles</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:border-transparent transition-all shadow-inner text-gray-900"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSearchQuery(''); }} className="mt-3 text-xs text-gray-500 hover:text-gray-900 font-medium w-full text-right">
                Clear Search
              </button>
            )}
          </div>

          {/* CATEGORIES AUTO */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full flex items-center justify-between text-sm font-medium p-3 rounded-xl transition-colors ${!selectedCategory ? 'bg-[#112440] text-white shadow-md' : 'text-gray-700 bg-gray-50 hover:bg-gray-100'}`}
                >
                  <span>All Articles</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${!selectedCategory ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {initialBlogs.length}
                  </span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between text-sm font-medium p-3 rounded-xl transition-colors ${selectedCategory === cat ? 'bg-[#112440] text-white shadow-md' : 'text-gray-700 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <span>{cat}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}
