import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Plus, Image as ImageIcon } from 'lucide-react';
import kenyanHouseLandscapeImg from '../assets/images/kenyan_house_landscape_1780570586379.png';

interface SubService {
  name: string;
  description: string;
}

interface StackSlide {
  id: string;
  title: string;
  focus: string;
  subServices: SubService[];
  image: string;
  ctaText: string;
}

const STACK_SLIDES: StackSlide[] = [
  {
    id: "architectural-interior",
    title: "Architectural & Interior Design",
    focus: "Master planning and the core visual identity of the project.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=95&w=1600&h=1200",
    ctaText: "Explore the Process",
    subServices: [
      { name: "Circulation Design", description: "Mapping the flow and movement within a space." },
      { name: "Functional Design", description: "Creating layouts that serve the specific purpose of the room." },
      { name: "Style Design", description: "Defining the aesthetic theme, materials, and color stories." },
      { name: "Furniture, Fixtures & Equipment (FF&E)", description: "The selection and curation of all movable and fixed items." }
    ]
  },
  {
    id: "specialty-systems",
    title: "Specialty Design & Systems",
    focus: "Engineering and high-utility technical installations.",
    image: kenyanHouseLandscapeImg,
    ctaText: "Explore the Process",
    subServices: [
      { name: "MEP Solutions", description: "Mechanical, Electrical, and Plumbing system integration." },
      { name: "Lighting Systems", description: "Architectural lighting design and smart home illumination." },
      { name: "Swimming Pools", description: "Technical and aesthetic design for aquatic features." },
      { name: "Kitchen & Laundry", description: "High-performance spatial planning for service areas." },
      { name: "ELV & IT System", description: "Extra Low Voltage systems including security and data." }
    ]
  },
  {
    id: "product-application",
    title: "Product & Application Design",
    focus: "Structural details and exterior architectural features.",
    image: kenyanHouseLandscapeImg,
    ctaText: "Explore the Process",
    subServices: [
      { name: "Curtain Wall and Facade", description: "The building’s outer \"skin\" and glass engineering." },
      { name: "Steel Structure", description: "Structural design and engineering for metal frameworks." },
      { name: "Balustrade & Staircase", description: "Custom vertical circulation and safety aesthetics." },
      { name: "Canopy & Partition", description: "External shading solutions and internal spatial dividers." }
    ]
  }
];

export const ServiceStacks: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F9F9F7]">
      {/* Sticky Scroll Section Stack Container */}
      <div className="relative">
        {STACK_SLIDES.map((slide, index) => {
          // Adjust sticky offsets or zIndex for stacking effect
          const zIndex = (index + 1) * 10;
          
          return (
            <div 
              key={slide.id}
              className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white shadow-[0_-15px_40px_rgba(0,0,0,0.45)]"
              style={{ zIndex }}
            >
              {/* Full-bleed background placeholder instead of project image */}
              <div className="absolute inset-0 z-0 bg-[#0F0F0F]">
                {/* Micro-grid lines mimicking architectural mapping */}
                <div 
                  className="absolute inset-0 opacity-[0.07]" 
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />
                <div className="absolute inset-8 border border-white/[0.02] pointer-events-none rounded-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 opacity-25">
                  <ImageIcon size={44} className="text-white/60 mb-2" />
                  <span className="text-[10px] font-mono tracking-[0.35em] text-white uppercase">[ Interactive Asset Interface // {slide.title} ]</span>
                </div>
                
                {/* Subtle scrim: Soft left-heavy cinematic dark gradient for high typography readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 pointer-events-none" />
              </div>

              {/* Grid content container */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center py-20">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  
                  {/* Left Column: Atelier Title & Dynamic CTA */}
                  <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-left">
                    <div className="space-y-4">
                      {/* Section Index */}
                      <div className="inline-flex items-center gap-3">
                        <span className="font-mono text-xs text-brand font-semibold tracking-wider">0{index + 1} // 03</span>
                        <span className="h-px bg-brand/35 w-12" />
                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono">WAMLED ATELIER</span>
                      </div>

                      {/* Heading: Large elegant Serif font */}
                      <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light leading-tight tracking-tight text-white max-w-lg">
                        {slide.title}
                      </h3>
                      
                      {/* Focus Tagline */}
                      <p className="text-xs sm:text-sm font-sans font-medium text-brand uppercase tracking-[0.15em] max-w-md">
                        {slide.focus}
                      </p>
                    </div>

                    {/* Aspirational Custom Minimalist CTA */}
                    <div className="pt-2">
                      <Link 
                        to="/filmstrip"
                        className="inline-flex items-center gap-4 border border-white/20 hover:border-brand/70 hover:bg-brand hover:text-white text-white px-8 py-4 rounded-full font-mono text-[10px] uppercase tracking-[0.25em] font-bold bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] select-none group"
                      >
                        <span>{slide.ctaText}</span>
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-dark transition-colors">
                          <Plus size={12} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Clean, Minimalist spaced-out Sans-Serif sub-services list */}
                  <div className="lg:col-span-6 space-y-6 border-t border-white/10 lg:border-t-0 pt-6 lg:pt-0 pl-0 lg:pl-12">
                    <div className="space-y-6">
                      {slide.subServices.map((sub, sidx) => (
                        <div 
                          key={sidx} 
                          className="group/item border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              {/* Sub-heading in a clean small Sans-Serif with high letter spacing */}
                              <h4 className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.25em] font-medium text-white group-hover/item:text-brand transition-colors duration-300">
                                {sub.name}
                              </h4>
                              {/* Short focus explanation */}
                              <p className="font-sans text-[11px] text-white/50 font-light leading-relaxed max-w-md">
                                {sub.description}
                              </p>
                            </div>
                            <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 text-brand">
                              <ArrowUpRight size={14} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Interactive Slide indicator line */}
              <div className="absolute bottom-6 left-6 right-6 hidden md:flex items-center justify-between text-[11px] font-mono tracking-widest text-white/35 z-10 pointer-events-none">
                <span>PARALLAX STUDIO STACKS</span>
                <div className="flex gap-4">
                  <span className={index === 0 ? "text-brand font-bold" : ""}>01</span>
                  <span>/</span>
                  <span className={index === 1 ? "text-brand font-bold" : ""}>02</span>
                  <span>/</span>
                  <span className={index === 2 ? "text-brand font-bold" : ""}>03</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
