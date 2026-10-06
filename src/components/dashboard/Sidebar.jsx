import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { fetchClient } from '@/api/fetchClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { LayoutDashboard, Users, MapPin, FileText, PackageSearch, Image as ImageIcon, Settings, ShieldAlert, Truck, BookOpen, X, Command, MessageSquare, Activity } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { user: admin } = useAuth();

  // Default to the lowest permission level while loading to be safe
  const role = admin?.role || 'SALES_AGENT';

  // 🛡️ ROLE-BASED ACCESS CONTROL FOR THE MENU
  const navItems = [
    // { name: 'Dashboard', path: '/', icon: LayoutDashboard, allowed: ['SUPER_ADMIN', 'ADMIN', 'SALES_AGENT'] },
    { name: 'Command Center', path: '/', icon: Activity, allowed: ['SUPER_ADMIN', 'ADMIN', 'SALES_AGENT'] },
    // { name: 'CRM (Leads)', path: '/crm-panel', icon: Users, allowed: ['SUPER_ADMIN', 'ADMIN', 'SALES_AGENT'] },
    { name: 'Fleet & Services', path: '/services', icon: PackageSearch, allowed: ['SUPER_ADMIN', 'ADMIN', 'SALES_AGENT'] },
    { name: 'Service Areas', path: '/network', icon: MapPin, allowed: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'SEO Pages', path: '/seo-pages', icon: FileText, allowed: ['SUPER_ADMIN', 'ADMIN'] }, 
    { name: 'Blogs', path: '/blogs', icon: BookOpen, allowed: ['SUPER_ADMIN', 'ADMIN'] }, 
    { name: 'Media Gallery', path: '/gallery', icon: ImageIcon, allowed: ['SUPER_ADMIN', 'ADMIN', 'SALES_AGENT'] },
    { name: 'Support Center', path: '/support-center', icon: MessageSquare, allowed: ['SUPER_ADMIN', 'ADMIN', 'SALES_AGENT'] },
    { name: 'Company Settings', path: '/settings', icon: Settings, allowed: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Staff & Team', path: '/team', icon: ShieldAlert, allowed: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  // Filter out any pages the current user is not allowed to see
  const visibleNavItems = navItems.filter(item => item.allowed.includes(role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-on-primary-fixed/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-64 bg-on-primary-fixed/95 backdrop-blur-2xl border-r border-white/5 text-slate-300 flex flex-col h-full shadow-[20px_0_40px_rgba(0,0,0,0.2)] z-50 md:z-20`}
      >
        {/* Ambient Sidebar Glare */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none opacity-50"></div>

        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0 relative z-10">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(0,174,230,0.5)] group-hover:shadow-[0_0_25px_rgba(0,174,230,0.8)] transition-all duration-300 group-hover:scale-110">
              <Command className="text-white" size={16} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight uppercase">Clezo <span className="text-primary">OS</span></span>
          </div>
          <button 
            className="md:hidden p-1.5 rounded-md bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none" 
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Main Menu</p>
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-medium relative overflow-hidden ${
                isActive 
                  ? 'bg-primary/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-primary/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent' 
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Glow */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(0,174,230,0.8)]"></div>
                )}
                <div className={`transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'text-primary' : ''}`}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="transition-transform duration-300 group-hover:translate-x-1">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 🌟 UPGRADED Footer Area */}
      <div className="p-5 border-t border-white/5 bg-black/40 shrink-0 relative z-10">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <p className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Clezo. <br /> All rights reserved.
          </p>
          <div className="w-8 h-[1px] bg-white/10 my-1"></div>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black">
            Developed By
          </p>
          <a 
            href="https://subham.digital" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors"
          >
            Subham.digital
          </a>
          <a 
            href="https://straxcel.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors"
          >
            Straxcel Business Solutions
          </a>
        </div>
      </div>
      </aside>
    </>
  );
}