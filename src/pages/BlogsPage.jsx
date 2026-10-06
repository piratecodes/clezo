import { useState, useEffect, useMemo, Fragment } from 'react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { Loader2, Search, Plus, Edit3, Trash2, Filter, ChevronLeft, ChevronRight, Check, ChevronsUpDown, Tag, Calendar, BookOpen } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion, AnimatePresence } from 'framer-motion';

import BlogFormDrawer from '@/components/blogs/BlogFormDrawer';

export default function BlogsPage() {
  useDocumentMeta("Blogs | Clezo Express Laundry", "Manage blog posts.");

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PUBLISHED, DRAFT
  const [dateFilter, setDateFilter] = useState('NEWEST'); // NEWEST, OLDEST, RECENTLY_MODIFIED
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [10, 25, 50, 100];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetchClient('/blogs');
      setBlogs(response.data?.blogs || []);
    } catch (error) {
      toast.error('Could not connect to API. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenNew = () => {
    setSelectedBlog(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetchClient(`/blogs/${id}`, { method: 'DELETE' });
      toast.success("Blog deleted successfully");
      loadBlogs();
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  // Advanced Filtering & Sorting
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title?.toLowerCase().includes(q) ||
        b.slug?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter === 'PUBLISHED') {
      result = result.filter(b => b.isPublished);
    } else if (statusFilter === 'DRAFT') {
      result = result.filter(b => !b.isPublished);
    }

    // 2.5 Category Filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(b => b.category === categoryFilter);
    }

    // 3. Date Sort
    if (dateFilter === 'NEWEST') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateFilter === 'OLDEST') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (dateFilter === 'RECENTLY_MODIFIED') {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return result;
  }, [blogs, searchQuery, statusFilter, dateFilter, categoryFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  
  // Calculate unique categories for dropdown
  const uniqueCategories = useMemo(() => {
    return [...new Set(blogs.map(b => b.category).filter(Boolean))].sort();
  }, [blogs]);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, itemsPerPage]);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-8rem)] gap-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Blogs & Articles</h1>
          <p className="text-slate-400 font-medium mt-1">Manage marketing content, drafts, and automated SEO.</p>
        </motion.div>
        <button
          onClick={handleOpenNew}
          className="bg-primary hover:bg-primary-fixed-variant text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] font-bold hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          Create Blog
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
        className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden flex flex-col flex-1 min-h-0"
      >
        
        {/* Ambient Glare */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

        {/* Advanced Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col md:flex-row items-center gap-4 rounded-t-xl z-20 relative">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, slug, or category..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm text-white placeholder-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto z-10">
            <div className="relative w-full md:w-44">
              <Listbox value={statusFilter} onChange={setStatusFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-lg bg-black/20 py-2 pl-3 pr-10 text-left border border-white/10 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary sm:text-sm transition-all text-white">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{statusFilter === 'ALL' ? 'All Status' : statusFilter === 'PUBLISHED' ? 'Published' : 'Drafts'}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-900 border border-white/10 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {['ALL', 'PUBLISHED', 'DRAFT'].map((status) => (
                        <ListboxOption key={status} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-white'}`} value={status}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                                {status === 'ALL' ? 'All Status' : status === 'PUBLISHED' ? 'Published' : 'Drafts'}
                              </span>
                              {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check className="h-4 w-4" aria-hidden="true" /></span> : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div className="relative w-full md:w-48">
              <Listbox value={categoryFilter} onChange={setCategoryFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-lg bg-black/20 py-2 pl-3 pr-10 text-left border border-white/10 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary sm:text-sm transition-all text-white">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{categoryFilter === 'ALL' ? 'All Categories' : categoryFilter}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-900 border border-white/10 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {['ALL', ...uniqueCategories].map((cat) => (
                        <ListboxOption key={cat} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-white'}`} value={cat}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                                {cat === 'ALL' ? 'All Categories' : cat}
                              </span>
                              {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check className="h-4 w-4" aria-hidden="true" /></span> : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div className="relative w-full md:w-48">
              <Listbox value={dateFilter} onChange={setDateFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-lg bg-black/20 py-2 pl-3 pr-10 text-left border border-white/10 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary sm:text-sm transition-all text-white">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{dateFilter === 'NEWEST' ? 'Newest Created' : dateFilter === 'OLDEST' ? 'Oldest Created' : 'Recently Modified'}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute right-0 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-900 border border-white/10 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {['NEWEST', 'OLDEST', 'RECENTLY_MODIFIED'].map((date) => (
                        <ListboxOption key={date} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-white'}`} value={date}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                                {date === 'NEWEST' ? 'Newest Created' : date === 'OLDEST' ? 'Oldest Created' : 'Recently Modified'}
                              </span>
                              {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check className="h-4 w-4" aria-hidden="true" /></span> : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 relative z-10">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center p-12 text-slate-500 relative z-10">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <p className="text-lg font-bold text-white">No blogs found</p>
            <p className="text-sm">Try adjusting your filters or create a new blog.</p>
          </div>
        ) : (
          <>
            <div className="overflow-auto flex-1 relative z-10 custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400 font-bold border-b border-white/10 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Title & Slug</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {paginatedBlogs.map((blog, idx) => (
                      <motion.tr 
                        key={blog.id} 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                      <td className="px-6 py-4">
                        <p className="font-bold text-white max-w-xs truncate group-hover:text-primary transition-colors" title={blog.title}>{blog.title}</p>
                        <p className="text-xs text-slate-400 max-w-xs truncate">/{blog.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                          {blog.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={blog.author?.profilePic && blog.author.profilePic !== 'default-avatar.png' ? `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '')}/uploads/${blog.author.profilePic}` : '/default-avatar.png'} alt="Author" className="h-6 w-6 rounded-full object-cover border border-white/10" />
                          <span className="text-slate-300 truncate max-w-25 font-bold">{blog.author?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-slate-300"><span className="font-bold text-slate-500">Created:</span> {new Date(blog.createdAt).toLocaleDateString()}</span>
                          <span className="text-slate-300"><span className="font-bold text-slate-500">Modified:</span> {new Date(blog.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {blog.isPublished ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full text-xs font-bold border border-emerald-500/20">Published</span>
                        ) : (
                          <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full text-xs font-bold border border-amber-500/20">Draft</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-4 rounded-b-xl z-20 relative">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 font-bold">Rows per page:</span>
                  <div className="relative w-20">
                    <Listbox value={itemsPerPage} onChange={setItemsPerPage}>
                      <div className="relative mt-1">
                        <ListboxButton className="relative w-full cursor-default rounded-lg bg-black/20 py-1.5 pl-3 pr-8 text-left border border-white/10 focus:outline-none sm:text-sm font-bold text-white transition-all">
                          <span className="block truncate">{itemsPerPage}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <ListboxOptions className="absolute bottom-full mb-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-900 border border-white/10 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[100]">
                            {itemsPerPageOptions.map((opt) => (
                              <ListboxOption key={opt} className={({ active }) => `relative cursor-default select-none py-2 px-4 transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-white'}`} value={opt}>
                                {({ selected }) => <span className={`block truncate ${selected ? 'font-bold text-primary' : 'font-normal'}`}>{opt}</span>}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                </div>
                <span className="text-sm text-slate-400">
                  Showing <span className="font-bold text-white">{filteredBlogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, filteredBlogs.length)}</span> of <span className="font-bold text-white">{filteredBlogs.length}</span> entries
                </span>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-1 shadow-sm">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold px-3 text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>

      <BlogFormDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        blog={selectedBlog} 
        onSuccess={loadBlogs} 
      />
    </div>
  );
}
