import React from 'react';
import { Award, Leaf, ShieldCheck, Trophy } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { 
      icon: Trophy, 
      title: "Best Award 2023", 
      desc: "5 Best Packers in Kolkata" 
    },
    { 
      icon: Award, 
      title: "ISO 9001:2015", 
      desc: "Quality Management Certified" 
    },
    { 
      icon: Leaf, 
      title: "ISO 14001:2015", 
      desc: "Environmental Management" 
    },
    { 
      icon: ShieldCheck, 
      title: "ISO 45001:2018", 
      desc: "Occupational Health & Safety" 
    },
  ];

  return (
    <section className="mb-20 relative z-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center text-center px-2 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-secondary/10 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-secondary" strokeWidth={2} />
                </div>
                <label className="font-black text-primary text-sm md:text-base">{badge.title}</label>
                <p className="text-xs text-gray-500 font-medium mt-1">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}