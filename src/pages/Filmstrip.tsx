import React, { useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { STUDIO_SERVICES } from '../data/studioData';

export const Filmstrip: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const initialServiceId = searchParams.get('service');
  const initialCategory = searchParams.get('category');

  useEffect(() => {
    // If the user came with a specific service request, scroll it into view immediately!
    if (initialServiceId && scrollContainerRef.current) {
      const element = document.getElementById(`film-${initialServiceId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 300);
      }
    } else if (initialCategory && scrollContainerRef.current) {
      // Find a service matching the bento category and focus it
      const categoryMap: Record<string, string> = {
        'Residential': 'residential-atelier',
        'Exterior': 'yacht-exterior-styling',
        'Commercial': 'commercial-hospitality',
        'Landscaping': 'botanical-landscape'
      };
      const matchingId = categoryMap[initialCategory];
      const element = document.getElementById(`film-${matchingId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 300);
      }
    }
  }, [initialServiceId, initialCategory]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-ink py-24 select-none relative flex flex-col justify-between overflow-hidden">
      {/* Editorial Watermark background */}
      <div className="absolute inset-0 bg-cream/10 bg-[radial-gradient(ellipse_at_top,rgba(168,63,27,0.025),transparent_75%)] pointer-events-none" />

      {/* Header and Back Button */}
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between z-10">
        <Link 
          to="/"
          className="group inline-flex items-center gap-3 text-ink/65 hover:text-brand text-xs font-mono tracking-widest uppercase transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Return to Studio
        </Link>
        <div className="text-right">
          <span className="text-brand font-mono tracking-[0.4em] text-[10px] uppercase block font-semibold">
            GALLERY DISCOVERY
          </span>
          <span className="text-[11px] text-ink/40 uppercase tracking-widest">
            9:16 Portrait Filmstrip experience
          </span>
        </div>
      </div>

      {/* Main Filmstrip Carousel Section */}
      <div className="relative my-auto py-8">
        
        {/* Navigation arrows for desktop drag prevention feedback */}
        <button 
          onClick={scrollLeft}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-ink/10 hover:border-brand hover:text-brand flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-auto shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>

        <button 
          onClick={scrollRight}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-ink/10 hover:border-brand hover:text-brand flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-auto shadow-sm"
        >
          <ArrowRight size={24} />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none gap-8 md:gap-12 px-[10vw] md:px-[25vw] py-4 items-center"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {STUDIO_SERVICES.map((service, index) => (
            <div
              key={service.id}
              id={`film-${service.id}`}
              className="snap-center shrink-0 w-[78vw] sm:w-[48vw] md:w-[32vw] lg:w-[24vw] aspect-[9/16] relative rounded-3xl overflow-hidden border border-ink/10 hover:border-brand/45 transition-all duration-500 group shadow-lg bg-white"
            >
              {/* Vertical Image */}
              <img 
                src={service.filmstripImage} 
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Dark overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/35 transition-all duration-500 opacity-70 group-hover:opacity-80" />

              {/* Hover highlight line border */}
              <div className="absolute inset-4 border border-white/5 group-hover:border-brand/35 transition-all duration-500 rounded-2xl pointer-events-none" />

              {/* Interactive rotated Title & Indicator */}
              <div className="absolute top-10 left-6 right-6 flex justify-between items-start">
                <span className="font-mono text-xs text-brand font-semibold">0{index + 1} // 04</span>
                
                {/* Rotating title effect */}
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFF] hover:text-brand block">
                    SWIPE TO NAVIGATION
                  </span>
                </div>
              </div>

              {/* Center rotating title vertically to horizontally */}
              <div className="absolute inset-x-6 top-[35%] flex items-center justify-center pointer-events-none">
                <div className="text-center group-hover:rotate-[3deg] transition-transform duration-700">
                  <span className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide block drop-shadow-md">
                    {service.title.split(' ')[0]}
                  </span>
                  <span className="text-sm uppercase tracking-[0.3em] font-mono text-brand/90 block mt-2 font-semibold">
                    {service.subtitle.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Bottom information and Zoom Micro "+" CTA */}
              <div className="absolute bottom-10 left-6 right-6 space-y-4">
                <p className="text-xs text-gray-200 font-light leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-[10px] font-mono tracking-wider text-gray-300 uppercase">
                    SWIFT ENTRANCE
                  </span>
                  
                  {/* Glowing '+' circle that transitions user */}
                  <button
                    onClick={() => navigate(`/services/${service.id}`)}
                    className="w-12 h-12 rounded-full bg-brand text-white hover:bg-[#1a1a1a] flex items-center justify-center transition-all duration-300 shadow-xl border border-white/10 hover:scale-110 active:scale-95 group-hover:animate-pulse pointer-events-auto"
                    title="Deep Dive Service Details"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Footer */}
      <div className="max-w-7xl mx-auto px-6 w-full text-center text-ink/40 text-[11px] uppercase tracking-[0.25em] z-10 mt-6 select-none flex flex-col md:flex-row items-center justify-between gap-4">
        <span>◀ SWIPE / ROTATE DRAG MOUSE TO BROWSE COLLECTION ▶</span>
        <div className="flex gap-4">
          <span className="text-ink/15">WAMLED GALLERY 2026</span>
        </div>
      </div>
    </div>
  );
};
export default Filmstrip;
