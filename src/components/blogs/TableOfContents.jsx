"use client";
import React, { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Select all H2 and H3 tags inside the article content
    const elements = Array.from(document.querySelectorAll('.blog-content h2, .blog-content h3'));
    
    // Assign IDs if they don't have one and extract text
    const parsedHeadings = elements.map((elem, idx) => {
      if (!elem.id) {
        elem.id = elem.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `heading-${idx}`;
      }
      return {
        id: elem.id,
        text: elem.innerText,
        level: Number(elem.tagName.charAt(1)) // 2 or 3
      };
    });

    setHeadings(parsedHeadings);

    // Setup Intersection Observer to highlight active TOC link
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700 pointer-events-none -z-10" />
      <h3 className="text-lg font-black text-on-surface mb-5 tracking-tight uppercase">Table of Contents</h3>
      <aside className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`block text-sm py-1.5 transition-colors ${
              heading.level === 3 ? 'ml-4' : 'font-bold'
            } ${
              activeId === heading.id 
                ? 'text-primary' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </aside>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  );
}
