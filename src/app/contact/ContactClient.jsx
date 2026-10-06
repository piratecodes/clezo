"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Transition, Disclosure } from "@headlessui/react";
import { MapPin, Phone, Mail, Copy, Check, ChevronUp, Loader2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import SupportBox from "@/components/landing/SupportBox";

// Helper to extract username from URL
function extractUsername(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    let username = pathSegments[pathSegments.length - 1] || "";
    // strip query params (URL constructor handles it but just in case)
    username = username.split("?")[0];
    if (username.startsWith("@")) {
      username = username.substring(1);
    }
    return username ? `@${username}` : url;
  } catch (e) {
    return url;
  }
}

const InfoCard = ({ icon: Icon, label, value, copyText, href, canCopy = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    if (!canCopy) return;
    e.preventDefault();
    const textToCopy = copyText || (typeof value === 'string' ? value : '');
    if (textToCopy) navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-primary/5 relative group hover:border-primary/20 transition-colors"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-slate-50 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          {href ? (
            <a href={href} className="text-slate-700 font-bold block truncate hover:text-primary transition-colors" target={href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer">
              {value}
            </a>
          ) : (
            <p className="text-slate-700 font-bold">{value}</p>
          )}
        </div>
        {canCopy && (
          <div className="relative shrink-0 ml-2">
            <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50">
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <Transition
              show={copied}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg"
            >
              Copied!
            </Transition>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MapCard = ({ address, googleMapsLink }) => {
  const [loaded, setLoaded] = useState(false);
  const encodedAddress = encodeURIComponent(address || "Kolkata, India");
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
  
  const mapLink = googleMapsLink || `https://maps.google.com/maps?q=${encodedAddress}`;

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-[2rem] p-3 border border-slate-100 shadow-xl shadow-primary/5 relative group overflow-hidden">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden bg-slate-50">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
            <Loader2 className="animate-spin text-slate-300 w-8 h-8" />
          </div>
        )}
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0 dark:contrast-[0.9] dark:brightness-[0.9]"
          allowFullScreen=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer-when-downgrade"
          title="Clezo Express Laundry Location"
        />
        <a 
          href={mapLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg text-sm font-bold text-slate-800 border border-white hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
        >
          <MapPin size={16} /> Open in Google Maps
        </a>
      </div>
    </motion.div>
  );
};

const SocialLinks = ({ facebookUrl, instagramUrl, twitterUrl, linkedinUrl }) => {
  const platforms = [
    { url: facebookUrl, icon: FaFacebook, name: "Facebook" },
    { url: instagramUrl, icon: FaInstagram, name: "Instagram" },
    { url: twitterUrl, icon: FaTwitter, name: "X (Twitter)" },
    { url: linkedinUrl, icon: FaLinkedin, name: "LinkedIn" },
  ].filter(p => p.url);

  if (platforms.length === 0) return null;

  return (
    <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8">
      {platforms.map((platform, idx) => {
        const username = extractUsername(platform.url);
        const shouldReduceMotion = useReducedMotion();
        return (
          <motion.a
            key={idx}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${platform.name}, ${username || platform.name}`}
            whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20 text-slate-600 hover:text-primary hover:border-primary/30 transition-colors group"
          >
            <platform.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">{username || platform.name}</span>
          </motion.a>
        );
      })}
    </motion.div>
  );
};

const FaqAccordion = () => {
  const faqs = [
    {
      q: "What is your service area in Thane?",
      a: "We currently serve all major localities across Thane City. You can check the availability of our services by entering your pincode in the booking section."
    },
    {
      q: "What is the turnaround time for cleaning?",
      a: "Our standard turnaround time is 48 to 72 hours depending on the garment type and cleaning requirements. Express 24-hour service is also available upon request."
    },
    {
      q: "How can I track my order?",
      a: "You can track the live status of your order directly from the 'Contact & Support' tab by selecting 'Track Status' and entering your order number and phone number."
    },
    {
      q: "How do I raise a complaint?",
      a: "Use the 'Send a Message' form on this page, select 'Complaint', and choose the appropriate category. Our support team will get back to you within 24 hours."
    },
    {
      q: "What are your store timings?",
      a: "Our customer support team is available from 9:00 AM to 9:00 PM, all days of the week."
    }
  ];

  return (
    <motion.div variants={fadeUp} className="mt-24 max-w-4xl mx-auto w-full relative z-20">
      <div className="bg-primary-fixed/15 backdrop-blur-xs rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest mx-auto">
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Disclosure key={i}>
            {({ open }) => (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-slate-800 hover:bg-slate-50 focus:outline-none">
                  <span className="font-bold">{faq.q}</span>
                  <ChevronUp className={`${open ? 'rotate-180 transform' : ''} w-5 h-5 text-slate-400 transition-transform duration-200`} />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="transform scale-95 opacity-0 -translate-y-4"
                  enterTo="transform scale-100 opacity-100 translate-y-0"
                  leave="transition duration-150 ease-out"
                  leaveFrom="transform scale-100 opacity-100 translate-y-0"
                  leaveTo="transform scale-95 opacity-0 -translate-y-4"
                >
                  <Disclosure.Panel className="px-6 pb-5 text-slate-600 font-medium text-sm leading-relaxed">
                    {faq.a}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        ))}
        </div>
      </div>
    </motion.div>
  );
};

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const slideRight = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const slideLeft = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export default function ContactClient({ contactData }) {
  const shouldReduceMotion = useReducedMotion();

  if (!contactData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-32 pb-20 px-4">
        <h1 className="text-3xl font-black text-slate-800 mb-4">Contact Us</h1>
        <p className="text-slate-500 mb-8 font-medium">Please call our support directly for immediate assistance.</p>
        <div className="w-full max-w-lg">
          <SupportBox compactMode={true} />
        </div>
      </div>
    );
  }

  const {
    primaryPhone, whatsappNumber, alternatePhone, supportEmail, salesEmail, 
    headOfficeAddress, googleMapsLink, facebookUrl, instagramUrl, twitterUrl, linkedinUrl
  } = contactData;

  // Clean numbers for links
  const cleanNumber = (num) => num ? num.replace(/\D/g, '') : '';

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden border-b border-slate-200/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="text-slate-800">Contact</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 relative inline-block">
              Us
              <motion.span 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 h-1.5 bg-primary/20 rounded-full"
              />
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Experience premium garment care and lightning-fast support. We're here to help you <span className="font-bold text-primary">every step of the way</span>.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
          
          {/* Left Column: Form Box (Sticky) */}
          <motion.div 
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } } : slideRight} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="w-full lg:w-[45%] lg:sticky lg:top-24 shrink-0"
          >
            {/* The SupportBox from the landing page in compact mode (no Book tab) */}
            <div className="-mt-10 lg:mt-0 h-full">
              <SupportBox compactMode={true} />
            </div>
          </motion.div>

          {/* Right Column: Info, Map, Socials */}
          <motion.div 
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="w-full lg:w-[55%] flex flex-col gap-6"
          >
            {/* 2x2 Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {headOfficeAddress && (
                <InfoCard 
                  icon={MapPin} label="Head Office" value={headOfficeAddress} 
                  href={googleMapsLink || `https://maps.google.com/maps?q=${encodeURIComponent(headOfficeAddress)}`} 
                  canCopy={false} 
                />
              )}

              {primaryPhone && (
                <InfoCard 
                  icon={Phone} label="Call Us" 
                  value={
                    <span className="flex flex-col gap-1">
                      <span>{primaryPhone}</span>
                      {alternatePhone && <span className="text-slate-500 font-medium text-sm">{alternatePhone}</span>}
                    </span>
                  } 
                  copyText={primaryPhone}
                  href={`tel:${cleanNumber(primaryPhone)}`} 
                  canCopy={true} 
                />
              )}

              {whatsappNumber && (
                <InfoCard 
                  icon={FaWhatsapp} label="WhatsApp" value={whatsappNumber} 
                  href={`https://wa.me/${cleanNumber(whatsappNumber)}`} 
                  canCopy={true} 
                />
              )}

              {supportEmail && (
                <InfoCard 
                  icon={Mail} label="Support Email" value={supportEmail} 
                  href={`mailto:${supportEmail}`} 
                  canCopy={true} 
                />
              )}

              {salesEmail && (
                <InfoCard 
                  icon={Mail} label="Sales Email" value={salesEmail} 
                  href={`mailto:${salesEmail}`} 
                  canCopy={true} 
                />
              )}

            </div>

            {/* Map */}
            {headOfficeAddress && <MapCard address={headOfficeAddress} googleMapsLink={googleMapsLink} />}

            {/* Socials */}
            <SocialLinks 
              facebookUrl={facebookUrl} 
              instagramUrl={instagramUrl} 
              twitterUrl={twitterUrl} 
              linkedinUrl={linkedinUrl} 
            />

          </motion.div>
        </div>

        {/* FAQ Section */}
        <FaqAccordion />

      </div>
    </main>
  );
}
