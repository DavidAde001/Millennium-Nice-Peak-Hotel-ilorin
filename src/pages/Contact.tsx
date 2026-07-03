import React, { useState } from 'react';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { dbService } from '../lib/db';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dbService.createContact(formData);
      toast.success("Thank you for your message. We will get back to you shortly.");
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="pt-32 pb-16 px-4 bg-theme-alt border-b gold-border">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-widest italic">Contact Us</h1>
          <p className="mt-4 text-gray-400 font-serif italic text-lg max-w-2xl mx-auto">
            We are here to serve you. Reach out with any inquiries or special requests.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-theme-base py-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Details & Map */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-serif text-white mb-8 border-b border-white/10 pb-4 italic">Our Location</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-theme-alt flex items-center justify-center border gold-border text-[#D4AF37] shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-1">Address</h3>
                      <p className="text-gray-400 text-sm font-light">Millennium Nice Peak Hotel</p>
                      <p className="text-gray-400 text-sm font-light">Ilorin, Kwara State, Nigeria</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-theme-alt flex items-center justify-center border gold-border text-[#D4AF37] shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-1">Phone</h3>
                      <p className="text-gray-400 text-sm font-light">+234 (0) 800 000 0000</p>
                      <p className="text-gray-400 text-sm italic">Available 24/7 for support</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-theme-alt flex items-center justify-center border gold-border text-[#D4AF37] shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-1">Email</h3>
                      <p className="text-gray-400 text-sm font-light">info@millenniumnicepeak.com</p>
                      <p className="text-gray-400 text-sm font-light">bookings@millenniumnicepeak.com</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-theme-alt flex items-center justify-center border gold-border text-[#D4AF37] shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-1">Hours</h3>
                      <p className="text-gray-400 text-sm font-light">Check-in: 2:00 PM</p>
                      <p className="text-gray-400 text-sm font-light">Check-out: 12:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="w-full h-80 bg-theme-alt border gold-border p-2 glass-dark">
                <iframe 
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Millennium%20Nice%20Peak%20Hotel,%20Ilorin+(Millennium%20Nice%20Peak%20Hotel)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Millennium Nice Peak Hotel Map"
                  className="filter grayscale opacity-80"
                ></iframe>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://maps.app.goo.gl/ZcCEgnMFZoLVUiyr7" target="_blank" rel="noopener noreferrer" className="flex-1 gold-gradient hover:opacity-90 text-black py-4 uppercase tracking-[0.2em] text-[10px] font-bold text-center transition-all min-h-[48px] flex items-center justify-center shadow-lg">
                  View on Google Maps
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=Millennium+Nice+Peak+Hotel,+Ilorin" target="_blank" rel="noopener noreferrer" className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 py-4 uppercase tracking-[0.2em] text-[10px] font-bold text-center transition-all min-h-[48px] flex items-center justify-center">
                  Get Directions
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="glass-dark border gold-border p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[100px] pointer-events-none rounded-full" />
                <h2 className="text-2xl font-serif text-white mb-8 border-b border-white/10 pb-4 italic">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Full Name</label>
                    <input 
                      required type="text" name="fullName" value={formData.fullName} onChange={handleChange} 
                      className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" 
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Email Address</label>
                    <input 
                      required type="email" name="email" value={formData.email} onChange={handleChange} 
                      className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" 
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Phone Number</label>
                    <input 
                      required type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                      className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" 
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Message</label>
                    <textarea 
                      required name="message" value={formData.message} onChange={handleChange} rows={5}
                      className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gold-gradient text-black py-4 uppercase tracking-[0.3em] text-[12px] font-bold transition-all hover:opacity-90 disabled:opacity-50 min-h-[48px] shadow-lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
