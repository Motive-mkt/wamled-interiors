import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Compass, 
  Cpu, 
  Columns, 
  Layers, 
  Trees, 
  ArrowRight,
  Plus 
} from 'lucide-react';

interface SubService {
  name: string;
  description: string;
}

interface PillarData {
  id: string;
  index: string;
  title: string;
  focus: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  items: SubService[];
  link: string;
}

const FIVE_PILLARS: PillarData[] = [
  {
    id: "architectural",
    index: "01",
    title: "Architectural & Interior",
    focus: "Master planning and the project’s visual soul and movement choreography.",
    icon: Compass,
    link: "/services#architectural-interior",
    items: [
      { name: "Circulation Design", description: "Mapping flow, viewpoints and cross-ventilation." },
      { name: "Functional Design", description: "Modular layouts and micro-zoned layouts." },
      { name: "Style Design", description: "Defining local Swahili and minimalist aesthetic stories." },
      { name: "FF&E Curation", description: "Italian marble slabs, raw stones and custom furnishings." }
    ]
  },
  {
    id: "specialty",
    index: "02",
    title: "Specialty Systems",
    focus: "High-utility mechanical, electrical and low-voltage installations.",
    icon: Cpu,
    link: "/services#technical-systems-mepf",
    items: [
      { name: "MEPF Solutions", description: "Mechanical, Electrical, and Plumbing engineering." },
      { name: "ELV & IT Systems", description: "Extra Low Voltage systems and automated security." },
      { name: "Lighting Systems", description: "Architectural luminescence and smart scene setting." },
      { name: "Kitchen & Laundry", description: "Professional-grade culinary layout design." }
    ]
  },
  {
    id: "product",
    index: "03",
    title: "Product Application",
    focus: "Structural glazing, frames and facade boundary engineering.",
    icon: Columns,
    link: "/services#exterior-structural",
    items: [
      { name: "Facade System", description: "Custom double-glazed acoustic facades." },
      { name: "Steel Structure", description: "High-wind load bearing metal framing." },
      { name: "Balustrades", description: "Premium architectural glass stairs & safety railings." },
      { name: "Partitions & Canopies", description: "Custom sliding partitions and shading canopy frames." }
    ]
  },
  {
    id: "finishing",
    index: "04",
    title: "Finishing & Furnishing",
    focus: "Meticulous surface coverings, custom timber lattice and raw finishes.",
    icon: Layers,
    link: "/services#interior-finishing-furnishing",
    items: [
      { name: "Wall & Floor Cover", description: "Hand-pressed lime plaster and seamless microcement." },
      { name: "Ceiling Systems", description: "Acoustic control and hidden integrated lighting rails." },
      { name: "Decoration & Artwork", description: "Curation of elite local sculpture and organic art." },
      { name: "Bathroom Solutions", description: "Custom-carved monolithic stone sinks & baths." }
    ]
  },
  {
    id: "outdoor",
    index: "05",
    title: "Specialized & Outdoor",
    focus: "Beachfront swimming horizons and salt-tolerant organic landscaping.",
    icon: Trees,
    link: "/services#specialized-outdoor",
    items: [
      { name: "Landscape Design", description: "Lush native saltwater-safe gardens and beach bounds." },
      { name: "Hospitality Design", description: "Commercial lounges, spa zones and wellness retreats." },
      { name: "Signage & Wayfinding", description: "Brass or timber engraved directional systems." },
      { name: "Wellness & Fitness", description: "Thermal sauna pools and coastal fitness installations." }
    ]
  }
];

export const ServiceStacks: React.FC = () => {
  return (
    <section className="relative w-full bg-white text-ink py-40 border-t border-ink/5">
      {/* Decorative Blueprint Grid Background Accent lines */}
      <div className="absolute inset-0 bg-white opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(26,26,26,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,26,26,0.02) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-16 mb-16 border-b border-ink/10">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-3">
              <span className="text-brand font-sans text-[13px] uppercase tracking-[0.15em] font-medium">WAMLED SPECTRUM // THE CULMINATION</span>
              <span className="h-px bg-brand/35 w-12" />
              <span className="text-ink/40 text-[11px] font-sans tracking-widest uppercase">02 / PILLARS</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-ink tracking-tight mt-2 leading-tight">
              The Five Pillars of<br />
              <span className="italic text-ink/70">Spatial Engineering.</span>
            </h2>
          </div>
          
          <div className="text-left font-sans text-xs md:text-sm text-ink/60 max-w-sm leading-relaxed font-light space-y-3">
            <p>
              We categorize our bespoke Mombasa architecture, installations, and custom finishing processes into five integrated columns of master-tier execution.
            </p>
          </div>
        </div>

        {/* 5-Column Elegant Categorized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-t border-b border-ink/10 divide-y md:divide-y-0 lg:divide-x divide-ink/10 bg-white shadow-none">
          {FIVE_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className="group p-8 lg:p-10 flex flex-col justify-between hover:bg-white transition-all duration-500 relative overflow-hidden"
              >
                {/* Subtle top indicator hover line (gold) */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="space-y-8 text-left">
                  {/* Pillar Metadata Following Architect rule */}
                  <div className="flex justify-between items-center">
                    <span className="text-brand font-sans text-[13px] uppercase tracking-[0.15em] font-semibold">{pillar.index}</span>
                    <span className="text-ink/30 text-[11px] font-sans tracking-widest">WM_CO</span>
                  </div>

                  {/* High Quality Ultra Thin Iconic Line visual */}
                  <div className="inline-flex py-2">
                    <IconComponent className="w-12 h-12 text-ink/40 group-hover:text-brand transition-colors duration-500" strokeWidth={1} />
                  </div>

                  {/* Header in Playfair Display serif */}
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-serif font-light text-ink group-hover:text-brand transition-colors duration-300 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-ink/50 leading-relaxed font-light">
                      {pillar.focus}
                    </p>
                  </div>

                  {/* Sub-services list with thin gold underline reveals on hover */}
                  <div className="pt-6 border-t border-ink/5 space-y-4">
                    <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-ink/40 font-semibold block mb-2">OFFERINGS</span>
                    <ul className="space-y-3">
                      {pillar.items.map((item, i) => (
                        <li key={i} className="group/item flex flex-col">
                          <Link 
                            to={pillar.link}
                            className="inline-block"
                          >
                            <span className="text-xs uppercase font-sans tracking-widest text-ink/85 group-hover/item:text-brand transition-all duration-300 relative py-0.5">
                              {item.name}
                              <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left" />
                            </span>
                          </Link>
                          <span className="text-[10px] text-ink/40 font-light mt-0.5 leading-normal pr-2 block">
                            {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom link to deeper process section */}
                <div className="pt-10 text-left">
                  <Link 
                    to={pillar.link}
                    className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] text-brand hover:text-ink transition-colors font-semibold"
                  >
                    <span>EXPLORE PROCESS</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* Dynamic visual footer badge */}
        <div className="pt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-sans uppercase tracking-[0.15em] text-ink/40">
          <span>WAMLED SPECIFICATION SHEETS v1.02</span>
          <span className="text-brand">Precision, structure, and quiet sophistication.</span>
        </div>

      </div>
    </section>
  );
};
