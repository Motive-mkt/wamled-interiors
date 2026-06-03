import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { CLIENT_REVIEWS } from '../data/studioData';
import { useCMS } from './CMSContext';

export const ClientReviewsSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { content } = useCMS();

  // Load reviews from CMS dynamically, with safe local fallback
  const reviews = content?.reviews && content.reviews.length > 0 
    ? content.reviews 
    : CLIENT_REVIEWS;

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-40 bg-white text-ink relative overflow-hidden border-t border-ink/5">
      {/* Absolute oversized background quote symbol */}
      <div className="absolute right-12 top-6 text-brand/5 select-none pointer-events-none text-[320px] font-serif leading-none">
        ”
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="architect-label text-brand mb-4 block">
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
              className="w-full grid md:grid-cols-12 gap-8 items-center bg-white border border-ink/15 p-8 md:p-12 lg:p-16 rounded-none shadow-none"
            >
              {/* Giant floating quotation mark for parallax feel */}
              <div className="md:col-span-1 hidden md:block text-brand text-7xl font-serif leading-none select-none opacity-40">
                “
              </div>

              {/* Review Copy */}
              <div className="md:col-span-10 space-y-6">
                <div className="flex gap-1 animate-fade-in">
                  {[...Array(reviews[currentIndex]?.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="text-brand fill-brand" />
                  ))}
                </div>

                <p className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-ink leading-relaxed italic">
                  "{reviews[currentIndex]?.text}"
                </p>

                <div className="pt-6 border-t border-ink/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-ink uppercase tracking-wider font-sans">
                      {reviews[currentIndex]?.author}
                    </h4>
                    <p className="architect-meta text-brand mt-1 block">
                      {(reviews[currentIndex] as any).title || (reviews[currentIndex] as any).location || (reviews[currentIndex] as any).role || 'Connoisseur'}
                    </p>
                  </div>
                  <span className="architect-meta text-ink/40">
                    0{currentIndex + 1} / 0{reviews.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tiny Kinetic Progress Dash */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
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
