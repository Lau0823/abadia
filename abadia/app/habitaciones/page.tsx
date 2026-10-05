'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Montserrat, Alex_Brush, Outfit } from 'next/font/google';

// 1. Títulos geométricos limpios
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

// 2. Acento caligráfico / cursiva fluida
const alexBrush = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

// 3. Cuerpo de texto contemporáneo
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const NUMERO_WHATSAPP = "573122373415";

// --- 2 VIDEOS .MOV PARA EL BANNER DE HABITACIONES (HERO) ---
const VIDEOS_HERO_HABITACIONES = [
  {
    id: 1,
    src: "/121015.mp4",
    poster: ""
  },
  {
    id: 2,
    src: "/121016.mp4",
    poster: ""
  }
];

// --- 2 VIDEOS PARA EL BANNER FULL SCREEN A MITAD DE PÁGINA (100% LIMPIO) ---
const VIDEOS_MITAD_HABITACIONES = [
  {
    id: 1,
    src: "/Habitaciones/habitacion2.mov",
    poster: ""
  },
  {
    id: 2,
    src: "/videosdebanner/copy_359F2AF5-3796-41C5-B3D0-B9AC83EF213B.mov",
    poster: ""
  }
];

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
  ),
  VolumeUp: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.83 0-1.51-.68-1.51-1.51V9.75c0-.83.68-1.5 1.51-1.5h2.24z" />
    </svg>
  ),
  VolumeMute: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-3.75l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.83 0-1.51-.68-1.51-1.51V9.75c0-.83.68-1.5 1.51-1.5h2.24z" />
    </svg>
  )
};

// --- DATA PARA EL MODAL DE SERVICIOS ---
interface DetalleServicio {
  nombre: string;
  icono: string;
  resumen: string;
  detalles: string[];
}

const INFO_SERVICIOS: Record<string, DetalleServicio> = {
  "Baño privado": {
    nombre: "Baño privado",
    icono: "🚿",
    resumen: "Espacio íntimo e higiénico con acabados frescos, ducha de agua constante y elementos de aseo esenciales.",
    detalles: [
      "Ducha independiente con excelente presión.",
      "Sanitario y lavamanos con toallas limpias.",
      "Espejo de vanidad e iluminación cálida."
    ]
  },
  "Nevera minibar": {
    nombre: "Nevera minibar",
    icono: "🧊",
    resumen: "Refrigerador compacto privado dentro de tu habitación para mantener bebidas frías, agua y refrigerios a tu alcance.",
    detalles: [
      "Compartimiento de enfriamiento rápido integrado.",
      "Capacidad adecuada para agua, gaseosas, vinos y snacks.",
      "Ubicación silenciosa para no interrumpir tus horas de descanso."
    ]
  },
  "Aire acondicionado": {
    nombre: "Aire acondicionado",
    icono: "❄️",
    resumen: "Climatización silenciosa individual tipo inverter para mantener una temperatura fresca y confortable frente a la calidez caribeña.",
    detalles: [
      "Control remoto individual con ajuste digital de temperatura.",
      "Tecnología inverter de ultra bajo nivel sonoro.",
      "Filtros higienizados periódicamente."
    ]
  },
  "Televisor Smart TV": {
    nombre: "Televisor Smart TV",
    icono: "📺",
    resumen: "Pantalla plana de alta definición con conectividad inteligente para disfrutar de tus plataformas de entretenimiento favoritas.",
    detalles: [
      "Acceso directo a Netflix, YouTube y aplicaciones de streaming.",
      "Control ergonómico y puertos de conexión multimedia.",
      "Excelente ángulo de visión orientado hacia las camas principales."
    ]
  }
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
    id: "Habitación 1",
    numero: "01",
    categoria: "",
    titulo: "Habitación 1",
    ubicacion: "San antero, playa blanca",
    precio: "$70.000",
    noches: "/ noche",
    capacidad: "4 Personas",
    descripcion: "Nuestra suite insignia concebida para una experiencia íntima sin precedentes. Cuenta con tina de hidromasaje exterior privada al aire libre en su balcón panorámico, lencería de 400 hilos en algodón egipcio, ducha tipo lluvia en piedra natural y amenidades botánicas orgánicas.",
    imagenes: [
      "/Habitaciones/habitacion1.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "/Habitaciones/habitacion101.png"
    ]
  },
  {
    id: "Habitación 2",
    numero: "02",
    categoria: "Cabaña",
    titulo: "Habitación 2",
    ubicacion: "San antero playa blanca",
    precio: "$70.000",
    noches: "/ noche",
    capacidad: "4 Personas",
    descripcion: "Arquitectura rústica moderna con terraza privada suspendida y rodeada de vegetación nativa del Caribe. Un refugio fresco pensado para respirar la brisa marina entre las palmeras.",
    imagenes: [
      "/Habitaciones/habitacion2.PNG",
      "/Habitaciones/habitacion2.2.PNG"
    ]
  },
  {
    id: "estancia-silencio",
    numero: "03",
    categoria: "Habitacion3",
    titulo: "Estancia Silencio",
    ubicacion: "",
    precio: "$70.000",
    noches: "/ noche",
    capacidad: "2 Personas",
    descripcion: "Diseño minimalista y fresco concebido para el descanso profundo, la desconexión total y la calma. Materiales nobles, temperatura fresca constante y acústica aislada.",
    imagenes: [
      "/Habitaciones/habitacion301.png",
      "/Habitaciones/habitacion3.jpeg",
      "/Habitaciones/301.png"
    ]
  },
  {
    id: "cabana-familiar",
    numero: "04",
    categoria: "Cabaña Familiar",
    titulo: "Habitación 4",
    ubicacion: "Paso Directo a la Arena",
    precio: "80.000",
    noches: "/ noche",
    capacidad: "5 a 6 Personas",
    descripcion: "Amplitud y confort integral para familias o grupos íntimos, con sala de descanso, dos ambientes independientes y acceso directo al sendero que lleva a la orilla del mar.",
    imagenes: [
      "/Habitaciones/habitacion4.jpeg",
      "/DSC05650.jpeg",
      "/DSC05657.jpeg"
    ]
  },
  {
    id: "bungalow-marino",
    numero: "05",
    categoria: "Bungalow",
    titulo: "Habitacion 5",
    ubicacion: "Primera Línea de Playa",
    precio: "80.000",
    noches: "/ noche",
    capacidad: "4 a 6 Personas",
    descripcion: "Ubicado a escasos metros de la marea, con hamaca privada, acabados en maderas nobles, ducha exterior a cielo abierto y sonido ininterrumpido de las olas.",
    imagenes: [
      "/Habitaciones/habitacion5/DSC05772.jpeg",
      "/Habitaciones/habitacion5/DSC05770.jpeg",
      "/Habitaciones/habitacion5/DSC05779.jpeg"
    ]
  },
  {
    id: "master-abadia",
    numero: "06",
    categoria: "Penthouse",
    titulo: "Habitación 6",
    ubicacion: "Nivel Superior • Vista Panorámica",
    precio: "$80.000",
    noches: "/ noche",
    capacidad: "4 a 6 Personas",
    descripcion: "Nuestra estancia más exclusiva con ventanales de piso a techo, jacuzzi privado, cava y atención personalizada permanente para una estadía inigualable.",
    imagenes: [
      "/Habitaciones/habitacion6.jpeg",
    ]
  }
];

const parsearPrecio = (precioStr: string): number => {
  const soloNumeros = precioStr.replace(/[^0-9]/g, '');
  const valor = parseInt(soloNumeros, 10);
  return isNaN(valor) ? 70000 : valor;
};

const obtenerCapacidadMaxima = (capacidadStr: string): number => {
  const matches = capacidadStr.match(/\d+/g);
  if (!matches) return 4;
  return Math.max(...matches.map(Number));
};

// --- COMPONENTE INDIVIDUAL DE HABITACIÓN CON FORMULARIO Y MODAL DE SERVICIOS ---
function HabitacionFullScreenItem({ 
  hab, 
  onAbrirServicio 
}: { 
  hab: Habitacion; 
  onAbrirServicio: (nombre: string) => void; 
}) {
  const [fotoIndex, setFotoIndex] = useState(0);

  const maxPersonas = obtenerCapacidadMaxima(hab.capacidad);
  const [personas, setPersonas] = useState(2);
  const [noches, setNoches] = useState(1);
  const [fechaLlegada, setFechaLlegada] = useState('');

  const tarifaBase = parsearPrecio(hab.precio);
  const precioTotal = tarifaBase * personas * noches;
  const precioTotalFormateado = `$${precioTotal.toLocaleString('es-CO')}`;

  const anterior = () => {
    setFotoIndex((prev) => (prev === 0 ? hab.imagenes.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setFotoIndex((prev) => (prev + 1) % hab.imagenes.length);
  };

  const cotizarWhatsApp = () => {
    const fechaTexto = fechaLlegada ? ` para la fecha ${fechaLlegada}` : '';
    const msj = encodeURIComponent(
      `Hola! Deseo cotizar la ${hab.titulo || 'Estancia ' + hab.numero} en Abadía Casa Hotel.\n` +
      `• Tarifa: ${hab.precio} por persona/noche\n` +
      `• Huéspedes: ${personas} personas\n` +
      `• Estancia: ${noches} ${noches === 1 ? 'noche' : 'noches'}${fechaTexto}\n` +
      `• Total estimado: ${precioTotalFormateado} COP.`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  const reservarWhatsApp = () => {
    const fechaTexto = fechaLlegada ? ` con llegada el ${fechaLlegada}` : '';
    const msj = encodeURIComponent(
      `Hola! Deseo realizar la RESERVA INMEDIATA de la ${hab.titulo || 'Estancia ' + hab.numero} en Abadía Casa Hotel.\n` +
      `• Huéspedes: ${personas} personas\n` +
      `• Noches: ${noches} ${noches === 1 ? 'noche' : 'noches'}${fechaTexto}\n` +
      `• Total a pagar: ${precioTotalFormateado} COP.\n` +
      `Por favor indíquenme los medios de pago para asegurar la reserva.`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <article className="w-full border-b border-[#E8DDD0] bg-white last:border-b-0">
      {/* 1. RECURSO FULL SCREEN CON CARRUSEL DE FOTOS */}
      <div className="relative h-[80vh] sm:h-[88vh] md:h-[92vh] w-full overflow-hidden bg-black select-none group">
        <Image
          src={hab.imagenes[fotoIndex]}
          alt={`${hab.titulo || 'Habitación ' + hab.numero} foto ${fotoIndex + 1}`}
          fill
          unoptimized
          priority
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />

        {/* ETIQUETA SUPERIOR GLASS ULTRA DIFUMINADA */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-white/20 backdrop-blur-3xl border border-white/30 px-4 py-1.5 rounded-full text-white text-xs font-light shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
            <span className={`${montserrat.className} font-bold text-[#C5A059] mr-1.5`}>0{hab.numero}</span>
            {hab.categoria && (
              <span className={`${montserrat.className} uppercase tracking-wider text-[10px]`}>{hab.categoria}</span>
            )}
          </div>
          <div className="pointer-events-auto bg-white/20 backdrop-blur-3xl border border-white/30 px-4 py-1.5 rounded-full text-white text-xs font-mono shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
            {fotoIndex + 1} de {hab.imagenes.length}
          </div>
        </div>

        {/* BOTONES CARRUSEL ‹ Y › */}
        <button
          onClick={anterior}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-90 cursor-pointer"
          aria-label={`Foto anterior de ${hab.titulo}`}
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguiente}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-90 cursor-pointer"
          aria-label={`Siguiente foto de ${hab.titulo}`}
        >
          <Icons.ChevronRight />
        </button>

        {/* TÍTULO Y COSTO SOBRE LA BASE DE LA FOTO */}
        <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white text-left">
            <div>
              {hab.ubicacion && (
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 block font-semibold mb-1">
                  📍 {hab.ubicacion}
                </span>
              )}
              <h3 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-md`}>
                {hab.titulo || `Habitación ${hab.numero}`}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className={`${montserrat.className} text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block`}>
                Tarifa Base
              </span>
              <span className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-white`}>
                {hab.precio} <span className="text-xs text-white/70 font-normal">por persona / noche</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DESCRIPCIÓN Y FICHA TÉCNICA */}
      <div className="bg-[#FAF7F2] py-10 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start justify-between gap-8 text-left">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className={`${montserrat.className} bg-[#8c7355] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full`}>
                Estancia {hab.numero}
              </span>
              <span className={`${montserrat.className} text-xs font-semibold uppercase text-[#C5A059]`}>
                👥 Capacidad: {hab.capacidad}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#5a483a] font-normal leading-relaxed">
              {hab.descripcion}
            </p>

            {/* BOTONES DE SERVICIOS INTERACTIVOS CON HOVER */}
            <div className="pt-2">
              <span className={`${montserrat.className} text-[10px] uppercase tracking-[0.25em] text-[#7d6553] font-bold block mb-2`}>
                Servicios Incluidos (Toca para ver detalles):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {["Baño privado", "Nevera minibar", "Aire acondicionado", "Televisor Smart TV"].map((srv, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onAbrirServicio(srv)}
                    className="group bg-white hover:bg-[#071326] p-3 rounded-2xl border border-[#071326]/20 hover:border-[#071326] text-xs font-medium text-[#3e3229] hover:text-white flex items-center justify-between shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-102 active:scale-95 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-[#8c7355] group-hover:text-[#C5A059] font-bold transition-colors">✓</span>
                      <span className="truncate">{srv}</span>
                    </span>
                    <span className="text-[10px] text-stone-400 group-hover:text-white/80 transition-colors">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FORMULARIO DE RESERVA: BORDES EN AZUL ABADÍA Y LETRAS CAFESITAS */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#071326]/25 shadow-md flex flex-col gap-5 shrink-0 w-full lg:w-88">
            <div className="border-b border-[#071326]/20 pb-3">
              <span className={`${montserrat.className} text-[10px] uppercase tracking-[0.25em] text-[#7d6553] font-bold block`}>
                Calcula tu Estancia
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xs text-[#5a483a]">Tarifa por persona:</span>
                <span className={`${montserrat.className} text-base font-bold text-[#8c7355]`}>
                  {hab.precio}
                </span>
              </div>
            </div>

            {/* CONTROLES DEL FORMULARIO CON LÍNEAS AZUL ABADÍA */}
            <div className="space-y-3.5">
              {/* Selector de personas */}
              <div className="flex items-center justify-between bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#071326]/30">
                <div>
                  <span className="text-xs font-semibold text-[#3e3229] block">Huéspedes</span>
                  <span className="text-[10px] text-[#7d6553] font-light">Máx. {maxPersonas} personas</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                    disabled={personas <= 1}
                    className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 disabled:opacity-40 text-[#3e3229] font-bold text-sm flex items-center justify-center border border-[#071326]/30 transition-all cursor-pointer"
                  >
                    −
                  </button>
                  <span className={`${montserrat.className} w-5 text-center font-bold text-[#3e3229] text-sm`}>
                    {personas}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPersonas((p) => Math.min(maxPersonas, p + 1))}
                    disabled={personas >= maxPersonas}
                    className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 disabled:opacity-40 text-[#3e3229] font-bold text-sm flex items-center justify-center border border-[#071326]/30 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Selector de noches */}
              <div className="flex items-center justify-between bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#071326]/30">
                <div>
                  <span className="text-xs font-semibold text-[#3e3229] block">Noches</span>
                  <span className="text-[10px] text-[#7d6553] font-light">Tiempo de estadía</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNoches((n) => Math.max(1, n - 1))}
                    disabled={noches <= 1}
                    className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 disabled:opacity-40 text-[#3e3229] font-bold text-sm flex items-center justify-center border border-[#071326]/30 transition-all cursor-pointer"
                  >
                    −
                  </button>
                  <span className={`${montserrat.className} w-5 text-center font-bold text-[#3e3229] text-sm`}>
                    {noches}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNoches((n) => Math.min(30, n + 1))}
                    className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 text-[#3e3229] font-bold text-sm flex items-center justify-center border border-[#071326]/30 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Selector de fecha */}
              <div className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#071326]/30">
                <label htmlFor={`fecha-${hab.id}`} className="text-[10px] uppercase font-bold text-[#7d6553] block mb-1">
                  Fecha estimada de llegada (opcional)
                </label>
                <input
                  id={`fecha-${hab.id}`}
                  type="date"
                  value={fechaLlegada}
                  onChange={(e) => setFechaLlegada(e.target.value)}
                  className="w-full bg-white border border-[#071326]/30 rounded-xl px-3 py-1.5 text-xs text-[#3e3229] outline-none focus:border-[#071326] transition-colors"
                />
              </div>
            </div>

            {/* PRECIO TOTAL */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#071326]/20">
              <div className="flex items-center justify-between text-[11px] text-[#5a483a] mb-1">
                <span>{personas} {personas === 1 ? 'persona' : 'personas'} × {noches} {noches === 1 ? 'noche' : 'noches'}</span>
                <span>{hab.precio} c/u</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#071326]/15 pt-2">
                <span className={`${montserrat.className} text-xs uppercase tracking-wider font-bold text-[#3e3229]`}>
                  Precio Total:
                </span>
                <span className={`${montserrat.className} text-2xl font-extrabold text-[#C5A059]`}>
                  {precioTotalFormateado} <span className="text-[11px] text-[#7d6553] font-normal">COP</span>
                </span>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={cotizarWhatsApp}
                className={`${montserrat.className} w-full bg-white hover:bg-stone-100 text-[#3e3229] border border-[#071326]/30 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-2xs`}
              >
                <span className="text-[#8c7355]">
                  <Icons.WhatsApp />
                </span>
                <span>Cotizar Habitación</span>
              </button>

              <button
                type="button"
                onClick={reservarWhatsApp}
                className={`${montserrat.className} w-full bg-[#8c7355] hover:bg-[#071326] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
              >
                <Icons.WhatsApp />
                <span>Reservar Habitación</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}

// --- BANNER FULL SCREEN A MITAD DE PÁGINA (SOLO 2 VIDEOS, 100% LIMPIO) ---
function BannerMitadPageVideos() {
  const [videoActivo, setVideoActivo] = useState(0);
  const [sonido, setSonido] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoActivo((prev) => (prev + 1) % VIDEOS_MITAD_HABITACIONES.length);
    }, 8500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[75vh] sm:h-[90vh] w-full overflow-hidden bg-black select-none">
      {VIDEOS_MITAD_HABITACIONES.map((video, idx) => {
        const activo = idx === videoActivo;
        return (
          <div
            key={video.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activo ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <video
              poster={video.poster}
              autoPlay
              muted={!sonido}
              loop
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              className="w-full h-full object-cover scale-105"
            >
              <source src={video.src} type="video/quicktime" />
              <source src={video.src} type="video/mp4" />
            </video>
          </div>
        );
      })}

      {/* SELECTOR SUTIL DE LOS 2 VIDEOS */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        {VIDEOS_MITAD_HABITACIONES.map((_, i) => (
          <button
            key={i}
            onClick={() => setVideoActivo(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === videoActivo
                ? 'w-6 h-2 bg-[#C5A059]'
                : 'w-2 h-2 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Ver video ${i + 1}`}
          />
        ))}
      </div>

      {/* BOTÓN FLOTANTE DISCRETO PARA AUDIO */}
      <button
        onClick={() => setSonido(!sonido)}
        className="absolute bottom-6 right-6 z-30 bg-black/45 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5"
        aria-label={sonido ? "Silenciar video" : "Activar sonido"}
      >
        {sonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
        <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
          {sonido ? "Audio ON" : "Audio OFF"}
        </span>
      </button>
    </section>
  );
}

export default function PaginaHabitaciones() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);

  // Estado para la ventana emergente modal de servicios
  const [servicioModal, setServicioModal] = useState<DetalleServicio | null>(null);

  // Cambio automático entre los 2 videos de Hero cada 9s
  useEffect(() => {
    const intervalHero = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % VIDEOS_HERO_HABITACIONES.length);
    }, 9000);
    return () => clearInterval(intervalHero);
  }, []);

  const abrirModal = (nombreServicio: string) => {
    const data = INFO_SERVICIOS[nombreServicio];
    if (data) {
      setServicioModal(data);
    }
  };

  const primerGrupoHabitaciones = HABITACIONES.slice(0, 3);
  const segundoGrupoHabitaciones = HABITACIONES.slice(3);

  return (
    <main className={`w-full bg-[#FAF7F2] text-[#2a2421] antialiased min-h-screen ${outfit.className}`}>
      
      {/* HEADER GLOBAL */}
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
            className="w-12 h-12 rounded-full bg-black/35 hover:bg-[#071326] text-white border border-white/20 flex items-center justify-center shadow-xl active:scale-90 transition-all duration-300 cursor-pointer backdrop-blur-xl"
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

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#071326]/95 backdrop-blur-3xl p-10 sm:p-12 flex flex-col justify-between border-l border-white/15 shadow-2xl transition-transform duration-500 ease-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className={`${montserrat.className} text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold`}>
              Abadía Casa Hotel
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-left my-auto">
            <Link onClick={() => setMenuAbierto(false)} href="/" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Inicio</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}> Habitaciones</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Otros Espacios de la Casa</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Qué hacer en San Antero</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Reservas & Pagos</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <span>Caribe</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          BANNER PRINCIPAL: 2 VIDEOS .MOV CON CONTROLES (HERO)
          ======================================================== */}
      <section className="relative h-[85vh] sm:h-[92vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 sm:pb-16 items-center">
        {VIDEOS_HERO_HABITACIONES.map((video, idx) => {
          const activo = idx === videoHeroActivo;
          return (
            <div
              key={video.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                activo ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <video
                poster={video.poster}
                autoPlay
                muted={!heroSonido}
                loop
                playsInline
                preload="auto"
                onLoadedData={(e) => {
                  e.currentTarget.play().catch(() => {});
                }}
                className="w-full h-full object-cover scale-105"
              >
                <source src={video.src} type="video/quicktime" />
                <source src={video.src} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />
            </div>
          );
        })}

        {/* SELECTOR FLOTANTE PARA CAMBIAR ENTRE LOS 2 VIDEOS */}
        <div className="absolute top-24 sm:top-28 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20">
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-white/70">
            Video
          </span>
          <div className="flex items-center gap-1.5">
            {VIDEOS_HERO_HABITACIONES.map((_, i) => (
              <button
                key={i}
                onClick={() => setVideoHeroActivo(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === videoHeroActivo
                    ? 'w-6 sm:w-7 h-2 bg-[#C5A059]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Ver video ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOTÓN FLOTANTE AUDIO HERO */}
        <button
          onClick={() => setHeroSonido(!heroSonido)}
          className="absolute bottom-6 right-6 sm:right-12 z-30 bg-black/45 hover:bg-[#071326] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-2"
          aria-label={heroSonido ? "Silenciar video" : "Activar sonido"}
          title={heroSonido ? "Silenciar video" : "Activar sonido"}
        >
          {heroSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
          <span className="text-[9px] uppercase font-mono tracking-widest hidden sm:inline">
            {heroSonido ? "Sonido ON" : "Sonido OFF"}
          </span>
        </button>

        {/* TÍTULO EDITORIAL EN HERO */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-2 text-center px-4">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-white/80 font-bold block`}>
            Colección de Estancias
          </span>
          <div className="relative inline-block">
            <h1 className={`${montserrat.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
              NUESTRAS
            </h1>
            <span className={`${alexBrush.className} block text-5xl sm:text-7xl text-[#7C9D96] -mt-3 sm:-mt-6 tracking-wide drop-shadow-md`}>
              Habitaciones?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-200 font-light max-w-lg mx-auto pt-1">
            Explora las 6 estancias boutique en pantalla completa con sus especificaciones de confort y capacidad.
          </p>

          <div className="pt-2">
            <Link
              href="#catalogo-estancias"
              className={`${montserrat.className} inline-flex items-center gap-2 bg-[#8c7355] hover:bg-[#071326] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(0,0,0,0.55)] transition-all duration-300 active:scale-95`}
            >
              <span>Ver Catálogo</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSICIÓN EDITORIAL: TÍTULO EN DORADO CON DETALLE SCRIPT */}
      <section id="catalogo-estancias" className="bg-[#FAF7F2] py-12 sm:py-16 px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              CATÁLOGO DE LAS
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              6 Estancias?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-2">
            Desliza las fotografías de cada estancia usando los controles de carrusel y consulta abajo sus servicios incluidos.
          </p>
        </div>
      </section>

      {/* 1. PRIMERAS 3 HABITACIONES */}
      <div className="w-full">
        {primerGrupoHabitaciones.map((hab) => (
          <HabitacionFullScreenItem key={hab.id} hab={hab} onAbrirServicio={abrirModal} />
        ))}
      </div>

      {/* ========================================================
          BANNER A MITAD DE PÁGINA: FULL SCREEN CON 2 VIDEOS 100% LIMPIO
          (SIN LETRAS, SIN TÍTULOS NI TEXTOS)
          ======================================================== */}
      <BannerMitadPageVideos />

      {/* 2. SIGUIENTES 3 HABITACIONES */}
      <div className="w-full">
        {segundoGrupoHabitaciones.map((hab) => (
          <HabitacionFullScreenItem key={hab.id} hab={hab} onAbrirServicio={abrirModal} />
        ))}
      </div>

      {/* VENTANA EMERGENTE (MODAL) DE SERVICIOS */}
      {servicioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            onClick={() => setServicioModal(null)} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl border-2 border-[#071326]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] space-y-5 text-stone-900 z-10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-[#071326]/15 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-[#FAF7F2] border border-[#071326]/20">
                  {servicioModal.icono}
                </span>
                <div>
                  <span className={`${montserrat.className} text-[10px] uppercase tracking-widest text-[#8c7355] font-bold block`}>
                    Servicio de la Estancia
                  </span>
                  <h4 className={`${montserrat.className} text-xl sm:text-2xl font-bold text-[#071326]`}>
                    {servicioModal.nombre}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setServicioModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#071326] text-stone-700 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm sm:text-base text-[#5a483a] leading-relaxed font-normal">
              {servicioModal.resumen}
            </p>

            <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#071326]/20">
              <span className={`${montserrat.className} text-[10px] uppercase tracking-wider text-[#7d6553] font-bold block`}>
                Especificaciones:
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#5a483a]">
                {servicioModal.detalles.map((det, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8c7355] font-bold mt-0.5">✓</span>
                    <span>{det}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setServicioModal(null)}
              className={`${montserrat.className} w-full bg-[#8c7355] hover:bg-[#071326] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md active:scale-95`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold font-mono">
            © 2026 Hotel Abadía. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}