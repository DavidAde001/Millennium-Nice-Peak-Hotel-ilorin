import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { dbService } from '../lib/db';
import { Booking, ContactMessage, Room } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Check, X, Calendar, MessageSquare, Hotel, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const [tab, setTab] = useState<'bookings' | 'rooms' | 'messages'>('bookings');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    if (tab === 'bookings') setBookings(await dbService.getBookings());
    if (tab === 'rooms') setRooms(await dbService.getRooms());
    if (tab === 'messages') setMessages(await dbService.getContacts());
  };

  const handleBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await dbService.updateBookingStatus(id, status);
      toast.success(`Booking ${status} successfully`);
      fetchData();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const toggleRoomStatus = async (id: string, currentStatus: boolean) => {
    try {
      await dbService.updateRoomStatus(id, !currentStatus);
      toast.success("Room status updated");
      fetchData();
    } catch (e) {
      toast.error("Failed to update room");
    }
  };

  // Analytics
  const totalRevenue = bookings.filter(b => b.status === 'Approved').reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending Payment Verification').length;

  return (
    <PageTransition>
      <div className="pt-32 pb-16 px-4 bg-theme-alt border-b gold-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-serif text-white uppercase tracking-widest italic">Admin Dashboard</h1>
            <p className="text-gray-400 font-serif italic">Secure Management Portal</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-dark border gold-border px-6 py-4 flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">Approved Revenue</span>
              <span className="gold-text font-serif italic text-xl">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="glass-dark border gold-border px-6 py-4 flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">Pending Verifications</span>
              <span className="text-white font-serif text-xl">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-theme-base py-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto pb-1">
            <button 
              onClick={() => setTab('bookings')}
              className={cn("uppercase tracking-[0.2em] text-[10px] font-bold pb-4 border-b-2 flex items-center gap-2 px-2 whitespace-nowrap min-h-[48px]", tab === 'bookings' ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-gray-400 hover:text-white")}
            >
              <Calendar size={16} /> Manage Bookings
            </button>
            <button 
              onClick={() => setTab('rooms')}
              className={cn("uppercase tracking-[0.2em] text-[10px] font-bold pb-4 border-b-2 flex items-center gap-2 px-2 whitespace-nowrap min-h-[48px]", tab === 'rooms' ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-gray-400 hover:text-white")}
            >
              <Hotel size={16} /> Manage Rooms
            </button>
            <button 
              onClick={() => setTab('messages')}
              className={cn("uppercase tracking-[0.2em] text-[10px] font-bold pb-4 border-b-2 flex items-center gap-2 px-2 whitespace-nowrap min-h-[48px]", tab === 'messages' ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-gray-400 hover:text-white")}
            >
              <MessageSquare size={16} /> Contact Messages
            </button>
          </div>

          <div className="min-h-[50vh]">
            <AnimatePresence mode="wait">
              
              {/* BOOKINGS TAB */}
              {tab === 'bookings' && (
                <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {bookings.length === 0 ? <p className="text-gray-500">No bookings found.</p> : (
                    <div className="space-y-4">
                      {bookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(booking => (
                        <div key={booking.id} className="glass-dark border gold-border p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <span className="font-mono gold-text font-bold">{booking.bookingRef}</span>
                              <span className={cn(
                                "text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm border",
                                booking.status === 'Approved' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                                booking.status === 'Rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                                "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20"
                              )}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-white text-lg font-serif">{booking.fullName} <span className="text-gray-400 text-sm font-sans font-normal">({booking.email} | {booking.phone})</span></p>
                            <p className="text-gray-500 text-sm font-light">Room ID: {booking.roomId} • {booking.numGuests} Guests</p>
                            <p className="text-gray-400 text-sm font-light">
                              {new Date(booking.checkInDate).toLocaleDateString()} &rarr; {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                            {booking.specialRequests && <p className="text-gray-300 text-sm bg-black/40 p-2 mt-2 italic font-serif">Note: {booking.specialRequests}</p>}
                          </div>
                          
                          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                            <span className="font-serif italic gold-text text-xl">{formatCurrency(booking.totalAmount)}</span>
                            {booking.status === 'Pending Payment Verification' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleBookingStatus(booking.id, 'Approved')}
                                  className="bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center min-h-[48px] transition-colors"
                                ><Check size={14} className="mr-1"/> Approve</button>
                                <button 
                                  onClick={() => handleBookingStatus(booking.id, 'Rejected')}
                                  className="bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center min-h-[48px] transition-colors"
                                ><X size={14} className="mr-1"/> Reject</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ROOMS TAB */}
              {tab === 'rooms' && (
                <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {rooms.map(room => (
                      <div key={room.id} className="glass-dark border gold-border p-4 transition-colors hover:border-[#D4AF37]/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-serif text-white text-lg">{room.roomNumber}</span>
                          <span className={cn(
                                "text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm border",
                                room.isAvailable ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                              )}>
                                {room.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-4 font-light">{room.type}</p>
                        <button 
                          onClick={() => toggleRoomStatus(room.id, room.isAvailable)}
                          className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] uppercase tracking-[0.2em] py-2 transition-colors min-h-[48px]"
                        >
                          Mark {room.isAvailable ? 'Booked' : 'Available'}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* MESSAGES TAB */}
              {tab === 'messages' && (
                <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                   {messages.length === 0 ? <p className="text-gray-500">No messages found.</p> : (
                    <div className="space-y-4">
                      {messages.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(msg => (
                        <div key={msg.id} className="glass-dark border gold-border p-6">
                           <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                             <div>
                               <p className="text-white font-serif">{msg.fullName}</p>
                               <p className="text-gray-400 text-sm font-light">{msg.email} • {msg.phone}</p>
                             </div>
                             <span className="text-gray-500 text-[10px] uppercase tracking-[0.1em]">{new Date(msg.createdAt).toLocaleString()}</span>
                           </div>
                           <p className="text-gray-300 bg-black/20 p-4 font-serif italic text-sm border-l-2 border-[#D4AF37]">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
