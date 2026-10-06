"use client";

import React, { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Transition, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDown, MapPin, Menu, X, Shirt, User, Baby, Laptop } from 'lucide-react';
import { usePathname } from 'next/navigation';

import icon from '@/assets/icon.png';

export default function Nav() {
  const [services, setServices] = useState([]);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState('');
  
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  
  const servicesMenuRef = useRef(null);

  const getActivePath = (p) => {
    if (p.startsWith('/blogs')) return '/blogs';
    if (p.startsWith('/photo-gallery')) return '/photo-gallery';
    if (p === '/' || p === '/about' || p === '/contact') return p;
    return '/services';
  };

  useEffect(() => {
    if (isDesktopMenuOpen) {
      setHoveredPath('/services');
    } else {
      setHoveredPath(getActivePath(pathname));
    }
  }, [pathname, isDesktopMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const fetchServices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) setServices(data.data);
        else if (Array.isArray(data)) setServices(data);
      } catch (err) {
        console.error("Nav Services Fetch Error:", err);
      }
    };
    fetchServices();

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${(!isLandingPage || isScrolled) ? 'bg-white/30 backdrop-blur-xl py-3 border-b border-white/40 shadow-sm' : 'bg-transparent py-4'}`} role="navigation" aria-label="Primary Navigation">
      <div className="container flex items-center justify-between px-4 relative">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-3 shrink-0">
          <Image 
            src={icon} 
            alt="Clezo Logo" 
            className="h-8 w-auto object-contain filter brightness-200" 
            draggable={false} 
            priority
          />
          <span className="self-center text-xl text-on-surface font-black whitespace-nowrap tracking-tight uppercase">Clezo</span>
        </Link>

        {/* --- DESKTOP ISLAND NAVIGATION --- */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <ul 
            className="flex items-center p-1.5 bg-white border border-gray-100/50 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            onMouseLeave={() => {
              if (!isDesktopMenuOpen) {
                setHoveredPath(getActivePath(pathname));
              }
            }}
          >
            {/* HOME */}
            <li className="relative z-10">
              <Link 
                href="/" 
                onMouseEnter={() => setHoveredPath('/')}
                className={`relative block px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${hoveredPath === '/' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="relative z-10">Home</span>
                {hoveredPath === '/' && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </Link>
            </li>

            {/* ABOUT */}
            <li className="relative z-10">
              <Link 
                href="/about" 
                onMouseEnter={() => setHoveredPath('/about')}
                className={`relative block px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${hoveredPath === '/about' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="relative z-10">About</span>
                {hoveredPath === '/about' && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </Link>
            </li>

            {/* SERVICES MEGA MENU (DESKTOP) */}
            <li className="relative z-10" ref={servicesMenuRef}>
              <button 
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                onMouseEnter={() => setHoveredPath('/services')}
                className={`relative flex items-center gap-1.5 px-6 py-2 rounded-full text-sm font-bold outline-none transition-colors duration-300 ${(hoveredPath === '/services' || isDesktopMenuOpen) ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Services <ChevronDown size={14} className={`transition-transform duration-300 ${isDesktopMenuOpen ? 'rotate-180' : ''}`} />
                </span>
                {(hoveredPath === '/services' || isDesktopMenuOpen) && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </button>

              {/* Dropdown Panel */}
              <Transition
                show={isDesktopMenuOpen}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-4 w-64 px-4 sm:px-0">
                  <div className="overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white border border-slate-100 py-2">
                    {services.length > 0 ? (
                      services.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/${item.slug}`}
                          onClick={() => setIsDesktopMenuOpen(false)}
                          className="block px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-sm text-slate-500 font-medium">Loading services...</div>
                    )}
                  </div>
                </div>
              </Transition>
            </li>

            {/* BLOGS */}
            <li className="relative z-10">
              <Link 
                href="/blogs" 
                onMouseEnter={() => setHoveredPath('/blogs')}
                className={`relative block px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${hoveredPath === '/blogs' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="relative z-10">Blogs</span>
                {hoveredPath === '/blogs' && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </Link>
            </li>

            {/* GALLERY */}
            <li className="relative z-10">
              <Link 
                href="/photo-gallery" 
                onMouseEnter={() => setHoveredPath('/photo-gallery')}
                className={`relative block px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${hoveredPath === '/photo-gallery' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="relative z-10">Gallery</span>
                {hoveredPath === '/photo-gallery' && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </Link>
            </li>
          </ul>
        </div>

        {/* --- ACTIONS & MOBILE --- */}
        <div className="flex items-center space-x-3">
          <Link href="/contact" className="hidden sm:block text-on-surface bg-white hover:bg-primary hover:text-white border border-outline-variant rounded-full font-bold text-sm px-6 py-2 transition-all shadow-sm">Contact Us</Link>
          
          <Disclosure as="div" className="md:hidden">
            {({ open, close }) => (
              <>
                <DisclosureButton className="p-2 text-white outline-none">
                  {open ? <X size={28} /> : <Menu size={28} />}
                </DisclosureButton>

                <Transition
                  as={Fragment}
                  enter="transition duration-150 ease-out"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition duration-100 ease-in"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <DisclosurePanel className="fixed top-full left-0 w-full bg-[#00080e]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-110 h-[calc(100vh-72px)] overflow-y-auto pb-20">
                    <div className="p-6 space-y-2">
                      
                      <Link href="/about" onClick={() => close()} className="block text-xl font-bold text-white border-b border-white/10 pb-3">About</Link>
                      
                      <Disclosure as="div" className="py-4 border-b border-white/10">
                        {({ open: serviceOpen }) => (
                          <>
                            <DisclosureButton className="flex items-center justify-between w-full font-bold text-white text-lg py-1">
                              <span>Services</span>
                              <ChevronDown size={16} className={`transition-transform ${serviceOpen ? 'rotate-180' : ''}`} />
                            </DisclosureButton>
                            
                            <DisclosurePanel className="mt-4 ml-2 space-y-3 border-l-2 border-white/10 pl-4 py-2">
                              {services.length > 0 ? (
                                services.map(s => (
                                  <Link 
                                    key={s.slug} 
                                    href={`/${s.slug}`}
                                    onClick={() => close()}
                                    className="block text-base font-semibold text-gray-400 hover:text-white"
                                  >
                                    {s.name}
                                  </Link>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">Loading services...</p>
                              )}
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                      
                      <Link href="/blogs" onClick={() => close()} className="block text-xl font-bold text-white py-4 border-y border-white/10">Blog</Link>
                      <Link href="/photo-gallery" onClick={() => close()} className="block text-xl font-bold text-white pb-4 border-b border-white/10">Gallery</Link>
                      <Link href="/contact" onClick={() => close()} className="w-full block bg-primary text-white text-center font-bold py-4 rounded-full mt-auto text-lg">Contact</Link>
                    </div>
                  </DisclosurePanel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>

      </div>
    </nav>
  );
}