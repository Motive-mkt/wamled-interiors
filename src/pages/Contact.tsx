import React, { useState } from 'react';
import { motion } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCMS } from '../components/CMSContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Instagram, 
  Facebook, 
  Mail,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Contact() {
  const { content } = useCMS();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: `Contact Form: ${formData.subject}`,
        details: formData.message,
        status: 'New',
        source: 'contact-page',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-ink pt-28 pb-24 relative overflow-hidden">
      {/* Cinematic grid background accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 relative z-10 w-full mt-8">
        
        {/* Left column: Contact info and hours */}
        <div className="md:col-span- così md:col-span-5 space-y-10 text-left">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/10 border border-ink/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A83F1B]" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold">Atelier Connection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-ink uppercase leading-none">
              Get in <br />
              <span className="italic text-brand font-light">touch.</span>
            </h1>
            
            <p className="text-xs md:text-sm text-ink/75 font-light leading-relaxed max-w-sm">
              Connect with our master planning and curation architects in Mombasa. We craft private luxury spaces aligned to your life.
            </p>
          </div>

          <div className="space-y-8 pt-6 border-t border-ink/10">
            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white border border-ink/5 rounded-2xl shadow-sm text-brand">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold font-mono tracking-widest uppercase text-ink/40">Studio Hotline</p>
                <a 
                  href={`tel:${content.phone.replace(/\s+/g, '')}`} 
                  className="text-lg font-serif font-light text-ink hover:text-brand transition-colors"
                >
                  {content.phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white border border-ink/5 rounded-2xl shadow-sm text-brand">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold font-mono tracking-widest uppercase text-ink/40">Studio Head Office</p>
                <p className="text-sm text-ink/80 leading-relaxed font-sans mt-0.5">
                  Nairobi and Nakuru, Kenya <br />
                  Central & Rift Valley Regions
                </p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white border border-ink/5 rounded-2xl shadow-sm text-brand">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold font-mono tracking-widest uppercase text-ink/40">Atelier Hours</p>
                <p className="text-sm text-ink/80 leading-relaxed font-sans mt-0.5">
                  {content.hours} <br />
                  Private Client Consultations by Appointment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-7 bg-white p-8 lg:p-12 rounded-3xl border border-ink/5 shadow-xl">
          {formStatus === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-[#A83F1B]/10 text-[#A83F1B] rounded-full flex items-center justify-center mx-auto scale-110">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-serif text-ink uppercase tracking-wider">Message Delivered</h2>
              <p className="text-ink/65 text-xs font-light max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to Wamled Studio. A master spatial designer has received your inquiry and will contact you directly within one business day.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-serif font-light text-ink mb-2">Send an Inquiry</h2>
                <p className="text-ink/50 text-xs font-light">Complete the dossier below to dispatch architectural or commercial requests.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">YOUR NAME</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Mwangi" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-ink/10 py-2 text-ink text-sm focus:outline-none focus:border-brand placeholder-ink/20 transition-colors rounded-none"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-bold">EMAIL ADDRESS</label>
                    <input 
                      required
                      type="email" 
                      placeholder="jane@domain.com" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-ink/10 py-2 text-ink text-sm focus:outline-none focus:border-brand placeholder-ink/20 transition-colors rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">PHONE NUMBER</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="07XX XXX XXX" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-ink/10 py-2 text-ink text-sm focus:outline-none focus:border-brand placeholder-ink/20 transition-colors rounded-none"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">SUBJECT OF INQUIRY</label>
                    <div className="relative">
                      <select 
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-transparent border-b border-ink/10 py-2 text-ink text-sm focus:outline-none focus:border-brand appearance-none cursor-pointer rounded-none"
                      >
                        <option value="General Inquiry">General Consultation</option>
                        <option value="Residential Atelier">Atelier Residential Design</option>
                        <option value="Commercial & Hospitality">Commercial & Hospitality</option>
                        <option value="Curated Yacht Deck">Curated Yacht & Exterior</option>
                        <option value="Bespoke Landscaping">Bespoke Landscaping</option>
                      </select>
                      <span className="absolute right-2 top-3 pointer-events-none text-ink/30 text-xs">▼</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">TELL US ABOUT YOUR SPACE</label>
                  <textarea 
                    required
                    placeholder="Describe your current site, dimensions, and visual aesthetic target..." 
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-1 text-ink text-sm focus:outline-none focus:border-brand placeholder-ink/20 transition-colors resize-none rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#A83F1B] hover:bg-[#8D3212] text-white py-4 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-1.5 mt-6 shadow-sm"
                >
                  {formStatus === 'submitting' ? 'TRANSMITTING...' : 'DISPATCH INQUIRY'}
                  <Send size={12} className="text-white" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
