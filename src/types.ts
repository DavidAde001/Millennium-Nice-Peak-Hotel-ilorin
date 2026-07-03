export type RoomType = 
  | 'Standard Room' 
  | 'Deluxe Room' 
  | 'Executive Room' 
  | 'Premium Deluxe Room' 
  | 'Family Suite' 
  | 'Business Suite' 
  | 'Presidential Suite' 
  | 'Royal Suite';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  description: string;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  bookingRef: string;
  roomId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  checkInDate: string; // ISO 8601
  checkOutDate: string; // ISO 8601
  numGuests: number;
  specialRequests: string;
  totalAmount: number;
  status: 'Pending Payment Verification' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}
