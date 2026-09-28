'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

const Icons = {
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.54 1.761.815 2.796.815 3.183 0 5.769-2.587 5.77-5.766.001-3.182-2.585-5.802-5.77-5.802zm9.969 5.828c0 5.518-4.481 9.999-10 9.999-1.745 0-3.385-.45-4.816-1.238l-7.184 1.889 1.921-7.018c-.859-1.488-1.353-3.218-1.353-5.064 0-5.518 4.482-10 10-10 5.519 0 10 4.482 10 10z" />
    </svg>
  )
};

interface Habitacion {
  id: string;
  numero: string;
  categoria: string;
  titulo: string;
  ubicacion: string;
  precio: string;
  noches: string;
  capacidad: string;
  descripcion: string;
  imagenes: string[];
}

const HABITACIONES: Habitacion[] = [
  {
    id: "suite-imperial",
    numero: "01",
    categoria: "Suite Insignia",
    titulo: "Suite Real con Hidromasaje",
    ubicacion: "Frente al Mar • Terraza Superior",
    precio: "$450.000",
    noches: "/ noche",
    capacidad: "4 a 6 Personas",
    descripcion: "Nuestra suite insignia concebida para una experiencia íntima sin precedentes. Cuenta con tina de hidromasaje exterior privada al aire libre en su balcón panorámico, lencería de 400 hilos en algodón egipcio, ducha tipo lluvia en piedra natural y amenidades botánicas orgánicas.",
    imagenes: [
      "/121017.jpg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "cabana-palmeras",
    numero: "02",
    categoria: "Cabaña Nativa",
    titulo: "Cabaña Vista Palmeras",
    ubicacion: "Jardín Botánico Central",
    precio: "$320.000",
    noches: "/ noche",
    capacidad: "4 a 5 Personas",
    descripcion: "Arquitectura rústica moderna con terraza privada suspendida y rodeada de vegetación nativa del Caribe. Un refugio fresco pensado para respirar la brisa marina entre las palmeras.",
    imagenes: [
      "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "estancia-silencio",
    numero: "03",
    categoria: "Estancia Silente",
    titulo: "Estancia Silencio",
    ubicacion: "Ala Silente • Planta Baja",
    precio: "$280.000",
    noches: "/ noche",
    capacidad: "4 Personas",
    descripcion: "Diseño minimalista y fresco concebido para el descanso profundo, la desconexión total y la calma. Materiales nobles, temperatura fresca constante y acústica aislada.",
    imagenes: [
      "/WhatsApp Image 2026-07-06 at 20.33.43.jpeg",
      "/121017.jpg",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "cabana-familiar",
    numero: "04",
    categoria: "Cabaña Familiar",
    titulo: "Cabaña Familiar Playa Blanca",
    ubicacion: "Paso Directo a la Arena",
    precio: "$390.000",
    noches: "/ noche",
    capacidad: "5 a 6 Personas",
    descripcion: "Amplitud y confort integral para familias o grupos íntimos, con sala de descanso, dos ambientes independientes y acceso directo al sendero que lleva a la orilla del mar.",
    imagenes: [
      "/WhatsApp Image 2026-07-06 at 20.33.44.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "bungalow-marino",
    numero: "05",
    categoria: "Bungalow",
    titulo: "Bungalow Atardecer Caribe",
    ubicacion: "Primera Línea de Playa",
    precio: "$360.000",
    noches: "/ noche",
    capacidad: "4 Personas",
    descripcion: "Ubicado a escasos metros de la marea, con hamaca privada, acabados en maderas nobles, ducha exterior a cielo abierto y sonido ininterrumpido de las olas.",
    imagenes: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=85",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg",
      "/121017.jpg"
    ]
  },
  {
    id: "master-abadia",
    numero: "06",
    categoria: "Penthouse",
    titulo: "Master Suite Abadía",
    ubicacion: "Nivel Superior • Vista Panorámica",
    precio: "$520.000",
    noches: "/ noche",
    capacidad: "4 a 6 Personas",
    descripcion: "Nuestra estancia más exclusiva con ventanales de piso a techo, jacuzzi privado, cava y atención personalizada permanente para una estadía inigualable.",
    imagenes: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1920&q=85",
      "/piscina.png",
      "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg"
    ]
  }
];

// --- COMPONENTE INDIVIDUAL DE HABITACIÓN: FULL SCREEN + BOTÓN WHATSAPP EN GLASS ---
function HabitacionFullScreenItem({ hab }: { hab: Habitacion }) {
  const [fotoIndex, setFotoIndex] = useState(0);

  const anterior = () => {
    setFotoIndex((prev) => (prev === 0 ? hab.imagenes.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setFotoIndex((prev) => (prev + 1) % hab.imagenes.length);
  };

  const cotizarWhatsApp = () => {
    const msj = encodeURIComponent(`Hola! Deseo cotizar reserva en Hotel Abadía para la habitación: ${hab.titulo} (${hab.precio})`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <article className="w-full border-b border-[#E8DDD0] bg-white last:border-b-0">
      {/* 1. IMAGEN FULL SCREEN CON CARRUSEL DE FOTOS */}
      <div className="relative h-[80vh] sm:h-[88vh] md:h-[92vh] w-full overflow-hidden bg-black select-none group">
        <Image
          src={hab.imagenes[fotoIndex]}
          alt={`${hab.titulo} foto ${fotoIndex + 1}`}
          fill
          unoptimized
          priority
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />

        {/* ETIQUETA SUPERIOR GLASS */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-light shadow-md">
            Estancia {hab.numero} • {hab.categoria}
          </div>
          <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-light shadow-md">
            Foto {fotoIndex + 1} de {hab.imagenes.length}
          </div>
        </div>

        {/* BOTONES CARRUSEL ‹ Y › */}
        <button
          onClick={anterior}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label={`Foto anterior de ${hab.titulo}`}
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguiente}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label={`Siguiente foto de ${hab.titulo}`}
        >
          <Icons.ChevronRight />
        </button>

        {/* TÍTULO Y COSTO SOBRE LA BASE DE LA FOTO EN BLANCO */}
        <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 block font-semibold">
                📍 {hab.ubicacion}
              </span>
              <h3 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-white drop-shadow-md">
                {hab.titulo}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs uppercase tracking-widest text-white/70 block">Costo Oficial</span>
              <span className="text-2xl sm:text-3xl font-medium text-white">
                {hab.precio} <span className="text-xs text-white/70 font-normal">{hab.noches}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DESCRIPCIÓN ABAJO DEL FULL SCREEN */}
      <div className="bg-[#FAF7F2] py-10 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="bg-[#8c7355] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full">
                Estancia {hab.numero}
              </span>
              <span className="text-xs font-semibold text-[#8c7355]">
                👥 Capacidad: {hab.capacidad}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {hab.descripcion}
            </p>

            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-2">
                Servicios Incluidos en la Habitación:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-2xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-2 shadow-sm">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Baño privado</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-2 shadow-sm">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Nevera minibar</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-2 shadow-sm">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Aire acondicionado</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-2 shadow-sm">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Televisor Smart TV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de acciones: BOTÓN WHATSAPP EN GLASS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDD0] shadow-md flex flex-col justify-between gap-5 shrink-0 lg:w-80">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold block">
                Tarifa Total por Noche
              </span>
              <div className="text-3xl font-semibold text-[#8c7355] mt-1">
                {hab.precio} <span className="text-xs text-stone-400 font-normal">{hab.noches}</span>
              </div>
              <span className="text-[11px] text-stone-500 block mt-1">
                Acomodación para {hab.capacidad}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* BOTÓN WHATSAPP EN GLASSMORPHISM ELEGANTE */}
              <button
                onClick={cotizarWhatsApp}
                className="w-full bg-white/70 hover:bg-white text-stone-800 border border-stone-300/80 backdrop-blur-xl py-3.5 px-4 rounded-2xl text-xs font-semibold uppercase tracking-[0.15em] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(140,115,85,0.15)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-[#8c7355]">
                  <Icons.WhatsApp />
                </span>
                <span>Reservar por WhatsApp</span>
              </button>

              {/* Botón Dashboard */}
              <Link
                href={`/reservas-y-pagos?id=${hab.id}`}
                className="w-full bg-[#8c7355] hover:bg-[#735e45] text-white py-3.5 px-4 rounded-2xl text-xs font-semibold uppercase tracking-[0.15em] shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 text-center"
              >
                <span>Dashboard de Reservas</span>
                <Icons.ArrowUpRight />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}

export default function PaginaHabitaciones() {
  const [menuAbierto, setMenuAbierto] = useState(false);

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

      {/* BANNER EDITORIAL FULL SCREEN DE ENTRADA (TÍTULO EN BLANCO) */}
      <section className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 px-6 text-white text-center">
        <Image
          src="/121017.jpg"
          alt="Colección de Habitaciones Hotel Abadía"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/80 font-semibold block">
            Colección de Estancias
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold uppercase tracking-wide text-white">
            Nuestras Habitaciones
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 font-light">
            Explora las 6 estancias boutique en pantalla completa con sus especificaciones de confort y capacidad.
          </p>
        </div>
      </section>

      {/* TRANSICIÓN EDITORIAL: TÍTULO EN DORADO */}
      <section className="bg-[#FAF7F2] py-12 px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
            — EXPERIENCIA VISUAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Catálogo Completo de las 6 Estancias
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Desliza las fotografías de cada estancia usando los controles de carrusel y consulta abajo sus servicios incluidos.
          </p>
        </div>
      </section>

      {/* LAS 6 HABITACIONES FULL SCREEN DE AHÍ PARA ABAJO */}
      <div className="w-full">
        {HABITACIONES.map((hab) => (
          <HabitacionFullScreenItem key={hab.id} hab={hab} />
        ))}
      </div>

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