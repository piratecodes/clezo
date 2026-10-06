import { useState, useEffect, useMemo, Fragment } from 'react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { Loader2, Search, Plus, MapPin, Briefcase, Edit3, Trash2, LayoutTemplate, XCircle, Filter, ChevronDown, Check } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';

import SeoPageFormDrawer from '@/components/seo/SeoPageFormDrawer';
import ServiceModal from '@/components/services/ServiceModal';

// Helper to format slugs (e.g., 'packers-and-movers' -> 'Packers And Movers')
const formatSlug = (slug) => {
  if (!slug) return '—';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function SeoPages() {
  useDocumentMeta("SEO Landing Pages | Clezo Express Laundry", "Manage programmatic SEO content.");

  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetchClient('/service-categories');
      const data = Array.isArray(response) ? response : (response.data || []);
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Could not connect to API. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleOpenNew = () => {
    setSelectedPage(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (page) => {
    setSelectedPage(page);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will remove the SEO data for this category.")) return;
    try {
      // Just clear the SEO fields instead of deleting the category
      await fetchClient(`/service-categories/${id}`, { 
        method: 'PATCH',
        body: JSON.stringify({ seoMetaTitle: null, seoMetaDescription: null, sections: null })
      });
      toast.success('SEO content cleared');
      loadPages();
    } catch (error) {
      toast.error(error.message || 'Failed to clear');
    }
  };

  // Extract unique categories for dropdown
  const uniqueCategories = useMemo(() => [...new Set(pages.map(p => p.slug))].filter(Boolean), [pages]);

  // SYNCED FILTER ENGINE
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      // Only show pages that have at least SOME SEO content configured
      const hasSeoContent = page.seoMetaTitle || page.pageTitle || page.seoMetaDescription || (page.sections && page.sections.length > 0);
      if (!hasSeoContent) return false;

      const categorySlug = (page.slug || '').toLowerCase();
      const title = (page.seoMetaTitle || page.headerTitle || page.name || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      // 1. Search Bar Match
      const matchesSearch = !query || categorySlug.includes(query) || title.includes(query);
      
      // 2. Dropdown Match
      const matchesCategory = !selectedCategory || categorySlug === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [pages, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="max-w-[1600px] mx-auto space-y-8 p-4 md:p-0 relative z-10"
    >
      
      {/* Header Section */}
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">SEO Landing Pages</h1>
          <p className="text-slate-400 font-medium mt-1">Manage programmatic SEO content and pages.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by city, service, or title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium text-white placeholder-slate-500 transition-all" 
            />
          </div>

          {/* Category Filter using Headless UI */}
          <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            <div className="relative w-full sm:w-48 z-40">
              <ListboxButton className="w-full flex items-center justify-between pl-9 pr-4 py-2.5 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl outline-none text-sm font-medium text-white transition-all hover:bg-black/40">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <span className="truncate">{selectedCategory ? formatSlug(selectedCategory) : 'All Categories'}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute w-full mt-2 bg-[#0B202D]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] py-2 max-h-60 overflow-auto focus:outline-none z-50">
                  <ListboxOption
                    value=""
                    className={({ active }) => `cursor-pointer select-none relative py-2 pl-10 pr-4 text-sm font-medium transition-colors ${active ? 'bg-primary/20 text-white' : 'text-slate-300'}`}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-bold text-primary' : ''}`}>All Categories</span>
                        {selected && <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={14} />}
                      </>
                    )}
                  </ListboxOption>
                  {uniqueCategories.map(c => (
                    <ListboxOption
                      key={c}
                      value={c}
                      className={({ active }) => `cursor-pointer select-none relative py-2 pl-10 pr-4 text-sm font-medium transition-colors ${active ? 'bg-primary/20 text-white' : 'text-slate-300'}`}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-bold text-primary' : ''}`}>{formatSlug(c)}</span>
                          {selected && <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={14} />}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>

          <button onClick={() => setIsServiceModalOpen(true)} className="shrink-0 flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 text-slate-300 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Plus size={16} strokeWidth={3} /> Create Service
          </button>
          <button onClick={handleOpenNew} className="shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5">
            <Plus size={16} strokeWidth={3} /> New Page
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden relative">
        {/* Ambient Glare */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full animate-pulse"></div>
            <Loader2 className="animate-spin text-primary relative z-10" size={40} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest relative z-10">Loading Database...</p>
          </div>
        ) : filteredPages.length === 0 && !searchQuery && !selectedCategory ? (
          <div className="text-center py-20">
            <LayoutTemplate className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white">The matrix is empty</h3>
            <p className="text-slate-400 mt-2">Build your first SEO-optimized landing page to get started.</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-20">
            <XCircle className="mx-auto h-16 w-16 text-red-500/50 mb-4" />
            <h3 className="text-xl font-bold text-white">No matches found</h3>
            <p className="text-slate-400 mt-2">Adjust your search or filters to see results.</p>
            <button onClick={clearFilters} className="mt-4 text-primary font-bold text-sm hover:underline">
                Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar relative z-10">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">H1 Title</th>
                  <th className="px-6 py-5">Content Strength</th>
                  <th className="px-6 py-5 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                <AnimatePresence>
                  {filteredPages.map((page) => (
                    <motion.tr 
                      key={page.id} 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-primary/70" />
                          <span className="font-bold text-slate-300 text-sm">{page.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-300 text-sm line-clamp-1">
                          {page.seoMetaTitle || page.headerTitle || <span className="text-red-400 italic font-medium">No SEO Title</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                              <div className="h-full bg-primary" style={{ width: `${(page.sections?.length || 0) * 10}%` }} />
                          </div>
                          <span className="text-[11px] font-black text-primary">{page.sections?.length || 0}/10</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(page)} 
                            className="p-2 text-slate-400 hover:text-primary bg-white/5 hover:bg-primary/20 border border-white/5 hover:border-primary/30 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(page.id)} 
                            className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <SeoPageFormDrawer 
        isOpen={isDrawerOpen} 
        setIsOpen={setIsDrawerOpen} 
        pageData={selectedPage} 
        existingPages={pages}
        onSuccess={loadPages} 
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        setIsOpen={setIsServiceModalOpen}
        categoryData={null}
        nextOrder={pages.length > 0 ? Math.max(...pages.map(p => p.order || 0)) + 1 : 1}
        existingOrders={pages.map(p => p.order)}
        onSuccess={loadPages}
      />
    </motion.div>
  );
}
