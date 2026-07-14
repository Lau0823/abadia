import { create } from 'zustand';

interface UIState {
  menuAbierto: boolean;
  seccionReservaAbierta: boolean;
  toggleMenu: () => void;
  setMenuAbierto: (isOpen: boolean) => void;
  toggleReserva: () => void;
  setReservaAbierta: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  menuAbierto: false,
  seccionReservaAbierta: false,
  toggleMenu: () => set((state) => ({ menuAbierto: !state.menuAbierto })),
  setMenuAbierto: (isOpen) => set({ menuAbierto: isOpen }),
  toggleReserva: () => set((state) => ({ seccionReservaAbierta: !state.seccionReservaAbierta })),
  setReservaAbierta: (isOpen) => set({ seccionReservaAbierta: isOpen }),
}));
