import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Listbox, ListboxButton, ListboxOptions, ListboxOption, Switch } from '@headlessui/react';
import { Fragment, useState, useEffect, useMemo } from 'react';
import { X, Save, Loader2, LayoutTemplate, Plus, Trash2, Image as ImageIcon, UploadCloud, ChevronDown, Check } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Subcomponent for FAQ Items to prevent Jodit cursor jumps ---
const FaqItem = ({ faq, idx, removeFaq, updateFaq, minimalJoditConfig }) => {
  // We only pass the initial answer to Jodit so it doesn't reset when parent re-renders!
  const [initialAnswer] = useState(faq.answer || '');
  
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-lg relative group transition-colors">
      <button type="button" onClick={() => removeFaq(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded shadow-sm p-1 opacity-0 group-hover:opacity-100 transition-all">
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

export default function SeoPageFormDrawer({ isOpen, setIsOpen, pageData, onSuccess, existingPages = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  
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
    categoryId: '',
    metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', isNoIndex: false, jsonLdSchema: '',
    headerTitle: '', introText: '',
    sections: [],
    faqs: []
  });

  // Track image modifications to prevent orphaned files in Cloudinary
  const [pendingDeletions, setPendingDeletions] = useState([]); // Delete these ONLY if user saves
  const [sessionUploads, setSessionUploads] = useState([]); // Delete these ONLY if user cancels/closes

  // Load Existing Data
  useEffect(() => {
    if (pageData) {
      setFormData({
        categoryId: pageData.id || '',
        metaTitle: pageData.seoMetaTitle || '', 
        metaDescription: pageData.seoMetaDescription || '', 
        metaKeywords: pageData.seoMetaKeywords || '', 
        canonicalUrl: pageData.seoCanonicalUrl || '', 
        isNoIndex: pageData.seoIsNoIndex || false, 
        jsonLdSchema: pageData.seoJsonLdSchema || '',
        headerTitle: pageData.headerTitle || '', 
        introText: pageData.headerIntroText || '',
        sections: (pageData.sections || []).map(s => ({
          ...s,
          image: { url: s.image?.url || '', alt: s.image?.alt || '' }
        })),
        faqs: pageData.faqs || []
      });
    } else {
      setFormData({
        categoryId: '',
        metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', isNoIndex: false, jsonLdSchema: '',
        headerTitle: '', introText: '', sections: [], faqs: []
      });
    }
    // Reset trackers when drawer opens
    if (isOpen) {
      setPendingDeletions([]);
      setSessionUploads([]);
    }
  }, [pageData, isOpen]);

  const availableCategories = useMemo(() => {
    if (pageData) return existingPages.filter(p => p.id === pageData.id);
    return existingPages.filter(page => !page.seoMetaTitle && (!page.sections || page.sections.length === 0));
  }, [existingPages, pageData]);

  useEffect(() => {
    if (!pageData && formData.categoryId) {
      const isStillAvailable = availableCategories.some(c => c.id.toString() === formData.categoryId.toString());
      if (!isStillAvailable) {
        setFormData(prev => ({ ...prev, categoryId: '' }));
      }
    }
  }, [availableCategories, formData.categoryId, pageData]);

  // --- DYNAMIC SECTION HANDLERS ---
  const addSection = () => {
    if (formData.sections.length >= 10) return toast.error("Maximum 10 sections allowed.");
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { 
        badge: { text: '', color: 'secondary' }, 
        heading: { text: '', color: 'primary' }, 
        description: '', 
        bullets: [],
        image: { url: '', alt: '' } // 🌟 ADDED IMAGE OBJECT
      }]
    }));
  };

  const updateSection = (index, field, nestedField, value) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      if (nestedField) {
        updatedSections[index] = {
          ...updatedSections[index],
          [field]: { ...updatedSections[index][field], [nestedField]: value }
        };
      } else {
        updatedSections[index] = { ...updatedSections[index], [field]: value };
      }
      return { ...prev, sections: updatedSections };
    });
  };

  const updateBullet = (sIndex, bIndex, value) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      const updatedBullets = [...updatedSections[sIndex].bullets];
      updatedBullets[bIndex] = value;
      updatedSections[sIndex] = { ...updatedSections[sIndex], bullets: updatedBullets };
      return { ...prev, sections: updatedSections };
    });
  };

  const addBullet = (sIndex) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sIndex] = { ...updatedSections[sIndex], bullets: [...updatedSections[sIndex].bullets, ''] };
      return { ...prev, sections: updatedSections };
    });
  };

  const removeSection = async (index) => {
    const section = formData.sections[index];
    // Stage image for deletion (do not delete yet)
    if (section.image?.url) {
      setPendingDeletions(prev => [...prev, section.image.url]);
    }
    
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const removeBullet = (sectionIndex, bulletIndex) => {
    setFormData(prev => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].bullets = newSections[sectionIndex].bullets.filter((_, i) => i !== bulletIndex);
      return { ...prev, sections: newSections };
    });
  };

  // --- FAQ HANDLERS ---
  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { _id: Date.now().toString(), question: '', answer: '' }] }));
  const removeFaq = (idx) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
  const updateFaq = (idx, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[idx][field] = value;
    setFormData(prev => ({ ...prev, faqs: newFaqs }));
  };

  // 🌟 CLOUDINARY UPLOAD WIDGET TRIGGER 🌟
  const openCloudinaryWidget = (sectionIndex) => {
    if (!window.cloudinary) return toast.error("Cloudinary script not loaded. Check index.html.");

    window.cloudinary.openUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'piratecodes',
        folder: import.meta.env.MODE === 'development' ? 'clezo/dev/service pages' : 'clezo/service page',
        cropping: true,
        multiple: false,
        uploadSignature: async (callback, params_to_sign) => {
          try {
            const res = await fetchClient('/cloudinary-signature', {
              method: 'POST',
              body: JSON.stringify(params_to_sign)
            });
            callback(res.signature || res.data?.signature);
          } catch (err) {
            toast.error("Signature failed");
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const newImageUrl = result.info.secure_url;
          const oldImageUrl = formData.sections[sectionIndex].image?.url;
          
          // If they are replacing an image, stage the old one for deletion
          if (oldImageUrl && oldImageUrl !== newImageUrl) {
             setPendingDeletions(prev => [...prev, oldImageUrl]);
          }

          // Track the new upload in case they cancel
          setSessionUploads(prev => [...prev, newImageUrl]);

          updateSection(sectionIndex, 'image', 'url', newImageUrl);
          toast.success("Image uploaded successfully!");
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) return toast.error("Please select a category");
    
    setIsLoading(true);
    
    // Strip frontend-only _id from faqs before sending to strict backend validator
    let payloadFaqs = formData.faqs;
    if (payloadFaqs && payloadFaqs.length > 0) {
      payloadFaqs = payloadFaqs.map(({ _id, ...rest }) => rest);
    }

    const payload = {
      seoMetaTitle: formData.metaTitle,
      seoMetaDescription: formData.metaDescription,
      seoMetaKeywords: formData.metaKeywords,
      seoCanonicalUrl: formData.canonicalUrl,
      seoIsNoIndex: formData.isNoIndex,
      seoJsonLdSchema: formData.jsonLdSchema,
      headerTitle: formData.headerTitle,
      headerIntroText: formData.introText,
      sections: formData.sections,
      faqs: payloadFaqs
    };

    try {
      await fetchClient(`/service-categories/${formData.categoryId}`, { 
        method: 'PATCH', 
        body: JSON.stringify(payload) 
      });
      
      // Cleanup Cloudinary - ONLY execute staged deletions on success
      pendingDeletions.forEach(url => {
        fetchClient('/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: url }) }).catch(console.error);
      });
      
      toast.success(pageData ? 'SEO Page updated successfully' : 'SEO Page created successfully');
      
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || 'Server Error: Check if backend API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // If the user closes without saving, delete any images uploaded during this session
    sessionUploads.forEach(url => {
       fetchClient('/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: url }) }).catch(console.error);
    });
    setIsOpen(false);
  };

  return (
    <Transition show={isOpen === true ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
        <TransitionChild as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                
                <DialogPanel className="pointer-events-auto w-screen max-w-4xl">
                  <form onSubmit={handleSubmit} className="flex h-full flex-col bg-on-primary-fixed/95 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,174,230,0.15)] border-l border-white/10 relative overflow-hidden">
                    
                    {/* Drawer Sky Glare */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[80px] pointer-events-none -z-10 rounded-full"></div>

                    {/* Header */}
                    <div className="bg-white/5 border-b border-white/10 px-6 py-6 text-white shrink-0 relative z-10">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                          <LayoutTemplate size={20} className="text-primary" />
                          {pageData ? 'Edit Landing Page' : 'Build Landing Page'}
                        </DialogTitle>
                        <button type="button" onClick={handleClose} className="text-white/50 hover:text-white"><X size={24} /></button>
                      </div>
                    </div>

                    {/* Scrollable Form Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
                      
                      {/* 1. ROUTING IDENTIFIERS */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Service Selection</h3>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Target Service <span className="text-primary">*</span></label>
                          <Listbox value={formData.categoryId} onChange={(val) => setFormData({...formData, categoryId: val})} disabled={!!pageData || (availableCategories.length === 0 && !pageData)}>
                            <div className="relative mt-1">
                              <ListboxButton className={`relative w-full cursor-default rounded-xl bg-black/40 py-3 pl-4 pr-10 text-left border focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 font-bold transition-all ${availableCategories.length === 0 && !pageData ? 'text-red-400 border-red-500/50' : 'text-white border-white/10'}`}>
                                <span className="block truncate">
                                  {formData.categoryId 
                                    ? existingPages.find(p => p.id?.toString() === formData.categoryId?.toString())?.name 
                                    : (!pageData && availableCategories.length === 0 ? '-- All Services Already Have SEO Pages --' : '-- Select Service --')}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                  <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                </span>
                              </ListboxButton>
                              <AnimatePresence>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                  <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-900 border border-white/10 text-base shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:outline-none sm:text-sm custom-scrollbar">
                                    {availableCategories.map((c) => (
                                      <ListboxOption key={c.id} value={c.id} className={({ active }) => `relative cursor-default select-none py-2.5 pl-10 pr-4 ${active ? 'bg-primary/20 text-primary' : 'text-slate-300'}`}>
                                        {({ selected }) => (
                                          <>
                                            <span className={`block truncate ${selected ? 'font-black' : 'font-medium'}`}>{c.name}</span>
                                            {selected ? (
                                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                <Check className="h-4 w-4" aria-hidden="true" />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </ListboxOption>
                                    ))}
                                  </ListboxOptions>
                                </Transition>
                              </AnimatePresence>
                            </div>
                          </Listbox>
                        </div>
                      </div>

                      {/* 2. SEO ENGINE */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. SEO Tags</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">Meta Title</label>
                            <input type="text" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white transition-all" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">Canonical URL</label>
                            <input type="text" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white transition-all placeholder-slate-500" value={formData.canonicalUrl} onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})} placeholder="Leave blank to self-canonicalize" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Meta Description</label>
                          <textarea rows="2" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white transition-all" value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Meta Keywords</label>
                          <input type="text" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white transition-all placeholder-slate-500" value={formData.metaKeywords} onChange={(e) => setFormData({...formData, metaKeywords: e.target.value})} placeholder="e.g. deep cleaning, home sanitization (separate by comma)" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-300 mb-1">JSON-LD Schema (Advanced)</label>
                           <textarea rows="2" className="w-full p-3 bg-black/60 text-emerald-400 font-mono text-xs border border-white/10 rounded-xl outline-none transition-all placeholder-slate-600" value={formData.jsonLdSchema} onChange={(e) => setFormData({...formData, jsonLdSchema: e.target.value})} placeholder='<script type="application/ld+json"> { ... } </script>' />
                        </div>
                        <div className="flex items-center justify-between mt-4 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                          <div>
                            <label className="text-sm font-bold text-red-400">Hide this page from Google (noIndex)</label>
                            <p className="text-xs text-slate-500 mt-1">If enabled, search engines will be instructed not to index this page.</p>
                          </div>
                          <Switch
                            checked={formData.isNoIndex}
                            onChange={(val) => setFormData({...formData, isNoIndex: val})}
                            className={`${formData.isNoIndex ? 'bg-red-500' : 'bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                          >
                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isNoIndex ? 'translate-x-6' : 'translate-x-1'}`} />
                          </Switch>
                        </div>
                      </div>

                      {/* 3. MAIN CONTENT */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Main Header</h3>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Page H1 Title</label>
                          <input type="text" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none font-bold text-lg text-white transition-all placeholder-slate-500" value={formData.headerTitle} onChange={(e) => setFormData({...formData, headerTitle: e.target.value})} placeholder="e.g. Best Deep Cleaning Services in Mumbai" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Introductory Paragraph</label>
                          <textarea rows="4" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white transition-all" value={formData.introText} onChange={(e) => setFormData({...formData, introText: e.target.value})} />
                        </div>
                      </div>

                      {/* 4. THE DYNAMIC SECTIONS */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Content Sections ({formData.sections.length}/10)</h3>
                           <button type="button" onClick={addSection} disabled={formData.sections.length >= 10} className="flex items-center gap-1 bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50">
                             <Plus size={14}/> Add Section
                           </button>
                        </div>

                        <div className="space-y-8">
                          {formData.sections.map((section, sIndex) => (
                            <div key={sIndex} className="bg-black/20 p-6 rounded-2xl border border-white/10 relative">
                               <button type="button" onClick={() => removeSection(sIndex)} className="absolute top-4 right-4 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                               
                               <div className="mb-6 border-b border-white/10 pb-4">
                                  <span className="bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold">Section {sIndex + 1}</span>
                               </div>

                               {/* Badge & Heading */}
                               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                  <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Top Badge / Tablet</label>
                                    <div className="flex gap-2">
                                      <input type="text" className="flex-1 min-w-0 p-2 bg-black/40 border border-white/10 rounded-lg outline-none text-sm text-white focus:border-primary transition-all placeholder-slate-600" value={section.badge.text} onChange={(e) => updateSection(sIndex, 'badge', 'text', e.target.value)} placeholder="e.g. Area Challenges" />
                                      <div className="w-40 shrink-0">
                                        <Listbox value={section.badge.color} onChange={(val) => updateSection(sIndex, 'badge', 'color', val)}>
                                          <div className="relative">
                                            <ListboxButton className="relative w-full cursor-default rounded-lg bg-black/40 py-2 pl-3 pr-8 text-left border border-white/10 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-bold text-white transition-all">
                                              <span className="block truncate">{section.badge.color === 'primary' ? 'Primary Color' : 'Secondary Color'}</span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                              </span>
                                            </ListboxButton>
                                            <AnimatePresence>
                                              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-900 border border-white/10 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:outline-none custom-scrollbar">
                                                  {[{id: 'primary', name: 'Primary Color'}, {id: 'secondary', name: 'Secondary Color'}].map((c) => (
                                                    <ListboxOption key={c.id} value={c.id} className={({ active }) => `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-primary/20 text-primary' : 'text-slate-300'}`}>
                                                      {({ selected }) => (
                                                        <>
                                                          <span className={`block truncate ${selected ? 'font-black' : 'font-medium'}`}>{c.name}</span>
                                                          {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-primary">
                                                              <Check className="h-4 w-4" aria-hidden="true" />
                                                            </span>
                                                          ) : null}
                                                        </>
                                                      )}
                                                    </ListboxOption>
                                                  ))}
                                                </ListboxOptions>
                                              </Transition>
                                            </AnimatePresence>
                                          </div>
                                        </Listbox>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Heading (H2)</label>
                                    <div className="flex gap-2">
                                      <input type="text" className="flex-1 min-w-0 p-2 bg-black/40 border border-white/10 rounded-lg outline-none text-sm font-bold text-white focus:border-primary transition-all placeholder-slate-600" value={section.heading.text} onChange={(e) => updateSection(sIndex, 'heading', 'text', e.target.value)} placeholder="e.g. Location-Based Challenges" />
                                      <div className="w-40 shrink-0">
                                        <Listbox value={section.heading.color} onChange={(val) => updateSection(sIndex, 'heading', 'color', val)}>
                                          <div className="relative">
                                            <ListboxButton className="relative w-full cursor-default rounded-lg bg-black/40 py-2 pl-3 pr-8 text-left border border-white/10 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-bold text-white transition-all">
                                              <span className="block truncate">{section.heading.color === 'primary' ? 'Primary Color' : 'Secondary Color'}</span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                              </span>
                                            </ListboxButton>
                                            <AnimatePresence>
                                              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-900 border border-white/10 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:outline-none custom-scrollbar">
                                                  {[{id: 'primary', name: 'Primary Color'}, {id: 'secondary', name: 'Secondary Color'}].map((c) => (
                                                    <ListboxOption key={c.id} value={c.id} className={({ active }) => `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-primary/20 text-primary' : 'text-slate-300'}`}>
                                                      {({ selected }) => (
                                                        <>
                                                          <span className={`block truncate ${selected ? 'font-black' : 'font-medium'}`}>{c.name}</span>
                                                          {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-primary">
                                                              <Check className="h-4 w-4" aria-hidden="true" />
                                                            </span>
                                                          ) : null}
                                                        </>
                                                      )}
                                                    </ListboxOption>
                                                  ))}
                                                </ListboxOptions>
                                              </Transition>
                                            </AnimatePresence>
                                          </div>
                                        </Listbox>
                                      </div>
                                    </div>
                                  </div>
                               </div>

                               {/* 🌟 NEW: IMAGE & ALT TEXT BLOCK WITH REMOVE BUTTON 🌟 */}
                                <div className="bg-black/20 p-4 rounded-xl border border-white/10 mb-6">
                                  <label className="text-xs font-bold text-slate-400 mb-3 uppercase flex items-center gap-2">
                                    <ImageIcon size={14} /> Section Image (Optional)
                                  </label>
                                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    
                                    {/* Image Preview & Upload Button */}
                                    <div className="shrink-0 flex flex-col gap-2 w-full sm:w-1/3">
                                      {section.image?.url ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                                          <img src={section.image.url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                      ) : (
                                        <div className="w-full aspect-video rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 bg-black/20">
                                          <ImageIcon size={24} className="mb-2 opacity-50" />
                                          <span className="text-[10px] font-bold uppercase">No Image</span>
                                        </div>
                                      )}
                                      
                                      <div className="flex gap-2 w-full mt-1">
                                        <button 
                                          type="button" 
                                          onClick={() => openCloudinaryWidget(sIndex)}
                                          className="flex-1 py-2.5 bg-white/5 border border-white/10 text-primary text-xs font-bold rounded-lg hover:bg-white/10 transition-colors flex justify-center items-center gap-1 shadow-sm"
                                        >
                                          <UploadCloud size={14} /> {section.image?.url ? 'Change' : 'Upload Image'}
                                        </button>

                                        {/* 🌟 THE SAFE REMOVE IMAGE BUTTON 🌟 */}
                                          {section.image?.url && (
                                          <button type="button" 
                                            onClick={async () => {
                                              if (section.image?.url) {
                                                setPendingDeletions(prev => [...prev, section.image.url]);
                                              }
                                              updateSection(sIndex, 'image', 'url', '');
                                              updateSection(sIndex, 'image', 'alt', '');
                                            }}
                                            className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </div>

                                    </div>

                                    {/* Alt Text Input */}
                                    <div className="flex-1 w-full">
                                      <label className="block text-xs font-bold text-slate-400 mb-1">Image Alt Text (SEO)</label>
                                      <input 
                                        type="text" 
                                        className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg outline-none text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-600" 
                                        value={section.image?.alt || ''} 
                                        onChange={(e) => updateSection(sIndex, 'image', 'alt', e.target.value)} 
                                        placeholder="e.g. Clezo professionals deep cleaning a modern living room" 
                                      />
                                      <p className="text-[10px] text-slate-500 mt-1">Briefly describe the image for screen readers and Google Images.</p>
                                    </div>
                                  </div>
                                </div>

                               {/* Description */}
                               <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Description Paragraph</label>
                                  <textarea rows="4" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none text-sm text-white focus:border-primary transition-all" value={section.description} onChange={(e) => updateSection(sIndex, 'description', null, e.target.value)} />
                               </div>

                               {/* Bullets Engine */}
                               <div className="mt-3.5 bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="block text-xs font-bold text-slate-300 uppercase">Bullet Points ({section.bullets.length})</label>
                                    <button type="button" onClick={() => addBullet(sIndex)} className="text-primary hover:text-primary/80 text-xs font-bold flex items-center gap-1 transition-colors"><Plus size={14}/> Add Bullet</button>
                                  </div>
                                  <div className="space-y-2">
                                    {section.bullets.map((bullet, bIndex) => (
                                      <div key={bIndex} className="flex gap-2 items-start">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0 shadow-[0_0_8px_rgba(0,174,230,0.8)]"></div>
                                        <textarea rows="2" className="flex-1 p-2 bg-black/40 border border-white/10 rounded-lg outline-none text-sm text-white focus:border-primary transition-all" value={bullet} onChange={(e) => updateBullet(sIndex, bIndex, e.target.value)} />
                                        <button type="button" onClick={() => removeBullet(sIndex, bIndex)} className="text-red-400 hover:text-red-600 px-2 mt-2 transition-colors"><X size={16}/></button>
                                      </div>
                                    ))}
                                  </div>
                               </div>

                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* 5. FAQs Engine */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">5. Frequently Asked Questions</h3>
                          <button type="button" onClick={addFaq} className="flex items-center gap-1 bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                            <Plus size={14} /> Add FAQ
                          </button>
                        </div>
                        
                        {formData.faqs.length === 0 ? (
                          <div className="text-center py-8 bg-black/40 rounded-xl border border-white/5 border-dashed">
                            <p className="text-slate-500 text-sm font-medium">No FAQs added yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
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

                    {/* Footer Actions */}
                    <div className="border-t border-white/10 px-6 py-4 bg-white/5 shrink-0 relative z-10">
                      <button 
                        type="submit" 
                        disabled={isLoading || (!pageData && availableCategories.length === 0)} 
                        className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)]"
                      >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {pageData ? 'Update SEO Page' : 'Publish New SEO Page'}
                      </button>
                    </div>

                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}