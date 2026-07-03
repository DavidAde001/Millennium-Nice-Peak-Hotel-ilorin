/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatContacts from './components/FloatContacts';
import Home from './pages/Home';
import BookRoom from './pages/BookRoom';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="flex-1 flex flex-col">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookRoom />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-neutral-950 font-sans text-neutral-100">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <AppRoutes />
        </main>
        <Footer />
        <FloatContacts />
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

