"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFacebookSquare, FaInstagram, FaTwitter, FaYoutube, FaLinkedin  } from 'react-icons/fa'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [contactData, setContactData] = useState({
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    headOfficeAddress: 'Kolkata, West Bengal, India',
    primaryPhone: '+91 98765 43210',
    supportEmail: 'support@clezo.in'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1'}/contact/`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.contact) {
          setContactData((prev) => ({ ...prev, ...result.data.contact }));
        }
      } catch (error) {
        console.error("Failed to fetch footer contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <footer className="relative bg-[#002333] text-slate-300 pt-20 pb-10 overflow-hidden border-t border-primary/20" role="contentinfo">
      {/* Ambient Magics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        
        {/* Top Section: CTA / Branding */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 pb-12 border-b border-white/10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Clezo.</span>
            </h2>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              The absolute standard in premium hygiene products and facility management. Elevating spaces with unmatched quality.
            </p>
          </div>
          <Link href="/contact" className="group flex items-center gap-3 bg-primary/10 hover:bg-primary border border-primary/30 hover:border-primary text-primary hover:text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(0,174,230,0.15)] hover:shadow-[0_0_30px_rgba(0,174,230,0.4)] whitespace-nowrap">
            Contact Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Middle Section: Links & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Socials */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black text-white uppercase tracking-tighter">CLEZO</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 font-medium">
              Join thousands of satisfied clients who trust Clezo for their daily hygiene, product, and management needs.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {contactData.facebookUrl && (
                <a href={contactData.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform">
                  <FaFacebookSquare size={20} />
                </a>
              )}
              {contactData.instagramUrl && (
                <a href={contactData.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform">
                  <FaInstagram size={20} />
                </a>
              )}
              {contactData.linkedinUrl && (
                <a href={contactData.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform">
                  <FaLinkedin size={20} />
                </a>
              )}
              {contactData.twitterUrl && (
                <a href={contactData.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform">
                  <FaTwitter size={20} />
                </a>
              )}
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform">
                  <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Company</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Services</Link></li>
              <li><Link href="/blogs" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Blogs</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Legal & Support</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-slate-400">
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Contact Support</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Terms & Conditions</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary/50" /> Sitemap</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Get In Touch</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="text-slate-400 leading-relaxed pt-1">{contactData.headOfficeAddress}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                  <Phone size={14} className="text-primary" />
                </div>
                <a href={`tel:${contactData.primaryPhone.replace(/\s/g,'')}`} className="text-slate-400 hover:text-white transition-colors truncate pt-1">
                  {contactData.primaryPhone}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                  <Mail size={14} className="text-primary" />
                </div>
                <a href={`mailto:${contactData.supportEmail}`} className="text-slate-400 hover:text-white transition-colors truncate pt-1">
                  {contactData.supportEmail}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Clezo. All rights reserved.
          </p>
          
          <p className="text-center uppercase tracking-widest text-[10px]">
            Developed by <a href="https://subham.digital" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white font-bold transition-colors">Subham.digital</a> | <a href="https://subham.digital" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary font-bold transition-colors">Straxcel Business Solutions</a>
          </p>
        </div>

      </div>
    </footer>
  );
}