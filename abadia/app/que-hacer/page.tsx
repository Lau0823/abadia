'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

const RECOMENDACIONES_DESTINO = [
  {
    id: "cispata",
    numero: "01",
    titulo: "Manglares de la Bahía de Cispatá & Delfines",
    punto: "Muelle de San Antero",
    distancia: "A 8 minutos del hotel",
    duracion: "Tour de 3 a 4 horas",
    descripcion: "Uno de los ecosistemas de manglar más biodiversos del país. Navega por túneles verdes naturales guiado por lancheros certificados nativos, conoce el programa de conservación del Caimán Aguja y observa delfines costeros en la desembocadura del Río Sinú.",
    imperdible: "Degustar ostras frescas servidas en botes tradicionales y el avistamiento de aves al amanecer.",
    imagen: "/caimanera.png"
  },
  {
    id: "caimanera",
    numero: "02",
    titulo: "Ciénaga de la Caimanera & La Casa Flotante",
    punto: "Sector Coveñas - San Antero",
    distancia: "A 12 minutos del hotel",
    duracion: "Paseo de 2 horas",
    descripcion: "Un espejo de agua tranquila de aguas salobres rodeado de manglar rojo. En medio de la ciénaga se encuentra la emblemática casa flotante de madera donde puedes disfrutar de un almuerzo tradicional con mariscos y jugo de corozo recién preparado.",
    imperdible: "El recorrido en canoas ecológicas sin motor para escuchar el sonido silencioso de la naturaleza.",
    imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: "islas-san-bernardo",
    numero: "03",
    titulo: "Expedición a las Islas de San Bernardo",
    punto: "Salida directa desde la playa del hotel",
    distancia: "45 minutos en lancha rápida",
    duracion: "Día completo (8:00 AM - 4:00 PM)",
    descripcion: "Zarpa directamente hacia el archipiélago de San Bernardo: aguas turquesas transparentes en Isla Múcura, arena blanca deslumbrante en Tintipán y visita cultural a Santa Cruz del Islote, la isla más densamente poblada del planeta.",
    imperdible: "Snorkel en arrecifes de coral vivos y almuerzo frente al mar en Tintipán.",
    imagen: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: "volcan-lodo",
    numero: "04",
    titulo: "Volcán de Lodo y Aguas Termales de San Antero",
    punto: "Sector rural San Antero",
    distancia: "A 15 minutos en auto",
    duracion: "2 horas",
    descripcion: "Una experiencia terapéutica y divertida. Sumérgete en el volcán de lodo natural cuyas propiedades minerales tonifican la piel, y luego lávate en los pozos de agua dulce natural guiado por los anfitriones de la comunidad.",
    imperdible: "Masaje relajante con lodo tibio natural para recargar energía.",
    imagen: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=85"
  }
];

export default function PaginaQueHacer() {
  const [seleccionado, setSeleccionado] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const item = RECOMENDACIONES_DESTINO[seleccionado];

  const coordinarTour = (titulo: string) => {
    const msj = encodeURIComponent(`Hola! Quiero recibir asesoría para realizar la actividad: ${titulo}`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <main className="w-full bg-[#FAF7F2] text-[#2a2421] antialiased min-h-screen font-light">
      
      {/* HEADER: SIN BOTÓN IZQUIERDO, LOGO CENTRADO Y MENÚ DERECHO */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-none">
        <div className="w-12 h-12" />

        <div className="pointer-events-auto flex items-center justify-center">
          <Link href="/" className="relative w-44 h-14 sm:w-56 sm:h-18 cursor-pointer drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-300 block">
            <Image 
              src="/logo.png" 
              alt="Logo Abadía" 
              fill 
              priority 
              className="object-contain filter brightness-0 invert" 
            />
          </Link>
        </div>

        <div className="pointer-events-auto">
          <button 
            onClick={() => setMenuAbierto(true)}
            className="w-12 h-12 rounded-full bg-black/35 hover:bg-black/55 text-white border border-white/20 flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-xl"
            aria-label="Abrir Menú"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </header>

      {/* MENÚ LATERAL GLASS */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          menuAbierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div onClick={() => setMenuAbierto(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#14100e]/85 backdrop-blur-3xl p-10 sm:p-12 flex flex-col justify-between border-l border-white/15 shadow-2xl transition-transform duration-500 ease-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              Menú Abadía
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-left my-auto">
            <Link onClick={() => setMenuAbierto(false)} href="/" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Inicio</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Nuestras Habitaciones</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Otros Espacios de la Casa</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Qué hacer en San Antero</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Dashboard de Reservas & Pagos</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <span>Caribe</span>
          </div>
        </div>
      </div>

      {/* BANNER EDITORIAL FULL SCREEN (TÍTULO EN BLANCO) */}
      <section className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 px-6 text-white text-center">
        <Image
          src={item.imagen}
          alt={item.titulo}
          fill
          priority
          unoptimized
          className="object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/80 font-semibold block">
            Guía de San Antero & El Caribe
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold uppercase tracking-wide text-white">
            {item.titulo}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 font-light">
            📍 {item.punto} • {item.distancia}
          </p>
        </div>
      </section>

      {/* SELECTOR DE LAS 4 EXPERIENCIAS */}
      <section className="bg-white border-b border-[#E8DDD0] py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none py-1">
          {RECOMENDACIONES_DESTINO.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => setSeleccionado(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                idx === seleccionado
                  ? 'bg-[#8c7355] text-white shadow-md scale-105'
                  : 'bg-[#FAF7F2] hover:bg-[#F3ECE2] text-stone-700 border border-[#E8DDD0]'
              }`}
            >
              {r.numero}. {r.titulo.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </section>

      {/* DETALLES EXTENDIDOS (TÍTULO EN DORADO EN FONDO BLANCO/ARENA) */}
      <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto space-y-8 text-left">
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c7355] font-semibold block">
            {item.duracion}
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            {item.titulo}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            {item.descripcion}
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7355]">
              El detalle imperdible de Abadía:
            </span>
            <p className="text-xs text-stone-700 font-medium">
              {item.imperdible}
            </p>
          </div>

          <button
            onClick={() => coordinarTour(item.titulo)}
            className="bg-[#8c7355] hover:bg-[#735e45] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            Coordinar este Tour
          </button>
        </div>
      </section>

      {/* FOOTER AZUL ABADÍA */}
      <footer className="w-full bg-[#071326] text-white py-16 px-6 text-center border-t border-blue-950/60">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="relative w-44 h-16 filter brightness-0 invert opacity-90">
            <Image src="/logo.png" alt="Logo Abadía Footer" fill sizes="176px" className="object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-white/90 font-light max-w-md leading-relaxed">
            Playa Blanca, San Antero & Coveñas — Colombia <br /> Un espacio para la desconexión total y la calma.
          </p>
          <div className="w-12 h-[1px] bg-white/20 my-2" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">
            © 2026 Hotel Abadía. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}