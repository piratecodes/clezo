"use client";
import React, { useState, Fragment, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Truck, MessageSquare, Send, Phone, User, Mail, FileText, CheckCircle2, Copy, Search, AlertCircle, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Tab, RadioGroup, Listbox, Transition, RadioGroupOption, RadioGroupLabel } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const statusLabels = {
  // Orders
  NEW: 'Booking received',
  CONFIRMED: 'Pickup scheduled',
  PICKED_UP: 'Clothes received',
  RECEIVED_AT_STORE: 'Clothes received',
  PROCESSING: 'Being cleaned',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'On the way',
  DELIVERED: 'Completed',
  COLLECTED: 'Completed',
  CANCELLED: 'Cancelled',
  PENDING_QUOTE: 'Quote in progress',
  QUOTED: 'Quote sent',
  // Tickets
  PENDING: 'Received',
  IN_PROGRESS: 'In progress',
  WAITING_CUSTOMER: 'Waiting for you',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const categoryOptions = [
  { id: 'DAMAGE', name: 'Damaged item' },
  { id: 'LOST_ITEM', name: 'Lost item' },
  { id: 'DELAY', name: 'Delay' },
  { id: 'QUALITY', name: 'Quality issue' },
  { id: 'BILLING', name: 'Billing issue' },
  { id: 'STAFF_BEHAVIOUR', name: 'Staff behaviour' },
  { id: 'OTHER', name: 'Other' },
];

const schema = z.object({
  type: z.enum(['ENQUIRY', 'COMPLAINT']),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, '10-digit number starting with 6-9'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Max 1000 characters'),
  category: z.string().optional(),
  orderNumber: z.string().optional(),
  website: z.string().optional(), // honeypot
}).superRefine((data, ctx) => {
  if (data.type === 'COMPLAINT' && !data.category) {
    ctx.addIssue({
      path: ['category'],
      message: 'Category is required for complaints',
      code: z.ZodIssueCode.custom,
    });
  }
});

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SupportBox({ compactMode = false }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "200px" });

  const [activeTab, setActiveTab] = useState(compactMode ? 'support' : 'book'); // 'book' or 'support'
  const [supportMode, setSupportMode] = useState('MESSAGE'); // 'MESSAGE' or 'TRACK'
  
  // Track Status State
  const [trackRef, setTrackRef] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Message Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null); // { ticketNumber, type }

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'ENQUIRY',
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
      category: '',
      orderNumber: '',
      website: '',
    }
  });

  const formType = watch('type');

  const onSubmitMessage = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data };
      // Backend DTOs with @IsEnum fail if an empty string is passed instead of undefined
      if (!payload.category) delete payload.category;
      if (!payload.orderNumber) delete payload.orderNumber;
      if (!payload.email) delete payload.email;
      if (!payload.website) delete payload.website;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/support-tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.ticketNumber) {
        setSuccessData({ ticketNumber: json.ticketNumber, type: data.type });
        reset();
      } else {
        toast.error("Failed to submit ticket. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackRef || !trackPhone) return;
    setIsTracking(true);
    setTrackError('');
    setTrackResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/track?ref=${encodeURIComponent(trackRef)}&phone=${encodeURIComponent(trackPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setTrackResult(data);
      } else {
        setTrackError("We couldn't find a match. Check the number and phone.");
      }
    } catch (err) {
      setTrackError("Network error. Please try again.");
    }
    setIsTracking(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Ticket number copied!');
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-700 transition-all";
  const inputErrorClass = "border-red-400 focus:border-red-500 focus:ring-red-500/20";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

  const innerContent = (
    <div className="bg-white/50 rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full">
      {/* Main Tabs */}
      {!compactMode && (
        <div className="flex flex-col sm:flex-row border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'book' ? 'bg-white text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Truck size={18} /> Quick Book Order
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'support' ? 'bg-white text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <MessageSquare size={18} /> Service Query & Support
          </button>
        </div>
      )}

      <div className="bg-white/50 min-h-[600px] relative overflow-hidden flex-grow flex flex-col">
        {!compactMode && (
          <motion.div
            initial={false}
                animate={{ opacity: activeTab === 'book' ? 1 : 0, y: activeTab === 'book' ? 0 : 10 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 w-full h-full min-h-[600px] p-0 sm:p-6 transition-all ${activeTab === 'book' ? 'z-10 pointer-events-auto' : 'z-0 pointer-events-none'}`}
              >
                {isInView ? (
                  <iframe 
                    src="https://pickup-scheduler.quickdrycleaning.com/en/ClezoExpress/pickup" 
                    className="w-full h-full min-h-[600px] border-none rounded-xl bg-white"
                    title="Schedule Pickup"
                  />
                ) : (
                  <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </motion.div>
        )}

        <motion.div
          initial={false}
          animate={{ opacity: activeTab === 'support' ? 1 : 0, y: activeTab === 'support' ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className={`relative w-full max-w-2xl mx-auto py-10 px-4 sm:px-8 bg-white/50 transition-all flex-grow ${activeTab === 'support' ? 'z-10 pointer-events-auto' : 'z-0 pointer-events-none absolute inset-0'}`}
        >
                  
                  {/* Support Mode Tabs */}
                  {!successData && (
                    <Tab.Group selectedIndex={supportMode === 'MESSAGE' ? 0 : 1} onChange={(index) => setSupportMode(index === 0 ? 'MESSAGE' : 'TRACK')}>
                      <Tab.List className="flex space-x-1 rounded-full bg-slate-100 p-1 mb-8 max-w-md mx-auto">
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'w-full rounded-full py-2.5 text-sm font-bold leading-5 transition-all outline-none relative',
                              selected ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className="relative z-10 flex items-center justify-center gap-2"><Send size={16} /> Send a Message</span>
                              {selected && (
                                <motion.div layoutId="pill" className="absolute inset-0 bg-white rounded-full shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                              )}
                            </>
                          )}
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'w-full rounded-full py-2.5 text-sm font-bold leading-5 transition-all outline-none relative',
                              selected ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className="relative z-10 flex items-center justify-center gap-2"><Search size={16} /> Track Status</span>
                              {selected && (
                                <motion.div layoutId="pill" className="absolute inset-0 bg-white rounded-full shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                              )}
                            </>
                          )}
                        </Tab>
                      </Tab.List>
                    </Tab.Group>
                  )}

                  <AnimatePresence mode="wait">
                    
                    {/* SUCCESS SCREEN */}
                    {successData ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
                        >
                          <CheckCircle2 size={40} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Message Received!</h3>
                        <p className="text-slate-600 mb-6">
                          {successData.type === 'COMPLAINT' 
                            ? "We're sorry for the inconvenience. We will contact you within 24 hours." 
                            : "Thank you for reaching out. We will reply within one working day."}
                        </p>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto mb-8">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Ticket Number</p>
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl font-black text-primary font-mono tracking-wider">{successData.ticketNumber}</span>
                            <button onClick={() => copyToClipboard(successData.ticketNumber)} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-primary transition-colors shadow-sm">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <button onClick={() => { setTrackRef(successData.ticketNumber); setSuccessData(null); setSupportMode('TRACK'); }} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                            Track this ticket
                          </button>
                          <button onClick={() => setSuccessData(null)} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                            Send another
                          </button>
                        </div>
                      </motion.div>
                    ) : supportMode === 'MESSAGE' ? (
                      /* SEND A MESSAGE MODE */
                      <motion.form
                        key="message-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit(onSubmitMessage)}
                        className="space-y-6"
                      >
                        
                        <Controller
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup value={field.value} onChange={field.onChange} className="grid grid-cols-2 gap-4">
                              {['ENQUIRY', 'COMPLAINT'].map((opt) => (
                                <RadioGroupOption
                                  key={opt}
                                  value={opt}
                                  className={({ active, checked }) =>
                                    `${active ? 'ring-2 ring-primary/50 ring-offset-2' : ''}
                                     ${checked ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                                      relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all`
                                  }
                                >
                                  {({ checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="text-sm">
                                          <RadioGroupLabel as="p" className={`font-bold ${checked ? 'text-primary' : 'text-slate-900'}`}>
                                            {opt === 'ENQUIRY' ? 'General Service Enquiry' : 'Complaint'}
                                          </RadioGroupLabel>
                                        </div>
                                      </div>
                                      {checked && (
                                        <div className="shrink-0 text-primary">
                                          <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </RadioGroupOption>
                              ))}
                            </RadioGroup>
                          )}
                        />

                        {/* Complaint specific fields */}
                        <AnimatePresence>
                          {formType === 'COMPLAINT' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-50"
                            >
                              <div className="pb-2">
                                <label className={labelClass}>Category *</label>
                                <Controller
                                  name="category"
                                  control={control}
                                  render={({ field }) => (
                                    <Listbox value={field.value} onChange={field.onChange}>
                                      <div className="relative mt-1">
                                        <Listbox.Button className={`relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border ${errors.category ? inputErrorClass : 'border-slate-200'} focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-sm`}>
                                          <span className={`block truncate ${!field.value ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {field.value ? categoryOptions.find(c => c.id === field.value)?.name : 'Select a category'}
                                          </span>
                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                          </span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                          <div className="absolute mt-1 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                            <Listbox.Options className="max-h-60 w-full overflow-y-auto overflow-x-hidden py-1 text-base focus:outline-none sm:text-sm">
                                              {categoryOptions.map((cat) => (
                                              <Listbox.Option
                                                key={cat.id}
                                                className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-slate-900'}`}
                                                value={cat.id}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{cat.name}</span>
                                                    {selected ? (
                                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                        <Check className="h-4 w-4" aria-hidden="true" />
                                                      </span>
                                                    ) : null}
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                            </Listbox.Options>
                                          </div>
                                        </Transition>
                                      </div>
                                    </Listbox>
                                  )}
                                />
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                              </div>
                              <div className="pb-2">
                                <label className={labelClass}>Order Number (Optional)</label>
                                <div className="relative">
                                  <input {...register('orderNumber')} type="text" className={classNames(inputClass, errors.orderNumber && inputErrorClass)} placeholder="e.g. CLZ-1042" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>Your Name *</label>
                            <div className="relative">
                              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input {...register('name')} type="text" className={classNames(inputClass, 'pl-10', errors.name && inputErrorClass)} placeholder="John Doe" />
                            </div>
                            {errors.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">{errors.name.message}</motion.p>}
                          </div>
                          <div>
                            <label className={labelClass}>Phone Number *</label>
                            <div className="relative flex">
                              <div className="flex items-center justify-center bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 text-slate-500 font-bold text-sm">
                                +91
                              </div>
                              <input {...register('phone')} type="text" className={classNames(inputClass, 'rounded-l-none', errors.phone && inputErrorClass)} placeholder="9876543210" maxLength={10} />
                            </div>
                            {errors.phone && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">{errors.phone.message}</motion.p>}
                          </div>
                        </div>
                        
                        <div>
                          <label className={labelClass}>Email Address (Optional)</label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input {...register('email')} type="email" className={classNames(inputClass, 'pl-10', errors.email && inputErrorClass)} placeholder="john@example.com" />
                          </div>
                          {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">{errors.email.message}</motion.p>}
                        </div>

                        <div>
                          <label className={labelClass}>Subject *</label>
                          <div className="relative">
                            <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input {...register('subject')} type="text" className={classNames(inputClass, 'pl-10', errors.subject && inputErrorClass)} placeholder="What is this regarding?" />
                          </div>
                          {errors.subject && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">{errors.subject.message}</motion.p>}
                        </div>

                        <div>
                          <label className={labelClass}>Message *</label>
                          <textarea {...register('message')} className={classNames(inputClass, 'h-32 resize-none', errors.message && inputErrorClass)} placeholder="Please describe your issue or inquiry in detail..." />
                          {errors.message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">{errors.message.message}</motion.p>}
                        </div>

                        {/* Honeypot */}
                        <div className="hidden">
                          <input {...register('website')} type="text" tabIndex="-1" autoComplete="off" />
                        </div>

                        <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                          {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> {formType === 'COMPLAINT' ? 'Submit Complaint' : 'Send Enquiry'}</>}
                        </button>
                      </motion.form>
                    ) : (
                      /* TRACK STATUS MODE */
                      <motion.div
                        key="track-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="max-w-md mx-auto space-y-6"
                      >
                        <form onSubmit={handleTrack} className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <div>
                            <label className={labelClass}>Ticket or Order Number</label>
                            <input 
                              required 
                              value={trackRef} 
                              onChange={e => setTrackRef(e.target.value)} 
                              type="text" 
                              className={inputClass} 
                              placeholder="e.g. CLZ-T-1001 or CLZ-1042" 
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Phone Number used</label>
                            <div className="relative flex">
                              <div className="flex items-center justify-center bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 text-slate-500 font-bold text-sm">
                                +91
                              </div>
                              <input 
                                required 
                                value={trackPhone} 
                                onChange={e => setTrackPhone(e.target.value)} 
                                type="text" 
                                className={classNames(inputClass, 'rounded-l-none')} 
                                placeholder="9876543210" 
                                maxLength={10} 
                              />
                            </div>
                          </div>
                          
                          <button disabled={isTracking} type="submit" className="w-full py-3.5 bg-slate-800 text-white font-extrabold rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                            {isTracking ? <><Loader2 size={18} className="animate-spin" /> Tracking...</> : <><Search size={18} /> Track Status</>}
                          </button>

                          <AnimatePresence>
                            {trackError && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 text-sm font-medium">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {trackError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </form>

                        <AnimatePresence>
                          {trackResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white border-2 border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{trackResult.type === 'ticket' ? 'Support Ticket' : 'Laundry Order'}</span>
                                  <h4 className="text-xl font-black text-slate-800 font-mono tracking-wide">{trackResult.number}</h4>
                                </div>
                                <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg text-sm">
                                  {statusLabels[trackResult.status] || trackResult.status}
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                  <span className="font-medium">Created On</span>
                                  <span className="font-bold text-slate-800">{new Date(trackResult.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                {trackResult.type === 'order' && (
                                  <>
                                    <div className="flex justify-between border-b border-slate-100 pb-2 pt-2">
                                      <span className="font-medium">Service Mode</span>
                                      <span className="font-bold text-slate-800">{trackResult.mode === 'STORE_VISIT' ? 'Store Visit' : 'Pickup & Drop'}</span>
                                    </div>
                                    {trackResult.expectedReadyAt && (
                                      <div className="flex justify-between pt-2">
                                        <span className="font-medium">Expected Ready By</span>
                                        <span className="font-bold text-primary">{new Date(trackResult.expectedReadyAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              {trackResult.type === 'ticket' && trackResult.messages && trackResult.messages.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Conversation History</h5>
                                  {trackResult.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-500">{msg.isAdmin ? 'Support Team' : 'You'}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                                      </div>
                                      <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${msg.isAdmin ? 'bg-slate-100 text-slate-700 rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'}`}>
                                        <p className="whitespace-pre-wrap">{msg.body}</p>
                                        {msg.attachments && msg.attachments.length > 0 && (
                                          <div className="mt-2 flex gap-2">
                                            {msg.attachments.map((att, i) => (
                                              <a key={i} href={att} target="_blank" rel="noreferrer" className="text-xs underline opacity-80 hover:opacity-100">Attachment {i+1}</a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </motion.div>
                    )}
                  </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );

  if (compactMode) {
    return innerContent;
  }

  return (
    <section ref={sectionRef} className="py-20 relative bg-white/5">
      <div className="container px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">How Can We Help You?</h2>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto">
            Choose to schedule a quick pickup or reach out to our support team for any inquiries or complaints.
          </p>
        </div>
        {innerContent}
      </div>
    </section>
  );
}
