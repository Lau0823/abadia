'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bitter, Outfit } from 'next/font/google';

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

// --- CATEGORÍAS EN CÍRCULOS (3 POR FILA) ---
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
    ruta: "/atardeceres",
    imagen: "/categorias/atardecer.png"
  }
];

// --- 2 VIDEOS PARA EL BANNER HERO ---
const VIDEOS_HERO_ESPACIOS = [
  {
    id: 1,
    titulo: "Piscina & Solárium",
    src: "/IMG_2254.mov",
    poster: "/piscina.png"
  },
  {
    id: 2,
    titulo: "Acceso & Parqueadero Privado",
    src: "/IMG_2396.MOV",
    poster: "/Code_Generated_Image.png"
  }
];

interface EspacioCompleto {
  id: string;
  numero: string;
  nombre: string;
  etiqueta: string;
  horario: string;
  video: string;
  descripcionLarga: string;
  caracteristicas: string[];
  fotosAbajo: {
    src: string;
    titulo: string;
    pie: string;
  }[];
}

const ESPACIOS_CASA: EspacioCompleto[] = [
  {
    id: "piscina",
    numero: "01",
    nombre: "Piscina Abadía",
    etiqueta: "Recreación, Sol & Descanso",
    horario: "Disponible para huéspedes",
    video: "/IMG_2254.mov",
    descripcionLarga:
      "Nuestra piscina principal es el punto de encuentro predilecto bajo el sol caribeño. Diseñada para toda la familia, cuenta con una amplia piscina de adultos, piscina infantil para los más pequeños, kiosko fresco, asoleadoras ergonómicas privadas y duchas de agua dulce rodeadas de palmeras tropicales.",
    caracteristicas: [
      "Piscina grande para adultos",
      "Piscina infantil para niños",
      "Kiosko sombreado y asoleadoras",
      "Duchas de agua dulce exteriores",
      "Ambiente privado y familiar",
      "Atardeceres frente a la brisa"
    ],
    fotosAbajo: [
      {
        src: "/piscina.png",
        titulo: "Zona de Asoleadoras & Kiosko",
        pie: "Espacio amplio para relajarse a la sombra o tomar el sol tras volver de la playa."
      }
    ]
  },
  {
    id: "parqueadero",
    numero: "02",
    nombre: "Entrada & Parqueadero Privado",
    etiqueta: "Acceso Vehicular & Seguridad",
    horario: "Monitoreo 24 Horas",
    video: "/IMG_2396.MOV",
    descripcionLarga:
      "Acceso directo y seguro pensado para tu total tranquilidad desde el primer instante de tu llegada. Un predio cerrado, vigilado y pavimentado con capacidad amplia para vehículos familiares y camionetas, situado a pocos pasos de la recepción y las habitaciones.",
    caracteristicas: [
      "Acceso cerrado y privado dentro del predio",
      "Vigilancia y monitoreo permanente",
      "Espacio cómodo para camionetas y automóviles",
      "Iluminación nocturna de seguridad",
      "Conexión directa e inmediata a recepción",
      "Sin costo adicional para huéspedes"
    ],
    fotosAbajo: [
      {
        src: "/Code_Generated_Image.png",
        titulo: "Portón de Ingreso & Vía de Acceso",
        pie: "Entrada vehicular cómoda y directa desde la vía de Playa Blanca."
      }
    ]
  }
];

const Icons = {
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
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
  ),
  Refresh: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
};

// --- COMPONENTE DE ESPACIO FULL SCREEN CON RESPALDO AL TAP ---
function EspacioFullScreenCard({ espacio }: { espacio: EspacioCompleto }) {
  const [esRespaldo, setEsRespaldo] = useState(false);
  const [sonido, setSonido] = useState(false);

  const consultarWhatsApp = () => {
    const msj = encodeURIComponent(
      `Hola! Deseo más información sobre el espacio ${espacio.nombre} en Abadía Casa Hotel.`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <section className="relative h-[90vh] sm:h-screen w-full overflow-hidden bg-[#071326] select-none border-0">
      
      {/* ========================================================
          VISTA FRENTE: VIDEO FULL SCREEN EN VIVO
          ======================================================== */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          esRespaldo ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
        }`}
      >
        <video
          key={espacio.video}
          autoPlay
          muted={!sonido}
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover scale-105"
        >
          <source src={espacio.video} type="video/quicktime" />
          <source src={espacio.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/90 via-black/25 to-black/35 pointer-events-none" />

        {/* AUDIO FLOTANTE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSonido(!sonido);
          }}
          className="absolute bottom-28 right-6 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5 border-0"
          aria-label={sonido ? "Silenciar video" : "Activar sonido"}
        >
          {sonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
          <span className={`${bitter.className} text-[9px] uppercase tracking-wider hidden sm:inline`}>
            {sonido ? "Audio ON" : "Audio OFF"}
          </span>
        </button>

        {/* INFORMACIÓN BASE DEL FRENTE */}
        <div className="absolute bottom-10 left-6 right-6 z-20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`${bitter.className} bg-white text-[#071326] px-3.5 py-1 rounded-full text-xs font-bold font-mono shadow-md`}>
                  {espacio.numero}
                </span>
                <span className="text-xs text-slate-300 uppercase tracking-wider font-light">
                  {espacio.etiqueta}
                </span>
              </div>

              <h2 className={`${bitter.className} text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-md`}>
                {espacio.nombre}
              </h2>

              <p className="text-xs text-slate-200 font-mono">
                {espacio.horario}
              </p>
            </div>

            {/* BOTÓN TAP PARA VOLTEAR AL RESPALDO */}
            <button
              onClick={() => setEsRespaldo(true)}
              className={`${bitter.className} bg-white hover:bg-slate-100 text-[#071326] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl cursor-pointer border-0 shrink-0`}
            >
              <Icons.Refresh />
              <span>Ver Respaldo & Detalles</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          VISTA RESPALDO (BACK): DETALLES, COMODIDADES & FOTOS
          ======================================================== */}
      <div 
        className={`absolute inset-0 bg-[#071326] p-6 sm:p-12 overflow-y-auto transition-opacity duration-700 ease-in-out flex flex-col justify-between ${
          esRespaldo ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto w-full my-auto space-y-6 text-white text-left py-8">
          
          {/* Cabecera del respaldo */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                RESPALDO • {espacio.etiqueta}
              </span>
              <h3 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white`}>
                {espacio.nombre}
              </h3>
            </div>

            {/* Botón para regresar al frente */}
            <button
              onClick={() => setEsRespaldo(false)}
              className={`${bitter.className} bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-0`}
            >
              <Icons.Refresh />
              <span>Volver al Video</span>
            </button>
          </div>

          {/* Horario y estado */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="bg-white/5 px-3 py-1.5 rounded-full font-mono">
              {espacio.horario}
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Acceso exclusivo para huéspedes de Abadía Casa Hotel
            </span>
          </div>

          {/* Descripción completa */}
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
            {espacio.descripcionLarga}
          </p>

          {/* Comodidades con punticos limpios */}
          <div className="bg-white/5 p-5 rounded-2xl space-y-3">
            <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-300 block`}>
              Servicios y Comodidades Incluidas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {espacio.caracteristicas.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fotografías complementarias del respaldo */}
          {espacio.fotosAbajo.length > 0 && (
            <div className="space-y-3 pt-1">
              <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-300 block`}>
                Fotografía Detallada:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {espacio.fotosAbajo.map((foto, index) => (
                  <div key={index} className="rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                    <div className="relative h-44 sm:h-52 w-full">
                      <Image
                        src={foto.src}
                        alt={foto.titulo}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white/5 space-y-0.5">
                      <p className={`${bitter.className} text-xs font-bold text-white uppercase`}>
                        {foto.titulo}
                      </p>
                      <p className="text-[11px] text-slate-300 font-light">
                        {foto.pie}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón WhatsApp */}
          <div className="pt-2">
            <button
              onClick={consultarWhatsApp}
              className={`${bitter.className} w-full sm:w-auto bg-white hover:bg-slate-100 text-[#071326] py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xl cursor-pointer border-0`}
            >
              Consultar Disponibilidad por WhatsApp
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}

export default function PaginaOtrosEspacios() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % VIDEOS_HERO_ESPACIOS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={`w-full bg-white text-[#071326] antialiased min-h-screen pb-20 ${outfit.className}`}>

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
          1. BANNER PRINCIPAL (HERO) CON 2 VIDEOS
          ======================================================== */}
      <section className="relative h-[85vh] sm:h-[92vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 sm:pb-16 items-center">
        {VIDEOS_HERO_ESPACIOS.map((video, idx) => {
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
        <div className="absolute top-24 sm:top-28 z-30 flex items-center gap-2.5 bg-[#071326]/75 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border-0 shadow-lg">
          <span className={`${bitter.className} text-[10px] uppercase font-bold tracking-widest text-white/70`}>
            {VIDEOS_HERO_ESPACIOS[videoHeroActivo].titulo}
          </span>
          <div className="flex items-center gap-1.5">
            {VIDEOS_HERO_ESPACIOS.map((_, i) => (
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
            Rincones de Calma & Comodidad
          </span>
          <h1 className={`${bitter.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
            Otros Espacios
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-lg mx-auto">
            Conoce nuestra piscina cristalina con kiosko y el parqueadero privado vigilado dentro del predio.
          </p>

          <div className="pt-2">
            <Link
              href="#seccion-espacios-fullscreen"
              className={`${bitter.className} inline-flex items-center gap-2 bg-[#071326] hover:bg-[#0d2242] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 active:scale-95 border-0`}
            >
              <span>Explorar Espacios</span>
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

      {/* TÍTULO INTRODUCTORIO */}
      <section id="seccion-espacios-fullscreen" className="bg-white py-10 px-6 text-center border-0">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold block`}>
            ÁREAS COMUNES
          </span>
          <h2 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Piscina & Parqueadero Privado
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Explora cada área en pantalla completa y toca el botón del respaldo para ver detalles y comodidades.
          </p>
        </div>
      </section>

      {/* ========================================================
          3. LAS CARDS FULL SCREEN SEGUIDAS (CON RESPALDO AL TAP)
          ======================================================== */}
      <div className="w-full flex flex-col">
        {ESPACIOS_CASA.map((espacio) => (
          <EspacioFullScreenCard key={espacio.id} espacio={espacio} />
        ))}
      </div>

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