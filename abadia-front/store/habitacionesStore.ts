import { create } from 'zustand';
import { fetchApi } from '../lib/api';

export interface Habitacion {
  id: string;
  titulo: string;
  subtitulo: string;
  precio: number;
  imagen: string;
  ocupacion: string;
  estado: string;
  comodidades?: string[];
}

interface HabitacionesState {
  habitaciones: Habitacion[];
  isLoading: boolean;
  error: string | null;
  fetchHabitaciones: () => Promise<void>;
}

export const useHabitacionesStore = create<HabitacionesState>((set) => ({
  habitaciones: [],
  isLoading: false,
  error: null,
  fetchHabitaciones: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchApi('/habitaciones');
      const mapped = data.map((h: any) => ({
        ...h,
        imagen: h.imagenes && h.imagenes.length > 0 ? h.imagenes[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
      }));
      set({ habitaciones: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar habitaciones', isLoading: false });
    }
  },
}));
