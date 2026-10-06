"use client";
import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  ShoppingBag, Loader2, Plus, Minus, MapPin, Calendar as CalendarIcon, 
  Clock, FileText, User, Phone, Mail, Home, CheckCircle2,
  ChevronDown, ArrowRight, ShieldCheck, Shirt, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Framer Motion Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const shake = {
  invalid: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } },
  valid: { scale: [1, 1.05, 1], transition: { duration: 0.3 } }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 20 } }
};

export default function LeadGenerationForm() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [cart, setCart] = useState({});
  const [serviceAreas, setServiceAreas] = useState([]);
  const [uniqueAreaNames, setUniqueAreaNames] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pincode: '',
    areaName: '',
    locality: '',
    addressLine: '',
    landmark: '',
    pickupDate: new Date(),
    pickupSlot: '9:00 AM - 12:00 PM',
    customerComment: ''
  });
  
  const [availableLocalities, setAvailableLocalities] = useState([]);
  const [pincodeStatus, setPincodeStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchServiceAreas();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-categories`);
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].slug);
      }
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchServiceAreas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-areas`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServiceAreas(json.data);
        const unique = [...new Set(json.data.map(area => area.areaName).filter(Boolean))];
        setUniqueAreaNames(unique);
      }
    } catch (err) {
      console.error("Failed to fetch service areas");
    }
  };

  useEffect(() => {
    if (activeCategory) {
      fetchOptions(activeCategory);
    }
  }, [activeCategory]);

  const fetchOptions = async (slug) => {
    setIsLoadingItems(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-options/service/${slug}`);
      const json = await res.json();
      setOptions(json.data?.options || []);
    } catch (err) {
      console.error("Failed to fetch options");
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      const area = serviceAreas.find(a => a.pincode === formData.pincode && a.isActive);
      if (!area) {
        setPincodeStatus('invalid');
        setAvailableLocalities([]);
        setFormData(prev => ({ ...prev, areaName: '', locality: '' }));
      } else {
        setPincodeStatus('valid');
        const locs = area.localities?.length > 0 ? area.localities : [area.areaName];
        setAvailableLocalities(locs);
        setFormData(prev => ({ 
          ...prev, 
          areaName: area.areaName, 
          locality: locs.includes(prev.locality) ? prev.locality : locs[0] 
        }));
      }
    } else {
      setPincodeStatus('idle');
      setAvailableLocalities([]);
      setFormData(prev => ({ ...prev, areaName: '', locality: '' }));
    }
  }, [formData.pincode, serviceAreas]);

  const updateCart = (item, delta) => {
    setCart(prev => {
      const currentQty = prev[item.id]?.quantity || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const newCart = { ...prev };
        delete newCart[item.id];
        return newCart;
      }
      return { ...prev, [item.id]: { ...item, quantity: newQty } };
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((acc, item) => acc + ((item.basePrice || 0) * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartCount === 0) {
      toast.error("Please add at least one service.");
      return;
    }
    if (pincodeStatus === 'invalid') {
      toast.error("Service not available for this pincode.");
      return;
    }
    if (!formData.locality) {
      toast.error("Please select a locality.");
      return;
    }

    setIsSubmitting(true);
    
    const leadItems = cartItems.map(item => ({
      serviceId: item.serviceType,
      itemId: String(item.id),
      quantity: item.quantity,
      unitPrice: item.basePrice || 0
    }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceMode: 'PICKUP_DROP',
          source: 'Website Booking',
          pickupDate: formData.pickupDate.toISOString(),
          items: leadItems
        })
      });
      const data = await res.json();
      
      if (res.ok && data) {
        toast.success("Booking Confirmed!");
        setSuccessData({ leadNumber: data.leadNumber || 'CONFIRMED' });
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (successData) {
    return (
      <section className="py-24 bg-white border-t border-slate-200" id="book-online">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="p-10 md:p-14 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-primary/5 flex flex-col items-center relative overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl" 
            />
            
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 size={80} strokeWidth={1.5} className="text-green-500 mb-6 drop-shadow-sm" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">Pickup Scheduled!</h2>
            <p className="text-slate-600 mb-8 text-lg font-medium">Your valet will arrive at the scheduled time. Thank you for choosing Clezo.</p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200 mb-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ticket Number</span>
              <span className="block text-4xl md:text-5xl font-black text-primary tracking-tighter">{successData.leadNumber}</span>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSuccessData(null);
                setCart({});
                setFormData(prev => ({ ...prev, customerName: '', customerPhone: '', customerEmail: '', addressLine: '', landmark: '', customerComment: '' }));
              }}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
            >
              Book Another Order
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-slate-800 text-sm font-medium transition-all outline-none placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4 h-4";

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 9:00 PM'
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-x-clip" id="book-online">
      {/* Magical Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10" 
      />
      
      {/* EXACT Container Constraint */}
      <div className="container mx-auto px-4 xl:max-w-7xl relative z-10">
        
        {/* Header Area with Magics */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-10 pb-8 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4">
            <motion.div variants={fadeUpItem} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Premium Doorstep Concierge
            </motion.div>
            <motion.h1 variants={fadeUpItem} className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Schedule Your <span className="relative whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Garment Care</span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1.5 bg-primary/20 rounded-full"
                />
              </span>
            </motion.h1>
            <motion.p variants={fadeUpItem} className="text-slate-500 font-medium max-w-2xl text-lg">
              Couture-grade wet cleaning, organic zero-odor solvents, and temperature-controlled white glove valets right to your doorstep.
            </motion.p>

            {/* Service Areas */}
            {uniqueAreaNames.length > 0 && (
              <motion.div variants={fadeUpItem} className="pt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-500 mr-2 flex items-center gap-1">
                  <MapPin size={14} className="text-primary" /> Service Hubs:
                </span>
                {uniqueAreaNames.slice(0, 5).map((area, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                    {area}
                  </span>
                ))}
                {uniqueAreaNames.length > 5 && (
                  <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs font-black text-primary cursor-help hover:bg-primary/20 transition-colors shadow-sm">
                    + {uniqueAreaNames.length - 5} more locations
                  </span>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Trust Badges pop in */}
          <motion.div variants={popIn} className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 px-5 py-4 rounded-2xl shadow-xl shadow-slate-200/50">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-xs font-black text-blue-600 shadow-sm z-30">MH</div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm z-20">KA</div>
              <div className="w-10 h-10 rounded-full bg-sky-50 border-2 border-white flex items-center justify-center text-xs font-black text-sky-600 shadow-sm z-10">DL</div>
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1">Zero Transit Crease <Sparkles size={12} className="text-amber-400" /></p>
              <p className="text-slate-500 font-medium">Fleet equipped with vertical hangers</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Services (7 cols) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 z-20">
            
            {/* Category Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative overflow-hidden"
            >
              <div className="flex items-center overflow-x-auto gap-1 p-1.5">
                {categories.map(cat => {
                  const isActive = activeCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`relative whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 z-10 ${
                        isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategory"
                          className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-md"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {isActive ? <CheckCircle2 size={16} /> : <Shirt size={16} className="opacity-50" />}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <div className="flex items-center justify-between mt-4 px-1">
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Step 1</p>
                <h2 className="text-xl font-black text-slate-800">Select Garments</h2>
              </div>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-help border border-slate-200"
              >
                <ShieldCheck size={14} className="text-primary" /> Complimentary Inspection
              </motion.span>
            </div>

            {/* Product List with Internal Scrollbar */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col relative">
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar relative z-10">
                {isLoadingItems ? (
                  <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : options.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center flex flex-col items-center justify-center">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300"
                    >
                      <Shirt size={32} />
                    </motion.div>
                    <p className="text-slate-500 font-bold">No garments available here.</p>
                    <p className="text-xs text-slate-400 mt-1">Try selecting another category.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-slate-100"
                  >
                  <AnimatePresence mode="popLayout">
                    {options.map(item => {
                      const qty = cart[item.id]?.quantity || 0;
                      return (
                        <motion.div 
                          variants={fadeUpItem}
                          layout
                          key={item.id} 
                          className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors group relative overflow-hidden"
                        >
                          {/* Hover Magic Accent */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                          
                          <div className="flex items-center gap-4 min-w-0 pl-2">
                            <motion.div 
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all"
                            >
                              <Shirt size={20} strokeWidth={1.5} />
                            </motion.div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-slate-800 truncate">{item.categoryName}</h3>
                                {item.productTag && <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase font-bold tracking-wider">{item.productTag}</span>}
                              </div>
                              {item.isCustomPricing ? (
                                <p className="text-xs font-bold text-orange-500 mt-0.5 flex items-center gap-1">
                                  <Sparkles size={10} /> Custom Quote Required
                                </p>
                              ) : (
                                <p className="text-xs font-bold text-slate-500 mt-0.5">₹{item.basePrice} / {item.pricingUnit}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            {/* Animated Quantity Selector */}
                            <motion.div 
                              layout
                              className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm"
                            >
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => updateCart(item, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                              >
                                <Minus size={14} strokeWidth={2.5} />
                              </motion.button>
                              
                              <motion.span 
                                key={qty}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-xs font-black w-8 text-center text-primary"
                              >
                                {qty}
                              </motion.span>
                              
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => updateCart(item, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                              >
                                <Plus size={14} strokeWidth={2.5} />
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form (5 cols) SCROLLS WITH PAGE */}
          <div className="lg:col-span-5 pb-10 relative">
            
            {/* Breathing Ambient Aura Behind Form */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-[3rem] blur-xl -z-10"
            />

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
            >
              {/* Magic Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-400 to-primary opacity-80" />

              <div className="border-b border-slate-100 pb-4 mb-6">
                <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Step 2</p>
                <h3 className="text-lg font-black text-slate-800">Doorstep Logistics &amp; Schedule</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Personal Info */}
                <div className="space-y-4">
                  <motion.div whileTap={{ scale: 0.99 }}>
                    <label className={labelClass}><User size={14} /> Full Name</label>
                    <div className="relative">
                      <User className={iconClass} />
                      <input required value={formData.customerName} onChange={e=>setFormData({...formData, customerName: e.target.value})} type="text" className={inputClass} placeholder="Enter your full name" />
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div whileTap={{ scale: 0.99 }}>
                      <label className={labelClass}><Phone size={14} /> Phone Number</label>
                      <div className="relative">
                        <Phone className={iconClass} />
                        <input required value={formData.customerPhone} onChange={e=>setFormData({...formData, customerPhone: e.target.value})} type="tel" className={inputClass} placeholder="+91 Mobile" />
                      </div>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.99 }}>
                      <label className={labelClass}><Mail size={14} /> Email Address</label>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input value={formData.customerEmail} onChange={e=>setFormData({...formData, customerEmail: e.target.value})} type="email" className={inputClass} placeholder="Email Address" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Address */}
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 items-end">
                    <motion.div className="col-span-2" animate={pincodeStatus === 'invalid' ? 'invalid' : pincodeStatus === 'valid' ? 'valid' : ''} variants={shake}>
                      <label className={labelClass}><MapPin size={14} /> Pincode</label>
                      <div className="relative">
                        <MapPin className={iconClass} />
                        <input 
                          required 
                          value={formData.pincode} 
                          onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '').slice(0,6)})} 
                          type="text" 
                          className={`${inputClass} font-mono ${pincodeStatus === 'invalid' ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50' : pincodeStatus === 'valid' ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20 bg-green-50' : ''}`} 
                          placeholder="Pincode" 
                          maxLength={6} 
                        />
                        <AnimatePresence>
                          {pincodeStatus === 'valid' && (
                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                              <CheckCircle2 size={16} strokeWidth={2.5} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    <div className="col-span-3">
                      <label className={labelClass}>Area Hub</label>
                      <input disabled value={formData.areaName} type="text" className="w-full px-4 py-3 bg-slate-100 border border-transparent rounded-xl text-xs font-bold text-slate-400 outline-none cursor-not-allowed" placeholder="Auto-filled" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {pincodeStatus === 'invalid' && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-bold mt-1">
                        Service not available in this pincode.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.div whileTap={{ scale: 0.99 }}>
                    <label className={labelClass}><Home size={14} /> Locality / Sector</label>
                    <Listbox value={formData.locality} onChange={(val) => setFormData({...formData, locality: val})}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-slate-50/50 border border-slate-200 py-3 pl-4 pr-10 text-left focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors">
                          <span className="block truncate">
                            {formData.locality || (pincodeStatus === 'valid' ? 'Select Locality' : 'Enter valid pincode first')}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-sm shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100">
                            {availableLocalities.map((loc, locIdx) => (
                              <Listbox.Option
                                key={locIdx}
                                className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary font-bold' : 'text-slate-700 font-medium'}`}
                                value={loc}
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-black text-primary' : ''}`}>{loc}</span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </motion.div>

                  <motion.div whileTap={{ scale: 0.99 }}>
                    <label className={labelClass}><Home size={14} /> Complete Address</label>
                    <textarea required value={formData.addressLine} onChange={e=>setFormData({...formData, addressLine: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-slate-800 text-sm font-medium transition-all outline-none resize-none placeholder:text-slate-400" rows={2} placeholder="Flat / Building Name, Street..." />
                  </motion.div>
                  
                  <motion.div whileTap={{ scale: 0.99 }}>
                    <label className={labelClass}><MapPin size={14} /> Landmark</label>
                    <div className="relative">
                      <MapPin className={iconClass} />
                      <input value={formData.landmark} onChange={e=>setFormData({...formData, landmark: e.target.value})} type="text" className={inputClass} placeholder="Near..." />
                    </div>
                  </motion.div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div whileTap={{ scale: 0.99 }}>
                    <label className={labelClass}><CalendarIcon size={14} /> Pickup Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4 h-4 z-10" />
                      <DatePicker 
                        selected={formData.pickupDate} 
                        onChange={(date) => setFormData({...formData, pickupDate: date})} 
                        minDate={new Date()}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-slate-800 text-sm font-medium transition-all outline-none cursor-pointer"
                        dateFormat="MMM d, yyyy"
                      />
                    </div>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.99 }}>
                    <label className={labelClass}><Clock size={14} /> Time Window</label>
                    <Listbox value={formData.pickupSlot} onChange={(val) => setFormData({...formData, pickupSlot: val})}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-slate-50/50 border border-slate-200 py-3 pl-10 pr-10 text-left focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors">
                          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                          <span className="block truncate">{formData.pickupSlot}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-sm shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100">
                            {timeSlots.map((slot, idx) => (
                              <Listbox.Option
                                key={idx}
                                className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary font-bold' : 'text-slate-700 font-medium'}`}
                                value={slot}
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-black text-primary' : ''}`}>{slot}</span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </motion.div>
                </div>

                <motion.div whileTap={{ scale: 0.99 }}>
                  <label className={labelClass}><FileText size={14} /> Care Notes</label>
                  <textarea value={formData.customerComment} onChange={e=>setFormData({...formData, customerComment: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-slate-800 text-sm font-medium transition-all outline-none resize-none placeholder:text-slate-400" rows={2} placeholder="Any specific instructions..." />
                </motion.div>

                <div className="pt-4 pb-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting || cartCount === 0 || pincodeStatus === 'invalid' || !formData.pincode}
                    className="relative w-full py-4 px-6 rounded-xl bg-primary disabled:bg-slate-300 disabled:text-slate-500 hover:bg-primary/90 text-white font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 overflow-hidden group"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 
                    <>
                      Schedule Pickup (₹
                      <AnimatePresence mode="popLayout">
                        <motion.span 
                          key={cartTotal}
                          initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: 20, opacity: 0, filter: "blur(4px)", position: "absolute" }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="inline-block"
                        >
                          {cartTotal}
                        </motion.span>
                      </AnimatePresence>
                      ) <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>}
                  </motion.button>
                </div>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
