import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface GatewayCategory {
  id: string;
  categoryKey: string; // matches initialCategory in Filmstrip
  title: string;
  subtitle: string;
  image: string;
  tagline: string;
}

const GATEWAY_CATEGORIES: GatewayCategory[] = [
  {
    id: "residential-interiors",
    categoryKey: "Residential",
    title: "Residential Interiors",
    subtitle: "(Living/Bedroom)",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=95&w=1200&h=1600",
    tagline: "Ultra-luxury seaside private suites designed for premium coastal living."
  },
  {
    id: "exterior-outdoor",
    categoryKey: "Exterior",
    title: "Exterior & Outdoor",
    subtitle: "(Facade/Patio)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=95&w=1200&h=1600",
    tagline: "High-wind structural glazed boundaries resisting marine microclimates."
  },
  {
    id: "commercial-spaces",
    categoryKey: "Commercial",
    title: "Commercial Spaces",
    subtitle: "(Offices/Retail)",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=95&w=1200&h=1600",
    tagline: "High-traffic maritime lounges, boutique offices, and private club rooms."
  },
  {
    id: "landscaping-gardens",
    categoryKey: "Landscaping",
    title: "Landscaping",
    subtitle: "(Gardens/Pools)",
    image: "/src/assets/images/premium_yacht_marina_1780516542006.png",
    tagline: "Beachfront swimming horizons and salt-tolerant organic gardens."
  }
];

export const BentoGalleryGateway: React.FC = () => {
  return (
    <section className="py-40 bg-white text-ink border-t border-b border-ink/10 relative overflow-hidden">
      {/* Dynamic graphic lighting glow behind */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* Header Introduction block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-ink/15">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-3">
              <span className="architect-label text-brand">
                CRAFT ARCHITECTURE
              </span>
              <span className="h-px bg-brand/35 w-8" />
              <span className="architect-meta text-ink/40">04 / CORE BLUEPRINTS</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-light text-ink tracking-tight">
              Bespoke Project Gateway.<br />
              <span className="italic text-ink/60">The Wamled curation.</span>
            </h2>
          </div>
          <p className="text-ink/65 text-xs max-w-sm leading-relaxed font-sans font-light text-left">
            Select an archetype gateway below. Navigating this interface transitions directly to our high-resolution 9:16 vertical films showing custom-engineered coastal properties.
          </p>
        </div>

        {/* 4-Column Horizontal Grid with High-Contrast Charcoal Borders - strict rounded-none & shadow-none */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-ink/15 rounded-none overflow-hidden bg-white shadow-none">
          {GATEWAY_CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/filmstrip?category=${cat.categoryKey}`}
              className="group relative block aspect-[9/16] bg-ink hover:bg-black overflow-hidden transition-colors duration-500 border-b sm:border-b-0 border-r last:border-r-0 border-ink/15 sm:odd:border-r-0 lg:odd:border-r"
              style={{
                // Ensure proper border spacing across different grid layouts
                borderBottom: '1px solid rgba(44, 42, 41, 0.15)',
              }}
            >
              {/* Inner Zoom image container - expands slightly on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.title}
                  className="w-full h-full object-cover opacity-100 transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Scrim: Dark premium layer for high contrast typography read-offs */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 transition-opacity duration-500 opacity-90 group-hover:opacity-95 pointer-events-none" />

              {/* Decorative inner hairline frame border - no rounded edges, reveal gold on hover */}
              <div className="absolute inset-4 border border-white/5 group-hover:border-brand/50 transition-colors duration-700 rounded-none pointer-events-none" />

              {/* Absolute Corner Identifier Tag */}
              <div className="absolute top-6 left-6 text-white/35 font-sans architect-meta pointer-events-none group-hover:text-brand transition-colors duration-300">
                GATEWAY_0{index + 1} //
              </div>

              {/* Core Interactive Layout: Text shifts on hover */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-left z-10 pointer-events-none">
                
                {/* Visual grouping of Category info */}
                <div className="transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-[-70%] group-hover:text-center w-full">
                  
                  {/* Category Small Spaced-out label */}
                  <span className="architect-label text-[#C5A059] block mb-1">
                    {cat.categoryKey}
                  </span>

                  {/* Elegant Large Serif Heading */}
                  <h3 className="text-2xl font-serif font-light text-white leading-tight">
                    {cat.title} <span className="block text-sm text-white/60 italic font-light mt-0.5">{cat.subtitle}</span>
                  </h3>
                  
                  {/* Subtle description visible on idle, fades down or gets replaced on hover */}
                  <p className="text-[10px] text-white/45 font-sans font-light tracking-wide leading-relaxed mt-3 block group-hover:hidden transition-all duration-300">
                    {cat.tagline}
                  </p>
                </div>

                {/* Micro-Text Reveal fades in only upon hover at the center bottom area */}
                <div className="absolute bottom-10 inset-x-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 flex flex-col items-center gap-2">
                  <span className="architect-label text-[#C5A059]">
                    EXPLORE PROJECTS
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand text-brand flex items-center justify-center animate-bounce">
                    <ArrowRight size={12} />
                  </div>
                </div>

              </div>

              {/* Bottom line marker status */}
              <div className="absolute bottom-6 right-6 text-right font-mono text-[8px] tracking-[0.25em] text-white/10 group-hover:text-brand/35 transition-colors">
                WAMLED DESIGN CO
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
