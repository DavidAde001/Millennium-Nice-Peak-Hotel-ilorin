import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-8 border-t gold-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link to="/" className="flex flex-col items-center md:items-start group hover:opacity-80 transition-opacity">
              <span className="font-serif italic text-2xl gold-text tracking-widest uppercase leading-none mb-1">Millennium</span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-light text-white">Nice Peak Hotel</span>
            </Link>
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs">
              Redefining luxury in Nigeria. Experience the pinnacle of hospitality, where elegance meets unmatched comfort in the heart of Ilorin.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-white/10 pb-2 inline-block">Explore</h3>
            <ul className="space-y-4">
              <li><Link to="/book" className="text-sm text-gray-400 hover:gold-text transition-colors block">Accommodations</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:gold-text transition-colors block">Contact Us</Link></li>
              <li><Link to="/admin" className="text-sm text-gray-400 hover:gold-text transition-colors block">Admin Login</Link></li>
              <li><a href="#" className="text-sm text-gray-400 hover:gold-text transition-colors block">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-white/10 pb-2 inline-block">Contact</h3>
            <ul className="space-y-4">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3 text-gray-400 group cursor-pointer hover:gold-text transition-colors">
                <MapPin className="shrink-0" size={16} />
                <span className="text-sm font-light text-center md:text-left">Plot 12, Phase 1<br />Ilorin, Kwara State, Nigeria</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-3 text-gray-400 group cursor-pointer hover:gold-text transition-colors">
                <Phone className="shrink-0" size={16} />
                <span className="text-sm font-light">+234 901 275 8772</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-3 text-gray-400 group cursor-pointer hover:gold-text transition-colors">
                <Mail className="shrink-0" size={16} />
                <span className="text-sm font-light">info@millenniumnicepeak.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-white/10 pb-2 inline-block">Newsletter</h3>
            <p className="text-gray-400 text-sm font-light text-center md:text-left">Subscribe to receive exclusive offers and the latest news.</p>
            <form className="w-full relative max-w-xs" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your Email Address" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-[11px] uppercase tracking-wider focus:outline-none focus:border-[#D4AF37] transition-colors" />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 gold-gradient text-black text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-opacity">
                Join
              </button>
            </form>
            <div className="flex gap-4 pt-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:gold-text transition-colors"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:gold-text transition-colors"><Twitter size={18} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:gold-text transition-colors"><Instagram size={18} /></a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Millennium Nice Peak Hotel. All rights reserved.
          </p>
          <div className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
            By <span className="gold-text">Adewale Fadipe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
