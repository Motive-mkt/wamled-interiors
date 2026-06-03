import React from 'react';
import { motion } from 'motion/react';

const VALUES = [
  { keyword: "CRAFTSMANSHIP", concept: "The uncompromising pursuit of raw material perfection." },
  { keyword: "PRECISION", concept: "Microscopic execution, where every joint is mathematically flawless." },
  { keyword: "MONOLITHIC FORM", concept: "Bold, unfragmented spatial geometries that establish quiet authority." },
  { keyword: "LOCAL INTELLIGENCE", concept: "Materials engineered directly against coastal sand, heat, and maritime air." },
  { keyword: "HERITAGE COHERENCE", concept: "Designs inspired by elite Swahili symmetries and global minimalist gallery norms." }
];

export const BrandValues: React.FC = () => {
  return (
    <section className="py-40 bg-white text-ink overflow-hidden border-t border-ink/5 relative">
      {/* Subtle metallic radial background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.015),transparent_65%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="architect-label text-brand mb-16 block">Brand Values & Identity</span>
        
        <h2 className="text-sm md:text-md uppercase tracking-wider font-sans text-ink/65 mb-20 max-w-lg mx-auto">
          We dismiss generic design templates. We create architectural answers suited for the highest standards.
        </h2>

        <div className="space-y-16">
          {VALUES.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.1, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="py-6 border-b border-ink/5 group"
            >
              <div className="flex flex-col md:flex-row items-center justify-between text-left gap-4 md:gap-12">
                <span className="architect-label text-brand opacity-60">0{idx + 1} //</span>
                
                <h3 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-ink group-hover:text-brand transition-colors duration-500">
                  {val.keyword}
                </h3>
                
                <p className="text-xs font-sans text-ink/70 max-w-sm mt-2 md:mt-0 tracking-wide leading-relaxed font-light">
                  {val.concept}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
