import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { Fragment, useState, useEffect, useMemo, useRef } from 'react';
import { X, Save, Loader2, Image as ImageIcon, Plus, Trash2, UploadCloud, FileText, Settings, Code, ChevronsUpDown, Check, Link, Unlink, RotateCcw } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';

// --- Subcomponent for FAQ Items to prevent Jodit cursor jumps ---
const FaqItem = ({ faq, idx, removeFaq, updateFaq, minimalJoditConfig }) => {
  // We only pass the initial answer to Jodit so it doesn't reset when parent re-renders!
  const [initialAnswer] = useState(faq.answer || '');
  
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-lg relative group transition-colors">
      <button onClick={() => removeFaq(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded shadow-sm p-1 opacity-0 group-hover:opacity-100 transition-all">
        <Trash2 size={14} />
      </button>
      <div className="space-y-3 pr-8">
        <input 
          type="text" 
          value={faq.question} 
          onChange={e => updateFaq(idx, 'question', e.target.value)} 
          placeholder="Question..." 
          className="w-full font-bold text-white bg-transparent border-b border-white/20 focus:border-primary focus:outline-none pb-1 placeholder-slate-500" 
        />
        <div className="mt-2 bg-white rounded-lg overflow-hidden border border-gray-200">
          <JoditEditor
            value={initialAnswer}
            config={minimalJoditConfig}
            onBlur={newContent => updateFaq(idx, 'answer', newContent)}
            onChange={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};

export default function BlogFormDrawer({ isOpen, onClose, blog, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'content', 'seo'
  const [existingCategories, setExistingCategories] = useState([]);
  const [query, setQuery] = useState('');

  const filteredCategories = query === '' 
    ? existingCategories 
    : existingCategories.filter((cat) => cat.toLowerCase().includes(query.toLowerCase()));

  // Jodit config
  const editorRef = useRef(null);
  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your blog...',
    height: 500,
    enableDragAndDropFileToEditor: true,
    uploader: { insertImageAsBase64URI: true }, // Simple base64 for inline images
    toolbarAdaptive: false, // dYOY FIX: Prevents toolbar buttons from vanishing when resizing/toggling code view!
    showTooltip: true,
    
    useNativeTooltip: true, // Native browser tooltips are fully reliable for hover
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', 'eraser', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'paragraph', 'classSpan', '|',
      'superscript', 'subscript', 'brush', '|',
      'file', 'image', 'video', '\n',
      
      'spellcheck', 'speechRecognize', '|',
      'cut', 'copy', 'paste', 'selectall', 'copyformat', '|',
      'hr', 'table', 'link', 'symbol', '|',
      'align', 'undo', 'redo', '|',
      'find', 'source', 'fullsize', 'preview', 'print'
    ]
  }), []);

  const minimalJoditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Answer (supports formatting & links)...',
    height: 90,
    toolbarAdaptive: false,
    useNativeTooltip: true,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', 'eraser', '|',
      'ul', 'ol', '|',
      'superscript', 'subscript', 'brush', '|',
      'align', 'undo', 'redo', '|',
      'link', 'source', 'fullsize'
    ]
  }), []);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    coverImageAlt: '',
    category: '',
    customAuthor: '',
    isPublished: true,
    faqs: [],
    seoMetaTitle: '',
    seoMetaDescription: '',
    seoMetaKeywords: '',
    seoCanonicalUrl: '',
    seoIsNoIndex: false,
    seoJsonLdSchema: ''
  });

  useEffect(() => {
    // Fetch categories for the creatable select
    fetchClient('/blogs/categories').then(res => {
      if (res.data?.categories) {
        setExistingCategories(res.data.categories);
      }
    }).catch(console.error);
  }, []);

  const handleCategorySelect = async (catName) => {
    setFormData(prev => ({ ...prev, category: catName }));
    if (!catName || formData.excerpt) return;
    try {
      const res = await fetchClient('/blogs');
      if (res.data?.blogs) {
        const matchingBlog = res.data.blogs.find(b => b.category === catName && b.excerpt);
        if (matchingBlog) {
          setFormData(prev => ({ ...prev, excerpt: matchingBlog.excerpt }));
          toast.success(`Loaded previous excerpt for "${catName}"`);
        }
      }
    } catch(e) {}
  };

  const [touchedFields, setTouchedFields] = useState({ seoMetaTitle: false, seoMetaDescription: false, seoJsonLdSchema: false });
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (blog && isOpen) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        coverImage: blog.coverImage || '',
        coverImageAlt: blog.coverImageAlt || '',
        category: blog.category || '',
        customAuthor: blog.customAuthor || '',
        isPublished: blog.isPublished ?? true,
        faqs: blog.faqs || [],
        seoMetaTitle: blog.seoMetaTitle || '',
        seoMetaDescription: blog.seoMetaDescription || '',
        seoMetaKeywords: blog.seoMetaKeywords || '',
        seoCanonicalUrl: blog.seoCanonicalUrl || '',
        seoIsNoIndex: blog.seoIsNoIndex ?? false,
        seoJsonLdSchema: blog.seoJsonLdSchema || ''
      });
      setTouchedFields({
        seoMetaTitle: !!blog.seoMetaTitle,
        seoMetaDescription: !!blog.seoMetaDescription,
        seoJsonLdSchema: !!blog.seoJsonLdSchema
      });
      setEditorContent(blog.content || '');
      setActiveTab('basic');
    } else if (!blog && isOpen) {
      // Reset
      setFormData({
        title: '', slug: '', excerpt: '', content: '', coverImage: '', coverImageAlt: '', category: '', customAuthor: '',
        isPublished: true, faqs: [], seoMetaTitle: '', seoMetaDescription: '', 
        seoMetaKeywords: '', seoCanonicalUrl: '', seoIsNoIndex: false, seoJsonLdSchema: ''
      });
      setTouchedFields({ seoMetaTitle: false, seoMetaDescription: false, seoJsonLdSchema: false });
      setEditorContent('');
      setActiveTab('basic');
    }
  }, [blog, isOpen]);

  // Automated SEO Engine
  useEffect(() => {
    setFormData(prev => {
      let updated = { ...prev };
      let changed = false;

      // 1. Meta Title
      if (!touchedFields.seoMetaTitle && prev.title !== prev.seoMetaTitle) {
        updated.seoMetaTitle = prev.title;
        changed = true;
      }

      // 2. Meta Description
      if (!touchedFields.seoMetaDescription) {
        const strippedText = prev.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        const excerpt = strippedText.length > 180 ? strippedText.substring(0, 180) + '...' : strippedText;
        if (excerpt && excerpt !== prev.seoMetaDescription) {
          updated.seoMetaDescription = excerpt;
          changed = true;
        }
      }

      // 3. JSON-LD Schema
      if (!touchedFields.seoJsonLdSchema) {
        const authorName = prev.customAuthor || "Admin";
        
        const currentMetaDesc = updated.seoMetaDescription !== undefined ? updated.seoMetaDescription : prev.seoMetaDescription;
        const currentMetaTitle = updated.seoMetaTitle !== undefined ? updated.seoMetaTitle : prev.seoMetaTitle;

        const datePublished = (blog?.createdAt ? new Date(blog.createdAt) : new Date()).toISOString().split('T')[0];
        const dateModified = new Date().toISOString().split('T')[0];

        const schemaObj = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": currentMetaTitle || prev.title,
          "image": prev.coverImage ? [prev.coverImage] : [],
          "author": {
            "@type": "Person",
            "name": authorName
          },
          "publisher": {
            "@type": "Organization",
            "name": "Clezo Express Laundry",
            "logo": {
              "@type": "ImageObject",
              "url": "https://clezo.com/logo.png"
            }
          },
          "datePublished": datePublished,
          "dateModified": dateModified,
          "description": currentMetaDesc || "",
          "url": prev.seoCanonicalUrl || `https://clezo.com/blogs/${prev.slug || ''}`,
          "mainEntityOfPage": `https://clezo.com/blogs/${prev.slug || ''}`
        };

        const newSchemaStr = JSON.stringify(schemaObj, null, 2);
        if (newSchemaStr !== prev.seoJsonLdSchema) {
          updated.seoJsonLdSchema = newSchemaStr;
          changed = true;
        }
      }

      return changed ? updated : prev;
    });
  }, [formData.title, formData.content, formData.coverImage, formData.slug, formData.customAuthor, formData.seoCanonicalUrl, formData.seoMetaTitle, formData.seoMetaDescription, touchedFields, blog]);

  // Cloudinary Widget
  const openCloudinaryWidget = () => {
    if (!window.cloudinary) return toast.error("Cloudinary script missing.");
    window.cloudinary.openUploadWidget({
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'piratecodes',
      folder: import.meta.env.MODE === 'development' ? 'dev/blogs' : 'blogs',
      cropping: true,
      multiple: false
    }, async (error, result) => {
      if (!error && result && result.event === "success") {
        // If they already had an image, delete the old one from Cloudinary to save space
        if (formData.coverImage) {
          try {
            await fetchClient('/location-pages/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: formData.coverImage }) });
          } catch(e) { console.error("Failed to delete old image", e); }
        }
        setFormData(prev => ({ ...prev, coverImage: result.info.secure_url }));
      }
    });
  };

  const handleDeleteImage = async () => {
    if (!formData.coverImage) return;
    try {
      await fetchClient('/location-pages/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: formData.coverImage }) });
      setFormData(prev => ({ ...prev, coverImage: '' }));
      toast.success("Image deleted from Cloudinary");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) return toast.error("Title and Slug are required");
    
    const payload = { ...formData };
    
    // Strip frontend-only _id from faqs before sending to strict backend validator
    if (payload.faqs && payload.faqs.length > 0) {
      payload.faqs = payload.faqs.map(({ _id, ...rest }) => rest);
    }

    setIsLoading(true);
    try {
      if (blog?.id) {
        await fetchClient(`/blogs/${blog.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success("Blog updated!");
      } else {
        await fetchClient('/blogs', { method: 'POST', body: JSON.stringify(payload) });
        toast.success("Blog created!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  };

  const autoGenerateSlug = (title) => {
    if (blog?.id) return; // Don't auto-change slug on edit unless they wipe it
    const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug: newSlug }));
  };

  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { _id: Date.now().toString(), question: '', answer: '' }] }));
  const removeFaq = (idx) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
  const updateFaq = (idx, field, val) => {
    const newFaqs = [...formData.faqs];
    newFaqs[idx][field] = val;
    setFormData(prev => ({ ...prev, faqs: newFaqs }));
  };

  return (
    <>
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-end p-0">
            <TransitionChild as={Fragment} enter="transform transition ease-in-out duration-300 sm:duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300 sm:duration-500" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <DialogPanel className="w-full max-w-5xl transform overflow-hidden bg-on-primary-fixed/95 backdrop-blur-2xl border-l border-white/10 h-screen shadow-[0_0_60px_rgba(0,174,230,0.15)] flex flex-col relative">
                
                {/* Modal Sky Glare */}
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/20 blur-[80px] pointer-events-none -z-10 rounded-full"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 relative z-10">
                  <DialogTitle as="h3" className="text-lg font-bold text-white tracking-tight drop-shadow-md">
                    {blog ? 'Edit Blog Post' : 'Create New Blog'}
                  </DialogTitle>
                  <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 shadow-sm border border-white/10 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6 bg-black/20 relative z-10">
                  <button onClick={() => setActiveTab('basic')} className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'basic' ? 'border-primary text-primary drop-shadow-[0_0_10px_rgba(0,174,230,0.5)]' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    <FileText className="w-4 h-4" /> Basics
                  </button>
                  <button onClick={() => setActiveTab('content')} className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'content' ? 'border-primary text-primary drop-shadow-[0_0_10px_rgba(0,174,230,0.5)]' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    <Code className="w-4 h-4" /> Content Editor
                  </button>
                  <button onClick={() => setActiveTab('seo')} className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'seo' ? 'border-primary text-primary drop-shadow-[0_0_10px_rgba(0,174,230,0.5)]' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    <Settings className="w-4 h-4" /> SEO Data
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-transparent custom-scrollbar relative z-10">
                  
                  {activeTab === 'basic' && (
                    <div className="space-y-6 max-w-6xl">
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Title <span className="text-primary">*</span></label>
                        <input type="text" value={formData.title} onChange={e => { setFormData({...formData, title: e.target.value}); autoGenerateSlug(e.target.value); }} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="10 Tips for Moving..." />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">URL Slug <span className="text-primary">*</span></label>
                        <div className="flex items-center">
                          <span className="bg-black/40 border border-white/10 border-r-0 rounded-l-xl px-4 py-3 text-slate-500 text-sm font-bold">/blog/</span>
                          <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="flex-1 p-3 bg-black/20 border border-white/10 rounded-r-xl text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Category</label>
                        <Combobox value={formData.category} onChange={handleCategorySelect}>
                          <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-black/20 text-left border border-white/10 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                              <ComboboxInput
                                className="w-full border-none py-3 pl-4 pr-10 text-sm font-bold leading-5 text-white bg-transparent focus:ring-0 outline-none placeholder-slate-500"
                                displayValue={(cat) => cat}
                                onChange={(event) => setQuery(event.target.value)}
                                onBlur={(event) => {
                                  if (!formData.category && event.target.value) {
                                    handleCategorySelect(event.target.value);
                                  }
                                }}
                                placeholder="Select or type to create a new category..."
                              />
                              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronsUpDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
                              </ComboboxButton>
                            </div>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
                              <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-900 py-1 text-base shadow-lg ring-1 ring-white/10 focus:outline-none sm:text-sm z-50 border border-white/10">
                                {query.length > 0 && !filteredCategories.includes(query) && (
                                  <ComboboxOption value={query} className="relative cursor-default select-none py-2 pl-10 pr-4 text-white hover:bg-primary/20 transition-colors">
                                    Create "{query}"
                                  </ComboboxOption>
                                )}
                                {filteredCategories.map((cat) => (
                                  <ComboboxOption key={cat} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-white'}`} value={cat}>
                                    {({ selected, active }) => (
                                      <>
                                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{cat}</span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                            <Check className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </ComboboxOption>
                                ))}
                              </ComboboxOptions>
                            </Transition>
                          </div>
                        </Combobox>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Custom Author Name (Optional)</label>
                        <input 
                          type="text" 
                          value={formData.customAuthor} 
                          onChange={(e) => setFormData({...formData, customAuthor: e.target.value})}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                          placeholder="E.g. Guest Post by Jane Doe"
                        />
                        <p className="text-xs text-slate-500 mt-1">Leave empty to use your admin profile name.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Short Excerpt</label>
                        <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all h-20" placeholder="Brief summary for blog cards..." />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Featured Image</label>
                        {formData.coverImage ? (
                          <div className='flex flex-row space-x-5 items-start'>
                            <div className="relative rounded-xl overflow-hidden border border-white/10 w-full max-w-sm mb-3 group">
                              <img src={formData.coverImage} alt="Cover Preview" className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                              <button onClick={handleDeleteImage} className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-lg hover:bg-red-500 shadow-md transition-colors backdrop-blur-md">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="w-full max-w-sm">
                              <label className="block text-xs font-bold text-slate-300 mb-1">Image Alt Text (SEO)</label>
                              <input 
                                type="text" 
                                value={formData.coverImageAlt || ''} 
                                onChange={e => setFormData({...formData, coverImageAlt: e.target.value})} 
                                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                                placeholder="Describe the image for Google..." 
                              />
                            </div>
                          </div>
                        ) : (
                          <button onClick={openCloudinaryWidget} className="flex flex-col items-center justify-center w-full max-w-sm h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-slate-400 hover:text-white group">
                            <UploadCloud className="w-8 h-8 mb-2 group-hover:text-primary transition-colors group-hover:scale-110" />
                            <span className="text-sm font-bold">Upload Cover Image</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          <span className="ml-3 text-sm font-bold text-white drop-shadow-md">Publish Immediately?</span>
                        </label>
                        <p className="text-xs text-slate-400 ml-auto font-medium">If unchecked, it saves as a Draft.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div className="space-y-8 max-w-6xl mx-auto">
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-white/10">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Rich Text Editor</span>
                          <span className="text-xs text-slate-400">Supports Markdown Paste</span>
                        </div>
                        <JoditEditor
                          ref={editorRef}
                          value={editorContent}
                          config={joditConfig}
                          onBlur={newContent => setFormData({...formData, content: newContent})}
                          onChange={() => {}} // Empty onChange to satisfy prop requirements without triggering cursor jump
                        />
                      </div>

                      <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] pointer-events-none -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 relative z-10">
                          <h4 className="font-bold text-white text-lg">Dynamic FAQs</h4>
                          <button onClick={addFaq} className="text-xs font-bold text-white flex items-center gap-1 hover:text-white bg-primary/40 hover:bg-primary/60 transition-all shadow-[0_2px_10px_rgba(0,174,230,0.3)] px-3 py-1.5 rounded-lg border border-primary/50">
                            <Plus size={14} /> Add Question
                          </button>
                        </div>
                        {formData.faqs.length === 0 ? (
                          <p className="text-sm text-slate-500 italic text-center py-4 relative z-10">No FAQs added yet.</p>
                        ) : (
                          <div className="space-y-4 relative z-10">
                            {formData.faqs.map((faq, idx) => (
                              <FaqItem 
                                key={faq._id || idx} 
                                faq={faq} 
                                idx={idx} 
                                removeFaq={removeFaq} 
                                updateFaq={updateFaq} 
                                minimalJoditConfig={minimalJoditConfig} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'seo' && (
                    <div className="space-y-6 max-w-6xl">
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl shadow-inner">
                        <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2 drop-shadow-md">
                          <Settings className="w-4 h-4 text-primary" /> Automated SEO Engine
                        </h4>
                        <p className="text-xs text-slate-300">If you leave SEO data blank, the system will automatically generate highly optimized SEO metadata using your title, excerpt, cover image, and author name. Along with `Article` schema.</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-bold text-slate-300">Meta Title</label>
                          <div className="flex items-center gap-2">
                            {touchedFields.seoMetaTitle ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Unlink className="w-3 h-3" /> Manual Override
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Link className="w-3 h-3" /> Auto Syncing
                              </span>
                            )}
                            {touchedFields.seoMetaTitle && (
                              <button onClick={() => setTouchedFields(prev => ({...prev, seoMetaTitle: false}))} className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-white transition-colors bg-white/5 hover:bg-primary/40 px-2 py-0.5 rounded-lg">
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            )}
                          </div>
                        </div>
                        <input type="text" value={formData.seoMetaTitle} onChange={e => { setFormData({...formData, seoMetaTitle: e.target.value}); if (!touchedFields.seoMetaTitle) setTouchedFields(prev => ({...prev, seoMetaTitle: true})); }} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Defaults to Blog Title" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-bold text-slate-300">Meta Description</label>
                          <div className="flex items-center gap-2">
                            {touchedFields.seoMetaDescription ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Unlink className="w-3 h-3" /> Manual Override
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Link className="w-3 h-3" /> Auto Syncing
                              </span>
                            )}
                            {touchedFields.seoMetaDescription && (
                              <button onClick={() => setTouchedFields(prev => ({...prev, seoMetaDescription: false}))} className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-white transition-colors bg-white/5 hover:bg-primary/40 px-2 py-0.5 rounded-lg">
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea value={formData.seoMetaDescription} onChange={e => { setFormData({...formData, seoMetaDescription: e.target.value}); if (!touchedFields.seoMetaDescription) setTouchedFields(prev => ({...prev, seoMetaDescription: true})); }} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl h-24 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Defaults to Excerpt" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Target Keywords</label>
                        <input type="text" value={formData.seoMetaKeywords} onChange={e => setFormData({...formData, seoMetaKeywords: e.target.value})} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="moving tips, packing, boxes..." />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Canonical URL</label>
                        <input type="text" value={formData.seoCanonicalUrl} onChange={e => setFormData({...formData, seoCanonicalUrl: e.target.value})} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={`https://clezo.com/blogs/${formData.slug || 'slug'}`} />
                        <p className="text-xs text-slate-500 mt-1">Leave empty to use the default URL. Only set this if this blog was originally published somewhere else.</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-bold text-slate-300">Custom JSON-LD Schema (Optional)</label>
                          <div className="flex items-center gap-2">
                            {touchedFields.seoJsonLdSchema ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Unlink className="w-3 h-3" /> Manual Override
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Link className="w-3 h-3" /> Auto Syncing
                              </span>
                            )}
                            {touchedFields.seoJsonLdSchema && (
                              <button onClick={() => setTouchedFields(prev => ({...prev, seoJsonLdSchema: false}))} className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-white transition-colors bg-white/5 hover:bg-primary/40 px-2 py-0.5 rounded-lg">
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea value={formData.seoJsonLdSchema} onChange={e => { setFormData({...formData, seoJsonLdSchema: e.target.value}); if (!touchedFields.seoJsonLdSchema) setTouchedFields(prev => ({...prev, seoJsonLdSchema: true})); }} className="w-full p-3 bg-slate-900/80 border border-white/10 rounded-xl font-mono text-xs h-40 text-emerald-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all custom-scrollbar" placeholder='{ "@context": "https://schema.org"... }' />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={formData.seoIsNoIndex} onChange={e => setFormData({...formData, seoIsNoIndex: e.target.checked})} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          <span className="ml-3 text-sm font-bold text-white drop-shadow-md">NoIndex (Hide from Google)</span>
                        </label>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3 shrink-0 relative z-10">
                  <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-fixed-variant rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5 disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {blog ? 'Update Blog' : 'Publish Blog'}
                  </button>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
    </>
  );
}
