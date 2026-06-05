import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, User, Phone, Briefcase, Star, CheckCircle, Mail } from 'lucide-react';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { STUDIO_SERVICES } from '../data/studioData';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, 'services', id);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setService({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Fallback to static pre-seeded service items
        const staticService = STUDIO_SERVICES.find(s => s.id === id);
        if (staticService) {
          setService(staticService);
        } else {
          setService(null);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching service details:", error);
      // Fallback on error
      const staticService = STUDIO_SERVICES.find(s => s.id === id);
      setService(staticService || null);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-6 text-center text-ink">
        <div className="w-10 h-10 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
        <span className="text-xs font-mono tracking-widest text-ink/40 uppercase">Loading Atelier Context...</span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-cream text-ink flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-serif mb-4">Service Not Found</h1>
        <p className="text-sm text-ink/65 mb-8 max-w-sm">We couldn't locate the elite architectural service you requested.</p>
        <Link to="/" className="bg-brand text-white my-4 px-8 py-3 rounded-full font-sans uppercase tracking-widest text-xs font-bold hover:bg-ink hover:text-white transition-colors">
          Back to Studio
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        details: `Service Interest: ${service.title}. Notes: ${formData.notes}`,
        projectType: service.title,
        status: 'New',
        source: 'service-detail-booking',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setTimeout(() => setFormStatus('idle'), 7000);
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-ink relative overflow-x-hidden">
      {/* Background Grid Pattern & Subtle radial glow */}
      <div className="absolute inset-0 bg-cream/10 bg-[radial-gradient(ellipse_at_top,rgba(168,63,27,0.02),transparent_70%)] pointer-events-none" />
      
      {/* Visual Navigation Header bar */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-8 flex justify-between items-center z-20 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-ink/50 hover:text-brand uppercase transition-colors"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          BACK TO GALLERY
        </button>
        <span className="text-[10px] font-mono tracking-[0.3em] text-brand font-semibold uppercase">
          Wamled Design Detail
        </span>
      </div>

      {/* Main Narrative Hero Area with Portrait Imagery */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait 9:16 Header Image representing modern editorial covers */}
          <div className="lg:col-span-5 relative aspect-[9/16] rounded-3xl overflow-hidden border border-ink/10 group shadow-2xl bg-cream/30">
            {service.image ? (
              <motion.img 
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src={service.image} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-x-0 inset-y-0 bg-[#F5F5F0] border-2 border-dashed border-ink/15 rounded-3xl flex flex-col items-center justify-center p-6 text-center text-ink/30">
                <Briefcase className="mb-2 text-ink/20 animate-pulse" size={40} />
                <span className="text-xs font-mono tracking-widest font-black uppercase">Atelier Image Frame</span>
                <span className="text-[10px] text-ink/40 font-mono mt-2 leading-relaxed">Dynamic layout empty frame for<br />{service.title}</span>
              </div>
            )}
            {/* Elegant vignette edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-6 border border-white/5 group-hover:border-brand/35 transition-all duration-700 pointer-events-none rounded-2xl" />
          </div>

          {/* Solution Narrative Text block */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-brand font-mono font-semibold">STUDIO ARCHITECTURE</span>
              <span className="h-px bg-brand/30 w-12" />
              <span className="text-xs text-ink/40 font-mono">WAMLED ATELIER</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-light leading-tight tracking-tight text-ink capitalize">
              {service.title}
            </h1>
            
            <p className="text-lg text-brand font-mono tracking-wider font-light uppercase font-semibold">
              {service.subtitle}
            </p>

            <div className="h-px bg-ink/10 my-6" />

            <div className="space-y-6">
              <span className="text-[10px] font-mono tracking-[0.34em] text-ink/40 uppercase block">The Solution Story</span>
              <h2 className="text-xl md:text-2xl font-serif font-light italic text-ink/85 leading-relaxed">
                "{service.solutionStory.heading}"
              </h2>

              <div className="space-y-4 text-ink/70 font-light text-sm md:text-base leading-relaxed">
                {service.solutionStory.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Custom Accentered Sub Services list */}
            <div className="bg-white p-8 rounded-2xl border border-ink/5 space-y-6 mt-8 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-brand uppercase block font-semibold">Specialist Sub-Disciplines Included</span>
              <div className="grid md:grid-cols-2 gap-6">
                {service.subServices.map((sub, sidx) => (
                  <div key={sidx} className="space-y-1">
                    <span className="text-xs font-sans font-semibold text-ink block">{sub.name}</span>
                    <span className="text-xs text-ink/60 font-light leading-relaxed block">{sub.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* The Process (01-04) Numbered Horizontal Timeline */}
      <section className="py-24 bg-cream/15 border-t border-b border-ink/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-16">
            <div>
              <span className="text-brand font-mono tracking-[0.4em] text-[10px] uppercase mb-2 block font-semibold">Our Design Roadmap</span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-ink leading-tight">
                The Architectural Process
              </h2>
            </div>
            <p className="text-xs text-ink/65 max-w-xs leading-relaxed font-light">
              We guide each luxury client seamlessly through four custom phases of development to match global luxury expectations.
            </p>
          </div>

          {/* Process Timeline Rows */}
          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
            <div className="hidden md:block absolute top-[50px] left-0 right-0 h-px bg-ink/10 z-0" />
            
            {service.processSteps.map((step, sidx) => (
              <div key={sidx} className="relative z-10 space-y-6 flex flex-col justify-start">
                {/* Massive Number representation */}
                <div className="w-16 h-16 rounded-full bg-white border border-ink/10 flex items-center justify-center font-serif text-2xl font-light text-brand hover:border-brand transition-colors shadow-md">
                  {step.number}
                </div>
                
                <div className="space-y-2 pr-4">
                  <h4 className="text-md font-sans font-bold uppercase tracking-wider text-ink">
                    {step.title}
                  </h4>
                  <p className="text-xs tracking-wide text-ink/65 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Touch Private Consultation CTA and Form Section */}
      <section className="py-28 bg-cream/25 border-t border-ink/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative Block */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-ink/10 rounded-full font-mono text-[9px] uppercase tracking-widest text-brand font-semibold shadow-sm">
                <Calendar size={10} />
                Private Consultation Scheduler
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight text-ink">
                Book a Private <br />
                <span className="italic text-ink/65">Consultation Session</span>
              </h2>

              <p className="text-ink/75 text-xs md:text-sm font-light leading-relaxed max-w-md">
                We invite discerning owners to schedule private consultations at our prominent Nairobi or Nakuru design studios, or securely via digital video link. Let us outline a masterwork tailored precisely to your land or structural dimensions.
              </p>

              <div className="space-y-4 pt-4 border-t border-ink/5 text-xs text-ink/60 font-light">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  <span>Exclusive material and marble library preview.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  <span>Complementary spatial audit and draft study review.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  <span>Toleranced site assessment against marine sea salt elements.</span>
                </div>
              </div>
            </div>

            {/* Right clean, minimal high-touch Form (Maximum 4 Fields) */}
            <div className="lg:col-span-6">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-ink/5 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {formStatus === 'success' ? (
                    <motion.div 
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-16 text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto scale-110">
                        <CheckCircle size={36} />
                      </div>
                      
                      <h3 className="text-3xl font-serif font-light text-ink tracking-wide">
                        Session Requested
                      </h3>
                      
                      <p className="text-xs text-ink/65 max-w-sm mx-auto leading-relaxed font-light">
                        Thank you for your interest. A lead architect from Wamled Studio will privately contact you within 24 hours to coordinate dates and spatial preferences.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="consultation-form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <h4 className="text-xs uppercase font-mono tracking-widest text-ink/40 border-b border-ink/5 pb-4">
                        Secure Client Entry Form
                      </h4>

                      {/* Field 1: Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand font-semibold">Full Name / Corporate Officer</label>
                        <div className="relative">
                          <input 
                            required
                            type="text" 
                            placeholder="Almasi M. G."
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-cream/40 border border-ink/10 rounded-xl px-4 py-3 placeholder-ink/20 text-sm text-ink focus:outline-none focus:border-brand transition-all"
                          />
                          <User size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20" />
                        </div>
                      </div>

                      {/* Field 2: Email */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand font-semibold">Direct Email Address</label>
                        <div className="relative">
                          <input 
                            required
                            type="email" 
                            placeholder="almasi@villas.co.ke"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-cream/40 border border-ink/10 rounded-xl px-4 py-3 placeholder-ink/20 text-sm text-ink focus:outline-none focus:border-brand transition-all"
                          />
                          <Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20" />
                        </div>
                      </div>

                      {/* Field 3: Phone */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand font-semibold">Encrypted Mobile / WhatsApp Contact</label>
                        <div className="relative">
                          <input 
                            required
                            type="tel" 
                            placeholder="07XX XXX XXX"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-cream/40 border border-ink/10 rounded-xl px-4 py-3 placeholder-ink/20 text-sm text-ink focus:outline-none focus:border-brand transition-all"
                          />
                          <Phone size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20" />
                        </div>
                      </div>

                      {/* Field 4: Notes */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand font-semibold">Spatial Vision & Details (Optional)</label>
                        <textarea 
                          rows={3}
                          placeholder="A 4-acre marine pool pavilion setup in Nyali..."
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full bg-cream/40 border border-ink/10 rounded-xl px-4 py-3 placeholder-ink/20 text-sm text-ink focus:outline-none focus:border-brand transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full bg-brand hover:bg-ink text-white hover:text-white py-4 rounded-xl font-mono text-xs uppercase tracking-widest font-bold font-sans transition-all duration-300 disabled:opacity-50 hover:scale-[1.01]"
                      >
                        {formStatus === 'submitting' ? 'SECURE SENDING...' : 'REQUEST SECURE RESERVATION'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
export default ServiceDetail;
