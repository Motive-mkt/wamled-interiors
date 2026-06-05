import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Briefcase,
  Layers,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: 'Institutional' | 'Commercial' | 'Housing';
  imageUrl: string;
  description: string;
  scopeOfWork?: string;
  galleryUrls?: string[];
  location?: string;
  completionYear?: string;
  isArchived?: boolean;
  createdAt?: string;
}

export default function Portfolio() {
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'Institutional' | 'Commercial' | 'Housing'>('Institutional');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setDbProjects(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error loading portfolio from 'projects':", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter based on selectedCategory ('Institutional' | 'Commercial' | 'Housing') and exclude archived items
  const filteredItems = dbProjects.filter(
    item => 
      item.category.toLowerCase() === selectedCategory.toLowerCase() && 
      item.isArchived !== true
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#121212] pt-32 pb-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 animate-fade-in">
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
            {(['Institutional', 'Commercial', 'Housing'] as const).map((tab) => (
              <button
                key={tab}
                id={`portfolio-tab-${tab.toLowerCase()}`}
                onClick={() => setSelectedCategory(tab)}
                className={`text-[9px] sm:text-xs font-mono uppercase tracking-widest px-6 py-3 rounded-full border transition-all duration-300 cursor-pointer ${
                  selectedCategory === tab
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
                  id={`project-card-${item.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45 }}
                  onClick={() => setSelectedProject(item)}
                  className="group relative flex flex-col justify-between overflow-hidden bg-white rounded-3xl border border-[#121212]/5 shadow-sm hover:shadow-lg hover:border-[#C5A059]/30 transition-all duration-400 cursor-pointer"
                >
                  {/* Photo container */}
                  <div className="aspect-[4/3] w-full relative overflow-hidden bg-[#161616]/5">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 select-none"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FAF9F7] border border-dashed border-[#121212]/20 flex flex-col items-center justify-center p-6 text-center select-none">
                        <ImageIcon size={24} className="text-[#C5A059]/40 mb-2" />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#121212]/30">Media Frame Pending</span>
                      </div>
                    )}
                    
                    {/* Floating Category tag over visual top margin */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[8px] font-mono tracking-wider font-extrabold text-[#C5A059] px-3 py-1 rounded-md border border-[#121212]/5 uppercase shadow-xs z-10">
                      {item.category}
                    </span>
                  </div>

                  {/* High Legibility text block *UNDER* the picture inside white layout container */}
                  <div className="p-6 text-left space-y-3 bg-white">
                    {(item.location || item.completionYear) && (
                      <div className="flex items-center justify-between text-gray-400 text-[9px] font-mono tracking-widest uppercase font-semibold">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-[#C5A059]" />
                          <span>{item.location || "Nairobi Studio"}</span>
                        </div>
                        {item.completionYear && (
                          <span className="text-[#C5A059] tracking-wider">
                            Year: {item.completionYear}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <h3 className="text-md sm:text-lg font-serif font-light text-[#121212] group-hover:text-[#C5A059] transition-colors uppercase leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-[11px] text-gray-500 font-light leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2 flex justify-start">
                      <span className="text-[9px] font-mono tracking-widest text-[#C5A059] font-bold uppercase inline-flex items-center gap-1 group-hover:underline">
                        EXPLORE RECORDS <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* PORTFOLIO IMMERSIVE DYNAMIC DETAILS MODAL/LAYOUT OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            id="project-details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121212]/90 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-[#F9F9F7] text-ink rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-ink/10"
            >
              {/* Modal Top Header Bar */}
              <div className="p-6 border-b border-ink/5 bg-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                  <span className="text-xs font-mono tracking-[0.25em] text-[#C5A059] font-black uppercase">
                    {selectedProject.category} RECORD INDEX
                  </span>
                </div>
                <button
                  id="close-project-modal"
                  onClick={() => setSelectedProject(null)}
                  className="p-2 -mr-2 text-ink/40 hover:text-ink hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                  title="Close Project Details"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto text-left p-6 sm:p-10 space-y-10">
                {/* Visual Intro Block (Title, Description, and Hero image) */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light leading-tight text-[#121212] uppercase tracking-tight">
                      {selectedProject.title}
                    </h2>
                    
                    {(selectedProject.location || selectedProject.completionYear) && (
                      <div className="flex items-center justify-between text-ink/55 text-xs font-mono uppercase tracking-widest font-semibold border-b border-ink/5 pb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-[#C5A059]" />
                          <span>{selectedProject.location || "Nairobi Studio"}</span>
                        </div>
                        {selectedProject.completionYear && (
                          <span className="text-[#A83F1B] font-bold">
                            Completed: {selectedProject.completionYear}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A83F1B] font-bold flex items-center gap-1">
                        <FileText size={12} />
                        Architectural Synopsis
                      </span>
                      <p className="text-sm text-ink/75 font-light leading-relaxed italic pr-4">
                        "{selectedProject.description}"
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {/* Primary Image Cover Frame */}
                    <div className="rounded-2xl overflow-hidden border border-ink/5 shadow-md aspect-[4/3] bg-cream/10">
                      <img
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope of Work Section */}
                <div className="space-y-4 border-t border-ink/5 pt-8">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A83F1B] font-black">
                    Scope of Work & Spatial Curation
                  </h4>
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ink/5 leading-relaxed text-sm text-ink/80 font-light space-y-4">
                    <p className="whitespace-pre-line">
                      {selectedProject.scopeOfWork || "Complete spatial mapping, interior elevation, custom furniture fabrication, and high-performance landscape coordination managed entirely by Wamled Interior's senior content desk."}
                    </p>
                  </div>
                </div>

                {/* Multi-Image Gallery Grid */}
                <div className="space-y-4 border-t border-ink/5 pt-8">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-black flex items-center gap-2">
                    <ImageIcon size={12} />
                    PROMINENT CAMERA WORKS & GALLERY
                  </h4>
                  
                  {/* Gallery Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.galleryUrls && selectedProject.galleryUrls.length > 0 ? (
                      selectedProject.galleryUrls.map((url, gIdx) => (
                        <div key={gIdx} className="aspect-video rounded-xl overflow-hidden border bg-cream/15 group relative shadow-xs">
                          <img
                            src={url}
                            alt={`Camera angle ${gIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))
                    ) : (
                      // If no galleryUrls exist, replicate primary image, Unsplash, or elegant empty blocks
                      [selectedProject.imageUrl, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600"].map((url, gIdx) => (
                        <div key={gIdx} className="aspect-video rounded-xl overflow-hidden border bg-cream/15 group relative shadow-xs">
                          <img
                            src={url}
                            alt={`Alternate spatial angle ${gIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Cta Action Bar */}
              <div className="p-6 border-t border-ink/5 bg-white flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
                <span className="text-[10px] text-ink/40 font-mono">
                  Wamled Interiors © 2026 Archive Records
                </span>
                <Link
                  to="/#consultation-form-box"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-8 py-3 bg-[#C5A059] hover:bg-ink text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all shadow-md text-center"
                >
                  Initiate Similar Space Project
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
