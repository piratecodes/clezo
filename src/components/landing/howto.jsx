"use client";

import React from 'react';
import { PackageOpen, Clock, Users, IndianRupee, FileCheck2, ShieldCheck } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      title: "Safe Packing",
      description: "High-quality packing materials ensure safe shifting services in Kolkata with maximum protection for your belongings.",
      icon: <PackageOpen size={24} />
    },
    {
      title: "On-Time Delivery",
      description: "Reliable packers and movers in Kolkata ensure timely pickup, fast transit, and secure delivery.",
      icon: <Clock size={24} />
    },
    {
      title: "Skilled Moving Team",
      description: "Experienced professionals handling packing, loading, and relocation services with care and efficiency.",
      icon: <Users size={24} />
    },
    {
      title: "Affordable Pricing",
      description: "Transparent and competitive pricing from the best packers and movers in Kolkata.",
      icon: <IndianRupee size={24} />
    },
    {
      title: "No Hidden Charges",
      description: "Clear quotations with zero hidden costs for home shifting and relocation services.",
      icon: <FileCheck2 size={24} />
    },
    {
      title: "Damage Claim Support",
      description: "Transit insurance support with quick claim assistance for safe moving services.",
      icon: <ShieldCheck size={24} />
    }
  ];

  return (
    /* CLEAN WRAPPER: Transparent/White background, strict Domestic logic */
    <section className="relative w-full py-16 overflow-hidden border-b border-gray-100">
      
      {/* 1. CONTENT CONTAINER: Following the 'no-mx-auto' and 'px-4' standard */}
      <div className="container px-4 relative z-10">
        
        {/* Authoritative Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-20 md:mb-28">
          <div className="grow space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 text-secondary rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
               The Clezo Standard
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-[1.1] tracking-tighter">
              Why Choose <br className="hidden md:block" />
              <span className="text-secondary italic">Clezo Express Laundry</span>
            </h2>
          </div>
          
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl md:border-l-4 md:border-gray-100 md:pl-10">
            Trusted by thousands, Clezo Express Laundry delivers safe, reliable, and affordable relocation services across Kolkata and India.
          </p>
        </div>

        {/* Tactical Feature Grid: Architectural Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative flex gap-6 items-start p-8 rounded-[2.5rem] bg-white border border-gray-50 hover:bg-slate-50/50 hover:border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
              
              {/* Dynamic Icon Structure */}
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-secondary flex items-center justify-center shrink-0 border border-gray-200 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-sm">
                {feature.icon}
              </div>
              
              <div className="space-y-3">
                {/* Numbering Detail (Blueprint Style) */}
                <span className="text-[10px] font-black text-secondary group-hover:text-primary transition-colors">0{index + 1} //</span>
                
                <h3 className="text-2xl font-black text-primary leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px]">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Accent on Hover */}
              <div className="absolute top-8 right-8 w-1 h-1 rounded-full bg-secondary scale-0 group-hover:scale-100 transition-transform"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}