import { motion } from 'motion/react';
import { ChevronDown, ArrowRight, Star, Wifi, Coffee, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { dbService } from '../lib/db';
import { useEffect, useState } from 'react';
import { Room } from '../types';
import { formatCurrency } from '../lib/utils';

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);

  useEffect(() => {
    dbService.getRooms().then(rooms => {
      // Get unique types for display
      const uniqueTypes = new Map();
      rooms.forEach(r => {
        if (!uniqueTypes.has(r.type)) uniqueTypes.set(r.type, r);
      });
      setFeaturedRooms(Array.from(uniqueTypes.values()).slice(0, 4));
    });
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">
        <motion.div
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaKeZOfIWm_WrnNmNu1dzfaszVSOyKIOdunUqUsTtEKQ&s=10" 
            alt="Luxury Hotel Facade" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        </motion.div>

        <div className="relative z-20 flex flex-col lg:w-1/2 justify-center px-4 md:px-12 w-full pt-20">
          <h2 className="text-[14px] uppercase tracking-[0.5em] gold-text font-semibold mb-6">5-Star Excellence</h2>
          <motion.h1
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-8"
          >
             Redefining <br/>
             <span className="italic">Luxury</span> in <br/>
             Nigeria
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-gray-300 text-lg font-light max-w-md mb-10 leading-relaxed"
          >
            Experience world-class hospitality in the heart of Ilorin. Where modern sophistication meets timeless elegance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/book" className="gold-gradient text-black font-bold uppercase tracking-[0.3em] text-[13px] px-12 py-5 shadow-2xl hover:brightness-110 flex items-center justify-center transition-all min-h-[56px]">
              Book Now
            </Link>
            <Link to="/contact" className="border gold-border px-8 py-5 text-[12px] text-white uppercase tracking-widest hover:bg-white/5 flex items-center justify-center transition-all min-h-[56px]">
              Contact Us
            </Link>
          </motion.div>
        </div>
        
        <div className="relative z-20 lg:w-1/2 flex items-center justify-center lg:justify-end px-4 md:px-12 mt-12 lg:mt-0 pb-20 lg:pb-0">
          {featuredRooms.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="glass-dark border gold-border w-full max-w-md p-1"
            >
              <div className="relative">
                <img src={featuredRooms[0].imageUrl} 
                    className="w-full h-64 object-cover" alt={featuredRooms[0].type} />
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 text-[10px] text-white uppercase tracking-widest border gold-border">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-white text-2xl mb-2 italic">{featuredRooms[0].type}</h3>
                <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">Room {featuredRooms[0].roomNumber}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Starting from</p>
                    <p className="text-2xl gold-text font-serif italic">{formatCurrency(featuredRooms[0].pricePerNight)}<span className="text-sm text-gray-300 font-sans not-italic tracking-normal"> / night</span></p>
                  </div>
                  <Link to="/book" className="text-[11px] text-white uppercase tracking-widest border-b gold-border pb-1 hover:gold-text transition-colors p-2 -mr-2 min-h-[48px] flex items-center">Details</Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={scrollToContent}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce p-4 min-h-[48px] min-w-[48px] flex justify-center items-center cursor-pointer z-30 lg:hidden"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </motion.button>
      </section>

      {/* Bottom Utility Bar (Booking Widget) */}
      <section className="hidden lg:grid h-32 bg-theme-alt border-t gold-border z-30 grid-cols-4 relative mt-[-128px]">
        <div className="flex flex-col justify-center px-10 border-r gold-border">
          <label className="text-[10px] uppercase tracking-[0.3em] gold-text mb-2 font-bold cursor-pointer inline-block" onClick={() => document.getElementById('book-checkin')?.focus()}>Check In</label>
          <input type="date" id="book-checkin" className="text-lg font-light bg-transparent text-white focus:outline-none w-full" style={{colorScheme: 'dark'}} />
        </div>
        <div className="flex flex-col justify-center px-10 border-r gold-border">
          <label className="text-[10px] uppercase tracking-[0.3em] gold-text mb-2 font-bold cursor-pointer inline-block" onClick={() => document.getElementById('book-checkout')?.focus()}>Check Out</label>
          <input type="date" id="book-checkout" className="text-lg font-light bg-transparent text-white focus:outline-none w-full" style={{colorScheme: 'dark'}} />
        </div>
        <div className="flex flex-col justify-center px-10 border-r gold-border">
          <label className="text-[10px] uppercase tracking-[0.3em] gold-text mb-2 font-bold cursor-pointer inline-block" onClick={() => document.getElementById('book-guests')?.focus()}>Guests</label>
          <select id="book-guests" className="text-lg font-light bg-transparent text-white focus:outline-none w-full appearance-none rounded-none cursor-pointer">
            <option value="1">01 Adult</option>
            <option value="2">02 Adults</option>
            <option value="3">02 Adults, 01 Child</option>
            <option value="4">02 Adults, 02 Children</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <Link to="/book" className="gold-gradient text-black font-bold uppercase tracking-[0.3em] text-[13px] px-12 py-5 shadow-2xl hover:brightness-110 min-h-[48px] flex items-center justify-center text-center">
            Check Availability
          </Link>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-4 bg-theme-base">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/20 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
            <img 
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAErtHP7VezC55YxoNUxaxcRst6LjyYhXtTKg2Pn-o_p5GgDWyCEL45CX2QumVKbQFMQFnfR8QhqdPCXJGRNSSoe5bMoYeQy147-18vDS93YP2liByxBvQ5ADHkpRzwjxe1HAu1cZA=s680-w680-h510-rw"
              alt="Luxury Experience" 
              className="w-full h-auto object-cover aspect-[4/3] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2070&auto=format&fit=crop";
              }}
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#D4AF37]"></div>
              <h2 className="gold-text font-serif tracking-[0.2em] uppercase text-[10px] font-bold">Welcome to Excellence</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight italic">
              An Oasis of <br/> Unparalleled Prestige
            </h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Situated in the vibrant city of Ilorin, Millennium Nice Peak Hotel offers an extraordinary blend of contemporary luxury and Nigerian hospitality. From our meticulously designed suites to our world-class amenities, every detail is crafted to provide a transcendent experience. Let us exceed your expectations.
            </p>
            <Link to="/book" className="inline-flex items-center gap-3 text-white hover:gold-text font-semibold uppercase tracking-[0.2em] text-[11px] group p-2 -ml-2 min-h-[48px] transition-colors">
              Explore Our Rooms
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms Spotlight */}
      <section className="py-24 px-4 bg-theme-alt border-y gold-border">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <div className="w-12 h-px bg-[#D4AF37]"></div>
              <h2 className="text-4xl font-serif text-white italic">Signature Stays</h2>
              <p className="text-gray-400 max-w-2xl font-light">Discover our carefully curated selection of luxury accommodations, designed to provide the ultimate comfort.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredRooms.map((room, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  key={room.id} 
                  className="group cursor-pointer glass-dark border gold-border transition-colors p-1"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img src={room.imageUrl} alt={room.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6 space-y-4 flex flex-col items-start text-left">
                    <h3 className="text-xl font-serif text-white italic">{room.type}</h3>
                    <div className="flex flex-col gap-1 w-full border-b border-white/10 pb-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Starting from</p>
                      <p className="gold-text font-serif text-xl italic">{formatCurrency(room.pricePerNight)}</p>
                    </div>
                    <Link to="/book" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:gold-text flex items-center gap-2 p-2 -ml-2 min-h-[48px] transition-colors">
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 px-4 bg-theme-base relative overflow-hidden">
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-serif text-white mb-16 italic">Premium Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { icon: Wifi, label: "High-Speed WiFi" },
                 { icon: Coffee, label: "Gourmet Dining" },
                 { icon: Shield, label: "24/7 Security" },
                 { icon: Star, label: "Room Service" }
               ].map((item, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: idx * 0.1 }}
                   className="flex flex-col items-center gap-4 p-8 border border-white/10 glass-dark transition-colors group hover:border-[#D4AF37]/50"
                 >
                   <item.icon className="gold-text group-hover:scale-110 transition-transform drop-shadow-lg" size={40} strokeWidth={1} />
                   <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">{item.label}</span>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Culinary Excellence */}
      <section className="py-24 px-4 bg-theme-alt border-y gold-border">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/20 -translate-x-4 translate-y-4 -z-10 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
              alt="Culinary Excellence" 
              className="w-full h-auto object-cover aspect-[4/3] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#D4AF37]"></div>
              <h2 className="gold-text font-serif tracking-[0.2em] uppercase text-[10px] font-bold">Gastronomy</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight italic">
              Culinary <br/> Masterpieces
            </h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Indulge in a symphony of flavors at our signature restaurant. Our executive chefs curate exquisite menus that blend local Nigerian delicacies with international fine dining techniques, ensuring every meal is an unforgettable experience.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 text-white hover:gold-text font-semibold uppercase tracking-[0.2em] text-[11px] group p-2 -ml-2 min-h-[48px] transition-colors">
              Reserve a Table
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Wellness & Spa */}
      <section className="relative py-32 px-4 bg-theme-base overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop" 
            alt="Spa & Wellness" 
            className="w-full h-full object-cover opacity-20 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-base via-theme-base/80 to-theme-base z-10" />
        </div>
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#D4AF37]"></div>
            <h2 className="gold-text font-serif tracking-[0.2em] uppercase text-[10px] font-bold">Wellness</h2>
            <div className="w-12 h-px bg-[#D4AF37]"></div>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight italic">
            Rejuvenate Your Senses
          </h3>
          <p className="text-gray-300 leading-relaxed font-light text-lg">
            Escape the bustling city and step into a sanctuary of tranquility. Our luxury spa offers bespoke treatments, from deep tissue massages to revitalizing facials, designed to restore your mind, body, and soul.
          </p>
        </div>
      </section>

      {/* Bespoke Events */}
      <section className="py-24 px-4 bg-theme-alt border-t gold-border">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/20 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
              alt="Bespoke Events" 
              className="w-full h-auto object-cover aspect-[4/3] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#D4AF37]"></div>
              <h2 className="gold-text font-serif tracking-[0.2em] uppercase text-[10px] font-bold">Venues</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight italic">
              Unforgettable <br/> Occasions
            </h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Whether you are planning a grand wedding celebration or a prestigious corporate conference, our elegant event spaces and dedicated planning team ensure flawless execution and lasting memories.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 text-white hover:gold-text font-semibold uppercase tracking-[0.2em] text-[11px] group p-2 -ml-2 min-h-[48px] transition-colors">
              Plan Your Event
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="py-24 px-4 bg-theme-base border-t gold-border">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
               <div className="w-12 h-px bg-[#D4AF37]"></div>
               <h2 className="text-4xl font-serif text-white italic">Guest Experiences</h2>
               <p className="text-gray-400 max-w-2xl font-light">See what our esteemed guests have to say about their stay at Millennium Nice Peak Hotel.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { text: "An absolute marvel. The attention to detail, from the room decor to the exquisite dining, is unmatched anywhere else in Ilorin.", author: "Adebayo T." },
                 { text: "The Royal Suite exceeded all expectations. The staff went above and beyond to make our anniversary incredibly special.", author: "Sarah & John M." },
                 { text: "A true oasis of calm. The spa treatments were divine, and the ambiance throughout the hotel made for a perfect weekend getaway.", author: "Ngozi O." }
               ].map((testimonial, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6, delay: idx * 0.1 }}
                   className="glass-dark border border-white/10 p-8 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-colors"
                 >
                   <div>
                     <div className="flex text-[#D4AF37] mb-6">
                       {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-[#D4AF37]" />)}
                     </div>
                     <p className="text-gray-300 font-serif italic leading-relaxed mb-8">"{testimonial.text}"</p>
                   </div>
                   <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                     <div className="w-8 h-px bg-[#D4AF37]"></div>
                     <p className="text-white text-[11px] uppercase tracking-[0.2em]">{testimonial.author}</p>
                   </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

    </PageTransition>
  );
}
