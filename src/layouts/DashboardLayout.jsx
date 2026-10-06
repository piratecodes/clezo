import { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  // We create the ref here so we can pass it down to TopNav and any pages that need it!
  const loadingBarRef = useRef(null);
  
  // State for mobile sidebar drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-on-primary-fixed via-on-tertiary-fixed to-on-primary-fixed overflow-hidden font-sans text-slate-300 relative">
      
      {/* Global Ambient Glares - STRICTLY using 'primary' sky color as requested */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -40, 0], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/15 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/15 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[160px]" 
        />
      </div>

      {/* 1. The Fixed Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. The Main Column */}
      <div className="flex flex-col flex-1 overflow-hidden w-full max-w-full z-10">
        
        {/* The Top Navigation Bar */}
        <TopNav loadingBarRef={loadingBarRef} setIsSidebarOpen={setIsSidebarOpen} />

        {/* 3. The Scrollable Page Content (The "Outlet") */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar">
           {/* This is where /crm, /cities, etc., will render! */}
          <Outlet context={{ loadingBarRef }} /> 
        </main>
        
      </div>
    </div>
  );
}