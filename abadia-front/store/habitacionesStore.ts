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
      set({ habitaciones: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar habitaciones', isLoading: false });
    }
  },
}));
