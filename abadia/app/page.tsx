'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const VIDEOS_HERO = [
  {
    id: 1,
    src: "/BANNER QUE ES ABADIA.MOV",
    poster: "/Habitaciones/habitacion1.jpeg"
  },
  {
    id: 2,
    src: "/videosdebanner/copy_411D7CCA-6A4F-4751-9D4E-D68E00EF3485 (1).mov",
    poster: "/121017.jpg"
  }
];

const VIDEO_MID = {
  src: "/videosdebanner/copy_359F2AF5-3796-41C5-B3D0-B9AC83EF213B.mov",
  poster: "/121017.jpg"
};

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
  ShoppingCart: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
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

const esVideo = (url?: string) => {
  if (!url) return false;
  const limpio = url.split('?')[0].toLowerCase();
  const extensiones = ['.mov', '.mp4', '.webm', '.ogg', '.m4v'];
  return extensiones.some((ext) => limpio.endsWith(ext));
};

interface Habitacion {
  id: string;
  numero: string;
  titulo: string;
  precio: string;
  noches: string;
  medios: string[];
}

const HABITACIONES: Habitacion[] = [
  {
    id: "habitacion-1",
    numero: "1",
    titulo: "Habitación 1",
    precio: "$70.000",
    noches: "/ noche por persona",
    medios: [
      "/Habitaciones/habitacion1.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "/Habitaciones/habitacion101.png"
    ]
  },
  {
    id: "habitacion-2",
    numero: "2",
    titulo: "Habitación 2",
    precio: "$70.000",
    noches: "/ noche por persona",
    medios: [
      "/Habitaciones/habitacion2.mov",
      "/Habitaciones/habitacion2.PNG",
      "/Habitaciones/habitacion2.2.PNG"
    ]
  },
  {
    id: "habitacion-3",
    numero: "3",
    titulo: "Habitación 3",
    precio: "$70.000",
    noches: "/ noche por persona",
    medios: [
      "/Habitaciones/habitacion301.png",
      "/Habitaciones/habitacion3.jpeg",
      "/Habitaciones/301.png"
    ]
  },
  {
    id: "habitacion-4",
    numero: "4",
    titulo: "Habitación 4",
    precio: "$70.000",
    noches: "/ noche por persona",
    medios: [
      "/Habitaciones/habitacion4.jpeg",
      "/DSC05650.jpeg",
      "/DSC05657.jpeg",
    ]
  },
  {
    id: "habitacion-5",
    numero: "5",
    titulo: "Habitación 5",
    precio: "$80.000",
    noches: "/ noche por persona",
    medios: [
      "/videosdebanner/copy_359F2AF5-3796-41C5-B3D0-B9AC83EF213B.mov",
      "/Habitaciones/habitacion5/DSC05772.jpeg",
      "/Habitaciones/habitacion5/DSC05770.jpeg",
      "/Habitaciones/habitacion5/DSC05779.jpeg"
    ]
  },
  {
    id: "habitacion-6",
    numero: "6",
    titulo: "Habitación 6",
    precio: "$80.000",
    noches: "/ noche por persona",
    medios: [
      "/Habitaciones/habitacion6.jpeg",
    ]
  }
];

// --- ITEMS PARA EL CARRUSEL CON ESQUINAS REDONDAS Y SIN BORDES ---
interface ItemCotizarHabitacion {
  id: string;
  titulo: string;
  precio: string;
  imagen: string;
}

const CARDS_COTIZAR: ItemCotizarHabitacion[] = [
  {
    id: "hab-01",
    titulo: "HABITACIÓN 01",
    precio: "70.000 COP",
    imagen: "/Habitaciones/habitacion1.jpeg"
  },
  {
    id: "hab-02",
    titulo: "HABITACIÓN 02",
    precio: "70.000 COP",
    imagen: "/Habitaciones/habitacion2.PNG"
  },
  {
    id: "hab-03",
    titulo: "HABITACIÓN 03",
    precio: "70.000 COP",
    imagen: "/Habitaciones/habitacion3.jpeg"
  },
  {
    id: "hab-04",
    titulo: "HABITACIÓN 04",
    precio: "70.000 COP",
    imagen: "/Habitaciones/habitacion4.jpeg"
  },
  {
    id: "hab-05",
    titulo: "HABITACIÓN 05",
    precio: "80.000 COP",
    imagen: "/Habitaciones/habitacion5/DSC05772.jpeg"
  },
  {
    id: "hab-06",
    titulo: "HABITACIÓN 06",
    precio: "80.000 COP",
    imagen: "/Habitaciones/habitacion6.jpeg"
  }
];

const OTROS_ESPACIOS = [
  { id: "piscina", titulo: "Piscina Abadía", recurso: "/IMG_2254.mov" },
  { id: "parqueadero", titulo: "Entrada y Parqueadero Privado", recurso: "/IMG_2396.MOV" }
];

const QUE_HACER_ITEMS = [
  { id: 1, titulo: "Vicenta Arepa de Huevo", desc: "El sabor tradicional más famoso de la región.", src: "/vicenta.MOV", isVideo: true },
  { id: 2, titulo: "Punta Bonita", desc: "Mirador con vista abierta a los colores del atardecer.", src: "/atardecer.jpg", isVideo: false },
  { id: 3, titulo: "Playa Serena", desc: "Aguas calmas y arena suave para desconectar.", src: "/mar.mp4", isVideo: true },
  { id: 4, titulo: "Moto Acuática", desc: "Recorridos guiados por las bahías de San Antero.", src: "/IMG_2277.mov", isVideo: true },
  { id: 5, titulo: "Gastronomía Local", desc: "Restaurantes recomendados a minutos del hotel.", src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", isVideo: false },
  { id: 6, titulo: "Ecoturismo & Manglares", desc: "Paseos en lancha hacia la bahía de Cispatá.", src: "/atardeceres/DSC00012.JPG", isVideo: false }
];

const ATARDECERES_FOTOS = [
  { id: 1, titulo: "Playa Blanca", src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG" },
  { id: 2, titulo: "Marea Baja", src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG" },
  { id: 3, titulo: "Palmeras al Atardecer", src: "/atardeceres/DSC00012.JPG" },
  { id: 4, titulo: "Punta Bonita", src: "/sunshine.JPG" },
  { id: 5, titulo: "San Antero Mágico", src: "/amanecersan atnero.JPG" },
];

function GlobalHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-12 py-4 sm:py-6 flex items-center justify-between pointer-events-none">
        <div className="w-10 sm:w-12 pointer-events-none" />

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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#071326]/75 hover:bg-[#071326] text-white border border-white/20 flex items-center justify-center active:scale-90 transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-md"
            aria-label="Abrir Menú"
          >
            <span className="text-lg sm:text-xl">☰</span>
          </button>
        </div>
      </header>

      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          menuAbierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div onClick={() => setMenuAbierto(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#071326]/95 backdrop-blur-3xl p-6 sm:p-10 flex flex-col justify-between border-l border-white/10 transition-transform duration-500 ease-out overflow-y-auto ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className={`${bitter.className} text-xs uppercase tracking-[0.25em] text-white/90 font-bold`}>
              Abadía Casa Hotel
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-left my-auto py-6">
            <Link onClick={() => setMenuAbierto(false)} href="/" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Inicio
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Habitaciones
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/gastronomia" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Gastronomía 
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/transporte" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Cómo Llegar & Transporte
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Otros Espacios de la Casa
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Qué hacer en San Antero
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="#atardeceres-san-antero" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Atardeceres Playa Blanca
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/testimonios" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Testimonios & Huéspedes
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>
              Cómo Reservar & Pagos
            </Link>
          </nav>

          <div className="pt-5 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <Link href="/dashboard" className="text-white hover:underline font-bold">
              Dashboard 🗝️
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function GlobalFooter() {
  return (
    <footer className="w-full bg-[#071326] text-white py-14 px-6 text-center border-t border-white/10">
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
  );
}

export default function HomePage() {
  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);
  const [habitacionSonido, setHabitacionSonido] = useState(false);
  const [espacioSonido, setEspacioSonido] = useState(false);

  const [habitacionActivaIndex, setHabitacionActivaIndex] = useState(0);
  const [fotoHabitacionIndex, setFotoHabitacionIndex] = useState(0);

  const [espacioActivoIndex, setEspacioActivoIndex] = useState(0);
  const [atardecerActivoIndex, setAtardecerActivoIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const intervalHero = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % VIDEOS_HERO.length);
    }, 9000);
    return () => clearInterval(intervalHero);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const intervalHab = setInterval(() => {
      setFotoHabitacionIndex((prev) => (prev + 1) % HABITACIONES[habitacionActivaIndex].medios.length);
    }, 2200);
    return () => clearInterval(intervalHab);
  }, [isMounted, habitacionActivaIndex]);

  useEffect(() => {
    if (!isMounted) return;
    const intervalEsp = setInterval(() => {
      setEspacioActivoIndex((prev) => (prev + 1) % OTROS_ESPACIOS.length);
    }, 6000);
    return () => clearInterval(intervalEsp);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const intervalAtardeceres = setInterval(() => {
      setAtardecerActivoIndex((prev) => (prev + 1) % ATARDECERES_FOTOS.length);
    }, 4500);
    return () => clearInterval(intervalAtardeceres);
  }, [isMounted]);

  const habitacionActual = HABITACIONES[habitacionActivaIndex];
  const espacioActual = OTROS_ESPACIOS[espacioActivoIndex];
  const atardecerActual = ATARDECERES_FOTOS[atardecerActivoIndex];

  const medioActual = habitacionActual.medios[fotoHabitacionIndex];
  const esRecursoVideo = esVideo(medioActual);
  const espacioEsVideo = esVideo(espacioActual.recurso);

  const siguienteFoto = () => {
    setFotoHabitacionIndex((prev) => (prev + 1) % habitacionActual.medios.length);
  };

  const anteriorFoto = () => {
    setFotoHabitacionIndex((prev) => (prev === 0 ? habitacionActual.medios.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      siguienteFoto();
    } else if (diff < -45) {
      anteriorFoto();
    }
    touchStartX.current = null;
  };

  const cambiarHabitacion = (idx: number) => {
    setHabitacionActivaIndex(idx);
    setFotoHabitacionIndex(0);
  };

  const cotizarWhatsApp = (asunto: string) => {
    const msj = encodeURIComponent(`Hola! Deseo cotizar reserva en Abadía Casa Hotel para: ${asunto}`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <main className={`w-full bg-white text-[#071326] antialiased selection:bg-[#071326] selection:text-white overflow-x-hidden ${outfit.className}`}>

      {/* HEADER GLOBAL */}
      <GlobalHeader />

      {/* ========================================================
          1. BANNER FULL SCREEN (HERO)
          ======================================================== */}
      <section className="relative h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 sm:pb-20 items-center">
        {VIDEOS_HERO.map((video, idx) => {
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
            </div>
          );
        })}

        {/* SELECTOR EN HERO */}
        <div className="absolute top-20 sm:top-28 z-30 flex items-center gap-2.5 bg-[#071326]/75 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/10">
          
          <div className="flex items-center gap-1.5">
            {VIDEOS_HERO.map((_, i) => (
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
          className="absolute bottom-6 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl border border-white/10 transition-all duration-300 active:scale-90 cursor-pointer flex items-center gap-2 shadow-lg"
          aria-label={heroSonido ? "Silenciar video" : "Activar sonido"}
          title={heroSonido ? "Silenciar video" : "Activar sonido"}
        >
          {heroSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
          <span className={`${bitter.className} text-[9px] uppercase tracking-widest hidden sm:inline`}>
            {heroSonido ? "Sonido ON" : "Sonido OFF"}
          </span>
        </button>

        {/* BOTÓN RESERVAR HERO */}
        <div className="relative z-20 flex flex-col items-center">
          <Link
            href="/reservas-y-pagos"
            className={`${bitter.className} bg-[#071326] hover:bg-[#0d2242] text-white px-9 sm:px-12 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2.5 border border-white/20 shadow-xl`}
          >
            <span>Reservar Ahora</span>
            <Icons.ArrowUpRight />
          </Link>
        </div>
      </section>

      {/* ========================================================
          2. CATEGORÍAS EN CÍRCULOS (3 POR FILA)
          ======================================================== */}
      <section className="bg-white py-12 sm:py-16 px-4 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-y-8 gap-x-4 sm:gap-x-12 place-items-center">
            {CATEGORIAS_CIRCULARES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.ruta}
                className="flex flex-col items-center gap-3 group w-full max-w-[120px]"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[2.5px] border-2 border-[#071326] group-hover:border-slate-400 transition-all duration-300 group-hover:scale-105 shadow-sm">
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

      {/* ========================================================
          3. NUESTRAS HABITACIONES (TEXTO + BOTONES 1 AL 6)
          ======================================================== */}
      <section className="bg-white pt-10 pb-6 px-4 text-center border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className={`${bitter.className} text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Nuestras Habitaciones
          </h2>
          
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-light">
            Encuentra habitaciones privadas, áreas comunes para conectar y relajarte, wifi ilimitado, piscina, parqueadero y playa, todo en un solo lugar.
          </p>

          {/* BOTONCITOS 1 AL 6 */}
          <div className="pt-2 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2">
            {HABITACIONES.map((hab, idx) => {
              const activa = idx === habitacionActivaIndex;
              return (
                <button
                  key={hab.id}
                  onClick={() => cambiarHabitacion(idx)}
                  className={`${bitter.className} w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                    activa
                      ? 'bg-white text-[#071326] border-2 border-[#071326] shadow-xl scale-110 ring-2 ring-[#071326]/20'
                      : 'bg-white text-[#071326] border border-slate-200 shadow-md hover:shadow-lg hover:scale-105'
                  }`}
                  aria-label={`Ver Habitación ${hab.numero}`}
                >
                  {hab.numero}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISOR RESPONSIVE HABITACIONES */}
      <section 
        id="seccion-habitaciones" 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[75dvh] sm:h-[90dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none touch-pan-y"
      >
        <div className="absolute inset-0 z-0">
          {esRecursoVideo ? (
            <video
              key={medioActual}
              autoPlay
              muted={!habitacionSonido}
              loop
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              className="w-full h-full object-cover transition-all duration-500"
            >
              <source src={medioActual} type="video/quicktime" />
              <source src={medioActual} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={medioActual}
              src={medioActual}
              alt={habitacionActual.titulo}
              fill
              priority
              unoptimized
              className="object-cover transition-all duration-500"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        <button
          onClick={anteriorFoto}
          className="absolute left-2 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#071326]/65 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer shadow-lg"
          aria-label="Foto anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteFoto}
          className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#071326]/65 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer shadow-lg"
          aria-label="Siguiente foto"
        >
          <Icons.ChevronRight />
        </button>

        {esRecursoVideo && (
          <button
            onClick={() => setHabitacionSonido(!habitacionSonido)}
            className="absolute bottom-20 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white px-3.5 py-1.5 rounded-full backdrop-blur-3xl border border-white/20 transition-all duration-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
            aria-label={habitacionSonido ? "Silenciar video" : "Activar sonido"}
          >
            {habitacionSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[10px] uppercase hidden sm:inline">
              {habitacionSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 pb-6 px-4 sm:px-6 max-w-4xl mx-auto w-full flex items-center justify-between text-white">
          <div>
            <h3 className={`${bitter.className} text-lg sm:text-2xl font-bold uppercase tracking-tight`}>
              {habitacionActual.titulo}
            </h3>
            <span className="text-xs text-slate-300 font-mono">
              {habitacionActual.precio} {habitacionActual.noches}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => cotizarWhatsApp(`reservar la ${habitacionActual.titulo}`)}
              className={`${bitter.className} bg-white text-[#071326] hover:bg-slate-100 py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer shadow-lg`}
            >
              Reservar
            </button>
            <Link
              href={`/habitaciones?id=${habitacionActual.id}`}
              className={`${bitter.className} bg-[#071326]/80 hover:bg-[#071326] text-white border border-white/20 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 inline-flex items-center gap-1`}
            >
              <span>Detalles</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. BANNER DE VIDEO (PEGADO)
          ======================================================== */}
      <section className="relative h-[70dvh] sm:h-[90dvh] w-full overflow-hidden bg-black">
        <video
          poster={VIDEO_MID.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            e.currentTarget.play().catch(() => {});
          }}
          className="w-full h-full object-cover"
        >
          <source src={VIDEO_MID.src} type="video/quicktime" />
          <source src={VIDEO_MID.src} type="video/mp4" />
        </video>
      </section>

      {/* ========================================================
          NUEVA SECCIÓN: MINI-CARDS CON ESQUINAS REDONDAS Y SIN BORDES
          (EN CARRUSEL HORIZONTAL RÁPIDO CON BOTÓN "COTIZAR")
          ======================================================== */}
      <section className="bg-white py-14 sm:py-20 px-4 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className={`${bitter.className} text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#071326]`}>
              Elige tu Habitación
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              Desliza y cotiza directamente tu estancia en San Antero por WhatsApp.
            </p>
          </div>

          {/* CINTA HORIZONTAL RÁPIDA: CARDS REDONDEADAS SIN BORDES */}
          <div className="relative w-full overflow-hidden py-4 group">
            <div className="flex gap-8 sm:gap-12 w-max animate-cinta group-hover:[animation-play-state:paused]">
              {[...CARDS_COTIZAR, ...CARDS_COTIZAR].map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className="w-48 sm:w-56 flex flex-col items-center text-center select-none"
                >
                  {/* Imagen de la card: Esquinas bien redondeadas y sin bordes */}
                  <div className="relative w-44 h-40 sm:w-52 sm:h-48 rounded-3xl overflow-hidden bg-slate-50 shadow-md hover:shadow-xl transition-all duration-500 border-0">
                    <Image
                      src={card.imagen}
                      alt={card.titulo}
                      fill
                      unoptimized
                      className="object-cover hover:scale-108 transition-transform duration-700"
                    />
                  </div>

                  {/* Datos del producto */}
                  <div className="mt-4 space-y-1 w-full">
                    <h4 className={`${bitter.className} text-xs sm:text-sm font-bold uppercase tracking-wider text-[#071326] truncate`}>
                      {card.titulo}
                    </h4>
                    <p className="text-xs sm:text-sm font-mono font-semibold text-[#071326]">
                      ${card.precio}
                    </p>
                  </div>

                  {/* Botón COTIZAR con Carrito de compras hacia WhatsApp */}
                  <button
                    onClick={() => cotizarWhatsApp(`${card.titulo} - Tarifa: $${card.precio}`)}
                    className={`${bitter.className} mt-3 bg-[#071326] hover:bg-[#0d2242] text-white py-2 px-5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 shadow-md cursor-pointer border-0`}
                  >
                    <Icons.ShoppingCart />
                    <span>COTIZAR</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animación continua en CSS */}
        <style jsx>{`
          @keyframes cintaHorizontal {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-cinta {
            animation: cintaHorizontal 18s linear infinite;
          }
        `}</style>
      </section>

      {/* ========================================================
          5. OTROS ESPACIOS DE LA CASA (FULL SCREEN + TEXTO)
          ======================================================== */}
      <section className="bg-white py-8 px-4 text-center border-b border-slate-200">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className={`${bitter.className} text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Otros Espacios de la Casa
          </h2>
          <p className={`${bitter.className} text-xs sm:text-sm tracking-[0.15em] uppercase font-bold text-slate-500`}>
            ABADIA CASA HOTEL puedes encontrar verdadero descanso
          </p>
        </div>
      </section>

      <section 
        id="seccion-otros-espacios" 
        className="relative h-[80dvh] sm:h-[95dvh] w-full overflow-hidden bg-black flex flex-col justify-between"
      >
        <div className="absolute inset-0 z-0">
          {espacioEsVideo ? (
            <video
              key={espacioActual.recurso}
              autoPlay
              muted={!espacioSonido}
              loop
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              className="w-full h-full object-cover transition-all duration-700"
            >
              <source src={espacioActual.recurso} type="video/quicktime" />
              <source src={espacioActual.recurso} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={espacioActual.recurso}
              src={espacioActual.recurso}
              alt={espacioActual.titulo}
              fill
              unoptimized
              className="object-cover transition-transform duration-1000"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        {/* SELECTOR DE PUNTOS */}
        <div className="relative z-20 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-end">
          <div className="flex gap-2 bg-[#071326]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {OTROS_ESPACIOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setEspacioActivoIndex(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  i === espacioActivoIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ver espacio ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {espacioEsVideo && (
          <button
            onClick={() => setEspacioSonido(!espacioSonido)}
            className="absolute top-32 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 active:scale-90 cursor-pointer flex items-center gap-1.5 shadow-md"
            aria-label={espacioSonido ? "Silenciar video" : "Activar sonido"}
          >
            {espacioSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {espacioSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 w-full px-4 sm:px-12 pb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
            <h3 className={`${bitter.className} text-xl sm:text-2xl font-bold uppercase tracking-tight`}>
              {espacioActual.titulo}
            </h3>

            <Link
              href="/otros-espacios"
              className={`${bitter.className} bg-white text-[#071326] hover:bg-slate-100 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg`}
            >
              Explorar Espacios →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. QUÉ HACER EN SAN ANTERO (CUADRÍCULA ESTÁTICA)
          ======================================================== */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className={`${bitter.className} text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#071326]`}>
              Qué hacer en San Antero
            </h2>
            <p className="text-sm text-slate-600 font-light max-w-xl mx-auto">
              Descubre los mejores planes gastronómicos, diversión marina y naturaleza a pasos de nuestro hotel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUE_HACER_ITEMS.map((item) => (
              <Link
                key={item.id}
                href="/que-hacer"
                className="relative h-72 sm:h-80 rounded-2xl overflow-hidden group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 block"
              >
                {item.isVideo ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  >
                    <source src={item.src} type="video/quicktime" />
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.titulo}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/90 via-[#071326]/30 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h4 className={`${bitter.className} text-lg font-bold uppercase tracking-wide leading-snug`}>
                    {item.titulo}
                  </h4>
                  <p className="text-xs text-slate-200 font-light line-clamp-2">
                    {item.desc}
                  </p>
                  <span className={`${bitter.className} text-[10px] text-white/80 uppercase tracking-widest font-semibold pt-1 inline-flex items-center gap-1 group-hover:text-white`}>
                    Conocer más <Icons.ArrowUpRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. ATARDECERES (VISOR + MINIATURAS)
          ======================================================== */}
      <section id="atardeceres-san-antero" className="bg-white py-8 px-4 text-center border-b border-slate-200">
        <h2 className={`${bitter.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
          Atardeceres
        </h2>
      </section>

      <section className="relative h-[70dvh] sm:h-[85dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none">
        {ATARDECERES_FOTOS.map((foto, idx) => {
          const activo = idx === atardecerActivoIndex;
          return (
            <div
              key={foto.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                activo ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={foto.src}
                alt={foto.titulo}
                fill
                priority={idx === 0}
                unoptimized
                className="object-cover scale-100 hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          );
        })}

        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-end">
          <div className="flex items-center gap-1.5 bg-[#071326]/75 backdrop-blur-3xl px-3 py-1.5 rounded-full border border-white/20">
            {ATARDECERES_FOTOS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setAtardecerActivoIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === atardecerActivoIndex
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Ver foto de atardecer ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-20 pb-8 text-center text-white">
          <h3 className={`${bitter.className} text-lg sm:text-xl font-bold uppercase tracking-wider`}>
            {atardecerActual.titulo}
          </h3>
        </div>
      </section>

      {/* Miniaturas de atardeceres */}
      <section className="bg-white py-6 px-4 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2">
            {ATARDECERES_FOTOS.map((item, i) => {
              const activo = i === atardecerActivoIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setAtardecerActivoIndex(i)}
                  className={`relative w-24 sm:w-32 h-16 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer ${
                    activo
                      ? 'border-[#071326] scale-105 ring-2 ring-slate-400'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.titulo}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER AZUL ABADÍA */}
      <GlobalFooter />

    </main>
  );
}