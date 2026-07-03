import { Room, Booking, ContactMessage, RoomType } from '../types';
import { supabase } from './supabase';

// Initial Mock Data Fallback
const STANDARD_AMENITIES = ["Free High-Speed WiFi", "Air Conditioning", "24/7 Room Service", "Security", "Laundry Service"];
const PREMIUM_AMENITIES = [...STANDARD_AMENITIES, "Swimming Pool", "Gourmet Restaurant", "Secure Parking"];
const LUXURY_AMENITIES = [...PREMIUM_AMENITIES, "Conference Hall", "Airport Pickup", "Personal Butler"];

const SAMPLE_ROOMS: Room[] = [];

const roomTypes: { type: RoomType; count: number; price: number; capacity: number; image: string; amenities: string[]; desc: string; startFloor: number }[] = [
  { type: 'Standard Room', count: 15, price: 30000, capacity: 2, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop', amenities: STANDARD_AMENITIES, desc: 'Comfortable and elegantly furnished standard room perfect for short stays.', startFloor: 1 },
  { type: 'Deluxe Room', count: 10, price: 45000, capacity: 2, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop', amenities: STANDARD_AMENITIES, desc: 'Spacious deluxe room with premium finishings and city views.', startFloor: 2 },
  { type: 'Executive Room', count: 8, price: 60000, capacity: 2, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop', amenities: PREMIUM_AMENITIES, desc: 'Refined executive room designed for business travelers with dedicated workspace.', startFloor: 3 },
  { type: 'Premium Deluxe Room', count: 6, price: 80000, capacity: 3, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop', amenities: PREMIUM_AMENITIES, desc: 'Upgraded deluxe experience with extended space and luxury bath features.', startFloor: 4 },
  { type: 'Family Suite', count: 4, price: 110000, capacity: 5, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', amenities: PREMIUM_AMENITIES, desc: 'Spacious family suite with multiple beds, perfect for group vacations.', startFloor: 5 },
  { type: 'Business Suite', count: 3, price: 150000, capacity: 4, image: 'https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=2070&auto=format&fit=crop', amenities: LUXURY_AMENITIES, desc: 'Premium suite featuring a separate lounge area for private meetings.', startFloor: 6 },
  { type: 'Presidential Suite', count: 2, price: 250000, capacity: 4, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop', amenities: LUXURY_AMENITIES, desc: 'The pinnacle of luxury with panoramic views, exquisite decor, and VIP treatment.', startFloor: 7 },
  { type: 'Royal Suite', count: 2, price: 450000, capacity: 6, image: 'https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2070&auto=format&fit=crop', amenities: LUXURY_AMENITIES, desc: 'Our most prestigious offering. A majestic suite fit for royalty with breathtaking scale and amenities.', startFloor: 8 }
];

let globalRoomId = 1;

roomTypes.forEach((rt) => {
  for (let i = 0; i < rt.count; i++) {
    // Determine specific images for 603, 604, 605
    let currentFloor = rt.startFloor;
    let roomNum = `${currentFloor}0${i + 1}`;
    if (i >= 9) roomNum = `${currentFloor}${i + 1}`;
    
    let imageUrl = rt.image;
    if (roomNum === '603') imageUrl = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGihDL_PiXIPPznwpa0Ll4gPn4Ry4qvdUWcBwwiDqPkUIwspG6TDOot8GmebH0jok8D0PWLVlbYdzvDr04N_ka66_GbCKmnG-7XpEn2VQ8lJlUJ4EbkgHYZlqXqU1mWmYUHmtOfWSb9lHtM=s680-w680-h510-rw';
    if (roomNum === '604') imageUrl = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEV5FU4jJSU1q6QxRpKLPz2eNoWFychuBemFTHXulU0jtpDL1C8eaavz50UA5mR2EknbyxLhFpRDmszHF8GCn-2vMBdfh8Iz1VZssoOABrrTNsZTelyiT5fiyhjIhV2wJpqovqG=s680-w680-h510-rw';
    if (roomNum === '605') imageUrl = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAES9RV3FeFbD3RDp6QrOQCNAkFQTBIWZRkAaqSuU-N0yjDMsaaQTr_MXabg5mxpR1P2JRBIQSQtZTf4EfEQV_h3Ka-OXlu0_GE8r9rDje4oW7GMUDziC20G26gkroUWolOunVKeuUf4Pu7V=s680-w680-h510-rw';

    SAMPLE_ROOMS.push({
      id: `room_${globalRoomId++}`,
      roomNumber: roomNum,
      type: rt.type,
      capacity: rt.capacity,
      description: rt.desc,
      pricePerNight: rt.price,
      imageUrl: imageUrl,
      amenities: rt.amenities,
      isAvailable: true
    });
  }
});

// Mock Local Storage Keys
const ROOMS_KEY = 'mnph_rooms';
const BOOKINGS_KEY = 'mnph_bookings';
const CONTACTS_KEY = 'mnph_contacts';

// Initialize Local Storage
if (!localStorage.getItem(ROOMS_KEY)) localStorage.setItem(ROOMS_KEY, JSON.stringify(SAMPLE_ROOMS));
if (!localStorage.getItem(BOOKINGS_KEY)) localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
if (!localStorage.getItem(CONTACTS_KEY)) localStorage.setItem(CONTACTS_KEY, JSON.stringify([]));

// --- API METHODS ---

export const dbService = {
  // ROOMS
  getRooms: async (): Promise<Room[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*');
      if (!error && data) return data as Room[];
    }
    return JSON.parse(localStorage.getItem(ROOMS_KEY) ||('[]'));
  },
  updateRoomStatus: async (roomId: string, isAvailable: boolean): Promise<void> => {
    if (supabase) {
      const { error } = await supabase.from('rooms').update({ isAvailable }).eq('id', roomId);
      if (!error) return;
    }
    const rooms: Room[] = JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]');
    const newRooms = rooms.map(r => r.id === roomId ? { ...r, isAvailable } : r);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(newRooms));
  },
  
  // BOOKINGS
  getBookings: async (): Promise<Booking[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data) return data as Booking[];
    }
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  },
  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      status: 'Pending Payment Verification',
      createdAt: new Date().toISOString()
    };
    if (supabase) {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select();
      if (!error && data) {
        await dbService.updateRoomStatus(bookingData.roomId, false);
        return data[0] as Booking;
      }
    }
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    await dbService.updateRoomStatus(bookingData.roomId, false);
    return newBooking;
  },
  updateBookingStatus: async (bookingId: string, status: Booking['status']): Promise<void> => {
    if (supabase) {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
      if (!error) return;
    }
    const bookings: Booking[] = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx > -1) {
      bookings[idx].status = status;
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      if (status === 'Rejected') {
        // Free up the room
        await dbService.updateRoomStatus(bookings[idx].roomId, true);
      }
    }
  },

  // CONTACTS
  getContacts: async (): Promise<ContactMessage[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('contacts').select('*');
      if (!error && data) return data as ContactMessage[];
    }
    return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
  },
  createContact: async (contactData: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> => {
    const newMessage: ContactMessage = {
      ...contactData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    if (supabase) {
      const { data, error } = await supabase.from('contacts').insert([newMessage]).select();
      if (!error && data) return data[0] as ContactMessage;
    }
    const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
    contacts.push(newMessage);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    return newMessage;
  }
};
