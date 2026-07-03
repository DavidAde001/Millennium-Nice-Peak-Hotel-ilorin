import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatContacts() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="bg-neutral-800 hover:bg-neutral-700 text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center border border-neutral-700 transition-colors focus:ring-2 focus:ring-gold-500 outline-none"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </motion.button>
      
      <motion.a
        href="https://wa.me/2348000000000"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        className="bg-green-600 hover:bg-green-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border border-green-500 transition-colors focus:ring-2 focus:ring-green-400 outline-none"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
      </motion.a>
    </div>
  );
}
