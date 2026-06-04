import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CaseStudy } from '../types';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  BookOpen, 
  Box, 
  Zap, 
  MessageSquare,
  Building,
  Activity
} from 'lucide-react';

const SUGGESTIONS = [
  {
    title: "The Minimalist Sanctuary: A Study in Light and Texture",
    location: "Nyali, Mombasa",
    projectType: "Atelier Residential",
    sqFt: "4,200 SQFT",
    vision: "To re-design a north-facing coastal pavilion using monochrome luxury and raw materials. We desired to capture continuous thermal marine breeze pathways while mitigating direct solar glare.",
    textures: "Laccate Oak, Honed Travertine, Hand-applied microcement",
    swatches: "#1A1A1A, #A83F1B, #C5A059, #F5F5F0",
    rawMaterials: "Brushed Brass, Solid Iroko Timber, Calacatta Viola Marble",
    challenge: "Maximizing natural light in a north-facing seaside duplex without introducing extreme equatorial heat, and resisting salt spray degradation.",
    blueprintUrl: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=800&h=600",
    renderUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800&h=600",
    finalPhotoUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800&h=600",
    materialSpotlightDesc: "Sourcing hand-selected monolithic calacatta violet marble slabs directly from Italian quarries to create zero-seam bathroom basins.",
    materialSpotlightUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800&h=1200",
    galleryUrls: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800&h=1200,https://images.unsplash.com/photo-1628592102751-ba82402b416a?auto=format&fit=crop&q=80&w=800&h=1200",
    galleryAnnotations: "Custom integrated solid oak ceiling grids,Precision aligned invisible lighting paths",
    testimonial: "The finished residence is a quiet sanctuary. Moving from space to space feels like a physical decompression.",
    testimonialAuthor: "Elena Safaricom Elite, Diani Coast",
    outcome: "Successfully achieved a seamless indoor-outdoor natural flow, dropping the ambient indoor temperature by 4.5°C without full-time HVAC usage."
  }
];

export default function CaseStudies() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'casestudies'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CaseStudy[];
      setStudies(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error loading case studies:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Back to list
  const handleBack = () => {
    setActiveStudy(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectStudy = (study: CaseStudy) => {
    setActiveStudy(study);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeStudy) {
    const swatchesArray = activeStudy.swatches ? activeStudy.swatches.split(',').map(s => s.trim()) : [];
    const galleryUrlsArray = activeStudy.galleryUrls ? activeStudy.galleryUrls.split(',').map(s => s.trim()) : [];
    const galleryAnnotationsArray = activeStudy.galleryAnnotations ? activeStudy.galleryAnnotations.split(',').map(s => s.trim()) : [];
    return (
      <div className="min-h-screen bg-[#F9F9F7] text-ink pt-28 pb-24 relative overflow-hidden">
        {/* Background Decorative Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A83F1B]/5 blur-[180px]" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full bg-[#C5A059]/5 blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Top navigation back button */}
          <button 
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1A1A1A]/60 hover:text-ink transition-colors mb-12 cursor-pointer pb-2"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Case Studies Archive
          </button>

          {/* 1. EDITORIAL HOOK: headline, overview, vision & stats sidebar */}
          <div className="grid lg:grid-cols-12 gap-12 items-start border-b border-ink/10 pb-16 mb-16">
            <div className="lg:col-span-8 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink/5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A83F1B]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A83F1B] font-bold">Premium Case Study</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] text-ink uppercase">
                {activeStudy.title}
              </h1>

              <div className="space-y-4">
                <p className="text-[11px] font-mono text-[#A83F1B] uppercase tracking-widest font-extrabold flex items-center gap-2">
                  <Activity size={12} /> THE VISION OBJECTIVE
                </p>
                <p className="text-lg text-ink/80 font-light leading-relaxed max-w-3xl italic font-serif">
                  "{activeStudy.vision}"
                </p>
              </div>
            </div>

            {/* Project Stats Sidebar */}
            <div className="lg:col-span-4 bg-white border border-ink/5 shadow-xs rounded-2xl p-8 space-y-6 text-left w-full lg:ml-auto">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#A83F1B] border-b border-ink/5 pb-3 font-bold">
                Project Dossier
              </h3>
              
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="block text-[9px] text-ink/40 uppercase tracking-wider mb-1">LOCATION</span>
                  <span className="text-ink text-sm font-sans flex items-center gap-1.5 font-medium">
                    <MapPin size={12} className="text-[#A83F1B]" /> {activeStudy.location}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-ink/40 uppercase tracking-wider mb-1">PROJECT CLASSIFICATION</span>
                  <span className="text-ink text-sm font-sans flex items-center gap-1.5 font-medium">
                    <Building size={12} className="text-[#A83F1B]" /> {activeStudy.projectType}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-ink/40 uppercase tracking-wider mb-1">SQUARE FOOTAGE</span>
                  <span className="text-ink text-sm font-sans flex items-center gap-1.5 font-medium">
                    <Layers size={12} className="text-[#A83F1B]" /> {activeStudy.sqFt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. THE NARRATIVE "WHY": concept selection, swatches & obstacle */}
          <div className="grid lg:grid-cols-12 gap-12 items-stretch mb-16 border-b border-ink/10 pb-16">
            <div className="lg:col-span-6 space-y-6 text-left">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#A83F1B] font-bold">
                02. Narrative Concept & Materiality
              </h3>
              <p className="text-sm text-ink/70 font-light leading-relaxed font-sans">
                Luxury design is the dialogue between tactile resistance and spatial absolute. By choosing specific raw coastal timbers and high-vein stones, we emphasize weight and presence.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-white border border-ink/5 shadow-xs space-y-2">
                  <span className="text-[10px] font-mono text-[#A83F1B] uppercase block tracking-wider font-bold">TACTILE TEXTURES</span>
                  <p className="text-xs text-ink leading-relaxed font-sans font-light">
                    {activeStudy.textures || 'Brushed Oak, Travertine'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-ink/5 shadow-xs space-y-2">
                  <span className="text-[10px] font-mono text-[#A83F1B] uppercase block tracking-wider font-bold">RAW INTERIOR INTEGRATION</span>
                  <p className="text-xs text-ink leading-relaxed font-sans font-light">
                    {activeStudy.rawMaterials || 'Brass, Iroko wood'}
                  </p>
                </div>
              </div>

              {/* Wamled Color Swatches Display */}
              {swatchesArray.length > 0 && (
                <div className="pt-6 space-y-2">
                  <span className="text-[10px] font-mono text-[#A83F1B] uppercase block tracking-widest font-extrabold">TACTILE SWATCHES</span>
                  <div className="flex flex-wrap gap-3">
                    {swatchesArray.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-ink/5 rounded-full px-3 py-1.5 shadow-xs">
                        <span className="w-3.5 h-3.5 rounded-full border border-ink/10 inline-block shadow-sm" style={{ backgroundColor: color }} />
                        <span className="text-[9px] font-mono text-ink/60 font-semibold">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Narrative Obstacle block */}
            <div className="lg:col-span-6 bg-amber-50/50 border border-amber-200/60 rounded-3xl p-8 lg:p-10 flex flex-col justify-between text-left shadow-xs">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-700 font-bold">Technical Challenge</span>
                </div>
                <h4 className="text-xl font-serif font-light text-ink uppercase tracking-wide">
                  The Critical Path Obstacle
                </h4>
                <p className="text-xs md:text-sm text-ink/85 font-light leading-relaxed font-sans">
                  {activeStudy.challenge}
                </p>
              </div>
              <div className="pt-6 border-t border-amber-200/50 text-[10px] font-mono text-amber-700/60 tracking-wider uppercase font-bold">
                ENGINEERED SOLUTIONS BY WAMLED ATELIER
              </div>
            </div>
          </div>

          {/* 3. PROCESS & TECHNICAL PROOF: Blueprint -> Render -> Final Photo side-by-side or stacked transition */}
          <div className="mb-20 space-y-8 text-left border-b border-ink/10 pb-16">
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#A83F1B] font-bold">
                03. Spatial Process & Precision Transition
              </h3>
              <p className="text-sm text-ink/70 font-light max-w-2xl leading-relaxed font-sans">
                Our Mombasa studio maps spatial reality across three linear thresholds of proof. This guarantees structural precision and uncompromised aesthetic alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Draft Blueprint */}
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/[0.02] border border-ink/5 relative shadow-xs">
                  <img src={activeStudy.blueprintUrl} alt="2D Blueprint" className="w-full h-full object-cover grayscale brightness-90 filter contrast-125" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-mono tracking-widest text-[#A83F1B] font-extrabold shadow-sm border border-ink/5">01. 2D VECTOR DRAFT</span>
                </div>
                <p className="text-[11px] text-ink/65 leading-relaxed font-sans font-light">
                  Executing rigorous load paths, solar radiation path tracing, and air fluid flow channels.
                </p>
              </div>

              {/* 3D Render */}
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/[0.02] border border-ink/5 relative shadow-xs">
                  <img src={activeStudy.renderUrl} alt="3D Render Simulation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-mono tracking-widest text-[#A83F1B] font-extrabold shadow-sm border border-ink/5">02. 3D RENDER MATCH</span>
                </div>
                <p className="text-[11px] text-ink/65 leading-relaxed font-sans font-light">
                  High-fidelity ambient simulation matching optical properties of custom-imported luxury stone and woods.
                </p>
              </div>

              {/* Final Realized */}
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/[0.02] border border-ink/5 relative shadow-xs">
                  <img src={activeStudy.finalPhotoUrl} alt="Realized Residence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest text-emerald-700 font-bold shadow-sm border border-ink/5">03. ARCHITECTURAL PHOTOGRAPHY</span>
                </div>
                <p className="text-[11px] text-ink/65 leading-relaxed font-sans font-light">
                  The complete masterpiece on Mombasa's shores. Realized with flawless alignment of structural seams.
                </p>
              </div>
            </div>

            {/* Material Spotlight macro segment */}
            {(activeStudy.materialSpotlightDesc || activeStudy.materialSpotlightUrl) && (
              <div className="bg-white border border-ink/5 rounded-3xl p-8 grid md:grid-cols-12 gap-8 items-center mt-8 shadow-xs">
                {activeStudy.materialSpotlightUrl && (
                  <div className="md:col-span-4 aspect-[4/5] rounded-xl overflow-hidden bg-black/10">
                    <img src={activeStudy.materialSpotlightUrl} alt="Material Detail Macro" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="md:col-span-8 space-y-4">
                  <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#A83F1B] font-extrabold block">TACTILE DETAILS SPECIFICATION</span>
                  <h4 className="text-xl md:text-2xl font-serif font-light text-ink uppercase tracking-wider">Material Spotlight Macro View</h4>
                  <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-light font-sans">
                    {activeStudy.materialSpotlightDesc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4. THE "HERO" GALLERY: Full bleed and vertical shots with micro-annotations */}
          {galleryUrlsArray.length > 0 && (
            <div className="mb-20 space-y-8 text-left border-b border-ink/10 pb-16">
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#A83F1B] font-bold">
                  04. Hero Case Record & Micro-Annotations
                </h3>
                <p className="text-sm text-ink/70 font-light max-w-2xl leading-relaxed font-sans">
                  Exploring structural elevations through highly precise micro-annotations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {galleryUrlsArray.map((url, index) => (
                  <div key={index} className="space-y-4">
                    <div className="aspect-[9/16] max-h-[700px] rounded-3xl overflow-hidden bg-black/[0.02] border border-ink/5 relative group shadow-sm">
                      <img src={url} alt={`Gallery vertical visual Record ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" referrerPolicy="no-referrer" />
                      
                      {/* Interactive Micro-annotation badge overlay */}
                      {galleryAnnotationsArray[index] && (
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-ink/5 text-left shadow-md">
                          <span className="text-[9px] font-mono tracking-widest text-[#A83F1B] uppercase block mb-1 font-extrabold">MICRO-ANNOTATION</span>
                          <p className="text-xs text-ink/90 font-light font-sans leading-relaxed">
                            {galleryAnnotationsArray[index]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SOCIAL PROOF & RESULTS */}
          <div className="mb-20 max-w-4xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-ink/5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A83F1B]" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#A83F1B] font-bold">05. Client Validation</span>
            </div>

            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-serif font-light text-ink leading-relaxed italic max-w-3xl mx-auto">
                "{activeStudy.testimonial}"
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-ink/40 font-bold">
                — {activeStudy.testimonialAuthor || 'Verified Client'}
              </p>
            </div>

            {/* Practical Outcome highlight */}
            <div className="p-8 rounded-3xl border border-ink/5 bg-white max-w-xl mx-auto space-y-3 shadow-xs">
              <span className="text-[10px] font-mono tracking-widest text-[#A83F1B] uppercase font-bold block">PROJECT METRIC OUTCOME</span>
              <p className="text-sm font-sans text-ink/75 font-light leading-relaxed">
                {activeStudy.outcome}
              </p>
            </div>
          </div>

          {/* 6. THE "NEXT STEP" CTA */}
          <div className="bg-white border border-ink/5 shadow-xs rounded-3xl p-10 lg:p-16 text-center max-w-3xl mx-auto space-y-8 relative overflow-hidden">
            {/* Soft decorative light path */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A83F1B]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif font-light text-ink uppercase tracking-wider">Let's create your architectural sanctuary</h3>
              <p className="text-xs md:text-sm text-ink/65 font-light max-w-md mx-auto leading-relaxed font-sans">
                Connect with our master planning team to translate premium coastal elevations into structured physical realities.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button 
                onClick={handleBack}
                className="px-6 py-3.5 border border-ink/15 hover:border-ink text-ink/70 hover:text-ink rounded-full font-mono text-[10px] uppercase tracking-widest bg-white transition-all duration-300 cursor-pointer shadow-xs"
              >
                EXPLORE ARCHIVES
              </button>
              <Link 
                to="/#consultation-form-box"
                className="px-8 py-3.5 bg-[#A83F1B] hover:bg-[#8d3212] text-white rounded-full font-mono text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#A83F1B]/15"
              >
                START YOUR STORY <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-ink pt-28 pb-24 relative overflow-hidden">
      {"/* Background Decorative Layer */"}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 animate-pulse">
        <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-[#A83F1B]/5 blur-[120px] pb-1" />
        <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] rounded-full bg-[#C5A059]/5 blur-[150px] pb-1" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title area */}
        <div className="space-y-6 max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink/5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A83F1B]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#1A1A1A]/55 font-bold">Wamled Living Narratives</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] uppercase text-ink">
            Curated <br />
            <span className="italic text-[#A83F1B]">Case</span> Studies
          </h1>
          <p className="text-sm text-ink/70 font-light leading-relaxed max-w-lg font-sans">
            Inside the master blueprints. Explore deep technical records, raw materialism, and spatial challenges solved by our studio across elite East African duplexes and villas.
          </p>
        </div>

        {/* List of Case Studies */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#A83F1B]/30 border-t-[#A83F1B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono tracking-widest uppercase text-ink/40">LOADING CASIER DOSSIERS...</p>
          </div>
        ) : studies.length === 0 ? (
          /* Empty list - showcase the suggested prompt structure with an option to see a live mockup study or add them */
          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="border border-ink/5 bg-white rounded-3xl p-12 lg:p-20 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#A83F1B]/5 border border-[#A83F1B]/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen size={20} className="text-[#A83F1B]" />
              </div>
              <h3 className="text-lg font-serif font-light text-ink mb-2 uppercase tracking-wide">Dynamic Case Studies Empty</h3>
              <p className="text-xs text-ink/65 font-light max-w-xs mx-auto mb-8 leading-relaxed font-sans">
                No case study files have been recorded yet. The owner will manually compile and add narrative case histories through the private Dashboard controller.
              </p>
              <div className="flex flex-col gap-3">
                <Link 
                  to="/admin" 
                  className="bg-[#A83F1B] hover:bg-[#8D3212] text-white py-3.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  ADD CASE STUDY TO DASHBOARD
                  <ArrowRight size={12} />
                </Link>
                <button
                  onClick={() => selectStudy(SUGGESTIONS[0] as CaseStudy)}
                  className="border border-ink/15 hover:border-ink text-ink/70 hover:text-ink py-3 rounded-full font-mono text-[10px] uppercase tracking-widest bg-white transition-colors duration-300 cursor-pointer shadow-xs"
                >
                  PREVIEW EXAMPLE LUXURY CASE STUDY
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Case studies list */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {studies.map(study => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group border border-ink/5 bg-white p-8 lg:p-10 rounded-3xl transition-all duration-500 cursor-pointer flex flex-col justify-between space-y-8 shadow-xs hover:shadow-lg hover:border-brand/20"
                onClick={() => selectStudy(study)}
              >
                <div className="space-y-6">
                  {/* Photo representation */}
                  {study.finalPhotoUrl && (
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-black/[0.02] border border-ink/5 relative">
                      <img src={study.finalPhotoUrl} alt="" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[9px] font-mono tracking-widest font-bold text-ink px-3 py-1 rounded-full uppercase border border-ink/5 shadow-xs">
                        {study.projectType}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex gap-2 text-[10px] font-mono text-[#A83F1B] font-bold">
                      <span>📍 {study.location}</span>
                      <span className="text-ink/20 font-normal">•</span>
                      <span>📏 {study.sqFt}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-light text-ink group-hover:text-[#A83F1B] transition-colors uppercase leading-snug">
                      {study.title}
                    </h3>
                    <p className="text-xs text-ink/70 font-light leading-relaxed line-clamp-3 font-sans">
                      {study.vision}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-ink/5 pt-6 text-[10px] font-mono tracking-widest text-[#A83F1B] font-bold">
                  <span>DISCOVER VISUAL RECORD</span>
                  <span className="transition-transform group-hover:translate-x-1.5 inline-block">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
