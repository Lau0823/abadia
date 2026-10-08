import { create } from 'zustand';

interface BookingState {
  checkIn: Date | null;
  checkOut: Date | null;
  huespedes: number;
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setHuespedes: (count: number) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  checkIn: null,
  checkOut: null,
  huespedes: 2,
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setHuespedes: (count) => set({ huespedes: count }),
}));
