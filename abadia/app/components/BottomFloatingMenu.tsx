'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bitter, Outfit } from 'next/font/google';

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

// Los 6 nombres y rutas idénticos a tus categorías
const CATEGORIAS_OFICIALES = [
  {
    id: "habitaciones",
    nombre: "HABITACIONES",
    ruta: "/habitaciones",
    imagen: "/categorias/habitaciones.png"
  },
  {
    id: "gastronomia",
    nombre: "GASTRONOMÍA",
    ruta: "/gastronomia",
    imagen: "/categorias/gastronomia.png"
  },
  {
    id: "otros-espacios",
    nombre: "ESPACIOS",
    ruta: "/otros-espacios",
    imagen: "/categorias/piscina.png"
  },
  {
    id: "que-hacer",
    nombre: "QUÉ HACER",
    ruta: "/que-hacer",
    imagen: "/categorias/que hacer.png"
  },
  {
    id: "transporte",
    nombre: "CÓMO LLEGAR",
    ruta: "/transporte",
    imagen: "/categorias/mapa.png"
  },
  {
    id: "atardeceres",
    nombre: "ATARDECERES",
    ruta: "/atardeceres",
    imagen: "/categorias/atardecer.png"
  }
];

const Icons = {
  Bed: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6v12m16.5-12v12m-16.5-4.5h16.5M3.75 9h16.5a2.25 2.25 0 012.25 2.25v2.25H1.5v-2.25A2.25 2.25 0 013.75 9z" />
    </svg>
  ),
  Utensils: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  Compass: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75l-4.5 1.5 1.5 4.5 4.5-1.5z" />
    </svg>
  ),
  ChevronUp: () => (
    <svg className="w-4 h-4 stroke-current fill-none transition-transform duration-300" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  )
};

export default function BottomFloatingGlassNav() {
  const [desplegado, setDesplegado] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Fondo difuminado al abrir */}
      {desplegado && (
        <div
          onClick={() => setDesplegado(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        />
      )}

      {/* Contenedor flotante permanente */}
      <div className={`fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none ${outfit.className}`}>
        
        {/* ========================================================
            PANEL DESPLEGABLE: LAS 6 CATEGORÍAS IDÉNTICAS A TU IMAGEN
            ======================================================== */}
        <div
          className={`pointer-events-auto w-full max-w-md mb-3 rounded-[2.5rem] p-5 sm:p-6 transition-all duration-500 ease-out origin-bottom
            bg-[#071326]/75 backdrop-blur-3xl saturate-150
            border border-white/45 shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.7)]
            ${desplegado
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 translate-y-8 pointer-events-none hidden'
            }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4 px-2">
            <span className={`${bitter.className} text-[11px] uppercase tracking-[0.25em] text-white font-bold drop-shadow-sm`}>
              Categorías
            </span>
            <button
              onClick={() => setDesplegado(false)}
              className="text-white/80 hover:text-white text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 transition-all cursor-pointer"
            >
              ✕ Cerrar
            </button>
          </div>

          {/* Grilla 3x2 con los 6 nombres de la imagen */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-2 place-items-center">
            {CATEGORIAS_OFICIALES.map((cat) => {
              const estaActiva = pathname === cat.ruta;

              return (
                <Link
                  key={cat.id}
                  href={cat.ruta}
                  onClick={() => setDesplegado(false)}
                  className="flex flex-col items-center gap-1.5 group w-full"
                >
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] transition-all duration-300 group-hover:scale-110 shadow-lg ${
                      estaActiva
                        ? 'border-2 border-white ring-2 ring-white/60 scale-105'
                        : 'border border-white/50 group-hover:border-white'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white/15 backdrop-blur-md flex items-center justify-center">
                      <Image
                        src={cat.imagen}
                        alt={cat.nombre}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className={`${bitter.className} text-[9px] sm:text-[10px] font-bold tracking-wider text-center truncate w-full text-white transition-opacity ${
                    estaActiva ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
                  }`}>
                    {cat.nombre}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            DOCK INFERIOR FIJO: GLASS ULTRA MODERNO ESTILO APPLE
            ======================================================== */}
        <nav 
          className="pointer-events-auto rounded-full px-3 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2.5 sm:gap-5 transition-all duration-300
            bg-[#071326]/65 backdrop-blur-3xl saturate-150
            border border-white/45 
            shadow-[0_15px_40px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(255,255,255,0.15)]"
        >
          {/* 1. HABITACIONES */}
          <Link
            href="/habitaciones"
            onClick={() => setDesplegado(false)}
            className={`flex flex-col items-center gap-0.5 text-xs transition-all duration-200 group px-1 ${
              pathname === '/habitaciones' 
                ? 'text-white scale-105 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Icons.Bed />
            <span className={`${bitter.className} text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white ${
              pathname === '/habitaciones' ? 'border-b border-white' : ''
            }`}>
              HABITACIONES
            </span>
          </Link>

          {/* 2. GASTRONOMÍA */}
          <Link
            href="/gastronomia"
            onClick={() => setDesplegado(false)}
            className={`flex flex-col items-center gap-0.5 text-xs transition-all duration-200 group px-1 ${
              pathname === '/gastronomia' 
                ? 'text-white scale-105 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Icons.Utensils />
            <span className={`${bitter.className} text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white ${
              pathname === '/gastronomia' ? 'border-b border-white' : ''
            }`}>
              GASTRONOMÍA
            </span>
          </Link>

          {/* 3. ESPACIOS */}
          <Link
            href="/otros-espacios"
            onClick={() => setDesplegado(false)}
            className={`flex flex-col items-center gap-0.5 text-xs transition-all duration-200 group px-1 ${
              pathname === '/otros-espacios' 
                ? 'text-white scale-105 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Icons.Sparkles />
            <span className={`${bitter.className} text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white ${
              pathname === '/otros-espacios' ? 'border-b border-white' : ''
            }`}>
              ESPACIOS
            </span>
          </Link>

          {/* 4. FLECHA DESPLEGABLE PARA VER LAS 6 */}
          <button
            onClick={() => setDesplegado(!desplegado)}
            className={`flex flex-col items-center gap-0.5 text-xs cursor-pointer px-2.5 py-1 rounded-full transition-all duration-200 ${
              desplegado 
                ? 'text-white bg-white/25 border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]' 
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Desplegar todas las categorías"
          >
            <div className={`transform transition-transform duration-300 ${desplegado ? 'rotate-180' : 'rotate-0'}`}>
              <Icons.ChevronUp />
            </div>
            <span className={`${bitter.className} text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white`}>
              {desplegado ? 'CERRAR' : 'MÁS'}
            </span>
          </button>
        </nav>
      </div>
    </>
  );
}