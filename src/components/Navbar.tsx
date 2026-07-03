import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Room', path: '/book' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || isMobileMenuOpen ? "glass-dark border-b gold-border" : "bg-transparent border-b border-transparent",
          "h-20 flex items-center"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="items-center flex min-h-[48px] px-2 -ml-2 hover:opacity-80 transition-opacity">
            <div className="flex flex-col items-start">
              <span className="font-serif italic text-2xl gold-text tracking-widest uppercase leading-none">Millennium</span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-light text-white">Nice Peak Hotel • Ilorin</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-2 py-3 min-h-[48px] flex items-center justify-center text-[11px] tracking-widest uppercase font-medium transition-colors hover:gold-text",
                  location.pathname === link.path ? "gold-text border-b border-[#D4AF37] pb-1" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white hover:text-gold-400 min-h-[48px] min-w-[48px] flex items-center justify-center -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6 w-full px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-2xl uppercase tracking-widest min-h-[48px] py-4 w-full flex items-center justify-center transition-colors active:text-gold-400",
                    location.pathname === link.path ? "text-gold-500 font-bold" : "text-neutral-200"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
