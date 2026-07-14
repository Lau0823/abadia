'use client';

import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const { menuAbierto, setMenuAbierto, toggleMenu } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();

  const hacerScrollASeccion = (idSeccion: string) => {
    setMenuAbierto(false);
    if (pathname !== '/') {
      router.push(`/#${idSeccion}`);
    } else {
      const elem = document.getElementById(idSeccion);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const irAInicio = () => {
    setMenuAbierto(false);
    if (pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* --- BOTÓN HAMBURGUESA FIJO --- */}
      <nav className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleMenu}
          className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-md border border-[#f4f1ea] flex flex-col justify-center items-center gap-1.5 w-12 h-12 active:scale-95 transition-all z-50 relative"
          aria-label="Alternar menú"
        >
          <span className={`h-[1px] w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`h-[1px] w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`h-[1px] w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? '-rotate-45 translate-y-[3px]' : ''}`} />
        </button>
      </nav>

      {/* --- PANEL LATERAL DEL MENÚ --- */}
      <div className={`fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-white/95 backdrop-blur-md shadow-2xl p-8 flex flex-col justify-between border-l border-[#f4f1ea] transition-transform duration-500 ease-out ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#3d342e]/50 font-medium block mb-8">— Navegación</span>
          <ul className="flex flex-col gap-6 text-lg text-[#3d342e] font-light tracking-wide">
            <li className="cursor-pointer hover:text-neutral-500 transition-colors" onClick={irAInicio}>Inicio</li>
            <li className="cursor-pointer hover:text-neutral-400 transition-colors" onClick={() => hacerScrollASeccion('habitaciones')}>Habitaciones</li>
            <li className="cursor-pointer hover:text-neutral-400 transition-colors" onClick={() => hacerScrollASeccion('seccion-reservas-mid')}>Reservar</li>
            <li className="cursor-pointer hover:text-neutral-400 transition-colors" onClick={() => hacerScrollASeccion('casa')}>Conoce la Casa</li>
            <li className="cursor-pointer hover:text-neutral-400 transition-colors" onClick={() => hacerScrollASeccion('planes')}>Planes y Precios</li>
            <li className="cursor-pointer hover:text-neutral-400 transition-colors" onClick={() => hacerScrollASeccion('turismo')}>Entorno Local</li>
          </ul>
        </div>
        <div className="text-[10px] text-neutral-400 font-medium tracking-wide">© 2026 Abadía Hotel Boutique.</div>
      </div>
    </>
  );
}
