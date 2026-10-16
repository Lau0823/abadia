'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Montserrat, Outfit } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const NUMERO_WHATSAPP = "573122373415";

// --- CATEGORÍAS EN CÍRCULOS (DE A 3 POR HORIZONTAL) ---
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
    ruta: "#atardeceres-san-antero",
    imagen: "/categorias/atardecer.png"
  }
];

// --- VIDEOS HERO PRINCIPAL ---
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

const esVideo = (url?: string) => {
  if (!url) return false;
  const limpio = url.split('?')[0].toLowerCase();
  const extensiones = ['.mov', '.mp4', '.webm', '.ogg', '.m4v'];
  return extensiones.some((ext) => limpio.endsWith(ext));
};

interface Habitacion {
  id: string;
  numero: string;
  categoria: string;
  titulo: string;
  precio: string;
  noches: string;
  ocupacion: string;
  camas: string;
  servicios: string[];
  medios: string[];
}

const HABITACIONES: Habitacion[] = [
  {
    id: "habitacion-1",
    numero: "1",
    categoria: "Confort & Mar",
    titulo: "Habitación 1",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "2 a 3 Huéspedes",
    camas: "1 Cama doble + Camarote cama semidoble",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi"],
    medios: [
      "/Habitaciones/habitacion1.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "/Habitaciones/habitacion101.png"
    ]
  },
  {
    id: "habitacion-2",
    numero: "2",
    categoria: "Brisa Serena",
    titulo: "Habitación 2",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 3 Huéspedes",
    camas: "1 Cama doble + Camarote cama semidoble",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi"],
    medios: [
      "/Habitaciones/habitacion2.mov",
      "/Habitaciones/habitacion2.PNG",
      "/Habitaciones/habitacion2.2.PNG"
    ]
  },
  {
    id: "habitacion-3",
    numero: "3",
    categoria: "Ala Silente",
    titulo: "Habitación 3",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "2 a 5 Huéspedes",
    camas: "1 Cama sencilla",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi"],
    medios: [
      "/Habitaciones/habitacion301.png",
      "/Habitaciones/habitacion3.jpeg",
      "/Habitaciones/301.png"
    ]
  },
  {
    id: "habitacion-4",
    numero: "4",
    categoria: "Acceso a Playa",
    titulo: "Habitación 4",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 Huéspedes",
    camas: "2 Camas Dobles",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi"],
    medios: [
      "/Habitaciones/habitacion4.jpeg",
      "/DSC05650.jpeg",
      "/DSC05657.jpeg",
    ]
  },
  {
    id: "habitacion-5",
    numero: "5",
    categoria: "Terraza Privada",
    titulo: "Habitación 5",
    precio: "$80.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 - 5 Huéspedes",
    camas: "1 Cama Queen + 1 Cama Semidoble + 1 Cama Junior",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi"],
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
    categoria: "Vista Abierta",
    titulo: "Habitación 6",
    precio: "$80.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 - 5 Huéspedes",
    camas: "1 Cama Queen + 1 Cama Semidoble + 1 Cama Junior",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi"],
    medios: [
      "/Habitaciones/habitacion6.jpeg",
    ]
  }
];

interface EspacioCasa {
  id: string;
  tag: string;
  titulo: string;
  recurso: string;
}

const OTROS_ESPACIOS: EspacioCasa[] = [
  {
    id: "Piscina",
    tag: "Recreación",
    titulo: "Piscina Abadía",
    recurso: "/IMG_2254.mov"
  },
  {
    id: "Parqueadero",
    tag: "Seguridad",
    titulo: "Entrada y Parqueadero Privado",
    recurso: "/IMG_2396.MOV"
  }
];

interface Experiencia {
  id: string;
  tag: string;
  titulo: string;
  recurso: string;
}

const EXPERIENCIAS_SAN_ANTERO: Experiencia[] = [
  {
    id: "vicenta",
    tag: "Gastronomía",
    titulo: "Vicenta Arepa de Huevo",
    recurso: "/vicenta.MOV"
  },
  {
    id: "punta-bonita",
    tag: "Mirador",
    titulo: "Punta Bonita",
    recurso: "/atardecer.jpg"
  },
  {
    id: "playa",
    tag: "Playa",
    titulo: "Playa Serena",
    recurso: "/mar.mp4"
  },
  {
    id: "moto-acuatica",
    tag: "Aventura",
    titulo: "Moto Acuática",
    recurso: "/IMG_2277.mov"
  }
];

interface AtardecerFoto {
  id: number;
  titulo: string;
  src: string;
}

const ATARDECERES_FOTOS: AtardecerFoto[] = [
  {
    id: 1,
    titulo: "Playa Blanca",
    src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG"
  },
  {
    id: 2,
    titulo: "Marea Baja",
    src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG"
  },
  {
    id: 3,
    titulo: "Palmeras",
    src: "/atardeceres/DSC00012.JPG"
  },
  {
    id: 4,
    titulo: "Punta Bonita",
    src: "/sunshine.JPG"
  },
  {
    id: 5,
    titulo: "San Antero",
    src: "/amanecersan atnero.JPG"
  },
];

const ATARDECERES_FOTOS_DUPLICADOS: AtardecerFoto[] = [
  ...ATARDECERES_FOTOS,
  ...ATARDECERES_FOTOS.map((f) => ({ ...f, id: f.id + 100 }))
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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#071326]/70 hover:bg-[#071326] text-white border border-white/20 flex items-center justify-center active:scale-90 transition-all duration-300 cursor-pointer backdrop-blur-xl"
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
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-bold">
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
            <Link onClick={() => setMenuAbierto(false)} href="/" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Inicio
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Habitaciones
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/gastronomia" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Gastronomía 
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/transporte" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Cómo Llegar & Transporte
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Otros Espacios de la Casa
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Qué hacer en San Antero
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="#atardeceres-san-antero" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Atardeceres Playa Blanca
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/testimonios" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
              Testimonios & Huéspedes
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-slate-300 transition-colors">
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
    <footer className="w-full bg-[#071326] text-white py-12 sm:py-16 px-6 text-center border-t border-white/10">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
        <div className="relative w-36 sm:w-44 h-14 sm:h-16 filter brightness-0 invert opacity-90">
          <Image src="/logo.png" alt="Logo Abadía Footer" fill sizes="(max-width: 640px) 144px, 176px" className="object-contain" />
        </div>
        <p className="text-xs sm:text-sm text-white/90 max-w-md leading-relaxed font-light">
          Playa Blanca, San Antero & Coveñas — Colombia <br /> Un espacio para la desconexión total y la calma.
        </p>
        <div className="w-12 h-[1px] bg-white/20 my-2" />
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold font-mono">
          © 2026 Abadía Casa Hotel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);
  const [habitacionSonido, setHabitacionSonido] = useState(false);
  const [espacioSonido, setEspacioSonido] = useState(false);
  const [experienciaSonido, setExperienciaSonido] = useState(false);

  const [habitacionActivaIndex, setHabitacionActivaIndex] = useState(0);
  const [fotoHabitacionIndex, setFotoHabitacionIndex] = useState(0);

  const [espacioActivoIndex, setEspacioActivoIndex] = useState(0);
  const [experienciaActivaIndex, setExperienciaActivaIndex] = useState(0);

  const [atardecerActivoIndex, setAtardecerActivoIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);

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
    }, 6000);
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
    const intervalExp = setInterval(() => {
      setExperienciaActivaIndex((prev) => (prev + 1) % EXPERIENCIAS_SAN_ANTERO.length);
    }, 7000);
    return () => clearInterval(intervalExp);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const intervalAtardeceres = setInterval(() => {
      setAtardecerActivoIndex((prev) => (prev + 1) % ATARDECERES_FOTOS.length);
    }, 5000);
    return () => clearInterval(intervalAtardeceres);
  }, [isMounted]);

  const habitacionActual = HABITACIONES[habitacionActivaIndex];
  const espacioActual = OTROS_ESPACIOS[espacioActivoIndex];
  const experienciaActual = EXPERIENCIAS_SAN_ANTERO[experienciaActivaIndex];
  const atardecerActual = ATARDECERES_FOTOS[atardecerActivoIndex];

  const medioActual = habitacionActual.medios[fotoHabitacionIndex];
  const esRecursoVideo = esVideo(medioActual);
  const espacioEsVideo = esVideo(espacioActual.recurso);
  const experienciaEsVideo = esVideo(experienciaActual.recurso);

  const siguienteFoto = () => {
    setFotoHabitacionIndex((prev) => (prev + 1) % habitacionActual.medios.length);
  };

  const anteriorFoto = () => {
    setFotoHabitacionIndex((prev) => (prev === 0 ? habitacionActual.medios.length - 1 : prev - 1));
  };

  const cambiarHabitacion = (idx: number) => {
    setHabitacionActivaIndex(idx);
    setFotoHabitacionIndex(0);
  };

  const siguienteExperiencia = () => {
    setExperienciaActivaIndex((prev) => (prev + 1) % EXPERIENCIAS_SAN_ANTERO.length);
  };

  const anteriorExperiencia = () => {
    setExperienciaActivaIndex((prev) =>
      prev === 0 ? EXPERIENCIAS_SAN_ANTERO.length - 1 : prev - 1
    );
  };

  const siguienteAtardecer = () => {
    setAtardecerActivoIndex((prev) => (prev + 1) % ATARDECERES_FOTOS.length);
  };

  const anteriorAtardecer = () => {
    setAtardecerActivoIndex((prev) =>
      prev === 0 ? ATARDECERES_FOTOS.length - 1 : prev - 1
    );
  };

  const cotizarWhatsApp = (asunto: string) => {
    const msj = encodeURIComponent(`Hola! Deseo cotizar reserva en Abadía Casa Hotel: ${asunto}`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <main className={`w-full bg-white text-[#071326] antialiased selection:bg-[#071326] selection:text-white overflow-x-hidden ${outfit.className}`}>

      {/* HEADER GLOBAL */}
      <GlobalHeader />

      {/* ========================================================
          1. BANNER PRINCIPAL (HERO)
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
        <div className="absolute top-20 sm:top-28 z-30 flex items-center gap-2.5 bg-[#071326]/70 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/10">
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-white/70">
            Video
          </span>
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
          className="absolute bottom-6 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl border border-white/10 transition-all duration-300 active:scale-90 cursor-pointer flex items-center gap-2"
          aria-label={heroSonido ? "Silenciar video" : "Activar sonido"}
          title={heroSonido ? "Silenciar video" : "Activar sonido"}
        >
          {heroSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
          <span className="text-[9px] uppercase font-mono tracking-widest hidden sm:inline">
            {heroSonido ? "Sonido ON" : "Sonido OFF"}
          </span>
        </button>

        {/* BOTÓN RESERVAR HERO */}
        <div className="relative z-20 flex flex-col items-center">
          <Link
            href="/reservas-y-pagos"
            className={`${montserrat.className} bg-[#071326] hover:bg-[#0d2242] text-white px-9 sm:px-12 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2.5 border border-white/20`}
          >
            <span>Reservar Ahora</span>
            <Icons.ArrowUpRight />
          </Link>
        </div>
      </section>

      {/* ========================================================
          CATEGORÍAS EN CÍRCULOS: DE A 3 POR HORIZONTAL
          ======================================================== */}
      <section className="bg-white py-10 sm:py-14 px-4 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-y-8 gap-x-4 sm:gap-x-12 place-items-center">
            {CATEGORIAS_CIRCULARES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.ruta}
                className="flex flex-col items-center gap-2.5 group w-full max-w-[120px]"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[2px] border-2 border-[#071326] group-hover:border-slate-400 transition-all duration-300 group-hover:scale-105">
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
                
                <span className={`${montserrat.className} text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#071326] group-hover:text-slate-600 transition-colors text-center`}>
                  {cat.nombre}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          TÍTULO: HABITACIONES
          ======================================================== */}
      <section className="bg-white py-6 px-4 text-center border-b border-slate-200">
        <h2 className={`${montserrat.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
          Nuestras Habitaciones
        </h2>
      </section>

      {/* ========================================================
          2. BANNER HABITACIÓN FULL SCREEN
          ======================================================== */}
      <section 
        id="seccion-habitaciones" 
        className="relative h-[80dvh] sm:h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none"
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
              className="w-full h-full object-cover transition-all duration-700"
            >
              <source src={medioActual} type="video/quicktime" />
              <source src={medioActual} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={medioActual}
              src={medioActual}
              alt={`${habitacionActual.titulo} medio ${fotoHabitacionIndex + 1}`}
              fill
              priority
              unoptimized
              className="object-cover transition-all duration-700"
            />
          )}

          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* SELECTOR SUPERIOR: SOLO NÚMEROS 01 AL 06 */}
        <div className="relative z-30 pt-16 sm:pt-24 px-3 sm:px-12 flex justify-center">
          <div className="max-w-md w-full flex items-center justify-between gap-1.5 sm:gap-2 bg-[#071326]/75 backdrop-blur-3xl p-1.5 rounded-full border border-white/20">
            {HABITACIONES.map((hab, idx) => {
              const activa = idx === habitacionActivaIndex;
              return (
                <button
                  key={hab.id}
                  onClick={() => cambiarHabitacion(idx)}
                  className={`flex-1 py-1.5 sm:py-2 px-2 rounded-full text-center text-xs sm:text-sm font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    activa
                      ? 'bg-blue-900 text-white scale-105 border border-white/50'
                      : 'bg-white/10 hover:bg-[#071326] text-white/90 border border-white/10'
                  }`}
                  aria-label={`Ver Habitación 0${hab.numero}`}
                >
                  0{hab.numero}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTROLES LATERALES */}
        <button
          onClick={anteriorFoto}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Foto anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteFoto}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Siguiente foto"
        >
          <Icons.ChevronRight />
        </button>

        {/* BOTÓN AUDIO */}
        {esRecursoVideo && (
          <button
            onClick={() => setHabitacionSonido(!habitacionSonido)}
            className="absolute bottom-6 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white px-3.5 py-1.5 rounded-full backdrop-blur-3xl border border-white/20 transition-all duration-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            aria-label={habitacionSonido ? "Silenciar video" : "Activar sonido"}
          >
            {habitacionSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[10px] uppercase hidden sm:inline">
              {habitacionSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        {/* PIE DEL VISOR */}
        <div className="relative z-20 pb-4 sm:pb-6 px-4 flex flex-col items-center pointer-events-none">
          <span className="bg-[#071326]/75 backdrop-blur-3xl border border-white/20 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white/90 font-mono">
            {fotoHabitacionIndex + 1} / {habitacionActual.medios.length} fotografías
          </span>
        </div>
      </section>

      {/* ========================================================
          3. FICHA TÉCNICA (LIMPIA, SIN DESCRIPCIÓN)
          ======================================================== */}
      <section className="bg-white py-6 sm:py-8 px-4 sm:px-12 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 text-left">

          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${montserrat.className} bg-[#071326] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full`}>
                Habitación 0{habitacionActual.numero}
              </span>
              <span className={`${montserrat.className} text-xs font-semibold uppercase tracking-wider text-slate-500`}>
                {habitacionActual.categoria}
              </span>
            </div>

            <h3 className={`${montserrat.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
              {habitacionActual.titulo}
            </h3>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-sm text-slate-700 font-medium">
              <span>👥 {habitacionActual.ocupacion}</span>
              <span>•</span>
              <span className="font-semibold text-[#071326]">🛏️ {habitacionActual.camas}</span>
            </div>

            {/* SERVICIOS RESUMIDOS */}
            <div className="flex flex-wrap gap-2 pt-2">
              {habitacionActual.servicios.map((srv, i) => (
                <span
                  key={i}
                  className="bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium"
                >
                  ✓ {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Tarjeta de tarifa oficial y botón WhatsApp */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4 shrink-0 lg:w-80">
            <div>
              <div className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-[#071326]`}>
                {habitacionActual.precio} <span className="text-sm text-slate-500 font-normal">{habitacionActual.noches}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => cotizarWhatsApp(`reservar la ${habitacionActual.titulo} (${habitacionActual.precio} por persona la noche)`)}
                className={`${montserrat.className} w-full bg-[#071326] hover:bg-[#0d2242] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
              >
                <Icons.WhatsApp />
                <span>Reservar WhatsApp</span>
              </button>

              <Link
                href={`/habitaciones?id=${habitacionActual.id}`}
                className={`${montserrat.className} w-full bg-white hover:bg-slate-50 text-[#071326] border border-slate-200 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 text-center`}
              >
                <span>Ver al Detalle</span>
                <Icons.ArrowUpRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. BANNER VIDEO MEDIO
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
          TÍTULO: OTROS ESPACIOS
          ======================================================== */}
      <section className="bg-white py-6 px-4 text-center border-b border-slate-200">
        <h2 className={`${montserrat.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
          Otros Espacios de la Casa
        </h2>
      </section>

      {/* ========================================================
          5. BANNER OTROS ESPACIOS
          ======================================================== */}
      <section 
        id="seccion-otros-espacios" 
        className="relative h-[80dvh] sm:h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between"
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
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* SELECTOR DE PUNTOS DE ESPACIOS */}
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
            className="absolute top-32 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={espacioSonido ? "Silenciar video" : "Activar sonido"}
          >
            {espacioSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {espacioSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 w-full px-4 sm:px-12 pb-6 sm:pb-10">
          <div className="max-w-6xl mx-auto bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left text-slate-900">
            <h3 className={`${montserrat.className} text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#071326]`}>
              {espacioActual.titulo}
            </h3>

            <Link
              href="/otros-espacios"
              className={`${montserrat.className} w-full sm:w-auto bg-[#071326] hover:bg-[#0d2242] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 shrink-0 text-center`}
            >
              Explorar Espacios →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          TÍTULO: QUÉ HACER
          ======================================================== */}
      <section className="bg-white py-6 px-4 text-center border-b border-slate-200">
        <h2 className={`${montserrat.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
          Qué hacer en San Antero
        </h2>
      </section>

      {/* ========================================================
          6. BANNER QUÉ HACER
          ======================================================== */}
      <section 
        id="seccion-que-hacer" 
        className="relative h-[75dvh] sm:h-[90dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none"
      >
        <div className="absolute inset-0 z-0">
          {experienciaEsVideo ? (
            <video
              key={experienciaActual.recurso}
              autoPlay
              muted={!experienciaSonido}
              loop
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              className="w-full h-full object-cover transition-all duration-700"
            >
              <source src={experienciaActual.recurso} type="video/quicktime" />
              <source src={experienciaActual.recurso} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={experienciaActual.recurso}
              src={experienciaActual.recurso}
              alt={experienciaActual.titulo}
              fill
              unoptimized
              className="object-cover transition-transform duration-1000"
            />
          )}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* SELECTOR DE PUNTOS EXPERIENCIAS */}
        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-end">
          <div className="flex items-center gap-1.5 bg-[#071326]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            {EXPERIENCIAS_SAN_ANTERO.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setExperienciaActivaIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === experienciaActivaIndex
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Ver experiencia ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={anteriorExperiencia}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Experiencia anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteExperiencia}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Siguiente experiencia"
        >
          <Icons.ChevronRight />
        </button>

        {experienciaEsVideo && (
          <button
            onClick={() => setExperienciaSonido(!experienciaSonido)}
            className="absolute bottom-4 right-4 sm:right-12 z-30 bg-[#071326]/75 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={experienciaSonido ? "Silenciar video" : "Activar sonido"}
          >
            {experienciaSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {experienciaSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-[#071326]/75 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white/80 font-mono">
            {experienciaActivaIndex + 1} de {EXPERIENCIAS_SAN_ANTERO.length} • {experienciaActual.tag}
          </span>
        </div>
      </section>

      {/* ========================================================
          7. FICHA DE DESTINO (RESUMIDA)
          ======================================================== */}
      <section className="bg-white py-6 sm:py-8 px-4 sm:px-12 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          
          <div className="space-y-1.5">
            <span className={`${montserrat.className} bg-[#071326] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full`}>
              {experienciaActual.tag}
            </span>
            <h3 className={`${montserrat.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
              {experienciaActual.titulo}
            </h3>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => cotizarWhatsApp(`conocer más sobre ${experienciaActual.titulo} en San Antero`)}
              className={`${montserrat.className} bg-[#071326] hover:bg-[#0d2242] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
            >
              <Icons.WhatsApp />
              <span>Consultar</span>
            </button>

            <Link
              href="/que-hacer"
              className={`${montserrat.className} bg-white hover:bg-slate-50 text-[#071326] border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 text-center`}
            >
              <span>Ver Todo</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          TÍTULO: ATARDECERES
          ======================================================== */}
      <section id="atardeceres-san-antero" className="bg-white py-6 px-4 text-center border-b border-slate-200">
        <h2 className={`${montserrat.className} text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#071326]`}>
          Los Atardeceres en San Antero
        </h2>
      </section>

      {/* ========================================================
          8. BANNER ATARDECERES
          ======================================================== */}
      <section className="relative h-[75dvh] sm:h-[90dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none">
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
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* SELECTOR DE PUNTOS ATARDECERES */}
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

        <button
          onClick={anteriorAtardecer}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Atardecer anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteAtardecer}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Siguiente atardecer"
        >
          <Icons.ChevronRight />
        </button>

        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-[#071326]/75 backdrop-blur-3xl border border-white/20 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white font-mono">
            {atardecerActivoIndex + 1} de {ATARDECERES_FOTOS.length} fotografías
          </span>
        </div>
      </section>

      {/* 2do CARRUSEL: TIRA INFINITA */}
      <section className="bg-white py-6 px-4 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            {ATARDECERES_FOTOS_DUPLICADOS.map((item, i) => {
              const originalIdx = i % ATARDECERES_FOTOS.length;
              const activo = originalIdx === atardecerActivoIndex;
              return (
                <button
                  key={`${item.id}-${i}`}
                  onClick={() => setAtardecerActivoIndex(originalIdx)}
                  className={`relative w-28 sm:w-36 h-20 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer ${
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] text-white font-mono font-medium">
                    0{(originalIdx + 1)}
                  </span>
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