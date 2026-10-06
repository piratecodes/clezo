"use client";

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronRight } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ServiceProducts({ products = [] }) {
  const [hoveredTag, setHoveredTag] = useState(null);

  if (!products || products.length === 0) return null;

  // 1. Group products by productTag
  const groupedProducts = products.reduce((acc, product) => {
    const tag = product.productTag || 'General';
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(product);
    return acc;
  }, {});

  const tags = Object.keys(groupedProducts);

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm tracking-wide uppercase shadow-[0_0_15px_rgba(0,174,230,0.15)]"
          >
            <Sparkles size={16} />
            Our Catalog
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight"
          >
            Explore <span className="text-primary italic drop-shadow-sm">Products</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl"
          >
            Premium care tailored exactly to your wardrobe. Browse our specialized offerings below.
          </motion.p>
        </div>

        {/* The Tabs UI */}
        <Tab.Group>
          {/* Scrollable Tab List for smaller screens */}
          <div className="overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar flex justify-center">
            <Tab.List 
              className="flex space-x-2 rounded-full bg-slate-200/50 p-1.5 backdrop-blur-md shadow-inner border border-white/50 w-max"
              onMouseLeave={() => setHoveredTag(null)}
            >
              {tags.map((tag) => (
                <Tab
                  key={tag}
                  onMouseEnter={() => setHoveredTag(tag)}
                  className={({ selected }) => {
                    const isHovered = hoveredTag === tag;
                    return classNames(
                      'relative w-full min-w-[120px] rounded-full py-3 px-6 text-sm md:text-base font-bold leading-5 transition-colors duration-300 outline-none z-10',
                      selected ? 'text-white' : (isHovered ? 'text-slate-800' : 'text-slate-600')
                    )
                  }}
                >
                  {({ selected }) => {
                    const isHoverPillActive = hoveredTag === tag || (!hoveredTag && selected);
                    return (
                    <>
                      <span className="relative z-20">{tag}</span>
                      
                      {/* 1. The Active Body (Stays on selected) */}
                      {selected && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-primary rounded-full z-10 shadow-[0_10px_20px_rgba(0,174,230,0.3)] border border-primary/50"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      {/* 2. The Hover Soul (Detaches on hover) */}
                      {isHoverPillActive && (
                        <motion.div
                          layoutId="hover-pill"
                          className="absolute inset-0 bg-white/15 rounded-full z-0 shadow-sm"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </>
                  )}}
                </Tab>
              ))}
            </Tab.List>
          </div>

          <Tab.Panels className="mt-4">
            <AnimatePresence mode="wait">
              {tags.map((tag, idx) => (
                <Tab.Panel
                  key={idx}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="outline-none"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {groupedProducts[tag].map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </Tab.Panel>
              ))}
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.02 }}
      className="group relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-[0_10px_30px_rgba(0,174,230,0.1)] rounded-2xl p-5 flex flex-col justify-center overflow-hidden transition-all duration-300"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
          {product.categoryName}
        </h3>
        
        {product.description && (
          <p className="mt-2 text-slate-500 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
