import React, { Fragment, useState, useEffect, useMemo, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Switch } from '@headlessui/react';
import { 
  X, Save, Loader2, Image as ImageIcon, Plus, Trash2, UploadCloud, 
  FileText, Settings, Code, RotateCcw, Sparkles, Tag, RefreshCw, 
  Link, Unlink, Check, ExternalLink, Flame, Calendar
} from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';

// --- Subcomponent for FAQ Items (avoids Jodit cursor reset on parent re-renders) ---
const FaqItem = ({ faq, idx, removeFaq, updateFaq, minimalJoditConfig }) => {
  const [initialAnswer] = useState(faq.answer || '');
  
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl relative group transition-colors">
      <button 
        type="button" 
        onClick={() => removeFaq(idx)} 
        className="absolute top-3 right-3 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        title="Remove Question"
      >
        <Trash2 size={14} />
      </button>
      <div className="space-y-3 pr-8">
        <input 
          type="text" 
          value={faq.question} 
          onChange={e => updateFaq(idx, 'question', e.target.value)} 
          placeholder="e.g. Can I use this offer for curtain dry cleaning?" 
          className="w-full font-bold text-white bg-transparent border-b border-white/20 focus:border-primary focus:outline-none pb-1 placeholder-slate-500 text-sm" 
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

export default function OfferFormDrawer({ isOpen, onClose, offerData, onSave }) {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'content' | 'seo'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [termInput, setTermInput] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef(null);

  const [touchedFields, setTouchedFields] = useState({
    seoMetaTitle: false,
    seoMetaDescription: false,
    seoJsonLdSchema: false
  });

  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    slug: '',
    badge: 'Limited Time',
    code: 'CLEZO30',
    showCouponCode: true,
    discount: '30% OFF',
    discountType: 'PERCENTAGE',
    description: '',
    bodyText: '',
    terms: [
      'Valid exclusively for bookings made via the Clezo Mobile App',
      'Applicable on first order across Thane & Pune live stores',
      'Minimum order value ₹499'
    ],
    faqs: [],
    bannerImage: null,
    bannerImageAlt: '',
    appStoreUrl: 'https://apps.apple.com/in/app/clezo-express-laundry/id6756257943',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo',
    startDate: '',
    endDate: '',
    claimedCount: 84,
    maxClaims: 100,
    seoMetaTitle: '',
    seoMetaDescription: '',
    seoMetaKeywords: '',
    seoCanonicalUrl: '',
    seoIsNoIndex: false,
    seoJsonLdSchema: '',
    isLimitedTime: true,
    showInUrgencyTicker: true,
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  // Jodit Editor Configs
  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Write in-depth landing page editorial, live hygiene guarantee, pickup schedule...',
    height: 420,
    enableDragAndDropFileToEditor: true,
    uploader: { insertImageAsBase64URI: true }, // Simple base64 for inline images
    toolbarAdaptive: false, // Prevents toolbar buttons from vanishing when resizing/toggling code view!
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

  // Helper to safely slugify
  const generateSlug = (text) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (offerData && isOpen) {
      setFormData({
        title: offerData.title || '',
        headline: offerData.headline || '',
        slug: offerData.slug || '',
        badge: offerData.badge || '',
        code: offerData.code || '',
        showCouponCode: offerData.showCouponCode ?? true,
        discount: offerData.discount || '',
        discountType: offerData.discountType || 'PERCENTAGE',
        description: offerData.description || '',
        bodyText: offerData.bodyText || '',
        terms: Array.isArray(offerData.terms) ? offerData.terms : [],
        faqs: Array.isArray(offerData.faqs) ? offerData.faqs : [],
        bannerImage: offerData.bannerImage || null,
        bannerImageAlt: offerData.bannerImageAlt || (offerData.bannerImage?.alt || ''),
        appStoreUrl: offerData.appStoreUrl || 'https://apps.apple.com/in/app/clezo-express-laundry/id6756257943',
        playStoreUrl: offerData.playStoreUrl || 'https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo',
        startDate: offerData.startDate ? new Date(offerData.startDate).toISOString().slice(0, 16) : '',
        endDate: offerData.endDate ? new Date(offerData.endDate).toISOString().slice(0, 16) : '',
        claimedCount: offerData.claimedCount ?? 84,
        maxClaims: offerData.maxClaims ?? 100,
        seoMetaTitle: offerData.seoMetaTitle || '',
        seoMetaDescription: offerData.seoMetaDescription || '',
        seoMetaKeywords: offerData.seoMetaKeywords || '',
        seoCanonicalUrl: offerData.seoCanonicalUrl || '',
        seoIsNoIndex: offerData.seoIsNoIndex ?? false,
        seoJsonLdSchema: offerData.seoJsonLdSchema || '',
        isLimitedTime: offerData.isLimitedTime ?? true,
        showInUrgencyTicker: offerData.isLimitedTime === false ? false : (offerData.showInUrgencyTicker ?? true),
        isActive: offerData.isActive ?? true,
        isFeatured: offerData.isFeatured ?? false,
        order: offerData.order ?? 0,
      });
      setIsAutoSync(false);
      setTouchedFields({
        seoMetaTitle: !!offerData.seoMetaTitle,
        seoMetaDescription: !!offerData.seoMetaDescription,
        seoJsonLdSchema: !!offerData.seoJsonLdSchema
      });
      setEditorContent(offerData.bodyText || '');
      setActiveTab('basic');
    } else if (isOpen) {
      // Create New Offer Defaults
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      threeDaysLater.setHours(23, 59, 0, 0);

      const randomNum = Math.floor(10 + Math.random() * 90);

      setFormData({
        title: '',
        headline: '',
        slug: '',
        badge: 'Limited Time',
        code: `CLEZO${randomNum}`,
        showCouponCode: true,
        discount: '30% OFF',
        discountType: 'PERCENTAGE',
        description: '',
        bodyText: '',
        terms: [
          'Valid exclusively for bookings made via the Clezo Mobile App',
          'Applicable on first order across Thane & Pune live stores',
          'Minimum order value ₹499'
        ],
        faqs: [],
        bannerImage: null,
        bannerImageAlt: '',
        appStoreUrl: 'https://apps.apple.com/in/app/clezo-express-laundry/id6756257943',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo',
        startDate: new Date().toISOString().slice(0, 16),
        endDate: threeDaysLater.toISOString().slice(0, 16),
        claimedCount: Math.floor(75 + Math.random() * 15),
        maxClaims: 100,
        seoMetaTitle: '',
        seoMetaDescription: '',
        seoMetaKeywords: '',
        seoCanonicalUrl: '',
        seoIsNoIndex: false,
        seoJsonLdSchema: '',
        isLimitedTime: true,
        showInUrgencyTicker: true,
        isActive: true,
        isFeatured: false,
        order: 0,
      });
      setIsAutoSync(true);
      setTouchedFields({ seoMetaTitle: false, seoMetaDescription: false, seoJsonLdSchema: false });
      setEditorContent('');
      setActiveTab('basic');
    }
  }, [offerData, isOpen]);

  // Automated SEO Engine Synchronization
  useEffect(() => {
    setFormData(prev => {
      let updated = { ...prev };
      let changed = false;

      // 1. Meta Title Auto-Sync
      if (!touchedFields.seoMetaTitle) {
        const computedTitle = prev.headline || (prev.title ? `${prev.title} | Clezo Offers` : '');
        if (computedTitle && prev.seoMetaTitle !== computedTitle) {
          updated.seoMetaTitle = computedTitle;
          changed = true;
        }
      }

      // 2. Meta Description Auto-Sync
      if (!touchedFields.seoMetaDescription) {
        const rawContent = prev.description || (prev.bodyText ? prev.bodyText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() : '');
        const computedDesc = rawContent.length > 170 ? rawContent.substring(0, 170) + '...' : rawContent;
        if (computedDesc && prev.seoMetaDescription !== computedDesc) {
          updated.seoMetaDescription = computedDesc;
          changed = true;
        }
      }

      // 3. JSON-LD Schema Auto-Sync
      if (!touchedFields.seoJsonLdSchema) {
        const schemaObj = {
          "@context": "https://schema.org",
          "@type": "SpecialAnnouncement",
          "name": updated.seoMetaTitle || prev.title || "Clezo Offer",
          "text": updated.seoMetaDescription || prev.description || `${prev.discount || 'Special'} discount on Clezo laundry services`,
          "url": prev.seoCanonicalUrl || `https://clezo.in/offers/${prev.slug || ''}`,
          "category": "https://schema.org/OnlineEventAttendanceMode",
          "expires": prev.endDate ? new Date(prev.endDate).toISOString() : undefined,
          "publisher": {
            "@type": "Organization",
            "name": "Clezo Express Laundry",
            "url": "https://clezo.in",
            "logo": {
              "@type": "ImageObject",
              "url": "https://clezo.in/logo.png"
            }
          }
        };

        const newSchemaStr = JSON.stringify(schemaObj, null, 2);
        if (newSchemaStr !== prev.seoJsonLdSchema) {
          updated.seoJsonLdSchema = newSchemaStr;
          changed = true;
        }
      }

      return changed ? updated : prev;
    });
  }, [
    formData.title, formData.headline, formData.description, 
    formData.bodyText, formData.slug, formData.endDate, 
    formData.discount, formData.seoCanonicalUrl, touchedFields
  ]);

  // Title Change with Auto-Sync Slug
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (isAutoSync) {
      setFormData(prev => ({
        ...prev,
        title: newTitle,
        slug: generateSlug(newTitle)
      }));
    } else {
      setFormData(prev => ({ ...prev, title: newTitle }));
    }
  };

  // Enhanced Random Coupon Codes with diverse themes
  const generateRandomCode = () => {
    const prefixes = [
      'CLEZO', 'SAVE', 'EXPRESS', 'HYGIENE', 'FRESH', 
      'FIRST', 'STEAM', 'WASH', 'DRYCLEAN', 'SUPER', 'FESTIVE'
    ];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setFormData(prev => ({ ...prev, code: `${randomPrefix}${randomNum}` }));
    toast.success('Generated random coupon code!');
  };

  // Scarcity simulation generator
  const randomizeScarcity = () => {
    const max = 100;
    const claimed = Math.floor(75 + Math.random() * 18);
    setFormData(prev => ({ ...prev, maxClaims: max, claimedCount: claimed }));
    toast.success('Simulated high claim demand!');
  };

  // Terms Manager
  const addTerm = () => {
    if (!termInput.trim()) return;
    setFormData(prev => ({ ...prev, terms: [...prev.terms, termInput.trim()] }));
    setTermInput('');
  };

  const removeTerm = (index) => {
    setFormData(prev => ({ ...prev, terms: prev.terms.filter((_, i) => i !== index) }));
  };

  // Dynamic FAQs Manager
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { _id: Date.now().toString(), question: '', answer: '' }]
    }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: newFaqs }));
  };

  // Cloudinary Direct Uploader
  const openCloudinaryWidget = () => {
    if (!window.cloudinary) return toast.error('Cloudinary library not loaded.');

    window.cloudinary.openUploadWidget({
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
      folder: import.meta.env.MODE === 'development' ? 'dev/offers' : 'offers',
      cropping: false,
      multiple: false,
      uploadSignature: async (callback, params_to_sign) => {
        try {
          const res = await fetchClient('/cloudinary-signature', {
            method: 'POST',
            body: JSON.stringify(params_to_sign)
          });
          callback(res.data?.signature || res.signature);
        } catch (err) {
          toast.error('Signature failed');
        }
      },
      styles: { 
        palette: { 
          window: '#18181b', sourceBg: '#27272a', windowBorder: '#3f3f46', 
          tabIcon: '#00aee6', inactiveTabIcon: '#a1a1aa', menuIcons: '#e4e4e7', 
          link: '#00aee6', action: '#00aee6', inProgress: '#3b82f6', 
          complete: '#10b981', error: '#ef4444', textDark: '#000000', textLight: '#ffffff' 
        } 
      }
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        const imageUrl = result.info.secure_url;
        setFormData(prev => ({
          ...prev,
          bannerImage: { url: imageUrl, publicId: result.info.public_id },
          bannerImageAlt: prev.bannerImageAlt || prev.title || 'Offer Banner'
        }));
        toast.success('Offer banner artwork uploaded!');
      }
    });
  };

  const handleTabChange = (newTab) => {
    if (activeTab === 'content' && editorRef.current) {
      try {
        const liveVal = typeof editorRef.current.getEditorValue === 'function'
          ? editorRef.current.getEditorValue()
          : editorRef.current.value;
        if (liveVal !== undefined && liveVal !== null) {
          setFormData(p => ({ ...p, bodyText: liveVal }));
          setEditorContent(liveVal);
        }
      } catch (e) {
        // Safe fallback
      }
    }
    setActiveTab(newTab);
    if (newTab === 'content') {
      setTimeout(() => {
        try {
          if (editorRef.current?.events) {
            editorRef.current.events.fire('resize');
          }
          window.dispatchEvent(new Event('resize'));
        } catch (e) {}
      }, 50);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.discount) {
      return toast.error('Please fill required fields (Title, Code, Discount)');
    }

    setIsSubmitting(true);
    try {
      let editorialContent = formData.bodyText;
      try {
        if (editorRef.current && typeof editorRef.current.getEditorValue === 'function') {
          const liveVal = editorRef.current.getEditorValue();
          if (liveVal !== undefined && liveVal !== null) {
            editorialContent = liveVal;
          }
        } else if (editorRef.current && editorRef.current.value !== undefined) {
          editorialContent = editorRef.current.value;
        }
      } catch (e) {
        editorialContent = formData.bodyText;
      }

      const payload = {
        ...formData,
        bodyText: editorialContent,
        code: formData.code.toUpperCase().trim(),
        claimedCount: Number(formData.claimedCount) || 0,
        maxClaims: Number(formData.maxClaims) || 100,
        order: Number(formData.order) || 0,
        bannerImage: formData.bannerImage ? {
          ...formData.bannerImage,
          alt: formData.bannerImageAlt || formData.title
        } : null,
      };

      if (offerData?.id) {
        await fetchClient(`/offers/${offerData.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        toast.success('Offer updated successfully!');
      } else {
        await fetchClient('/offers', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('New offer launched successfully!');
      }

      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => { /* Prevent outside click from closing to protect dropdowns and data */ }}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        {/* Panel Container - Fixed flush right with zero top gap */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="flex h-full justify-end p-0">
            <TransitionChild
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="w-full max-w-3xl transform overflow-hidden bg-[#0f172a] text-slate-200 h-full shadow-2xl flex flex-col border-l border-white/10 relative">
                
                {/* Header - Flush with top, no gap */}
                <div className="px-6 py-4 border-b border-white/10 bg-slate-900/90 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                      <Tag size={20} />
                    </div>
                    <div>
                      <DialogTitle as="h2" className="text-lg font-black text-white tracking-tight">
                        {offerData ? 'Edit Promotion Deal' : 'Launch New Promotion Deal'}
                      </DialogTitle>
                      <p className="text-xs text-slate-400 font-medium">
                        Configure discounts, countdown timer, ad copy, and SEO.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Tabs Bar */}
                <div className="flex border-b border-white/10 px-6 bg-black/25 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTabChange('basic')}
                    className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'basic'
                        ? 'border-primary text-primary drop-shadow-[0_0_8px_rgba(0,174,230,0.5)]'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" /> Basics
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('content')}
                    className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'content'
                        ? 'border-primary text-primary drop-shadow-[0_0_8px_rgba(0,174,230,0.5)]'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Page Content
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('seo')}
                    className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'seo'
                        ? 'border-primary text-primary drop-shadow-[0_0_8px_rgba(0,174,230,0.5)]'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" /> SEO Engine
                  </button>
                </div>

                {/* Scrollable Form Content */}
                <form id="offer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                  
                  {/* TAB 1: BASICS */}
                  <div className={activeTab === 'basic' ? 'space-y-6' : 'hidden'}>
                      
                      {/* Offer Title */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Offer Title <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={handleTitleChange}
                          placeholder="e.g. Flat 30% Off On First Live Laundry Order"
                          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:border-primary outline-none"
                        />
                      </div>

                      {/* URL Slug & Badge Text */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                              URL Slug <span className="text-primary">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                if (!isAutoSync) {
                                  setIsAutoSync(true);
                                  setFormData(p => ({ ...p, slug: generateSlug(p.title) }));
                                  toast.success('Slug auto-sync restored!');
                                }
                              }}
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                                isAutoSync
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600 hover:text-white'
                              }`}
                              title={isAutoSync ? 'Syncing with Title' : 'Click to reset Auto-Sync with Title'}
                            >
                              {isAutoSync ? 'Auto Sync' : 'Manual Sync (Reset)'}
                            </button>
                          </div>
                          <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => {
                              setIsAutoSync(false);
                              setFormData(p => ({ ...p, slug: generateSlug(e.target.value) }));
                            }}
                            placeholder="flat-30-off-first-order"
                            className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-primary outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Badge Text
                          </label>
                          <input
                            type="text"
                            value={formData.badge}
                            onChange={(e) => setFormData(p => ({ ...p, badge: e.target.value }))}
                            placeholder="e.g. Limited Time, Most Popular"
                            className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      {/* Coupon Code, Discount & Visibility Toggle */}
                      <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Coupon Code <span className="text-primary">*</span>
                              </label>
                              <button 
                                type="button" 
                                onClick={generateRandomCode} 
                                className="text-[10px] text-primary hover:text-primary-fixed-variant flex items-center gap-1 font-bold cursor-pointer transition-colors"
                              >
                                <RefreshCw size={10} /> Random
                              </button>
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.code}
                              onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                              placeholder="CLEZO30"
                              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold text-sm focus:border-primary outline-none tracking-wider"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                              Discount Value <span className="text-primary">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.discount}
                              onChange={(e) => setFormData(p => ({ ...p, discount: e.target.value }))}
                              placeholder="e.g. 30% OFF or ₹150 FLAT"
                              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-primary outline-none font-bold"
                            />
                          </div>
                        </div>

                        {/* Coupon Code Hide/Show Toggle */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block">Display Coupon Code on Live Website</span>
                            <span className="text-[11px] text-slate-400">
                              If disabled, the code is hidden from public view (offer auto-applied via app download links).
                            </span>
                          </div>
                          <Switch
                            checked={formData.showCouponCode}
                            onChange={(val) => setFormData(p => ({ ...p, showCouponCode: val }))}
                            className={`${
                              formData.showCouponCode ? 'bg-primary' : 'bg-slate-700'
                            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                formData.showCouponCode ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                          </Switch>
                        </div>
                      </div>

                      {/* Short Description */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Short Description (Teaser for Offer Cards)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.description}
                          onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                          placeholder="Experience live laundry hygiene with an instant flat discount on your first order..."
                          className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs focus:border-primary outline-none"
                        />
                      </div>

                      {/* Urgency & Scarcity Controls */}
                      <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Sparkles size={14} /> Urgency & Scarcity Simulation
                          </span>
                          {formData.isLimitedTime && (
                            <button
                              type="button"
                              onClick={randomizeScarcity}
                              className="text-[11px] bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg font-bold border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <RefreshCw size={11} /> Simulate High Demand
                            </button>
                          )}
                        </div>

                        {/* Limited Time vs Permanent Offer Toggle */}
                        <div className="p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white block">
                                {formData.isLimitedTime ? '⏳ Limited-Time Offer' : '♾️ Permanent / Lifetime Offer'}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {formData.isLimitedTime 
                                  ? 'Displays countdown timer and slot scarcity progress bar.' 
                                  : 'Evergreen deal (e.g. New User Welcome Offer). Countdown & slot limits are hidden.'}
                              </span>
                            </div>
                            <Switch
                              checked={formData.isLimitedTime}
                              onChange={(val) => setFormData(p => ({ 
                                ...p, 
                                isLimitedTime: val, 
                                showInUrgencyTicker: val ? p.showInUrgencyTicker : false 
                              }))}
                              className={`${
                                formData.isLimitedTime ? 'bg-emerald-500' : 'bg-slate-700'
                              } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                            >
                              <span
                                className={`${
                                  formData.isLimitedTime ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
                                } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>

                          {/* Show in Live Urgency Ticker Toggle - ONLY applicable for Limited-Time deals */}
                          {formData.isLimitedTime ? (
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <div>
                                <span className="text-xs font-bold text-white block">
                                  🔔 Include in Live Urgency Ticker
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Feature this deal in real-time social proof notifications on the frontend
                                </span>
                              </div>
                              <Switch
                                checked={formData.showInUrgencyTicker}
                                onChange={(val) => setFormData(p => ({ ...p, showInUrgencyTicker: val }))}
                                className={`${
                                  formData.showInUrgencyTicker ? 'bg-primary' : 'bg-slate-700'
                                } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                              >
                                <span
                                  className={`${
                                    formData.showInUrgencyTicker ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
                                  } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg transition duration-200 ease-in-out`}
                                />
                              </Switch>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 opacity-70">
                              <div>
                                <span className="text-xs font-bold text-slate-400 block">
                                  🔔 Live Urgency Ticker (Disabled)
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Permanent / Lifetime deals cannot have urgency tickers. Only limited-time deals qualify.
                                </span>
                              </div>
                              <span className="text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                                Not Applicable
                              </span>
                            </div>
                          )}
                        </div>

                        {formData.isLimitedTime ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                  Deal Expiry Date (Countdown Timer)
                                </label>
                                <input
                                  type="datetime-local"
                                  value={formData.endDate}
                                  onChange={(e) => setFormData(p => ({ ...p, endDate: e.target.value }))}
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-emerald-400 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                  Claimed vs Total Slots
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={formData.claimedCount}
                                    onChange={(e) => setFormData(p => ({ ...p, claimedCount: e.target.value }))}
                                    placeholder="Claimed"
                                    className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs text-center font-bold"
                                  />
                                  <span className="text-slate-500 font-bold">/</span>
                                  <input
                                    type="number"
                                    value={formData.maxClaims}
                                    onChange={(e) => setFormData(p => ({ ...p, maxClaims: e.target.value }))}
                                    placeholder="Max"
                                    className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs text-center font-bold"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar Preview */}
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs font-medium text-slate-300">
                              <span>Preview:</span>
                              <span className="text-emerald-400 font-bold">
                                {formData.claimedCount} of {formData.maxClaims} claimed ({Math.round((formData.claimedCount / (formData.maxClaims || 1)) * 100)}% claimed)
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="bg-slate-900/40 border border-dashed border-emerald-500/30 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
                            <span className="text-base">✨</span>
                            <span>This offer is configured as <strong>Permanent / Lifetime</strong>. Frontend displays an "Evergreen Offer" badge without scarcity expiration.</span>
                          </div>
                        )}
                      </div>

                      {/* Banner Artwork & Thumbnail (Hover upload, replace, delete) */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Offer Banner Artwork
                        </label>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {formData.bannerImage?.url ? (
                            <div className="relative w-56 h-32 rounded-2xl overflow-hidden border border-white/15 group shadow-lg">
                              <img 
                                src={formData.bannerImage.url} 
                                alt={formData.bannerImageAlt || "Banner preview"} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                              {/* Hover Overlay with Replace and Delete */}
                              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                <button
                                  type="button"
                                  onClick={openCloudinaryWidget}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-fixed-variant text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                                  title="Replace with new image"
                                >
                                  <RotateCcw size={12} /> Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormData(p => ({ ...p, bannerImage: null }))}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                                  title="Delete image"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={openCloudinaryWidget}
                              className="relative w-56 h-32 rounded-2xl bg-slate-900/80 border-2 border-dashed border-white/10 hover:border-primary/50 cursor-pointer overflow-hidden group transition-all flex flex-col items-center justify-center text-slate-400 hover:text-primary"
                            >
                              <div className="flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                                <UploadCloud className="w-8 h-8 mb-2 text-slate-500 group-hover:text-primary transition-colors" />
                                <span className="text-xs font-bold text-slate-300 group-hover:text-white">Upload Banner</span>
                                <span className="text-[10px] text-slate-500">16:9 Landscape recommended</span>
                              </div>
                              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          )}

                          <div className="flex-1 space-y-1">
                            <p className="text-xs text-slate-300 font-semibold">Hover over thumbnail to manage artwork</p>
                            <p className="text-[11px] text-slate-500">
                              Target folder: <code className="text-slate-400 font-mono">{import.meta.env.MODE === 'development' ? 'dev/offers' : 'offers'}</code>
                            </p>
                          </div>
                        </div>

                        {/* Image Alt Tag Input */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                            Banner Image Alt Tag (SEO & Accessibility)
                          </label>
                          <input
                            type="text"
                            value={formData.bannerImageAlt}
                            onChange={(e) => setFormData(p => ({ ...p, bannerImageAlt: e.target.value }))}
                            placeholder="e.g. Clezo 30% Off First Live Laundry Order Banner"
                            className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      {/* Official App Download Links */}
                      <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          App Store Download Destinations
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              Google Play Store URL
                            </label>
                            <input
                              type="text"
                              value={formData.playStoreUrl}
                              onChange={(e) => setFormData(p => ({ ...p, playStoreUrl: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              Apple App Store URL
                            </label>
                            <input
                              type="text"
                              value={formData.appStoreUrl}
                              onChange={(e) => setFormData(p => ({ ...p, appStoreUrl: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Headless UI Switches: Active & Featured */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={formData.isActive}
                            onChange={(val) => setFormData(p => ({ ...p, isActive: val }))}
                            className={`${
                              formData.isActive ? 'bg-primary' : 'bg-slate-700'
                            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                          >
                            <span
                              className={`${
                                formData.isActive ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg transition duration-200 ease-in-out`}
                            />
                          </Switch>
                          <div>
                            <span className="text-xs font-bold text-white block">Active On Live Website</span>
                            <span className="text-[11px] text-slate-400">Visible on /offers directory</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch
                            checked={formData.isFeatured}
                            onChange={(val) => setFormData(p => ({ ...p, isFeatured: val }))}
                            className={`${
                              formData.isFeatured ? 'bg-amber-500' : 'bg-slate-700'
                            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                          >
                            <span
                              className={`${
                                formData.isFeatured ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg transition duration-200 ease-in-out`}
                            />
                          </Switch>
                          <div>
                            <span className="text-xs font-bold text-white block">Hero Banner Slider (Featured)</span>
                            <span className="text-[11px] text-slate-400">Slides in top banner carousel on /offers page</span>
                          </div>
                        </div>
                      </div>

                  </div>

                  {/* TAB 2: PAGE CONTENT (Landing Page Editorial, Terms & Dynamic FAQs) */}
                  <div className={activeTab === 'content' ? 'space-y-6' : 'hidden'}>
                    
                    {/* Landing Page Headline H1 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Ad Landing Page Headline (H1)
                      </label>
                      <input
                        type="text"
                        value={formData.headline}
                        onChange={(e) => setFormData(p => ({ ...p, headline: e.target.value }))}
                        placeholder="e.g. Get Flat 30% Off On Your First Live Laundry Order in Thane & Pune"
                        className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:border-primary outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Displayed as the primary H1 title on the individual landing page (/offers/[slug]) for Google Ads.
                      </p>
                    </div>

                    {/* Editorial Body Text */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Offer Story & Hygiene Breakdown (Rich Text)
                      </label>
                      <div className="bg-white rounded-xl overflow-hidden text-slate-900 border border-white/20">
                        <JoditEditor
                          ref={editorRef}
                          value={editorContent}
                          config={joditConfig}
                          onBlur={(newContent) => {
                            setFormData(p => ({ ...p, bodyText: newContent }));
                            setEditorContent(newContent);
                          }}
                          onChange={(newContent) => {
                            setFormData(p => ({ ...p, bodyText: newContent }));
                          }}
                        />
                      </div>
                    </div>

                      {/* Terms & Conditions Manager */}
                      <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Terms & Conditions Checklist
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={termInput}
                            onChange={(e) => setTermInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTerm(); } }}
                            placeholder="e.g. Valid on first Clezo App order only"
                            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-primary outline-none"
                          />
                          <button
                            type="button"
                            onClick={addTerm}
                            className="px-4 py-2 bg-primary hover:bg-primary-fixed-variant text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus size={14} /> Add Term
                          </button>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          {formData.terms.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-2">No terms added yet.</p>
                          ) : (
                            formData.terms.map((term, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-800/60 px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/5">
                                <span className="truncate pr-2">• {term}</span>
                                <button 
                                  type="button" 
                                  onClick={() => removeTerm(idx)} 
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                  title="Remove term"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Dynamic FAQs Section (Copied from Blog drawer pattern) */}
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                          <div>
                            <h4 className="font-bold text-white text-base">Offer Specific FAQs</h4>
                            <p className="text-xs text-slate-400">Answer deal-specific questions to eliminate friction for ad visitors.</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={addFaq} 
                            className="text-xs font-bold text-white flex items-center gap-1.5 bg-primary/40 hover:bg-primary/60 transition-all px-3 py-1.5 rounded-lg border border-primary/50 cursor-pointer shadow-sm"
                          >
                            <Plus size={14} /> Add Question
                          </button>
                        </div>

                        {formData.faqs.length === 0 ? (
                          <p className="text-xs text-slate-500 italic text-center py-6">
                            No FAQs added for this offer yet. Click "+ Add Question" to answer user doubts.
                          </p>
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

                  {/* TAB 3: AUTOMATED SEO ENGINE */}
                  <div className={activeTab === 'seo' ? 'space-y-6' : 'hidden'}>
                      
                      {/* Automated Engine Info Card */}
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl shadow-inner">
                        <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-primary" /> Automated Offer SEO Engine
                        </h4>
                        <p className="text-xs text-slate-300">
                          Metadata and Schema.org structured data automatically sync with your Offer Title, Headline, and Expiry date. You can manually customize any field anytime or click Reset to re-sync.
                        </p>
                      </div>

                      {/* Meta Title */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Meta Title
                          </label>
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
                              <button 
                                type="button"
                                onClick={() => setTouchedFields(prev => ({ ...prev, seoMetaTitle: false }))} 
                                className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-white transition-colors bg-white/5 hover:bg-primary/40 px-2 py-0.5 rounded-lg cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            )}
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={formData.seoMetaTitle} 
                          onChange={e => { 
                            setFormData({ ...formData, seoMetaTitle: e.target.value }); 
                            if (!touchedFields.seoMetaTitle) setTouchedFields(prev => ({ ...prev, seoMetaTitle: true })); 
                          }} 
                          className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-primary outline-none" 
                          placeholder="Defaults to Offer Headline or Title" 
                        />
                      </div>

                      {/* Meta Description */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Meta Description
                          </label>
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
                              <button 
                                type="button"
                                onClick={() => setTouchedFields(prev => ({ ...prev, seoMetaDescription: false }))} 
                                className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-white transition-colors bg-white/5 hover:bg-primary/40 px-2 py-0.5 rounded-lg cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea 
                          rows={3}
                          value={formData.seoMetaDescription} 
                          onChange={e => { 
                            setFormData({ ...formData, seoMetaDescription: e.target.value }); 
                            if (!touchedFields.seoMetaDescription) setTouchedFields(prev => ({ ...prev, seoMetaDescription: true })); 
                          }} 
                          className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-primary outline-none" 
                          placeholder="Defaults to Short Description or Body summary" 
                        />
                      </div>

                      {/* Target Keywords */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Target Keywords
                        </label>
                        <input 
                          type="text" 
                          value={formData.seoMetaKeywords} 
                          onChange={e => setFormData({ ...formData, seoMetaKeywords: e.target.value })} 
                          className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-primary outline-none" 
                          placeholder="laundry offers thane, clezo coupon code, dry cleaning discount pune..." 
                        />
                      </div>

                      {/* Canonical URL */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Canonical URL
                        </label>
                        <input 
                          type="text" 
                          value={formData.seoCanonicalUrl} 
                          onChange={e => setFormData({ ...formData, seoCanonicalUrl: e.target.value })} 
                          className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-primary outline-none" 
                          placeholder={`https://clezo.in/offers/${formData.slug || 'slug'}`} 
                        />
                        <p className="text-[11px] text-slate-500 mt-1">Leave empty to use default domain link.</p>
                      </div>

                      {/* JSON-LD Schema */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Custom Schema.org JSON-LD
                          </label>
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
                              <button 
                                type="button"
                                onClick={() => setTouchedFields(prev => ({ ...prev, seoJsonLdSchema: false }))} 
                                className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-white transition-colors bg-white/5 hover:bg-primary/40 px-2 py-0.5 rounded-lg cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea 
                          rows={6}
                          value={formData.seoJsonLdSchema} 
                          onChange={e => { 
                            setFormData({ ...formData, seoJsonLdSchema: e.target.value }); 
                            if (!touchedFields.seoJsonLdSchema) setTouchedFields(prev => ({ ...prev, seoJsonLdSchema: true })); 
                          }} 
                          className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-[11px] text-emerald-400 focus:border-primary outline-none custom-scrollbar" 
                          placeholder='{ "@context": "https://schema.org"... }' 
                        />
                      </div>

                      {/* NoIndex Switch */}
                      <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-white/5">
                        <div>
                          <span className="text-xs font-bold text-white block">NoIndex (Hide from Google Search)</span>
                          <span className="text-[11px] text-slate-400">
                            Enable for private landing pages used exclusively for paid ad traffic.
                          </span>
                        </div>
                        <Switch
                          checked={formData.seoIsNoIndex}
                          onChange={(val) => setFormData(p => ({ ...p, seoIsNoIndex: val }))}
                          className={`${
                            formData.seoIsNoIndex ? 'bg-red-500' : 'bg-slate-700'
                          } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                        >
                          <span
                            className={`${
                              formData.seoIsNoIndex ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>

                  </div>

                </form>

                {/* Footer Actions - Flush with bottom */}
                <div className="p-4 border-t border-white/10 bg-slate-900/90 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="offer-form"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {offerData ? 'Save Changes' : 'Launch Offer'}
                      </>
                    )}
                  </button>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
