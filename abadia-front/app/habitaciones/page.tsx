'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bitter, Outfit } from 'next/font/google';
import { API_URL } from '@/lib/api';

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const NUMERO_WHATSAPP = "573122373415";

// --- CATEGORÍAS (3 POR FILA) ---
interface CategoriaCircular {
  id: string;
  nombre: string;
  ruta: string;
  imagen: string;
}

const CATEGORIAS_CIRCULARES: CategoriaCircular[] = [
  {
    id: "habitaciones",
    nombre: "Habitaciones",
    ruta: "/habitaciones",
    imagen: "/categorias/habitaciones.png"
  },
  {
    id: "gastronomia",
    nombre: "Gastronomía",
    ruta: "/gastronomia",
    imagen: "/categorias/gastronomia.png"
  },
  {
    id: "otros-espacios",
    nombre: "Espacios",
    ruta: "/otros-espacios",
    imagen: "/categorias/piscina.png"
  },
  {
    id: "que-hacer",
    nombre: "Qué Hacer",
    ruta: "/que-hacer",
    imagen: "/categorias/que hacer.png"
  },
  {
    id: "transporte",
    nombre: "Cómo Llegar",
    ruta: "/transporte",
    imagen: "/categorias/mapa.png"
  },
  {
    id: "atardeceres",
    nombre: "Atardeceres",
    ruta: "atardeceres",
    imagen: "/categorias/atardecer.png"
  }
];

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
    resumen: "Refrigerador compacto privado para mantener bebidas frías, agua y refrigerios a tu alcance.",
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
  },
  "Hidratación": {
    nombre: "Hidratación",
    icono: "💧",
    resumen: "Disponibilidad de agua fresca purificada e hidratación constante para tu bienestar durante la estancia frente al mar.",
    detalles: [
      "Agua fresca potable purificada disponible.",
      "Estación de hidratación en la habitación.",
      "Servicio continuo de atención y reposición."
    ]
  }
};

interface Estancia {
  id: string;
  categoria: string;
  ubicacion: string;
  precio: string;
  noches: string;
  capacidad: string;
  descripcion: string;
  imagenes: string[];
  servicios?: string[];
}

const ESTANCIAS_DEFAULT: Estancia[] = [
  {
    id: "estancia-1",
    categoria: "Confort & Mar",
    ubicacion: "San Antero, Playa Blanca",
    precio: "$70.000",
    noches: "/ noche",
    capacidad: "4 Personas",
    descripcion: "Estancia concebida para una experiencia íntima. Cuenta con balcón panorámico hacia el entorno natural, lencería fresca de alta suavidad, ducha de descanso y acabados costeros limpios.",
    imagenes: [
      "/Habitaciones/habitacion1.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "/Habitaciones/habitacion101.png"
    ]
  },
  {
    id: "estancia-2",
    categoria: "Cabaña",
    ubicacion: "San Antero, Playa Blanca",
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
    id: "estancia-3",
    categoria: "Ala Silente",
    ubicacion: "Planta Baja",
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
    id: "estancia-4",
    categoria: "Cabaña Familiar",
    ubicacion: "Paso Directo a la Arena",
    precio: "$70.000",
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
    id: "estancia-5",
    categoria: "Bungalow",
    ubicacion: "Primera Línea de Playa",
    precio: "$80.000",
    noches: "/ noche",
    capacidad: "4 a 6 Personas",
    descripcion: "Ubicado a escasos metros de la orilla de la playa, con hamaca privada, acabados en maderas nobles, ambiente fresco y el sonido ininterrumpido de las olas.",
    imagenes: [
      "/Habitaciones/habitacion5/DSC05772.jpeg",
      "/Habitaciones/habitacion5/DSC05770.jpeg",
      "/Habitaciones/habitacion5/DSC05779.jpeg"
    ]
  },
  {
    id: "estancia-6",
    categoria: "Penthouse",
    ubicacion: "Nivel Superior • Vista Panorámica",
    precio: "$80.000",
    noches: "/ noche",
    capacidad: "4 a 6 Personas",
    descripcion: "Nuestra estancia más amplia en el nivel superior, con ventanales generosos, gran capacidad de acomodación y excelente ventilación natural para una estancia placentera.",
    imagenes: [
      "/Habitaciones/habitacion6.jpeg",
    ]
  }
];

const formatearHabitacionBackend = (hab: any): Estancia => {
  const precioNum = Number(hab.precio) || 70000;
  const precioFormateado = `$${precioNum.toLocaleString('es-CO')}`;

  const fotos = (hab.imagenes && Array.isArray(hab.imagenes) && hab.imagenes.length > 0)
    ? hab.imagenes
    : (hab.imagen ? [hab.imagen] : ['/Habitaciones/habitacion1.jpeg']);

  return {
    id: hab.id,
    categoria: hab.titulo || 'Estancia de Lujo',
    ubicacion: hab.subtitulo || 'San Antero, Playa Blanca',
    precio: precioFormateado,
    noches: '/ noche',
    capacidad: hab.ocupacion || '4 Personas',
    descripcion: hab.descripcion || 'Estancia concebida para una experiencia íntima. Cuenta con balcón panorámico hacia el entorno natural, lencería fresca y acabados costeros limpios.',
    imagenes: fotos,
    servicios: hab.comodidades && Array.isArray(hab.comodidades) && hab.comodidades.length > 0 ? hab.comodidades : undefined,
  };
};

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

function EstanciaFullScreenItem({ 
  estancia, 
  onAbrirServicio 
}: { 
  estancia: Estancia; 
  onAbrirServicio: (nombre: string) => void; 
}) {
  const [fotoIndex, setFotoIndex] = useState(0);

  const maxPersonas = obtenerCapacidadMaxima(estancia.capacidad);
  const [personas, setPersonas] = useState(2);
  const [noches, setNoches] = useState(1);
  const [fechaLlegada, setFechaLlegada] = useState('');

  const tarifaBase = parsearPrecio(estancia.precio);
  const precioTotal = tarifaBase * personas * noches;
  const precioTotalFormateado = `$${precioTotal.toLocaleString('es-CO')}`;

  const anterior = () => {
    setFotoIndex((prev) => (prev === 0 ? estancia.imagenes.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setFotoIndex((prev) => (prev + 1) % estancia.imagenes.length);
  };

  const cotizarWhatsApp = async () => {
    // Si la estancia tiene ID real de base de datos, registramos la cotización en el backend
    if (estancia.id && !estancia.id.startsWith('estancia-')) {
      try {
        await fetch(`${API_URL}/reservations/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: {
              nombre: 'Interesado Web',
              telefono: '',
              correo: '',
              documento: `WEB-${Date.now().toString().slice(-6)}`,
              tipoDocumento: 'CC'
            },
            reserva: {
              habitacion_id: estancia.id,
              checkIn: fechaLlegada || new Date().toISOString().split('T')[0],
              checkOut: fechaLlegada || new Date(Date.now() + 86400000).toISOString().split('T')[0],
              numeroAdultos: personas,
              numeroNinos: 0
            }
          })
        });
      } catch (err) {
        console.error("Error registrando cotización:", err);
      }
    }

    const fechaTexto = fechaLlegada ? ` para la fecha ${fechaLlegada}` : '';
    const msj = encodeURIComponent(
      `Hola! Deseo cotizar estancia (${estancia.categoria}) en Abadía Casa Hotel.\n` +
      `Tarifa: ${estancia.precio} por persona/noche\n` +
      `Huéspedes: ${personas} personas\n` +
      `Estancia: ${noches} ${noches === 1 ? 'noche' : 'noches'}${fechaTexto}\n` +
      `Total estimado: ${precioTotalFormateado} COP.`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  const reservarWhatsApp = async () => {
    // Registra la reserva en el backend
    if (estancia.id && !estancia.id.startsWith('estancia-')) {
      try {
        await fetch(`${API_URL}/reservations/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: {
              nombre: 'Reserva Directa Web',
              telefono: '',
              correo: '',
              documento: `WEB-${Date.now().toString().slice(-6)}`,
              tipoDocumento: 'CC'
            },
            reserva: {
              habitacion_id: estancia.id,
              checkIn: fechaLlegada || new Date().toISOString().split('T')[0],
              checkOut: fechaLlegada || new Date(Date.now() + 86400000).toISOString().split('T')[0],
              numeroAdultos: personas,
              numeroNinos: 0
            }
          })
        });
      } catch (err) {
        console.error("Error registrando reserva:", err);
      }
    }

    const fechaTexto = fechaLlegada ? ` con llegada el ${fechaLlegada}` : '';
    const msj = encodeURIComponent(
      `Hola! Deseo realizar la RESERVA INMEDIATA de la estancia (${estancia.categoria}) en Abadía Casa Hotel.\n` +
      `Huéspedes: ${personas} personas\n` +
      `Noches: ${noches} ${noches === 1 ? 'noche' : 'noches'}${fechaTexto}\n` +
      `Total a pagar: ${precioTotalFormateado} COP.\n` +
      `Por favor indíquenme los medios de pago para asegurar la reserva.`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <article className="w-full bg-white border-0">
      {/* FOTO FULL SCREEN */}
      <div className="relative h-[80vh] sm:h-[88vh] md:h-[92vh] w-full overflow-hidden bg-black select-none group">
        <Image
          src={estancia.imagenes[fotoIndex]}
          alt={`${estancia.categoria} foto ${fotoIndex + 1}`}
          fill
          unoptimized
          priority
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />

        {/* CONTROLES CARRUSEL */}
        <button
          onClick={anterior}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer shadow-xl border-0"
          aria-label="Foto anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguiente}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer shadow-xl border-0"
          aria-label="Siguiente foto"
        >
          <Icons.ChevronRight />
        </button>

        {/* INFORMACIÓN SOBRE LA BASE DE LA FOTO */}
        <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white text-left">
            <div>
              {estancia.ubicacion && (
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 block font-semibold mb-1">
                  📍 {estancia.ubicacion}
                </span>
              )}
              <h3 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-md`}>
                {estancia.categoria}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className={`${bitter.className} text-[10px] uppercase tracking-widest text-slate-300 font-bold block`}>
                Tarifa Base
              </span>
              <span className={`${bitter.className} text-2xl sm:text-3xl font-bold text-white`}>
                {estancia.precio} <span className="text-xs text-white/70 font-normal">por persona / noche</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETALLES Y FORMULARIO */}
      <div className="bg-white py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start justify-between gap-10 text-left">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className={`${bitter.className} bg-[#071326] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full shadow-sm`}>
                {estancia.categoria}
              </span>
              <span className={`${bitter.className} text-xs font-semibold uppercase text-slate-600`}>
                👥 Capacidad: {estancia.capacidad}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
              {estancia.descripcion}
            </p>

            {/* BOTONES DE SERVICIOS CON PUNTICO LIMPIO */}
            <div className="pt-2">
              <span className={`${bitter.className} text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold block mb-3`}>
                Servicios Incluidos (Toca para ver detalles):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(estancia.servicios && estancia.servicios.length > 0 
                  ? estancia.servicios 
                  : ["Baño privado", "Nevera minibar", "Aire acondicionado", "Televisor Smart TV"]
                ).map((srv, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onAbrirServicio(srv)}
                    className="group bg-white hover:bg-[#071326] p-3.5 rounded-2xl border-0 text-xs font-medium text-slate-800 hover:text-white flex items-center justify-between shadow-[0_4px_16px_rgba(7,19,38,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#071326] group-hover:bg-white transition-colors shrink-0" />
                      <span className="truncate">{srv}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-white/80 transition-colors">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FORMULARIO BLANCO, SIN BORDES, CON SOMBRA */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border-0 shadow-[0_15px_45px_rgba(7,19,38,0.1)] flex flex-col gap-6 shrink-0 w-full lg:w-92">
            <div>
              <span className={`${bitter.className} text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold block`}>
                Calcula tu Estancia
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xs text-slate-500 font-light">Tarifa por persona:</span>
                <span className={`${bitter.className} text-lg font-bold text-[#071326]`}>
                  {estancia.precio}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Huéspedes */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border-0 shadow-[0_4px_14px_rgba(7,19,38,0.05)]">
                <div>
                  <span className={`${bitter.className} text-xs font-semibold text-slate-800 block`}>Huéspedes</span>
                  <span className="text-[10px] text-slate-400 font-light">Máx. {maxPersonas} personas</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                    disabled={personas <= 1}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-sm flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm"
                  >
                    −
                  </button>
                  <span className={`${bitter.className} w-5 text-center font-bold text-slate-800 text-sm`}>
                    {personas}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPersonas((p) => Math.min(maxPersonas, p + 1))}
                    disabled={personas >= maxPersonas}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-sm flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Noches */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border-0 shadow-[0_4px_14px_rgba(7,19,38,0.05)]">
                <div>
                  <span className={`${bitter.className} text-xs font-semibold text-slate-800 block`}>Noches</span>
                  <span className="text-[10px] text-slate-400 font-light">Tiempo de estadía</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNoches((n) => Math.max(1, n - 1))}
                    disabled={noches <= 1}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-sm flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm"
                  >
                    −
                  </button>
                  <span className={`${bitter.className} w-5 text-center font-bold text-slate-800 text-sm`}>
                    {noches}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNoches((n) => Math.min(30, n + 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Fecha */}
              <div className="bg-white p-3.5 rounded-2xl border-0 shadow-[0_4px_14px_rgba(7,19,38,0.05)]">
                <label htmlFor={`fecha-${estancia.id}`} className={`${bitter.className} text-[10px] uppercase font-bold text-slate-500 block mb-1.5`}>
                  Fecha estimada de llegada (opcional)
                </label>
                <input
                  id={`fecha-${estancia.id}`}
                  type="date"
                  value={fechaLlegada}
                  onChange={(e) => setFechaLlegada(e.target.value)}
                  className="w-full bg-slate-50 border-0 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#071326]/20 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* PRECIO TOTAL */}
            <div className="bg-white p-4 rounded-2xl border-0 shadow-[0_6px_20px_rgba(7,19,38,0.06)]">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>{personas} {personas === 1 ? 'persona' : 'personas'} × {noches} {noches === 1 ? 'noche' : 'noches'}</span>
                <span>{estancia.precio} c/u</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-[#071326]`}>
                  Precio Total:
                </span>
                <span className={`${bitter.className} text-2xl font-extrabold text-[#071326]`}>
                  {precioTotalFormateado} <span className="text-[11px] text-slate-400 font-normal">COP</span>
                </span>
              </div>
            </div>

            {/* BOTONES */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={cotizarWhatsApp}
                className={`${bitter.className} w-full bg-white hover:bg-slate-100 text-[#071326] border-0 py-3.5 px-4 rounded-2xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md`}
              >
                <Icons.WhatsApp />
                <span>Cotizar Habitación</span>
              </button>

              <button
                type="button"
                onClick={reservarWhatsApp}
                className={`${bitter.className} w-full bg-[#071326] hover:bg-[#0d2242] text-white border-0 py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
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

function BannerMitadPageVideos({ videos = VIDEOS_MITAD_HABITACIONES }: { videos?: { id: number; src: string; poster: string }[] }) {
  const [videoActivo, setVideoActivo] = useState(0);
  const [sonido, setSonido] = useState(false);

  useEffect(() => {
    if (videos.length <= 1) return;
    const interval = setInterval(() => {
      setVideoActivo((prev) => (prev + 1) % videos.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <section className="relative h-[75vh] sm:h-[90vh] w-full overflow-hidden bg-black select-none">
      {videos.map((video, idx) => {
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

      {videos.length > 1 && (
        <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-[#071326]/75 backdrop-blur-md px-3 py-1.5 rounded-full border-0 shadow-lg">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setVideoActivo(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === videoActivo
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Ver video ${i + 1}`}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setSonido(!sonido)}
        className="absolute bottom-6 right-6 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5 border-0"
        aria-label={sonido ? "Silenciar video" : "Activar sonido"}
      >
        {sonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
        <span className={`${bitter.className} text-[9px] uppercase tracking-wider hidden sm:inline`}>
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
  const [servicioModal, setServicioModal] = useState<DetalleServicio | null>(null);

  // Estado dinámico conectado con el Backend
  const [estancias, setEstancias] = useState<Estancia[]>(ESTANCIAS_DEFAULT);
  const [videosHero, setVideosHero] = useState(VIDEOS_HERO_HABITACIONES);
  const [videosMitad, setVideosMitad] = useState(VIDEOS_MITAD_HABITACIONES);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar habitaciones dinámicas desde el backend
  useEffect(() => {
    fetch(`${API_URL}/habitaciones`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : data?.data || [];
        if (lista.length > 0) {
          const activas = lista.filter((h: any) => h.estado !== 'MANTENIMIENTO');
          if (activas.length > 0) {
            setEstancias(activas.map(formatearHabitacionBackend));
          }
        }
      })
      .catch(err => {
        console.warn("Utilizando catálogo predeterminado:", err);
      })
      .finally(() => setCargando(false));
  }, []);

  // 2. Cargar videos configurados en multimedia desde el backend
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(settings => {
        if (Array.isArray(settings)) {
          const v1 = settings.find((s: any) => s.clave === 'hero_video_1')?.valor;
          const v2 = settings.find((s: any) => s.clave === 'hero_video_2')?.valor;
          const vMid = settings.find((s: any) => s.clave === 'video_mid')?.valor;

          const nuevosHero: { id: number; src: string; poster: string }[] = [];
          if (v1) nuevosHero.push({ id: 1, src: v1, poster: "" });
          if (v2) nuevosHero.push({ id: 2, src: v2, poster: "" });
          if (nuevosHero.length > 0) setVideosHero(nuevosHero);

          if (vMid) {
            setVideosMitad([{ id: 1, src: vMid, poster: "" }]);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (videosHero.length <= 1) return;
    const intervalHero = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % videosHero.length);
    }, 9000);
    return () => clearInterval(intervalHero);
  }, [videosHero.length]);

  const abrirModal = (nombreServicio: string) => {
    const data = INFO_SERVICIOS[nombreServicio] || {
      nombre: nombreServicio,
      icono: "✨",
      resumen: `Servicio de ${nombreServicio} incluido y garantizado para tu bienestar y descanso en Abadía.`,
      detalles: [
        "Disponible para todos los huéspedes de la habitación.",
        "Mantenimiento e higiene certificados.",
        "Atención personalizada por el equipo de Abadía."
      ]
    };
    setServicioModal(data);
  };

  const puntoMedio = Math.max(1, Math.ceil(estancias.length / 2));
  const primerGrupoHabitaciones = estancias.slice(0, puntoMedio);
  const segundoGrupoHabitaciones = estancias.slice(puntoMedio);

  return (
    <main className={`w-full bg-white text-[#071326] antialiased min-h-screen ${outfit.className}`}>
      
      {/* HEADER GLOBAL */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-none">
        <div className="w-10 sm:w-12" />

        <div className="pointer-events-auto flex items-center justify-center">
          <Link href="/" className="relative w-36 h-12 sm:w-56 sm:h-18 cursor-pointer drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-300 block">
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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#071326]/75 hover:bg-[#071326] text-white flex items-center justify-center active:scale-90 transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-md border-0"
            aria-label="Abrir Menú"
          >
            <span className="text-lg sm:text-xl">☰</span>
          </button>
        </div>
      </header>

      {/* MENÚ LATERAL */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          menuAbierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div onClick={() => setMenuAbierto(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#071326]/95 backdrop-blur-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-out overflow-y-auto ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className={`${bitter.className} text-xs uppercase tracking-[0.25em] text-white/90 font-bold`}>
              Abadía Casa Hotel
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border-0"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-5 text-left my-auto py-6">
            <Link onClick={() => setMenuAbierto(false)} href="/" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Inicio</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Habitaciones</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/gastronomia" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Gastronomía</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/transporte" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Cómo Llegar & Transporte</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Otros Espacios de la Casa</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Qué hacer en San Antero</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Reservas & Pagos</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <Link href="/dashboard" className="text-white hover:underline font-bold">Dashboard 🗝️</Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. BANNER PRINCIPAL (HERO)
          ======================================================== */}
      <section className="relative h-[85vh] sm:h-[92vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 sm:pb-16 items-center">
        {videosHero.map((video, idx) => {
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

        {/* SELECTOR ENTRE VIDEOS */}
        {videosHero.length > 1 && (
          <div className="absolute top-24 sm:top-28 z-30 flex items-center gap-2.5 bg-[#071326]/75 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border-0 shadow-lg">
            <span className={`${bitter.className} text-[10px] uppercase font-bold tracking-widest text-white/70`}>
              Video
            </span>
            <div className="flex items-center gap-1.5">
              {videosHero.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVideoHeroActivo(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === videoHeroActivo
                      ? 'w-6 sm:w-7 h-2 bg-white'
                      : 'w-2 h-2 bg-white/40 hover:bg-white'
                  }`}
                  aria-label={`Ver video ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* AUDIO HERO */}
        <button
          onClick={() => setHeroSonido(!heroSonido)}
          className="absolute bottom-6 right-6 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl transition-all duration-300 active:scale-90 cursor-pointer flex items-center gap-2 shadow-xl border-0"
          aria-label={heroSonido ? "Silenciar video" : "Activar sonido"}
          title={heroSonido ? "Silenciar video" : "Activar sonido"}
        >
          {heroSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
          <span className={`${bitter.className} text-[9px] uppercase tracking-widest hidden sm:inline`}>
            {heroSonido ? "Sonido ON" : "Sonido OFF"}
          </span>
        </button>

        {/* TÍTULO HERO */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-3 text-center px-4">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold block`}>
            Colección de Estancias
          </span>
          <h1 className={`${bitter.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
            Nuestras Habitaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-lg mx-auto">
            Explora las estancias boutique en pantalla completa con sus especificaciones de confort y capacidad.
          </p>

          <div className="pt-2">
            <Link
              href="#catalogo-estancias"
              className={`${bitter.className} inline-flex items-center gap-2 bg-[#071326] hover:bg-[#0d2242] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 active:scale-95 border-0`}
            >
              <span>Ver Catálogo</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CATEGORÍAS EN CÍRCULOS (3 POR FILA)
          ======================================================== */}
      <section className="bg-white py-12 sm:py-16 px-4 border-0">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-y-8 gap-x-4 sm:gap-x-12 place-items-center">
            {CATEGORIAS_CIRCULARES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.ruta}
                className="flex flex-col items-center gap-3 group w-full max-w-[120px]"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[2.5px] border-0 shadow-[0_6px_20px_rgba(7,19,38,0.12)] group-hover:scale-105 transition-all duration-300 bg-white">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src={cat.imagen}
                      alt={cat.nombre}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                <span className={`${bitter.className} text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#071326] group-hover:text-slate-600 transition-colors text-center`}>
                  {cat.nombre}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TÍTULO DEL CATÁLOGO */}
      <section id="catalogo-estancias" className="bg-white py-10 sm:py-14 px-6 text-center border-0">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold block`}>
            ESTANCIA FRENTE AL MAR
          </span>
          <h2 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Catálogo de Estancias
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Desliza las fotografías de cada estancia usando los controles de carrusel y consulta abajo sus servicios incluidos.
          </p>
        </div>
      </section>

      {/* 3. PRIMERAS 3 ESTANCIAS */}
      <div className="w-full">
        {primerGrupoHabitaciones.map((estancia) => (
          <EstanciaFullScreenItem key={estancia.id} estancia={estancia} onAbrirServicio={abrirModal} />
        ))}
      </div>

      {/* 4. BANNER A MITAD DE PÁGINA (VIDEOS LIMPIOS) */}
      <BannerMitadPageVideos videos={videosMitad} />

      {/* 5. SIGUIENTES 3 ESTANCIAS */}
      <div className="w-full">
        {segundoGrupoHabitaciones.map((estancia) => (
          <EstanciaFullScreenItem key={estancia.id} estancia={estancia} onAbrirServicio={abrirModal} />
        ))}
      </div>

      {/* MODAL DE SERVICIOS */}
      {servicioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            onClick={() => setServicioModal(null)} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-md bg-white border-0 rounded-3xl p-6 sm:p-8 space-y-5 text-slate-900 z-10 animate-in zoom-in-95 duration-300 shadow-[0_25px_60px_rgba(7,19,38,0.25)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2.5 rounded-2xl bg-white shadow-sm border-0">
                  {servicioModal.icono}
                </span>
                <div>
                  <span className={`${bitter.className} text-[10px] uppercase tracking-widest text-slate-500 font-bold block`}>
                    Servicio de la Estancia
                  </span>
                  <h4 className={`${bitter.className} text-xl sm:text-2xl font-bold text-[#071326]`}>
                    {servicioModal.nombre}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setServicioModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#071326] text-slate-700 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer border-0"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {servicioModal.resumen}
            </p>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border-0 shadow-inner">
              <span className={`${bitter.className} text-[10px] uppercase tracking-wider text-slate-600 font-bold block`}>
                Especificaciones:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {servicioModal.detalles.map((det, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#071326] shrink-0" />
                    <span>{det}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setServicioModal(null)}
              className={`${bitter.className} w-full bg-[#071326] hover:bg-[#0d2242] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg active:scale-95 border-0`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* FOOTER OFICIAL ABADÍA */}
      <footer className="w-full bg-[#071326] text-white py-14 px-6 text-center border-0">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="relative w-40 sm:w-48 h-14 sm:h-16 filter brightness-0 invert opacity-95">
            <Image src="/logo.png" alt="Logo Abadía Footer" fill sizes="192px" className="object-contain" />
          </div>
          
          <div className="space-y-1">
            <p className={`${bitter.className} text-sm sm:text-base font-semibold tracking-wide`}>
              Abadía Casa Hotel • Playa Blanca, San Antero & Coveñas
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Un refugio de mar, calma y descanso auténtico frente al Golfo de Morrosquillo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-mono">
            <span>WhatsApp: +57 312 237 3415</span>
            <span>•</span>
            <span>San Antero, Córdoba, Colombia</span>
          </div>

          <div className="w-16 h-[1px] bg-white/20 my-1" />

          <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-2 gap-3 text-[11px] text-slate-400 font-light">
            <p>© 2026 Abadía Casa Hotel. Todos los derechos reservados.</p>
            <p className="tracking-wide">
              Hecho por{' '}
              <span className={`${bitter.className} font-bold text-white hover:text-slate-200 transition-colors`}>
                Si Forever Studio
              </span>
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}