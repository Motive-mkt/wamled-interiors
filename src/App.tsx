/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { CMSProvider, useCMS } from './components/CMSContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { BrandValues } from './components/BrandValues';
import { WhyUsStats } from './components/WhyUsStats';
import { ServiceStacks } from './components/ServiceStacks';
import { EnterpriseBridge } from './components/EnterpriseBridge';
import { ClientReviewsSlider } from './components/ClientReviewsSlider';
import { BentoGalleryGateway } from './components/BentoGalleryGateway';

// Performance Optimization: Code-Split page nodes dynamically
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CaseStudies = React.lazy(() => import('./pages/CaseStudies'));
const Filmstrip = React.lazy(() => import('./pages/Filmstrip'));
const ServiceDetail = React.lazy(() => import('./pages/ServiceDetail'));
const BespokeServices = React.lazy(() => import('./pages/BespokeServices'));
import { 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Star, 
  Home, 
  Building2, 
  Sparkles, 
  Layout, 
  Lamp, 
  PaintBucket,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ShoppingBag,
  AlertCircle,
  ArrowUp,
  Image as ImageIcon
} from 'lucide-react';

// --- Helpers ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { content } = useCMS();
  const { user, role } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <>
      <Link 
        to="/services" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-xs font-sans font-medium tracking-widest transition-colors duration-300 ${
          mobile ? 'py-3 text-lg text-[#000000] hover:opacity-80' : 'text-[#000000] hover:opacity-80'
        }`}
      >
        Services
      </Link>
      <Link 
        to="/portfolio" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-xs font-sans font-medium tracking-widest transition-colors duration-300 ${
          mobile ? 'py-3 text-lg text-[#000000] hover:opacity-80' : 'text-[#000000] hover:opacity-80'
        }`}
      >
        Portfolio
      </Link>
      <Link 
        to="/casestudies" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-xs font-sans font-medium tracking-widest transition-colors duration-300 ${
          mobile ? 'py-3 text-lg text-[#000000] hover:opacity-80' : 'text-[#000000] hover:opacity-80'
        }`}
      >
        Case Studies
      </Link>
      <Link 
        to="/filmstrip" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-xs font-sans font-medium tracking-widest transition-colors duration-300 ${
          mobile ? 'py-3 text-lg text-[#000000] hover:opacity-80' : 'text-[#000000] hover:opacity-80'
        }`}
      >
        Work
      </Link>
      <Link 
        to="/contact" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-xs font-sans font-medium tracking-widest transition-colors duration-300 ${
          mobile ? 'py-3 text-lg text-[#000000] hover:opacity-80' : 'text-[#000000] hover:opacity-80'
        }`}
      >
        Contact
      </Link>
      <Link 
        to="/" 
        onClick={() => {
          setIsMobileMenuOpen(false);
          const el = document.getElementById('reviews-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`text-xs font-sans font-medium tracking-widest transition-colors duration-300 ${
          mobile ? 'py-3 text-lg text-[#000000] hover:opacity-80' : 'text-[#000000] hover:opacity-80'
        }`}
      >
        Reviews
      </Link>
    </>
  );

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 top-0 ${isScrolled ? 'bg-[#F9F9F7]/95 backdrop-blur-md py-4 border-b border-ink/5 shadow-md' : 'bg-[#F9F9F7]/90 py-7 border-b border-black/10'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="transition-colors duration-500">
            <Link to="/" className="flex items-center gap-3 select-none text-[#000000]">
              {/* Empty padded image container on the left */}
              <div className="w-10 h-10 border border-dashed border-black/30 rounded flex-shrink-0 flex items-center justify-center bg-transparent" aria-hidden="true" />
              
              {/* 3-line vertically stacked text */}
              <div className="flex flex-col text-left font-sans font-black tracking-widest text-[#000000]" style={{ fontSize: '9px', lineHeight: '10px' }}>
                <span>WAMLED</span>
                <span>INTERIORS</span>
                <span>DESIGNS</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
            <Link 
              to="/admin" 
              className="flex items-center gap-2 text-[10px] font-mono tracking-wider px-4 py-2 rounded-lg border border-black/20 text-[#000000] hover:bg-black/5 transition-all duration-300"
            >
              <Layout size={12} className="text-[#000000]" />
              DASHBOARD
            </Link>
            <a 
              href={`tel:${content.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-xs font-sans tracking-wide px-4 py-2 rounded-full border border-black/20 text-[#000000] bg-transparent hover:bg-black/5 transition-all duration-300"
            >
              <Phone size={12} className="text-[#000000]" />
              {content.phone}
            </a>
          </div>

          <button 
            className="md:hidden p-2 rounded-lg text-[#000000] hover:bg-black/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-[#F9F9F7]/98 pt-28 px-6 flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col gap-8 text-center items-center">
              <NavLinks mobile />
              <a 
                href={`tel:${content.phone.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-3 bg-brand text-white py-4 rounded-xl font-bold font-mono text-xs uppercase tracking-widest hover:bg-ink transition-colors shadow-sm"
              >
                <Phone size={14} />
                {content.phone}
              </a>
            </div>
            <div className="text-center font-mono text-[10px] text-ink/40 uppercase tracking-widest">
              Wamled Atelier Nairobi & Nakuru
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { content } = useCMS();
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'Residential',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        status: 'New',
        source: 'homepage-consultation',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 6000);
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
    }
  };

  return (
    <section className="relative min-h-[95vh] flex items-center pt-28 pb-16 bg-[#1A1A1A] text-white overflow-hidden animate-fade-in animate-duration-1000">
      {/* Background Cinematic Texture & Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={content.heroImage} 
          alt="Luxury coastal interior design studio space"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Scrim Overlay: modern gradient mask so the image features on the right stay perfectly clear & bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A83F1B]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFFFFF] font-extrabold select-none">NAIROBI & NAKURU, KENYA</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.1] text-white tracking-tight select-none whitespace-pre-line">
              {content.heroHeadline || "Interiors crafted\naround the\nway you live."}
            </h1>
            <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#A83F1B] uppercase font-bold pt-2">
              {content.heroSubheadline || "CONSOULT . DESIGN . BUILD"}
            </p>
          </div>
          
          <p className="text-sm md:text-base text-[#F9F9F9]/90 max-w-xl leading-relaxed font-light">
            Bespoke residential and commercial interior design from Nairobi and Nakuru studios with a reputation for quality, structure and quiet sophistication.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a 
              href={content.heroCtaUrl || "#consultation-form-box"} 
              className="inline-flex items-center gap-2 bg-[#A83F1B] hover:bg-[#8d3212] active:bg-[#6c230a] text-white px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              EXPLORE THE PROCESS
              <span className="text-white">→</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 items-center pt-8 border-t border-white/10 text-[11px] text-[#FFFFFF] font-mono tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">★</span>
              <span className="font-semibold text-white/90">5.0 rated studio</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-[#888888]" />
              <span className="font-semibold text-white/90">Moi Avenue</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[#888888]" />
              <span className="font-semibold text-white/90">Open until 8:00 PM</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          id="consultation-form-box"
          className="lg:col-span-5 bg-[#FDFDFD] p-10 lg:p-12 rounded-3xl border border-gray-100 shadow-2xl max-w-md lg:ml-auto w-full relative animate-fade-in"
        >
          {formStatus === 'success' ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-[#A83F1B]/10 text-[#A83F1B] rounded-full flex items-center justify-center mx-auto scale-110">
                <Star size={30} className="fill-current animate-pulse" />
              </div>
              <h2 className="text-2xl font-serif text-[#111111] uppercase tracking-wider">Success</h2>
              <p className="text-gray-500 text-xs font-light max-w-xs mx-auto">We've received your request. A lead architect will contact you directly within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-serif font-light text-[#111111] mb-2 text-left">Book a free consultation</h2>
              <p className="text-[#888888] text-xs font-light mb-8 text-left">We'll respond within one business day.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-bold">FULL NAME</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Mwangi" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-200 py-2 text-[#111111] text-sm focus:outline-none focus:border-[#A83F1B] placeholder-gray-400 transition-colors rounded-none"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-bold font-sans">PHONE</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="07XX XXX XXX" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-200 py-2 text-[#111111] text-sm focus:outline-none focus:border-[#A83F1B] placeholder-gray-400 transition-colors rounded-none"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-bold">PROJECT TYPE</label>
                  <div className="relative">
                    <select 
                      value={formData.projectType}
                      onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-200 py-2 text-[#111111] text-sm focus:outline-none focus:border-[#A83F1B] appearance-none cursor-pointer rounded-none"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial & Hospitality</option>
                      <option value="Yacht & Exterior">Curated Yacht & Exterior</option>
                      <option value="Landscaping">Bespoke Landscaping</option>
                    </select>
                    <span className="absolute right-2 top-3 pointer-events-none text-gray-400 text-xs">▼</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-bold">TELL US ABOUT YOUR SPACE (OPTIONAL)</label>
                  <textarea 
                    placeholder="A 3-bedroom apartment in Nyali..." 
                    rows={1}
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-200 py-1 text-[#111111] text-sm focus:outline-none focus:border-[#A83F1B] placeholder-gray-400 transition-colors resize-none rounded-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#A83F1B] hover:bg-[#8d3212] text-white py-4 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-1 mt-4"
                >
                  {formStatus === 'submitting' ? 'TRANSMITTING...' : 'REQUEST CONSULTATION'}
                  <span className="text-white ml-1">→</span>
                </button>
              </form>
              <div className="text-center pt-4">
                <p className="text-[11px] text-[#888888] font-light">
                  Or call <a href={`tel:${content.phone.replace(/\s+/g, '')}`} className="underline hover:text-[#A83F1B] transition-colors font-semibold">{content.phone}</a>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { content } = useCMS();

  const trackWhatsApp = async () => {
    try {
      await addDoc(collection(db, 'leads'), {
        name: 'WhatsApp Click',
        phone: 'See WhatsApp Link',
        projectType: 'Direct Message',
        details: 'User initiated WhatsApp conversation',
        status: 'New',
        source: 'whatsapp-footer',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
    window.open(`https://wa.me/${content.phone.replace(/\s+/g, '').replace(/^0/, '254')}`, '_blank');
  };

  return (
    <footer 
      className="bg-[#A83F1B] text-white py-24 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px, 40px 40px, 40px 40px'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 block font-bold">
          BEGIN YOUR PROJECT
        </span>
        
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white leading-[1.15] max-w-5xl mx-auto">
          Let's design <span className="italic font-normal">something remarkable.</span>
        </h2>
        
        <p className="text-white/80 text-xs sm:text-sm md:text-base font-sans font-light max-w-2xl mx-auto leading-relaxed">
          Tell us about your space. We'll come back with a clear plan, an honest timeline, and a vision worth committing to.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 max-w-lg mx-auto">
          <a 
            href={`tel:${content.phone}`} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#A83F1B] px-8 py-4 rounded-xl font-mono text-[11px] uppercase tracking-widest font-bold transition-all hover:bg-white/90 shadow-lg cursor-pointer"
          >
            <Phone size={13} className="fill-[#A83F1B]" />
            {content.phone || '0723 758 595'}
          </a>
          
          <button 
            onClick={trackWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white bg-transparent hover:bg-white/5 px-8 py-4 rounded-xl font-mono text-[11px] uppercase tracking-widest font-bold transition-all cursor-pointer"
          >
            MESSAGE ON WHATSAPP
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Subtle separator */}
        <div className="pt-12">
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Stats & Navigation columns */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 text-left w-full md:w-auto">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-white/55 tracking-widest uppercase block font-bold">
                LOCATION
              </span>
              <span className="text-xs md:text-sm font-sans font-medium text-white block">
                {content.location || 'Nairobi and Nakuru, Kenya'}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-white/55 tracking-widest uppercase block font-bold">
                HOURS
              </span>
              <span className="text-xs md:text-sm font-sans font-medium text-white block">
                {content.hours || 'Open until 8:00 PM'}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-white/55 tracking-widest uppercase block font-bold">
                CONSULTATION
              </span>
              <span className="text-xs md:text-sm font-sans font-medium text-white block">
                Free first consultation
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end md:items-center gap-6 justify-between w-full md:w-auto">
            <div className="flex flex-wrap gap-4 text-[9px] font-mono tracking-widest text-white/50 uppercase">
              <Link to="/portfolio" className="hover:text-white transition-colors">PORTFOLIO</Link>
              <Link to="/casestudies" className="hover:text-white transition-colors">CASE STUDIES</Link>
              <Link to="/contact" className="hover:text-white transition-colors">CONTACT</Link>
              <Link to="/admin" className="hover:text-white transition-colors">ADMIN</Link>
            </div>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white rounded-lg transition-all cursor-pointer self-end md:self-auto"
              aria-label="Scroll to top"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const NotFound = () => (
  <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-6 text-center text-ink relative">
    <div className="absolute inset-0 bg-cream/10 bg-[radial-gradient(ellipse_at_top,rgba(168,63,27,0.025),transparent_75%)] pointer-events-none" />
    <div className="bg-white border border-ink/10 p-12 rounded-3xl shadow-xl max-w-md w-full relative z-10">
      <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-8">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-4xl font-serif font-light mb-4 text-ink">404</h1>
      <p className="text-ink/65 text-xs font-light mb-10 leading-relaxed">The luxury editorial segment or architectural study could not be matched.</p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-ink transition-colors shadow-sm"
      >
        <Home size={12} />
        RETURN HOME
      </Link>
    </div>
  </div>
);

const GoogleMapSection = () => {
  return (
    <section className="py-20 bg-[#F9F9F7] px-6 border-t border-ink/5">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-ink/10">
          <div className="space-y-2 text-left">
            <span className="text-brand font-mono tracking-[0.4em] text-[10px] uppercase font-bold">STUDIO LATITUDE</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-ink uppercase tracking-tight">Our Nairobi & Nakuru Headquarters</h2>
          </div>
          <div className="text-left font-mono text-[10px] text-ink/50 tracking-wider">
            <span>📍 NAIROBI & NAKURU, KENYA</span> <br className="hidden md:inline" />
            <span className="md:ml-2 text-brand font-semibold">S 1° 17' 24'' / E 36° 49' 12''</span>
          </div>
        </div>
        
        <div className="w-full h-[450px] md:h-[550px] rounded-3xl overflow-hidden border border-ink/15 shadow-xl relative group">
          <iframe 
            title="Wamled Atelier Nairobi and Nakuru Headquarters Map"
            src="https://maps.google.com/maps?q=Nairobi%20and%20Nakuru%20Kenya&t=&z=9&ie=UTF8&iwloc=&output=embed" 
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700 brightness-95 hover:brightness-100"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Subtle design overlays to match the premium theme */}
          <div className="absolute top-6 left-6 bg-ink/95 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white text-left shadow-2xl pointer-events-none max-w-xs space-y-2.5 hidden sm:block">
            <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase block font-bold">Atelier Locations</span>
            <p className="text-xs font-serif font-light leading-relaxed text-white/80">
              Our master ateliers are beautifully situated in Nairobi and Nakuru. Reach out to coordinate an on-site spatial consultation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <div className="bg-[#F9F9F7]">
      <Hero />
      <ServiceStacks />
      <BrandValues />
      <WhyUsStats />
      <EnterpriseBridge />
      <ClientReviewsSlider />
      <BentoGalleryGateway />
      <GoogleMapSection />
      <Footer />
    </div>
  );
};

const PremiumFallbackLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#F9F9F7] text-[#1A1A1A] select-none">
    <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
      <div className="w-10 h-10 border-2 border-[#C5A059]/35 border-t-[#C5A059] rounded-full animate-spin" />
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-[0.3em] text-[#C5A059] uppercase block font-semibold">Wamled Atelier</span>
        <span className="text-[10px] text-[#1A1A1A]/45 tracking-widest uppercase block">Refining Spatial Architecture...</span>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CMSProvider>
          <ScrollToTop />
          <Navbar />
          <React.Suspense fallback={<PremiumFallbackLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/filmstrip" element={<Filmstrip />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/casestudies" element={<CaseStudies />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<BespokeServices />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </React.Suspense>
        </CMSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


