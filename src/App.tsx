/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { CMSProvider, useCMS } from './components/CMSContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
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
      <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium hover:text-brand transition-colors ${!isScrolled && !mobile ? 'text-white' : 'text-ink'}`}>Services</a>
      <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium hover:text-brand transition-colors ${!isScrolled && !mobile ? 'text-white' : 'text-ink'}`}>Shop</a>
      <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium hover:text-brand transition-colors ${!isScrolled && !mobile ? 'text-white' : 'text-ink'}`}>Work</a>
      <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium hover:text-brand transition-colors ${!isScrolled && !mobile ? 'text-white' : 'text-ink'}`}>Reviews</a>
      
      {user && role && (
        <Link 
          to="/admin" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            !isScrolled && !mobile
              ? 'border-white/20 text-white hover:bg-white/10' 
              : 'border-brand/20 text-brand hover:bg-brand/5'
          }`}
        >
          <Layout size={16} />
          DASHBOARD
        </Link>
      )}
    </>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className={`text-2xl font-semibold serif tracking-tight decoration-brand underline underline-offset-4 transition-colors ${!isScrolled ? 'text-white' : 'text-ink'}`}>
            <Link to="/">Wamled<span className="text-brand">.</span></Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
            <a 
              href={`tel:${content.phone.replace(/\s+/g, '')}`}
              className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all ${
                !isScrolled 
                  ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm' 
                  : 'bg-brand text-white hover:bg-brand/90'
              }`}
            >
              <Phone size={16} />
              {content.phone}
            </a>
          </div>

          <button 
            className={`md:hidden p-2 rounded-lg transition-colors ${!isScrolled ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-gray-100'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="fixed inset-0 z-40 md:hidden bg-white pt-24 px-6"
          >
            <div className="flex flex-col gap-8 text-center items-center">
              <NavLinks mobile />
              <a 
                href={`tel:${content.phone.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-3 bg-brand text-white py-4 rounded-xl font-bold"
              >
                <Phone size={18} />
                {content.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { content } = useCMS();
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
        source: 'form',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
    }
  };


  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={content.heroImage} 
          alt="Modern living space"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-ink/40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest">Mombasa, Kenya</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl serif font-medium leading-[1.1] mb-8 text-balance">
            {content.heroHeadline.split(' ').map((word, i) => (
              word.toLowerCase() === 'crafted' ? <span key={i} className="italic text-brand/90"> {word} </span> : word + ' '
            ))}
          </h1>
          
          <p className="text-lg text-white/80 max-w-lg mb-10 leading-relaxed font-light">
            Bespoke residential and commercial interior design from a Mombasa studio with a reputation for quality, structure and quiet sophistication.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span>5.0 rated studio</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} className="text-brand" />
              <span>{content.location.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock size={16} className="text-brand" />
              <span>{content.hours}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-cream p-8 lg:p-10 rounded-2xl shadow-2xl max-w-md ml-auto"
        >
          {formStatus === 'success' ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto scale-110">
                <Star size={32} className="fill-current" />
              </div>
              <h2 className="text-2xl serif font-medium text-ink">Thank you!</h2>
              <p className="text-ink/60 text-sm">We've received your inquiry and will contact you shortly.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl serif font-medium mb-2 text-ink">Book a free consultation</h2>
              <p className="text-ink/60 text-sm mb-8">We'll respond within one business day.</p>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Mwangi" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-2 text-ink focus:outline-none focus:border-brand transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Phone</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="07XX XXX XXX" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-2 text-ink focus:outline-none focus:border-brand transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Project Type</label>
                  <select 
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-2 text-ink focus:outline-none focus:border-brand transition-colors text-sm appearance-none"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Tell us about your space (Optional)</label>
                  <textarea 
                    placeholder="A 3-bedroom apartment in Nyali..." 
                    rows={2}
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-2 text-ink focus:outline-none focus:border-brand transition-colors text-sm resize-none"
                  />
                </div>
                
                <button 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-brand text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-lg hover:shadow-brand/20 mt-4 group disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? 'SENDING...' : 'REQUEST CONSULTATION'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-ink/40 mt-4">
                  Or call <a href={`tel:${content.phone}`} className="underline hover:text-brand transition-colors">{content.phone}</a>
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('residential') || t.includes('home')) return <Home className="text-brand" size={24} />;
    if (t.includes('commercial') || t.includes('office')) return <Building2 className="text-brand" size={24} />;
    if (t.includes('styling') || t.includes('curated')) return <Sparkles className="text-brand" size={24} />;
    if (t.includes('space') || t.includes('layout')) return <Layout className="text-brand" size={24} />;
    if (t.includes('furniture') || t.includes('decor')) return <Lamp className="text-brand" size={24} />;
    return <PaintBucket className="text-brand" size={24} />;
  };

  if (loading) return null;
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 mb-20 items-end">
          <div>
            <span className="text-brand font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">OUR SERVICES</span>
            <h2 className="text-4xl md:text-6xl serif font-medium text-ink leading-tight">
              A structured, professional approach to every interior.
            </h2>
          </div>
          <p className="text-ink/60 max-w-md leading-relaxed">
            From the first sketch to the final styled vignette, we deliver interiors that are functional, considered and built to last — for homes and businesses across the Kenyan coast.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:shadow-md transition-shadow">
                {getIcon(service.title)}
              </div>
              <h3 className="text-xl font-medium serif mb-3 text-ink group-hover:text-brand transition-colors">{service.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">THE SHOP</span>
          <h2 className="text-4xl md:text-6xl serif font-medium text-ink">Curated Pieces.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-cream/30 rounded-3xl p-8 border border-transparent hover:border-brand/10 transition-all hover:bg-cream/50"
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand">
                  <ShoppingBag size={24} />
                </div>
                <span className="text-xl font-bold text-ink">KSh {Number(product.price).toLocaleString()}</span>
              </div>
              <h3 className="text-xl font-bold serif mb-3 text-ink">{product.name}</h3>
              <p className="text-ink/60 text-sm mb-8 leading-relaxed line-clamp-3">{product.description}</p>
              
              <a 
                href={`https://wa.me/254723758595?text=Hi, I'm interested in the ${product.name}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-ink text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:bg-brand"
              >
                ENQUIRE NOW
                <ArrowRight size={18} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const { content } = useCMS();
  const isEmpty = content.galleryImages.length === 0;
  
  return (
    <section id="gallery" className="py-24 bg-white/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <span className="text-brand font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">SELECTED WORK</span>
            <h2 className="text-4xl md:text-6xl serif font-medium text-ink">Recent interiors.</h2>
          </div>
          <p className="text-ink/60 max-w-xs leading-relaxed text-sm md:text-base">
            A glimpse of homes and spaces shaped by the Wamled studio.
          </p>
        </div>

        {isEmpty ? (
          <div className="py-24 text-center border-2 border-dashed border-ink/10 rounded-3xl bg-cream/30">
            <ImageIcon className="mx-auto text-ink/20 mb-4" size={48} />
            <p className="text-ink/40 font-medium italic">Our portfolio is being updated. No images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {content.galleryImages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden group rounded-2xl aspect-[3/4] md:aspect-[3/4]"
              >
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Reviews = () => {
  const { content } = useCMS();

  return (
    <section id="reviews" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center mb-12">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
          </div>
          <span className="text-brand font-bold text-[10px] uppercase tracking-[0.3em] mb-6 block">5.0 STUDIO RATING</span>
          <h2 className="text-4xl md:text-6xl serif font-medium text-ink max-w-3xl mx-auto leading-tight">
            Trusted by clients who care about the details.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.reviews.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl text-left border border-ink/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-ink/80 italic mb-8 leading-relaxed font-light serif text-lg text-balance">
                  "{testimonial.text}"
                </p>
              </div>
              <div className="pt-6 border-t border-ink/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{testimonial.author}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { content } = useCMS();

  const trackWhatsApp = async () => {
    try {
      await addDoc(collection(db, 'leads'), {
        name: 'WhatsApp Inquiry',
        phone: 'See WhatsApp',
        projectType: 'Direct Message',
        details: 'User clicked WhatsApp button',
        status: 'New',
        source: 'whatsapp',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
    window.open(`https://wa.me/${content.phone.replace(/\s+/g, '').replace(/^0/, '254')}`, '_blank');
  };

  const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      default: return null;
    }
  };

  return (
    <footer className="bg-brand text-white py-24 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] h-full">
          {[...Array(400)].map((_, i) => (
            <div key={i} className="border-r border-b border-white flex items-center justify-center h-12 w-full text-[6px]">
              +
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <span className="text-white/60 font-bold text-[10px] uppercase tracking-[0.4em] mb-8 block">BEGIN YOUR PROJECT</span>
        <h2 className="text-5xl md:text-8xl serif font-medium mb-8 leading-[1.1] text-balance">
          Let's design <span className="italic text-white opacity-90">something remarkable.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
          Tell us about your space. We'll come back with a clear plan, an honest timeline, and a vision worth committing to.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-20">
          <a 
            href={`tel:${content.phone}`} 
            className="group flex items-center gap-3 bg-white text-brand px-10 py-5 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-105 shadow-xl"
          >
            <Phone size={18} />
            {content.phone}
          </a>
          <button 
            onClick={trackWhatsApp}
            className="flex items-center gap-3 bg-transparent border border-white/30 text-white px-10 py-5 rounded-xl font-bold text-sm tracking-wide transition-all hover:bg-white/10 group"
          >
            MESSAGE ON WHATSAPP
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-12 pt-16 border-t border-white/20 items-start">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">LOCATION</span>
            <span className="font-medium text-sm">{content.location}</span>
          </div>
          <div className="flex flex-col items-center sm:items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">HOURS</span>
            <span className="font-medium text-sm">{content.hours}</span>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">CONSULTATION</span>
            <span className="font-medium text-sm">Free first consultation</span>
          </div>
        </div>

        <div className="mt-24 pt-8 text-[10px] font-bold uppercase tracking-widest text-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <span>© 2024 WAMLED STUDIO INTERIORS.</span>
            <div className="flex gap-4">
              {content.socialLinks.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-white hover:text-white/60 transition-colors">
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-8">
            <Link to="/admin" className="hover:text-white transition-colors">ADMIN</Link>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const NotFound = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
    <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full">
      <div className="w-20 h-20 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-8">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-4xl font-bold serif mb-4">404</h1>
      <p className="text-ink/60 mb-10">We couldn't find the page you're looking for. It might have been moved or deleted.</p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-xl font-bold hover:bg-brand/90 transition-all"
      >
        <Home size={18} />
        BACK HOME
      </Link>
    </div>
  </div>
);

// --- Main App ---

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 1000);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-cream/20">
      <Hero />
      <Services />
      <Products />
      <Gallery />
      <Reviews />
      <Footer />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-4 bg-brand text-white rounded-2xl shadow-2xl shadow-brand/40 hover:scale-110 transition-transform"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CMSProvider>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </CMSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

