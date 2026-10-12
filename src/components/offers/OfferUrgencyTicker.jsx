"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateRemainingTime } from '@/utils/istTime';

const INDIAN_NAMES = [
  "Pooja K.", "Rohit S.", "Vikram P.", "Neha M.", "Ananya D.", 
  "Aditya R.", "Snehal J.", "Kunal T.", "Shweta N.", "Tanvi K.",
  "Gaurav B.", "Ayesha M.", "Pranav K.", "Meera V.", "Ritu S.",
  "Abhishek G.", "Siddharth C.", "Divya L.", "Nikhil D.", "Kavita S.",
  "Rahul M.", "Priya N.", "Amitabh K.", "Smita P.", "Harsh V."
];

const LOCALITIES = [
  "Hiranandani Estate, Thane", "Kothrud, Pune", "Manpada, Thane", 
  "Viman Nagar, Pune", "Baner, Pune", "Ghodbunder Rd, Thane", 
  "Wakad, Pune", "Majiwada, Thane", "Kalyani Nagar, Pune", 
  "Pokhran Rd, Thane", "Hinjawadi, Pune", "Aundh, Pune", 
  "Vartak Nagar, Thane", "Koregaon Park, Pune", "Naupada, Thane", 
  "Bavdhan, Pune", "Teen Hath Naka, Thane", "Magarpatta, Pune"
];

export default function OfferUrgencyTicker({ offers = [], targetEndDate }) {
  // STRICT RULE: Only active limited-time offers where showInUrgencyTicker is explicitly true
  const tickerEligibleOffers = offers.filter(o => 
    o.isActive && 
    o.isLimitedTime === true && 
    o.showInUrgencyTicker === true
  );

  // If no offer has live urgency ticker enabled in the admin/backend, DO NOT DISPLAY THE SECTION AT ALL!
  if (tickerEligibleOffers.length === 0) {
    return null;
  }

  const validCodesList = tickerEligibleOffers.map(o => o.code).filter(Boolean);
  if (validCodesList.length === 0) {
    return null;
  }
  
  const codesRef = useRef(validCodesList);
  useEffect(() => {
    codesRef.current = validCodesList;
  }, [validCodesList.join(',')]);

  // Determine limited-time offer expiration from eligible offers only
  const limitedTimeOffer = tickerEligibleOffers.find(o => o.endDate);
  const activeEndDate = targetEndDate || limitedTimeOffer?.endDate;

  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 45, seconds: 20 });
  const [noticeIndex, setNoticeIndex] = useState(0);
  const [currentNotice, setCurrentNotice] = useState({
    name: "Pooja K.",
    locality: "Hiranandani Estate, Thane",
    code: validCodesList[0] || "",
    ago: "2 mins ago"
  });

  // 1. Independent Countdown Effect (Updates every 1s)
  useEffect(() => {
    if (!activeEndDate) return;

    const updateCountdown = () => {
      const remaining = calculateRemainingTime(activeEndDate);
      if (!remaining.isExpired) {
        setTimeLeft({
          hours: remaining.days * 24 + remaining.hours,
          minutes: remaining.minutes,
          seconds: remaining.seconds
        });
      } else {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return { hours: 23, minutes: 59, seconds: 59 };
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeEndDate]);

  // 2. Independent Notice Rotation Effect (7-second rotation with codes from eligible offers only)
  useEffect(() => {
    const rotate = () => {
      const availableCodes = codesRef.current.length > 0 ? codesRef.current : validCodesList;
      if (availableCodes.length === 0) return;

      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const randomLocality = LOCALITIES[Math.floor(Math.random() * LOCALITIES.length)];
      const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)];
      const randomMinutes = Math.floor(1 + Math.random() * 12);
      const agoText = randomMinutes === 1 ? "Just now" : `${randomMinutes} mins ago`;

      setCurrentNotice({
        name: randomName,
        locality: randomLocality,
        code: randomCode,
        ago: agoText
      });
      setNoticeIndex(prev => prev + 1);
    };

    const interval = setInterval(rotate, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-3 sm:py-3.5 bg-[#001a2c]/90 backdrop-blur-xl text-white border-y border-white/10 relative z-20 shadow-md">
      {/* Light Glare / Theme Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-emerald-500/10 pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Animated Social Proof Claim Ticker with Smooth Transition */}
          <div className="flex items-center gap-3 font-medium text-slate-300 min-h-[28px] overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={noticeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex items-center gap-1.5 flex-wrap"
              >
                <span className="text-white font-bold">{currentNotice.name}</span>
                <span className="text-slate-400">({currentNotice.locality}) applied</span>
                <span className="text-emerald-400 font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentNotice.code}
                </span>
                <span className="text-slate-400 hidden sm:inline">• {currentNotice.ago}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Real-time IST Countdown Clock */}
          {activeEndDate ? (
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shadow-inner shrink-0">
              <Clock size={15} className="text-amber-400 animate-spin-slow shrink-0" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
                Deals Expire In (IST):
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-amber-400 text-xs sm:text-sm">
                <span className="bg-white/10 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shrink-0">
              <Sparkles size={14} className="text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200">
                Live App Offers Active Now Across Thane &amp; Pune
              </span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
