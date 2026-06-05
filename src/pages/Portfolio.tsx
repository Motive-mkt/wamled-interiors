import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCMS } from '../components/CMSContext';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Briefcase,
  Layers,
  Sparkle
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

import kenyanHouseLandscapeImg from '../assets/images/kenyan_house_landscape_1780570586379.png';
import englishPointLandscapeImg from '../assets/images/english_point_user_landscape_1780571382886.png';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  location?: string;
  createdAt?: string;
  isBeforeAfter?: boolean;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "default-p-01",
    title: "The Mazeras Stone Pavilion & Modern Residence",
    category: "Architectural & Interior Design",
    imageUrl: kenyanHouseLandscapeImg,
    description: "A striking warm minimalist modern Kenyan house featuring floor-to-ceiling glass, a flat concrete roofline, and hand-cut Mazeras stone supporting pillars.",
    location: "Kileleshwa, Nairobi"
  },
  {
    id: "default-p-02",
    title: "The Obsidian Commercial Tower Plaza",
    category: "Specialty Design",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=90&w=900&h=675",
    description: "An ultra-clean double-height corporate atrium combining basalt, mahogany columns, and circadian lighting arrays for high-performance workspaces.",
    location: "Westlands, Nairobi"
  },
  {
    id: "default-p-03",
    title: "Nairobi Contemporary Art Pavilion",
    category: "Architectural & Interior Design",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=90&w=900&h=675",
    description: "A striking, climate-adapted civic pavilion combining local volcanic tuffs with carbon-neutral concrete forms and deep recessed light channels.",
    location: "Nairobi, Kenya"
  },
  {
    id: "default-p-04",
    title: "English Point Marina Landscaped Boardwalk & Deck",
    category: "Product & Application Design",
    imageUrl: englishPointLandscapeImg,
    description: "A premium waterfront hospitality landscaping of the dockside at English Point Marina, featuring majestic palm rings, timber-decked lounges, infinity resort pool setups, and deep-water berths.",
    location: "Mombasa, Kenya"
  },
  {
    id: "default-p-05",
    title: "Oceanside Cliffside Modern Villa Restoration",
    category: "Before & After",
    isBeforeAfter: true,
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=90&w=900&h=675",
    beforeImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=90&w=900&h=675", // raw dry ocean edge
    afterImageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=90&w=900&h=675", // finished cliff villa
    description: "Complete architectural rehabilitation of a neglected coastal villa, converting raw weather-damaged concrete structures into an elite, open-plan minimalist shoreline retreat.",
    location: "Nyali, Mombasa"
  }
];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Architectural & Interior Design');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to firestore 'portfolio' collection
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
      setItems(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error loading portfolio items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const combinedItems = [...items, ...DEFAULT_PORTFOLIO_ITEMS];

  // Filtering logic
  const filteredItems = combinedItems.filter(item => {
    if (selectedCategory === 'Before & After') {
      return item.isBeforeAfter === true || item.category === 'Before & After';
    } else {
      // Avoid matching Before&After items inside standard categories
      if (item.isBeforeAfter || item.category === 'Before & After') return false;
      return item.category.toLowerCase() === selectedCategory.toLowerCase();
    }
  });

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#121212] pt-32 pb-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Title Section with Editorial spacing */}
        <div className="space-y-6 max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212]/5 border border-[#121212]/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#121212]/60 font-bold">Wamled Archives</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] uppercase text-[#121212]">
            Curated <br />
            <span className="italic text-[#C5A059]">Portfolio</span> Collection
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed max-w-lg">
            A meticulous archive of realized structures, bespoke high-performance environments, and coastal transformations crafted by our Nairobi & Nakuru design studios.
          </p>
        </div>

        {/* Categories Tab Selector (Sub-Header Navigation/Filter Section) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 pb-6 border-b border-[#121212]/10 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block font-bold">Atelier Classification</span>
            <span className="text-xs font-sans tracking-widest text-[#121212]/60 uppercase">Project Segments & Records</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              'Architectural & Interior Design', 
              'Specialty Design', 
              'Product & Application Design',
              'Before & After'
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`text-[9px] sm:text-xs font-mono uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  selectedCategory.toLowerCase() === tab.toLowerCase()
                    ? 'bg-[#C5A059] border-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/10'
                    : 'bg-white border-[#121212]/10 text-gray-600 hover:text-[#121212] hover:bg-gray-100/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main List Rendering */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono tracking-widest uppercase text-gray-400">Consulting Archive Indexes...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#121212]/5 bg-[#121212]/[0.01] rounded-3xl p-12 lg:p-20 text-center max-w-md mx-auto my-12"
          >
            <div className="w-12 h-12 rounded-full bg-[#121212]/5 border border-[#121212]/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase size={20} className="text-[#C5A059]" />
            </div>
            <h3 className="text-sm font-serif font-light text-[#121212] mb-2 uppercase tracking-wide">Empty Dynamic Portfolio Segment</h3>
            <p className="text-[11px] text-gray-500 font-light max-w-xs mx-auto mb-10 leading-relaxed">
              No works have been added to this pillar section yet. The Studio Owner is manually uploading projects and building photographic records.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/#consultation-form-box" 
                className="bg-[#C5A059] hover:bg-[#121212] text-white py-3 rounded-full font-mono text-[9px] uppercase font-bold tracking-widest transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                REQUEST CONSULTATION
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        ) : selectedCategory === 'Before & After' ? (
          /* BEFORE & AFTER SPECIAL LAYOUT: Renders responsive slider cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-dashed border-[#121212]/10 shadow-lg hover:shadow-xl transition-all duration-350"
              >
                <BeforeAfterSlider 
                  beforeUrl={item.beforeImageUrl || ''} 
                  afterUrl={item.afterImageUrl || item.imageUrl} 
                  title={item.title} 
                  description={item.description} 
                  location={item.location} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          /* STANDARD CATEGORIES: Ultra-clean, white-gallery style layout, NO overlay scrims */
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45 }}
                  className="group relative flex flex-col justify-between overflow-hidden bg-white rounded-3xl border border-[#121212]/5 shadow-xs hover:shadow-lg hover:border-[#C5A059]/20 transition-all duration-400"
                >
                  {/* Photo container - Absolutely clear on display */}
                  <div className="aspect-[4/3] w-full relative overflow-hidden bg-[#161616]/5">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 select-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating Category tag over visual top margin */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[8px] font-mono tracking-wider font-extrabold text-[#C5A059] px-3 py-1 rounded-md border border-[#121212]/5 uppercase shadow-xs z-10">
                      {item.category}
                    </span>
                  </div>

                  {/* High Legibility text block *UNDER* the picture inside white layout container */}
                  <div className="p-6 text-left space-y-3 bg-white">
                    {item.location && (
                      <div className="flex items-center gap-1 text-gray-400 text-[9px] font-mono tracking-widest uppercase font-semibold">
                        <MapPin size={10} className="text-[#C5A059]" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    
                    <h3 className="text-lg sm:text-xl font-serif font-light text-[#121212] group-hover:text-[#C5A059] transition-colors uppercase leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-[11px] text-gray-500 font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
