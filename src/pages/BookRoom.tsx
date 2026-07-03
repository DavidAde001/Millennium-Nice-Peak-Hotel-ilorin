import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { dbService } from '../lib/db';
import { Room } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Users, Check, X, ArrowRight, Copy, Phone } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function BookRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [step, setStep] = useState<'list' | 'form' | 'payment' | 'success'>('list');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    checkInDate: '',
    checkOutDate: '',
    numGuests: 1,
    specialRequests: ''
  });

  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    dbService.getRooms().then(setRooms);
  }, []);

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const nights = differenceInDays(parseISO(formData.checkOutDate), parseISO(formData.checkInDate));
    return nights > 0 ? nights : 0;
  };

  const numNights = calculateNights();
  const totalAmount = selectedRoom ? selectedRoom.pricePerNight * numNights : 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numNights <= 0) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }
    // Generate temporary reference for payment stage
    setBookingRef(`MNPH-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmPayment = async () => {
    if (!selectedRoom) return;
    try {
      await dbService.createBooking({
        bookingRef,
        roomId: selectedRoom.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        checkInDate: parseISO(formData.checkInDate).toISOString(),
        checkOutDate: parseISO(formData.checkOutDate).toISOString(),
        numGuests: Number(formData.numGuests),
        specialRequests: formData.specialRequests,
        totalAmount
      });
      // Update local room list to show it's no longer available
      setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, isAvailable: false } : r));
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      toast.error("Failed to process reservation.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="pt-32 pb-16 px-4 bg-theme-alt border-b gold-border">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-widest">Reservations</h1>
          <p className="mt-4 text-gray-400 font-serif italic text-lg text-center max-w-2xl mx-auto">
            Choose from our exquisite selection of luxury rooms and suites.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-theme-base py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* List View */}
            {step === 'list' && (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {rooms.map((room) => (
                  <div key={room.id} className="glass-dark border gold-border flex flex-col group p-1">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={room.imageUrl} alt={room.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-white text-xl italic">{room.type}</h3>
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Room {room.roomNumber}</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Price</p>
                        <p className="text-xl gold-text font-serif italic">{formatCurrency(room.pricePerNight)}<span className="text-sm text-gray-300 font-sans not-italic tracking-normal"> / night</span></p>
                      </div>
                      <p className="text-gray-300 font-light text-sm mb-6 flex-1 line-clamp-2">{room.description}</p>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Users size={16} className="text-[#D4AF37]" /> Up to {room.capacity} Guests
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 3).map((amt, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-300 px-2 py-1 border border-white/10">
                              {amt}
                            </span>
                          ))}
                          {room.amenities.length > 3 && <span className="text-[10px] px-2 py-1 text-gray-500">+{room.amenities.length - 3}</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookClick(room)}
                        className="w-full py-4 text-[12px] uppercase tracking-[0.2em] font-bold transition-all min-h-[48px] gold-gradient text-black hover:opacity-90 shadow-lg"
                      >
                        Book This Room
                      </button>
                    </div>
                  </div>
                ))}
            </motion.div>
            )}

            {/* Form View */}
            {step === 'form' && selectedRoom && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <button 
                  onClick={() => setStep('list')}
                  className="mb-8 text-neutral-400 hover:text-white uppercase tracking-widest text-xs flex items-center gap-2 p-2 -ml-2 min-h-[48px]"
                >
                  <ArrowRight size={14} className="rotate-180" /> Back to Rooms
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 glass-dark border gold-border p-6 md:p-8">
                    <h2 className="text-2xl font-serif text-white mb-6">Guest Details</h2>
                    <form id="booking-form" onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                          <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Phone Number</label>
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Number of Guests</label>
                          <select name="numGuests" value={formData.numGuests} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none min-h-[48px]">
                            {[...Array(selectedRoom.capacity)].map((_, i) => (
                              <option key={i} value={i + 1}>{i + 1} Guest{i > 0 && 's'}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Address</label>
                          <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Check-In Date</label>
                          <input required type="date" name="checkInDate" value={formData.checkInDate} min={new Date().toISOString().split('T')[0]} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" style={{colorScheme: 'dark'}} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Check-Out Date</label>
                          <input required type="date" name="checkOutDate" value={formData.checkOutDate} min={formData.checkInDate || new Date().toISOString().split('T')[0]} onChange={handleInputChange} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]" style={{colorScheme: 'dark'}} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Special Requests</label>
                          <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={4} className="w-full bg-theme-base border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"></textarea>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-dark border gold-border p-6">
                      <h3 className="text-lg font-serif text-white mb-4 border-b border-white/10 pb-4">Reservation Summary</h3>
                      <img src={selectedRoom.imageUrl} alt={selectedRoom.type} className="w-full aspect-video object-cover mb-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Room Name</span>
                          <span className="text-white font-medium">{selectedRoom.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Room Number</span>
                          <span className="text-white font-mono">{selectedRoom.roomNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price Per Night</span>
                          <span className="text-white font-mono">{formatCurrency(selectedRoom.pricePerNight)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Number of Nights</span>
                          <span className="text-white">{numNights}</span>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="gold-text uppercase tracking-widest text-[10px] font-bold">Total Amount</span>
                        <span className="text-xl font-serif italic text-white">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      form="booking-form"
                      className="w-full gold-gradient text-black py-4 uppercase tracking-[0.2em] text-[12px] font-bold transition-all hover:opacity-90 min-h-[48px]"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment View */}
            {step === 'payment' && selectedRoom && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto glass-dark border gold-border p-8 text-center"
              >
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="gold-text font-serif text-2xl">₦</span>
                </div>
                <h2 className="text-3xl font-serif text-white mb-2">Complete Payment</h2>
                <p className="text-gray-400 mb-8">Please transfer the total amount to the account details below to secure your reservation.</p>

                <div className="bg-theme-base border gold-border p-6 rounded-sm text-left space-y-4 mb-8">
                   <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4">
                     <div>
                       <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Total Amount Due</p>
                       <p className="text-3xl font-serif italic gold-text">{formatCurrency(totalAmount)}</p>
                     </div>
                     <div className="mt-4 md:mt-0 text-right">
                       <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Booking Reference</p>
                       <p className="font-mono text-white tracking-widest">{bookingRef}</p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Bank Name</p>
                        <p className="text-white font-medium">OPay</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Account Name</p>
                        <p className="text-white font-medium uppercase tracking-wider">Adewale Fadipe</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Account Number</p>
                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-mono text-white tracking-widest">9012758772</p>
                          <button 
                            onClick={() => copyToClipboard('9012758772')}
                            className="p-2 border border-white/20 hover:bg-white/10 text-gray-300 rounded-sm transition-colors flex items-center gap-2 min-h-[48px]"
                            title="Copy Account Number"
                          >
                            <Copy size={16} /> <span className="text-[10px] uppercase tracking-wider">Copy</span>
                          </button>
                        </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={confirmPayment}
                  className="w-full gold-gradient text-black py-4 uppercase tracking-[0.2em] text-[12px] font-bold transition-all hover:opacity-90 min-h-[48px]"
                >
                  I Have Made Payment
                </button>
                <button 
                  onClick={() => setStep('form')}
                  className="w-full mt-4 bg-transparent border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 py-4 uppercase tracking-[0.2em] text-[12px] transition-all min-h-[48px]"
                >
                  Cancel / Go Back
                </button>
              </motion.div>
            )}

            {/* Success View */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto glass-dark border border-green-500/30 p-8 text-center"
              >
                <div className="w-20 h-20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Thank You For Your Reservation!</h2>
                <div className="bg-theme-base p-4 mb-6 inline-block border gold-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Booking Reference</p>
                  <p className="text-2xl font-mono gold-text tracking-widest">{bookingRef}</p>
                </div>
                
                <p className="text-gray-300 mb-2 font-medium">Your booking status: <span className="gold-text font-bold uppercase tracking-widest text-[10px] ml-2">Pending Payment Verification</span></p>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                  Please contact our receptionist immediately via WhatsApp or Phone Call to verify your payment. Provide your Booking Reference Number to confirm your reservation.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <a href={`https://wa.me/2348000000000?text=Hello, I just made a reservation. My reference is ${bookingRef}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white py-4 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] font-bold transition-colors min-h-[48px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                    WhatsApp Reception
                  </a>
                  <a href="tel:+2348000000000" className="border border-white/20 hover:bg-white/10 text-white py-4 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] font-bold transition-colors min-h-[48px]">
                    <Phone size={18} />
                    Call Reception
                  </a>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Hotel Contact Information</p>
                  <p className="text-gray-300 text-sm">Millennium Nice Peak Hotel, Ilorin, Kwara State</p>
                  <p className="text-gray-300 text-sm">Email: info@millenniumnicepeak.com</p>
                  <p className="text-gray-400 text-sm mt-4 italic text-xs">For any issues, please do not hesitate to reach out.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
