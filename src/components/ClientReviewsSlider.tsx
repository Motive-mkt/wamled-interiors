import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { CLIENT_REVIEWS } from '../data/studioData';

export const ClientReviewsSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? CLIENT_REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === CLIENT_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-28 bg-cream/40 text-ink relative overflow-hidden border-t border-ink/5">
      {/* Absolute oversized background quote symbol */}
      <div className="absolute right-12 top-6 text-brand/5 select-none pointer-events-none text-[320px] font-serif leading-none">
        ”
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-brand font-mono tracking-[0.4em] text-[10px] uppercase mb-4 block">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
              Quiet Luxury,<br/>
              <span className="italic text-ink/65">Validated by Discerning Owners.</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={prevReview}
              className="w-12 h-12 rounded-full border border-ink/10 hover:border-brand text-ink/40 hover:text-brand bg-white flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextReview}
              className="w-12 h-12 rounded-full border border-ink/10 hover:border-brand text-ink/40 hover:text-brand bg-white flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative min-h-[380px] md:min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full grid md:grid-cols-12 gap-8 items-center bg-white border border-ink/5 p-8 md:p-12 lg:p-16 rounded-3xl shadow-sm"
            >
              {/* Giant floating quotation mark for parallax feel */}
              <div className="md:col-span-1 hidden md:block text-brand text-7xl font-serif leading-none select-none opacity-40">
                “
              </div>

              {/* Review Copy */}
              <div className="md:col-span-10 space-y-6">
                <div className="flex gap-1">
                  {[...Array(CLIENT_REVIEWS[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-brand fill-brand" />
                  ))}
                </div>

                <p className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-ink leading-relaxed italic">
                  "{CLIENT_REVIEWS[currentIndex].text}"
                </p>

                <div className="pt-6 border-t border-ink/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-ink uppercase tracking-wider font-sans">
                      {CLIENT_REVIEWS[currentIndex].author}
                    </h4>
                    <p className="text-xs text-brand font-mono tracking-widest mt-1 uppercase">
                      {CLIENT_REVIEWS[currentIndex].title}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-ink/40 uppercase tracking-[0.2em]">
                    0{currentIndex + 1} / 0{CLIENT_REVIEWS.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tiny Kinetic Progress Dash */}
        <div className="flex justify-center gap-2 mt-8">
          {CLIENT_REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-brand' : 'w-2 bg-ink/15'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
