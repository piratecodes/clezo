"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClezoBotArt from './ClezoBotArt'; // Import the incredibly detailed humanoid SVG

const ACTIVITIES = ['window-washer', 'mopping', 'spritzer', 'vacuuming', 'inspector', 'napping'];

export default function ClezoBot() {
  const [activity, setActivity] = useState('hidden'); // hidden, surprised, or one of ACTIVITIES
  const [facing, setFacing] = useState(1); // 1 = right, -1 = left
  const [positionX, setPositionX] = useState(-150);
  const [doorOpen, setDoorOpen] = useState(false); // Left Portal
  const [rightDoorOpen, setRightDoorOpen] = useState(false); // Right Portal
  const idleTimerRef = useRef(null);
  const firstImpressionDone = useRef(false);

  // Easter Egg Click Handler
  const handleSurprise = () => {
    if (activity === 'surprised' || activity === 'angry' || activity === 'hidden') return;
    
    const reaction = Math.random() > 0.5 ? 'surprised' : 'angry';
    setActivity(reaction);
    
    if (reaction === 'surprised') {
      // Run away in fear!
      setDoorOpen(true);
      setTimeout(() => {
        setFacing(-1); // Turn around
        setPositionX(-150); // Run back behind the door very fast
        setTimeout(() => {
          setDoorOpen(false);
          setTimeout(() => setActivity('hidden'), 500);
        }, 600);
      }, 300);
    } else {
      // Get angry! Shake for 1.5s, then turn around and leave in a huff.
      setTimeout(() => {
        setDoorOpen(true);
        setTimeout(() => {
          setFacing(-1);
          setPositionX(-150);
          setTimeout(() => {
             setDoorOpen(false);
             setTimeout(() => setActivity('hidden'), 500);
          }, 800);
        }, 400);
      }, 1500);
    }
  };

  // Activity Manager
  const triggerRandomActivity = () => {
    if (activity === 'surprised') return;
    const nextActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    setActivity(nextActivity);
    setFacing(1);
    setPositionX(-150); // Start hidden behind the door
    
    // 1. Open the magical door smoothly
    setDoorOpen(true);
    
    // 2. Wait for door to swing fully open, then walk out deliberately
    setTimeout(() => {
      if (nextActivity === 'vacuuming') {
        setPositionX(typeof window !== 'undefined' ? window.innerWidth + 100 : 2000);
      } else {
        setPositionX(100); // Move out just past the door and work smoothly
      }
    }, 600);
    
    // 3. Close the left door behind him once he clears the doorway
    setTimeout(() => {
      setDoorOpen(false);
    }, 1800);
    
    // 4. Return sequence or Right Portal sequence
    if (nextActivity === 'vacuuming') {
      // He sweeps all the way across the screen in 2.5 seconds.
      // Open the right portal for him to exit through!
      setTimeout(() => setRightDoorOpen(true), 1500); 
      
      // Close the right portal once he's inside and finish the sequence
      setTimeout(() => {
         setRightDoorOpen(false);
         setTimeout(() => {
           setActivity('hidden');
           // Reset for next time (he'll spawn on the left again automatically next time)
           setPositionX(-150);
           if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
           idleTimerRef.current = setTimeout(triggerRandomActivity, 5000);
         }, 800);
      }, 3000); 
    } else {
      // Normal return sequence (turn around and go back in the left portal)
      setTimeout(() => {
        if (activity !== 'surprised' && activity !== 'angry') {
          setFacing(-1); // Turn around
          setDoorOpen(true); // Open left door for re-entry
          
          setTimeout(() => {
            setPositionX(-150); // Walk back inside
            setTimeout(() => {
               setDoorOpen(false); 
               setTimeout(() => {
                 setActivity('hidden');
                 if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
                 idleTimerRef.current = setTimeout(triggerRandomActivity, 5000);
               }, 800);
            }, 1200);
          }, 600);
        }
      }, 8000);
    }
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
    <div className="fixed bottom-0 left-0 w-full h-[180px] z-[100] pointer-events-none hidden md:block overflow-visible">
      
      {/* LEFT Magical Straight Aura */}
      <motion.div 
        className="absolute bottom-4 left-[-10px] w-[30px] h-[140px] z-30 flex justify-center items-center"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: doorOpen ? 1 : 0, scaleX: doorOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute w-[8px] h-full bg-white blur-[2px] rounded-full"></div>
        <div className="absolute w-[40px] h-full bg-[#00c6ff] blur-[15px] rounded-full animate-pulse"></div>
        <div className="absolute w-[60px] h-full bg-primary blur-[25px] rounded-full opacity-60"></div>
      </motion.div>

      {/* RIGHT Magical Straight Aura (For when he vacuums across the screen) */}
      <motion.div 
        className="absolute bottom-4 right-[-10px] w-[30px] h-[140px] z-30 flex justify-center items-center"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: rightDoorOpen ? 1 : 0, scaleX: rightDoorOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute w-[8px] h-full bg-white blur-[2px] rounded-full"></div>
        <div className="absolute w-[40px] h-full bg-[#00c6ff] blur-[15px] rounded-full animate-pulse"></div>
        <div className="absolute w-[60px] h-full bg-primary blur-[25px] rounded-full opacity-60"></div>
      </motion.div>

      {/* Bot Container with Materialization Mask on BOTH sides */}
      {/* Fades out on the left (0-60px) AND fades out on the right (calc(100%-60px) to 100%) */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, transparent 0px, transparent 15px, black 60px, black calc(100% - 60px), transparent calc(100% - 15px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0px, transparent 15px, black 60px, black calc(100% - 60px), transparent calc(100% - 15px), transparent 100%)'
        }}
      >
        <motion.div
          className="absolute bottom-4 pointer-events-auto cursor-pointer"
        animate={{ x: positionX, scaleX: facing }}
        transition={{ 
          x: activity === 'vacuuming' ? { duration: 2.5, ease: "linear" } : { type: "tween", ease: "easeOut", duration: 0.8 },
          scaleX: { duration: 0.2 }
        }}
        onClick={handleSurprise}
      >
        <div className="relative pb-2">
          {/* Main Bot SVG (Provided by Claude) */}
          <motion.div
            animate={{
              y: activity === 'surprised' ? -40 : activity === 'angry' ? [0, -10, 0, -10, 0] : 0,
              x: activity === 'angry' ? [-5, 5, -5, 5, 0] : 0,
              rotate: activity === 'surprised' ? 15 : activity === 'angry' ? [-10, 10, -10, 10, 0] : 0,
              scale: activity === 'surprised' ? 1.2 : activity === 'angry' ? 1.1 : 1,
              filter: activity === 'angry' ? 'hue-rotate(140deg) saturate(3)' : 'none'
            }}
            transition={{ 
              type: "tween",
              ease: activity === 'surprised' ? "backOut" : "easeInOut",
              duration: activity === 'angry' ? 0.3 : 0.6,
              repeat: activity === 'angry' ? Infinity : 0
            }}
            className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)]"
          >
            <ClezoBotArt activity={activity} size={110} />
          </motion.div>
        </div>
      </motion.div>
    </div>
    </div>
  );
}
