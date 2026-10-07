"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACTIVITIES = ['window-washer', 'scanner', 'spritzer', 'zoomer', 'inspector', 'napping'];

export default function ClezoBot() {
  const [activity, setActivity] = useState('hidden'); // hidden, surprised, or one of ACTIVITIES
  const [facing, setFacing] = useState(1); // 1 = right, -1 = left
  const [positionX, setPositionX] = useState(-200);
  const idleTimerRef = useRef(null);
  const firstImpressionDone = useRef(false);

  // Easter Egg Click Handler
  const handleSurprise = () => {
    if (activity === 'surprised' || activity === 'hidden') return;
    setActivity('surprised');
    // Drop mop and run away!
    setTimeout(() => {
      setFacing(-1); // Turn around
      setPositionX(-50); // Run back into the base station
      setTimeout(() => setActivity('hidden'), 1000);
    }, 800);
  };

  // Activity Manager
  const triggerRandomActivity = () => {
    if (activity === 'surprised') return;
    const nextActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    setActivity(nextActivity);
    setFacing(1);
    setPositionX(-50); // Start inside the station
    
    // Wait for the station door to open before driving out
    setTimeout(() => {
      if (nextActivity === 'zoomer') {
        setPositionX(typeof window !== 'undefined' ? window.innerWidth + 100 : 2000);
      } else {
        setPositionX(90); // Move completely out of the station
      }
    }, 600);
    
    // Reset back to hidden after working
    setTimeout(() => {
      if (activity !== 'surprised') {
        setFacing(-1); // Turn around to face the station
        setPositionX(-50); // Drive back inside
        setTimeout(() => setActivity('hidden'), 1200); // Close door and hide station
      }
    }, nextActivity === 'zoomer' ? 4000 : 7000);
  };

  useEffect(() => {
    // 1. First impression after 4.5 seconds
    const initialTimer = setTimeout(() => {
      if (!firstImpressionDone.current) {
        firstImpressionDone.current = true;
        triggerRandomActivity();
      }
    }, 4500);

    // 2. Idle Tracker (5 seconds)
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      // Only trigger if bot is currently hidden
      idleTimerRef.current = setTimeout(() => {
        setActivity(curr => {
          if (curr === 'hidden') {
            setTimeout(triggerRandomActivity, 100);
          }
          return curr;
        });
      }, 5000);
    };

    // Listeners for idle detection
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    resetIdleTimer();

    return () => {
      clearTimeout(initialTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
    };
  }, []);

  if (activity === 'hidden') return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-[150px] z-[100] pointer-events-none hidden md:block overflow-visible">
      {/* Base Station Door */}
      <motion.div 
        className="absolute bottom-4 left-0 w-20 h-[85px] bg-gradient-to-r from-gray-900 to-[#001b2e] rounded-r-2xl border-r-4 border-t-2 border-primary z-50 shadow-[0_0_20px_rgba(0,174,230,0.4)]"
        initial={{ x: -100 }}
        animate={{ x: activity !== 'hidden' ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Blinking Status Light */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
        
        {/* Sliding Mechanical Door */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full bg-gray-800 rounded-br-xl border-r-2 border-gray-600 flex items-center justify-center overflow-hidden"
          animate={{ height: positionX > -40 ? '0%' : '100%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Danger Stripes on Door */}
          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
        </motion.div>
      </motion.div>

      {/* Container is pointer-events-none so it doesn't block clicks on the footer. Bot itself has pointer-events-auto */}
      <motion.div
        className="absolute bottom-4 pointer-events-auto cursor-pointer z-40"
        animate={{ x: positionX, scaleX: facing }}
        transition={{ 
          x: activity === 'zoomer' ? { duration: 2.5, ease: "linear" } : { type: "spring", stiffness: 80, damping: 15 },
          scaleX: { duration: 0.2 }
        }}
        onClick={handleSurprise}
      >
        {/* Render Activity Props */}
        <div className="relative">
          {/* Main Bot SVG */}
          <motion.svg 
            width="80" height="80" viewBox="0 0 100 100"
            animate={{
              y: activity === 'surprised' ? -30 : activity === 'napping' ? 15 : activity === 'inspector' ? [0, -10, 0] : [0, -3, 0],
              rotate: activity === 'surprised' ? 15 : 0
            }}
            transition={{ 
              y: activity === 'surprised' || activity === 'napping' ? { type: "spring" } : { repeat: Infinity, duration: activity === 'inspector' ? 1 : 2, ease: "easeInOut" }
            }}
          >
            {/* Shadow */}
            <ellipse cx="50" cy="95" rx="30" ry="5" fill="rgba(0,0,0,0.1)" />
            {/* Body */}
            <rect x="25" y="30" width="50" height="55" rx="25" fill="#ffffff" stroke="#00aee6" strokeWidth="4"/>
            {/* Screen */}
            <rect x="30" y="40" width="40" height="20" rx="10" fill="#002333" />
            
            {/* Eyes */}
            {activity === 'napping' ? (
              <>
                <path d="M38 50 Q 42 46 46 50" stroke="#00aee6" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M54 50 Q 58 46 62 50" stroke="#00aee6" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : activity === 'surprised' ? (
              <>
                <circle cx="40" cy="50" r="5" fill="#ef4444" />
                <circle cx="60" cy="50" r="5" fill="#ef4444" />
                <path d="M35 40 L45 45 M65 40 L55 45" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /> {/* Angry/Surprised eyebrows */}
              </>
            ) : activity === 'scanner' ? (
              <>
                <rect x="35" y="48" width="30" height="4" rx="2" fill="#00aee6" /> {/* Cylon eye */}
              </>
            ) : (
              <>
                <circle cx="40" cy="50" r="4" fill="#00c6ff" />
                <circle cx="60" cy="50" r="4" fill="#00c6ff" />
              </>
            )}

            {/* Thruster/Base */}
            <path d="M40 85 L 60 85 L 55 95 L 45 95 Z" fill="#00aee6" />
          </motion.svg>

          {/* === ACTIVITY PROPS === */}
          
          {/* 1. Scanner Laser */}
          {activity === 'scanner' && (
             <motion.div 
               className="absolute top-10 left-[60px] w-[200px] h-[20px] bg-gradient-to-r from-[#00c6ff]/40 to-transparent -rotate-12 origin-left blur-sm"
               animate={{ rotate: [-15, 15, -15] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             />
          )}

          {/* 2. Zzz for Napping */}
          {activity === 'napping' && (
             <motion.div 
               className="absolute -top-10 left-[50px] text-primary font-black text-xl"
               animate={{ y: [0, -20], opacity: [1, 0], scale: [0.5, 1.5] }}
               transition={{ duration: 2, repeat: Infinity }}
             >
               Zzz
             </motion.div>
          )}

          {/* 3. Dropped Mop (Easter Egg) */}
          {activity === 'surprised' && (
             <motion.div 
               className="absolute bottom-0 left-[-20px]"
               initial={{ rotate: 0, y: 0 }}
               animate={{ rotate: -90, y: 30, x: -10 }}
               transition={{ type: "spring" }}
             >
               <div className="w-1 h-12 bg-gray-400"></div>
               <div className="w-6 h-4 bg-primary -ml-2.5 rounded-sm"></div>
             </motion.div>
          )}

          {/* 4. Spritzer Particles */}
          {activity === 'spritzer' && (
             <motion.div 
               className="absolute top-8 left-[60px] flex gap-1"
               animate={{ opacity: [0, 1, 0], x: [0, 30] }}
               transition={{ duration: 0.8, repeat: Infinity }}
             >
               <div className="w-2 h-2 rounded-full bg-[#00c6ff]"></div>
               <div className="w-1 h-1 rounded-full bg-white mt-2"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-primary -mt-1"></div>
             </motion.div>
          )}

          {/* 5. Window Washer Squeegee */}
          {activity === 'window-washer' && (
             <motion.div 
               className="absolute top-4 left-[65px]"
               animate={{ y: [-10, 20, -10] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             >
               <div className="w-10 h-1 bg-gray-500 rotate-90 origin-left"></div>
               <div className="w-2 h-10 bg-primary -ml-1 mt-1 rounded-sm"></div>
             </motion.div>
          )}

          {/* 6. Inspector Magnifying Glass */}
          {activity === 'inspector' && (
             <motion.div 
               className="absolute top-6 left-[50px]"
               animate={{ x: [0, 15, 0], rotate: [0, 20, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
               <div className="w-8 h-8 rounded-full border-4 border-gray-600 bg-[#00c6ff]/20 flex items-center justify-center">
                 {/* Shiny glass glare */}
                 <div className="w-4 h-4 bg-white/40 rounded-full blur-[2px] -mt-2 -ml-2"></div>
               </div>
               <div className="w-1.5 h-6 bg-gray-700 ml-[26px] rotate-45 -mt-2 rounded-b-sm"></div>
             </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
