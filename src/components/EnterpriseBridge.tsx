import React from 'react';
import { KENYAN_PARTNERS } from '../data/studioData';

export const EnterpriseBridge: React.FC = () => {
  return (
    <section className="py-40 bg-white overflow-hidden border-t border-ink/5 relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <span className="architect-label text-brand mb-2 block">
          Elite Alliances
        </span>
        <h3 className="text-xl md:text-2xl font-serif text-ink/80">
          The Enterprise Bridge
        </h3>
        <p className="text-xs text-ink/65 font-light mt-2">
          Collaborating with premier Kenyan corporations and luxury developers to implement large-scale masterpieces.
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden py-4 bg-white">
        {/* Double gradient fades on edges for luxurious vignette depth */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Infinite scrolling block */}
        <div className="flex flex-row whitespace-nowrap animate-marquee items-center min-w-full">
          {/* First loop of items */}
          {[...KENYAN_PARTNERS, ...KENYAN_PARTNERS, ...KENYAN_PARTNERS, ...KENYAN_PARTNERS].map((partner, idx) => (
            <div 
              key={`p1-${idx}`} 
              className="inline-flex flex-col items-center justify-center mx-12 px-8 py-4 bg-white border border-ink/15 shadow-none hover:border-brand/40 rounded-none transition-all duration-300 pointer-events-auto cursor-pointer group"
              style={{
                '--hover-color': partner.originalColor
              } as React.CSSProperties}
            >
              {/* Logo text stylized grayscale until hover */}
              <span 
                className="text-lg md:text-2xl font-serif tracking-widest text-[#1a1a1a] opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                style={{
                  textCombineUpright: 'none'
                }}
              >
                {/* Visual rendering of original colors on hover */}
                <span className="block group-hover:hidden transition-all duration-300 filter grayscale">
                  {partner.logoText}
                </span>
                <span 
                  className="hidden group-hover:block transition-all duration-300"
                  style={{ color: partner.originalColor }}
                >
                  {partner.logoText}
                </span>
              </span>
              <span className="architect-label text-ink/40 group-hover:text-brand mt-1 block">
                Partner Alliance
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
