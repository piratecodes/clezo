"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfferStickyMobileCta({ offer }) {
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setIsIos(true);
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playStoreUrl = offer?.playStoreUrl || "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo";
  const appStoreUrl = offer?.appStoreUrl || "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943";
  const targetStoreUrl = isIos ? appStoreUrl : playStoreUrl;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 px-4 sm:px-6 bg-[#001724]/90 backdrop-blur-xl border-t border-white/15 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between gap-3">
            
            {/* Deal Info */}
            <div className="truncate pr-2">
              <div className="flex items-center gap-1.5">
                {offer?.discount && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-md shadow-xs">
                    {offer.discount}
                  </span>
                )}
                <span className="text-xs font-black text-white truncate font-mono">
                  {offer?.code || 'CLEZO APP'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate mt-0.5 font-medium">
                {offer?.title || 'Claim in Clezo App'}
              </p>
            </div>

            {/* Claim Action Button */}
            <a
              href={targetStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 bg-primary hover:bg-primary-fixed-variant text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Smartphone size={14} />
              <span>Claim In App</span>
              <ArrowRight size={13} />
            </a>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
