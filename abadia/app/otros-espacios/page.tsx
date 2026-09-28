'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ESPACIOS_CASA = [
  {
    id: "mirador",
    nombre: "El Mirador de Estrellas",
    etiqueta: "Deck Panorámico Superior",
    horario: "Abierto 24 Horas",
    descripcion: "Ubicado en el punto más elevado del hotel, este deck construido con maderas nobles y rodeado de copas de palmeras ofrece vistas ininterrumpidas al horizonte marino. Durante el atardecer se convierte en el lugar predilecto para un brindis y por la noche permite una observación astronómica privilegiada libre de contaminación lumínica.",
    caracteristicas: ["Asoleadoras ergonómicas", "Telescopio para observación nocturna", "Servicio de bebidas al atardecer", "Capacidad para 12 personas"],
    imagen: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: "patio",
    nombre: "Patio de las Fuentes",
    etiqueta: "Claustro Botánico Colonial",
    horario: "6:00 AM - 10:00 PM",
    descripcion: "Un rincón de arquitectura fresca inspirado en los claustros coloniales del Caribe. Cuenta con tres fuentes de piedra balinesa cuyo rumor constante relaja el ambiente, helechos nativos gigantes y pequeños sofás de lino para quienes desean disfrutar de un café colombiano o leer un libro a la sombra.",
    caracteristicas: ["Ambiente silencioso garantizado", "Selección de libros y revistas", "Fuentes de agua natural", "Temperatura templada todo el día"],
    imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: "solarium",
    nombre: "Solárium de Palmeras",
    etiqueta: "Playa & Camas Balinesas",
    horario: "8:00 AM - 7:00 PM",
    descripcion: "Situado a escasos metros de la línea de marea de Playa Blanca. Cada cama balinesa cuenta con cortinajes de lino para privacidad, servicio de toallas blancas sin límite y atención personalizada para frutas frescas y bebidas tropicales artesanales.",
    caracteristicas: ["Camas balinesas privadas", "Servicio de toallas ilimitado", "Duchas de agua dulce exteriores", "Acceso directo a la orilla"],
    imagen: "/piscina.png"
  }
];

export default function PaginaOtrosEspacios() {
  const [activo, setActivo] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const espacio = ESPACIOS_CASA[activo];

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
          src={espacio.imagen}
          alt={espacio.nombre}
          fill
          priority
          unoptimized
          className="object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/80 font-semibold block">
            Rincones de Calma
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold uppercase tracking-wide text-white">
            {espacio.nombre}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 font-light">
            {espacio.etiqueta} • {espacio.horario}
          </p>
        </div>
      </section>

      {/* SELECTOR DE LOS 3 ESPACIOS */}
      <section className="bg-white border-b border-[#E8DDD0] py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none py-1">
          {ESPACIOS_CASA.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActivo(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                idx === activo
                  ? 'bg-[#8c7355] text-white shadow-md scale-105'
                  : 'bg-[#FAF7F2] hover:bg-[#F3ECE2] text-stone-700 border border-[#E8DDD0]'
              }`}
            >
              {item.nombre}
            </button>
          ))}
        </div>
      </section>

      {/* DETALLES EXTENDIDOS (TÍTULO EN DORADO EN FONDO BLANCO/ARENA) */}
      <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto space-y-10 text-left">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c7355] font-semibold block">
            {espacio.etiqueta}
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            {espacio.nombre}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            {espacio.descripcion}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E8DDD0] shadow-sm space-y-4">
          <h3 className="text-base font-semibold uppercase tracking-wider text-stone-800">
            Detalles y Servicios del Espacio
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {espacio.caracteristicas.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                <span className="text-[#8c7355] font-bold">✓</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
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