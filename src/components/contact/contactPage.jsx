"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Loader2, MessageCircle } from 'lucide-react';
import { FaFacebookSquare, FaInstagram, FaTwitter, FaLinkedin  } from 'react-icons/fa'

export default function ContactPage() {
  const [contactData, setContactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1'}/contact/`);
        const data = await res.json();
        
        if (data.success && data.data && data.data.contact) {
          // Pass the exact object from the database directly into state
          setContactData(data.data.contact);
        } else {
          // Fallback data updated to perfectly match your API model keys
          setContactData({
            headOfficeAddress: "Bhawanipur 25A, Asutosh Mukherjee Road, Kolkata, West Bengal, India",
            primaryPhone: "+91 98765 43210",
            whatsappNumber: "+91 98765 43210",
            supportEmail: "support@clezo.com",
            salesEmail: "sales@clezo.com",
            googleMapsLink: "https://www.google.com/maps/embed?pb=...", // Real embed link format
            facebookUrl: "https://facebook.com",
            instagramUrl: "https://instagram.com",
            twitterUrl: "",
            linkedinUrl: "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch contact data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-secondary mb-4" size={40} />
        <p className="text-primary font-bold tracking-widest uppercase text-xs">Loading Details...</p>
      </div>
    );
  }

  // Helper to check if ANY social links exist (ignores empty strings from the DB)
  const hasSocials = Boolean(
    contactData?.facebookUrl || 
    contactData?.instagramUrl || 
    contactData?.twitterUrl || 
    contactData?.linkedinUrl
  );

  return (
    <main className="min-h-screen pt-24 pb-20" role="main">
      <div className="container px-4 max-w-7xl relative z-10 mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Reach Out Today
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6 tracking-tight">
            Let's Get <span className="text-primary italic">Moving.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium">
            Looking for reliable packers and movers in Kolkata? Contact Clezo for safe home shifting, office relocation, car ransportation, and storage services. Our team is ready to assist you with quick quotes and professional moving support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT: Contact Information Card */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">
            
            {/* Decorative Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

            <div>
              <h3 className="text-3xl font-black text-primary mb-10">Headquarters</h3>
              
              <div className="space-y-8 relative z-10">
                {/* 1. Address mapped to headOfficeAddress */}
                {contactData?.headOfficeAddress && (
                  <div className="flex gap-5 items-start group">
                    <div className="w-14 h-14 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-secondary transition-colors rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="font-black text-primary mb-1 text-lg">Clezo Express Laundry</p>
                      <p className="text-gray-500 leading-relaxed font-medium">{contactData.headOfficeAddress}</p>
                    </div>
                  </div>
                )}
                
                {/* 2. Phone mapped to primaryPhone */}
                {contactData?.primaryPhone && (
                  <div className="flex gap-5 items-start group">
                    <div className="w-14 h-14 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-secondary transition-colors rounded-2xl flex items-center justify-center shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="font-black text-primary mb-1 text-lg">Call Us</p>
                      <a href={`tel:${contactData.primaryPhone.replace(/\s/g,'')}`} className="text-gray-500 font-medium hover:text-secondary transition-colors">
                        {contactData.primaryPhone}
                      </a>
                      {/* Optional: Show WhatsApp if it exists in DB */}
                      {contactData?.whatsappNumber && (
                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                           WhatsApp: <a href={`https://wa.me/${contactData.whatsappNumber.replace(/\s/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 font-medium hover:text-secondary hover:underline transition-colors">
                             {contactData.whatsappNumber}
                           </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Email mapped to supportEmail */}
                {contactData?.supportEmail && (
                  <div className="flex gap-5 items-start group">
                    <div className="w-14 h-14 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-secondary transition-colors rounded-2xl flex items-center justify-center shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="font-black text-primary mb-1 text-lg">Email Us</p>
                      <a href={`mailto:${contactData.supportEmail}`} className="text-gray-500 font-medium hover:text-secondary transition-colors">
                        {contactData.supportEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Socials mapped to flat DB URLs */}
            {hasSocials && (
              <div className="mt-12 pt-8 border-t border-gray-100 relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Connect With Us</p>
                <div className="flex flex-wrap items-center gap-3">
                  
                  {contactData?.facebookUrl && (
                    <a href={contactData.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm">
                      <FaFacebookSquare size={20} />
                    </a>
                  )}
                  
                  {contactData?.instagramUrl && (
                    <a href={contactData.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all shadow-sm">
                      <FaInstagram size={20} />
                    </a>
                  )}
                  
                  {contactData?.twitterUrl && (
                    <a href={contactData.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-sm">
                      <FaTwitter size={20} />
                    </a>
                  )}

                  {contactData?.linkedinUrl && (
                    <a href={contactData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all shadow-sm">
                      <FaLinkedin size={20} />
                    </a>
                  )}

                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Dynamic Google Map mapped to googleMapsLink */}
          <div className="h-[400px] lg:h-auto min-h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white relative bg-gray-100 flex items-center justify-center">
            {contactData?.googleMapsLink ? (
              <iframe 
                src={contactData.googleMapsLink}
                className="absolute inset-0 w-full h-full border-0 filter contrast-[0.95]"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
              ></iframe>
            ) : (
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Map data unavailable</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}