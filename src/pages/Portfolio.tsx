import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCMS } from '../components/CMSContext';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Layers, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Briefcase,
  Plus
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  location?: string;
  createdAt?: string;
}

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Yacht & Exterior', 'Landscaping'];

export default function Portfolio() {
  const { content } = useCMS();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState<'All' | 'Institutional' | 'Commercial' | 'Housing'>('All');
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

  const filteredItems = items.filter(item => {
    // Stage 1: Global Category Tab
    const matchesGlobal = selectedCategory === 'All' 
      ? true 
      : item.category.toLowerCase() === selectedCategory.toLowerCase();
      
    // Stage 2: Sub-Header Navigation Filter
    if (subCategoryFilter === 'All') {
      return matchesGlobal;
    } else if (subCategoryFilter === 'Institutional') {
      return matchesGlobal && item.category.toLowerCase() === 'institutional';
    } else if (subCategoryFilter === 'Commercial') {
      return matchesGlobal && item.category.toLowerCase() === 'commercial';
    } else if (subCategoryFilter === 'Housing') {
      return matchesGlobal && (item.category.toLowerCase() === 'housing' || item.category.toLowerCase() === 'residential');
    }
    return matchesGlobal;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-ink pt-28 pb-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#A83F1B]/5 blur-[120px] pb-1" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C5A059]/5 blur-[150px] pb-1" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Title Section with Editorial spacing */}
        <div className="space-y-6 max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink/5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A83F1B]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#1A1A1A]/55 font-bold">Wamled Archives</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] uppercase text-ink">
            Curated <br />
            <span className="italic text-[#A83F1B]">Portfolio</span> Collection
          </h1>
          <p className="text-sm text-ink/65 font-light leading-relaxed max-w-lg font-sans">
            A comprehensive record of uncompromised coastal sanctuaries, private estates, marine assemblies, and high-performance commercial layouts crafted by our Mombasa studio.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-ink/10 mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-[10px] font-mono uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[#A83F1B] border-[#A83F1B] text-white font-bold'
                  : 'bg-white border-ink/10 text-ink/60 hover:text-ink hover:bg-black/[0.03]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sub-header Navigation / Filter Section */}
        <div className="border border-ink/5 bg-white p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-none shadow-xs">
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#A83F1B] font-mono block font-bold">PROJECT DISCIPLINE SELECTION</span>
            <h2 className="text-xl font-serif font-light text-ink uppercase tracking-tight">Curation Filter</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSubCategoryFilter('All')}
              className={`text-[10px] font-mono uppercase tracking-[0.1em] px-4 py-2 border transition-all duration-300 cursor-pointer ${
                subCategoryFilter === 'All'
                  ? 'bg-[#A83F1B] border-[#A83F1B] text-white font-bold'
                  : 'bg-transparent border-ink/15 text-ink/60 hover:text-ink hover:border-ink/35'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSubCategoryFilter('Institutional')}
              className={`text-[10px] font-mono uppercase tracking-[0.1em] px-4 py-2 border transition-all duration-300 cursor-pointer ${
                subCategoryFilter === 'Institutional'
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-transparent border-ink/15 text-ink/60 hover:text-ink hover:border-ink/35'
              }`}
            >
              Institutional
            </button>
            <button
              onClick={() => setSubCategoryFilter('Commercial')}
              className={`text-[10px] font-mono uppercase tracking-[0.1em] px-4 py-2 border transition-all duration-300 cursor-pointer ${
                subCategoryFilter === 'Commercial'
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-transparent border-ink/15 text-ink/60 hover:text-ink hover:border-ink/35'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => setSubCategoryFilter('Housing')}
              className={`text-[10px] font-mono uppercase tracking-[0.1em] px-4 py-2 border transition-all duration-300 cursor-pointer ${
                subCategoryFilter === 'Housing'
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-transparent border-ink/15 text-ink/60 hover:text-ink hover:border-ink/35'
              }`}
            >
              Housing
            </button>
          </div>
        </div>

        {/* Main List Rendering */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#A83F1B]/30 border-t-[#A83F1B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono tracking-widest uppercase text-ink/40">Consulting Archive Indexes...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty placeholder requested by user */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-ink/5 bg-white rounded-3xl p-12 lg:p-20 text-center max-w-md mx-auto my-12 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-[#A83F1B]/5 border border-[#A83F1B]/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase size={20} className="text-[#A83F1B]" />
            </div>
            <h3 className="text-lg font-serif font-light text-ink mb-2 uppercase tracking-wide">Dynamic Portfolio is Empty</h3>
            <p className="text-xs text-ink/65 font-light max-w-xs mx-auto mb-10 leading-relaxed font-sans">
              No works have been added to this query yet. The Studio Archivist will manually upload projects and build photographic records through the Owner Control Dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/#consultation-form-box" 
                className="bg-[#A83F1B] hover:bg-[#8D3212] text-white py-3 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                REQUEST CONSULTATION
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Render Active Grid */
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-ink/5 hover:border-brand/20 transition-all duration-500 shadow-xs hover:shadow-lg animate-fade-in"
                >
                  {/* Photo container */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-black/[0.02]">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Floating Category tag */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[9px] font-mono tracking-wider font-bold text-ink px-3 py-1 rounded-full border border-ink/5 uppercase shadow-xs select-none">
                      {item.category}
                    </span>
                  </div>

                  {/* Content section below photobox */}
                  <div className="p-6 space-y-3 text-left bg-white">
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-[#A83F1B] text-[10px] font-mono font-bold tracking-wider">
                        <MapPin size={10} />
                        <span>{item.location}</span>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-serif font-light text-ink group-hover:text-[#A83F1B] transition-colors uppercase leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-[11px] text-ink/70 font-light leading-relaxed line-clamp-3 font-sans">
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
