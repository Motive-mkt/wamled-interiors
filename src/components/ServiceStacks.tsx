import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Compass, 
  Cpu, 
  Layers, 
  Plus,
  ArrowRight 
} from 'lucide-react';

interface SlideItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  offerings: string[];
  ctaText: string;
  destination: string;
}

const THREE_SLIDES: SlideItem[] = [
  {
    id: "architectural",
    index: "01",
    title: "Architectural & Interior Design",
    subtitle: "PILLAR A",
    description: "Creating comprehensive visual codes, trade-wind cross-ventilation maps, and dynamic physical choreography within seaside residences.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=95&w=1000&h=1600",
    icon: Compass,
    offerings: [
      "Circulation Design",
      "Functional Design",
      "Style Design",
      "Furniture, Fixtures & Equipment (FF&E)"
    ],
    ctaText: "Explore the Process",
    destination: "/bespoke-services"
  },
  {
    id: "specialty",
    index: "02",
    title: "Specialty Design & Systems",
    subtitle: "PILLAR B",
    description: "Automated climate structures, advanced MEP installations, and secure smart automation engineered to survive active marine environments.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=95&w=1000&h=1600",
    icon: Cpu,
    offerings: [
      "MEP Solutions",
      "Swimming Pools",
      "ELV & IT Systems",
      "Lighting Systems",
      "Kitchen & Laundry"
    ],
    ctaText: "View Case Studies",
    destination: "/bespoke-services"
  },
  {
    id: "product",
    index: "03",
    title: "Product & Application Design",
    subtitle: "PILLAR C",
    description: "Multi-track sliding profiles, double-glazed acoustic structural curtain systems, and bespoke architectural canopy and framing.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=95&w=1000&h=1600",
    icon: Layers,
    offerings: [
      "Curtain Walls & Facades",
      "Steel Structures",
      "Balustrades & Staircases",
      "Canopies & Partitions"
    ],
    ctaText: "Explore Structures",
    destination: "/bespoke-services"
  }
];

export const ServiceStacks: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F9F9F7] text-ink border-t border-ink/5 overflow-visible">
      {/* Editorial Section Header: Stationary above the scroll cards */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 relative z-10" id="service-header-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-ink/10" id="service-section-header">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-3">
              <span className="text-[#C5A059] font-sans text-[13px] uppercase tracking-[0.15em] font-bold">WAMLED SPECTRUM // MASTER SERVICES</span>
              <span className="h-px bg-[#C5A059]/35 w-12" />
              <span className="text-ink/40 text-[11px] font-sans tracking-widest uppercase font-semibold">03 / MASTER STACKS</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#1A1A1A] tracking-tight mt-2 leading-tight">
              The Three Pillars of<br />
              <span className="italic text-[#C5A059]">Spatial Architecture.</span>
            </h2>
          </div>
          
          <div className="text-left font-sans text-xs md:text-sm text-ink/65 max-w-sm leading-relaxed font-light">
            <p>
              We compile our bespoke Nairobi and Mombasa designs, structural fabrications, and precision setups into three master-level disciplines.
            </p>
          </div>
        </div>
      </div>

      {/* GSAP-Style Sticky Card Deck Stack Container */}
      <div className="relative w-full flex flex-col items-center select-none" id="service-sticky-container">
        {THREE_SLIDES.map((slide, index) => {
          const IconComponent = slide.icon;
          return (
            <div 
              key={slide.id}
              className="sticky top-0 h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8"
              style={{
                zIndex: index + 10,
              }}
              id={`slide-wrapper-${slide.id}`}
            >
              {/* Luxury Card Box constrained to 9:16 Aspect Ratio and 100% Bright Crisp Image Background */}
              <motion.div 
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[430px] h-[75vh] md:h-[82vh] max-h-[720px] aspect-[9/16] rounded-[36px] overflow-hidden bg-white border border-ink/10 shadow-2xl transition-all duration-500"
                id={`service-card-${slide.id}`}
              >
                {/* 100% Bright, Crisp, and Unfiltered Project Image */}
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* --- TOP FLOATING PANEL (Absolute text layer over image, no background container) --- */}
                <div 
                  className="absolute top-6 left-6 right-6 z-20 text-left pointer-events-none"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.65)'
                  }}
                  id={`top-card-panel-${slide.id}`}
                >
                  <div className="flex justify-between items-center gap-3 mb-2">
                    {/* Subtitle / Index: Helvetica Neue 13px, Uppercase, Tracking 0.15em */}
                    <span className="text-[13px] font-sans font-semibold uppercase tracking-[0.15em] text-white leading-snug drop-shadow-sm">
                      {slide.index} // {slide.subtitle}
                    </span>
                    <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-md flex-shrink-0 shadow-md">
                      <IconComponent size={15} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Category Title: Massive elegant Serif font */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-white leading-tight">
                    {slide.title}
                  </h3>
                </div>

                {/* --- BOTTOM FLOATING PANEL (Absolute transparent text layer over image) --- */}
                <div 
                  className="absolute bottom-6 left-6 right-6 z-20 text-left pointer-events-none"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.65)'
                  }}
                  id={`bottom-card-panel-${slide.id}`}
                >
                  {/* Brief Strategic Description */}
                  <p className="text-[12px] font-sans font-light leading-relaxed text-white/95 mb-4">
                    {slide.description}
                  </p>

                  {/* Sub-Services Listing Area */}
                  <div className="border-t border-white/25 pt-3">
                    <span className="text-[9px] font-sans uppercase tracking-[0.15em] text-white/60 font-bold block mb-2.5">
                      PRECISION COMPOSITION
                    </span>
                    
                    {/* Sub-Services blueprint font: 13px, Uppercase, 0.15em letter spacing */}
                    <div className="space-y-2">
                      {slide.offerings.map((subService, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between group/sub transition-all duration-300 pointer-events-auto cursor-pointer"
                        >
                          <span className="text-[13px] font-sans uppercase tracking-[0.15em] text-white font-medium transition-colors hover:text-[#C5A059]">
                            {subService}
                          </span>
                          <Plus size={10} className="text-[#C5A059] opacity-0 group-hover/sub:opacity-100 transition-opacity" strokeWidth={3} id={`plus-icon-${index}-${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minimalist CTA Row directly over the image with Gold Hover Interaction */}
                  <div className="pt-3.5 mt-4 border-t border-white/25 flex justify-between items-center gap-4">
                    <Link 
                      to={slide.destination}
                      className="inline-flex items-center gap-2 px-4.5 py-2 border border-white/30 hover:border-[#C5A059] text-[10px] font-sans uppercase tracking-[0.15em] font-bold text-white hover:text-white rounded-full bg-white/10 hover:bg-[#C5A059] backdrop-blur-md transition-all duration-300 group/link pointer-events-auto shadow-md"
                    >
                      <span>{slide.ctaText}</span>
                      <Plus size={10} className="text-white group-hover/link:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                    </Link>

                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-semibold">
                      SEC_0{slide.index}
                    </span>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Visual Footer Badge & Slogan */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-2" id="service-footer-badge-wrapper">
        <div className="border-t border-ink/10 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-sans uppercase tracking-[0.15em] text-ink/40 font-semibold" id="service-footer-badge">
          <span>WAMLED SPECIFICATION CATALOGUE // 2026</span>
          <span className="text-[#C5A059] tracking-[0.2em]">STRUCTURED SOPHISTICATION.</span>
        </div>
      </div>
    </section>
  );
};
