'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

// --- 2 VIDEOS .MOV PARA EL BANNER PRINCIPAL (HERO) ---
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

// Video limpio para la sección media
const VIDEO_MID = {
  src: "/videosdebanner/copy_359F2AF5-3796-41C5-B3D0-B9AC83EF213B.mov",
  poster: "/121017.jpg"
};

// --- ICONOS VECTORIALES DE ALTA PRECISIÓN ---
const Icons = {
  Key: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={`${className} stroke-current fill-none`} viewBox="0 0 24 24" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
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
  Play: () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
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

// Función auxiliar para detectar videos .mov y otros formatos
const esVideo = (url?: string) => {
  if (!url) return false;
  const limpio = url.split('?')[0].toLowerCase();
  const extensiones = ['.mov', '.mp4', '.webm', '.ogg', '.m4v'];
  return extensiones.some((ext) => limpio.endsWith(ext));
};

// --- DATA: 6 HABITACIONES ---
interface Habitacion {
  id: string;
  numero: string;
  categoria: string;
  titulo: string;
  ubicacion: string;
  precio: string;
  noches: string;
  ocupacion: string;
  camas: string;
  descripcion: string;
  medios: string[];
}

const HABITACIONES: Habitacion[] = [
  {
    id: "habitacion-1",
    numero: "1",
    categoria: "Habitación Confort",
    titulo: "Habitación 1",
    ubicacion: "Playa Blanca • San Antero",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "2 a 3 Huéspedes",
    camas: "1 Cama Queen + Cama Adicional",
    descripcion: "Habitación privada equipada con aire acondicionado, televisor Smart TV, mininevera y Wi-Fi de alta velocidad para descansar a pasos del mar.",
    medios: [
      "/Habitaciones/habitacion1.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "habitacion-2",
    numero: "2",
    categoria: "Estancia Confort",
    titulo: "Habitación 2",
    ubicacion: "Jardín Botánico Central",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 3 Huéspedes",
    camas: "1 Cama Queen + 1 Sencilla",
    descripcion: "Rodeada de palmeras y vegetación caribeña. Totalmente climatizada, equipada con mininevera, Smart TV, Wi-Fi de alta velocidad y video en alta definición.",
    medios: [
      "/Habitaciones/habitacion2.mov",
      "/Habitaciones/habitacion2.PNG",
      "/Habitaciones/habitacion2.2.PNG"
    ]
  },
  {
    id: "habitacion-3",
    numero: "3",
    categoria: "Habitación Confort",
    titulo: "Habitación 3",
    ubicacion: "Planta Baja • Ala Silente",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "2 a 3 Huéspedes",
    camas: "1 Cama Queen + Cama Auxiliar",
    descripcion: "Ambiente fresco y apacible para el descanso. Dotada con aire acondicionado, mininevera, Smart TV, baño privado y Wi-Fi.",
    medios: [
      "/Habitaciones/habitacion3.jpeg",
      "/121017.jpg",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "habitacion-4",
    numero: "4",
    categoria: "Habitación Familiar",
    titulo: "Habitación 4",
    ubicacion: "Acceso Directo a la Orilla",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 Huéspedes",
    camas: "2 Camas Dobles",
    descripcion: "Amplitud y comodidad para compartir. Incluye aire acondicionado, mininevera, Smart TV, Wi-Fi de alta velocidad y salida rápida a la arena.",
    medios: [
      "/Habitaciones/habitacion4.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920&q=85"
    ]
  },
  {
    id: "habitacion-5",
    numero: "5",
    categoria: "Suite Familiar Superior",
    titulo: "Habitación 5",
    ubicacion: "Primera Línea • Terraza Privada",
    precio: "$80.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 - 5 Huéspedes",
    camas: "1 Cama Queen + 1 Cama Semidoble + 1 Cama Junior (Nido Deslizable)",
    descripcion: "Habitación espaciosa con excelente capacidad. Cuenta con 1 cama Queen, 1 cama semidoble y 1 cama junior deslizable desde abajo. Equipada con aire acondicionado, mininevera, Smart TV, Wi-Fi y video del espacio.",
    medios: [
      "/videosdebanner/copy_359F2AF5-3796-41C5-B3D0-B9AC83EF213B.mov",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=85",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg"
    ]
  },
  {
    id: "habitacion-6",
    numero: "6",
    categoria: "Master Suite Superior",
    titulo: "Habitación 6",
    ubicacion: "Nivel Superior • Vista Panorámica",
    precio: "$80.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 - 5 Huéspedes",
    camas: "1 Cama Queen + 1 Cama Semidoble + 1 Cama Junior (Nido Deslizable)",
    descripcion: "Nuestra habitación más amplia con vista abierta. Dotada con 1 cama Queen, 1 cama semidoble y 1 cama junior deslizable inferior, además de aire acondicionado, mininevera, Smart TV y Wi-Fi.",
    medios: [
      "/Habitaciones/habitacion6.jpeg",
      "/piscina.png",
      "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg"
    ]
  }
];

// --- OTROS ESPACIOS DE LA CASA ---
interface EspacioCasa {
  id: string;
  tag: string;
  titulo: string;
  descripcion: string;
  recurso: string;
}

const OTROS_ESPACIOS: EspacioCasa[] = [
  {
    id: "Piscina",
    tag: "01 • Recreación & Relax",
    titulo: "Piscina Abadía",
    descripcion: "Área de agua cristalina rodeada de palmeras tropicales y asoleadoras privadas para relajarte a cualquier hora.",
    recurso: "/IMG_2254.mov"
  },
  {
    id: "Parqueadero",
    tag: "02 • Acceso & Seguridad",
    titulo: "Entrada y Parqueadero Privado",
    descripcion: "Acceso vehicular cerrado, vigilado y cómodo dentro del predio para la completa seguridad de tu vehículo.",
    recurso: "/IMG_2396.MOV"
  }
];

// --- EXPERIENCIAS EN SAN ANTERO ---
interface Experiencia {
  id: string;
  tag: string;
  titulo: string;
  descripcion: string;
  recurso: string;
}

const EXPERIENCIAS_SAN_ANTERO: Experiencia[] = [
  {
    id: "vicenta",
    tag: "Gastronomía Tradicional",
    titulo: "Vicenta Arepa de Huevo",
    descripcion: "La tradición culinaria más emblemática de la región. Crujientes, recién preparadas y con el auténtico sabor costeño.",
    recurso: "/vicenta.MOV"
  },
  {
    id: "punta-bonita",
    tag: "Mirador & Atardeceres",
    titulo: "Punta Bonita",
    descripcion: "Un rincón paradisíaco con vistas panorámicas privilegiadas sobre el mar y atardeceres dorados inolvidables.",
    recurso: "/atardecer.jpg"
  },
  {
    id: "playa",
    tag: "Aguas Calmas",
    titulo: "Playa",
    descripcion: "Arena suave y mar sereno a solo unos pasos de tu habitación. Ideal para nadar, caminar y descansar bajo la brisa.",
    recurso: "/mar.mp4"
  },
  {
    id: "moto-acuatica",
    tag: "Aventura Náutica",
    titulo: "Moto Acuática",
    descripcion: "Adrenalina y velocidad recorriendo los puntos clave de la bahía con instructores certificados de la zona.",
    recurso: "/IMG_2277.mov"
  }
];

// --- 7 FOTOGRAFÍAS: LOS ATARDECERES EN SAN ANTERO PLAYA BLANCA ---
interface AtardecerFoto {
  id: number;
  titulo: string;
  momento: string;
  src: string;
}

const ATARDECERES_FOTOS: AtardecerFoto[] = [
  {
    id: 1,
    titulo: "Reflejo Dorado sobre Playa Blanca",
    momento: "05:45 PM • Horizonte Caribe",
    src: "/atardecer.jpg"
  },
  {
    id: 2,
    titulo: "La Calma de la Marea Baja",
    momento: "05:55 PM • Frente al Hotel",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: 3,
    titulo: "Cielo Naranja entre Palmeras",
    momento: "06:05 PM • Sendero Costero",
    src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: 4,
    titulo: "Crepúsculo en Punta Bonita",
    momento: "06:12 PM • Golfo de Morrosquillo",
    src: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: 5,
    titulo: "Paz Silente frente a la Orilla",
    momento: "06:20 PM • Muelle Artesanal",
    src: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: 6,
    titulo: "Tonos Violeta y Brisa Marina",
    momento: "06:28 PM • Playa Blanca",
    src: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1920&q=85"
  },
  {
    id: 7,
    titulo: "La Noche se Encuentra con el Mar",
    momento: "06:35 PM • Abadía Casa Hotel",
    src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1920&q=85"
  }
];

// --- CABECERA INTEGRADA GLOBAL (SIN BOTÓN DE RESERVAR) ---
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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/55 text-white border border-white/20 flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-xl"
            aria-label="Abrir Menú"
          >
            <span className="text-lg sm:text-xl">☰</span>
          </button>
        </div>
      </header>

      {/* MENÚ LATERAL GLASS RESPONSIVE */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          menuAbierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div onClick={() => setMenuAbierto(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#071326]/95 backdrop-blur-3xl p-6 sm:p-10 flex flex-col justify-between border-l border-white/15 shadow-2xl transition-transform duration-500 ease-out overflow-y-auto ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              Abadía Casa Hotel
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-left my-auto py-6">
            <Link onClick={() => setMenuAbierto(false)} href="/" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Inicio
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Nuestras Habitaciones
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/gastronomia" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Gastronomía de Autor
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/matrimonios" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Matrimonios & Eventos
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/transporte" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Cómo Llegar & Transporte
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Otros Espacios de la Casa
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Qué hacer en San Antero
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="#atardeceres-san-antero" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Atardeceres Playa Blanca
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/testimonios" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Testimonios & Huéspedes
            </Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className="text-base sm:text-lg font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">
              Cómo Reservar & Pagos
            </Link>
          </nav>

          <div className="pt-5 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <Link href="/dashboard" className="text-[#C5A059] hover:underline">
              Dashboard 🗝️
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// --- FOOTER AZUL ABADÍA INTEGRADO ---
function GlobalFooter() {
  return (
    <footer className="w-full bg-[#071326] text-white py-12 sm:py-16 px-6 text-center border-t border-blue-950/60">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
        <div className="relative w-36 sm:w-44 h-14 sm:h-16 filter brightness-0 invert opacity-90">
          <Image src="/logo.png" alt="Logo Abadía Footer" fill sizes="(max-width: 640px) 144px, 176px" className="object-contain" />
        </div>
        <p className="text-xs sm:text-sm text-white/90 font-light max-w-md leading-relaxed">
          Playa Blanca, San Antero & Coveñas — Colombia <br /> Un espacio para la desconexión total y la calma.
        </p>
        <div className="w-12 h-[1px] bg-white/20 my-2" />
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold">
          © 2026 Abadía Casa Hotel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

// --- PANTALLA SPLASH ---
function BienvenidaAbadia({ onFinish }: { onFinish: () => void }) {
  const [desvanecer, setDesvanecer] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setDesvanecer(true), 2400);
    const finishTimer = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#071326] px-6 text-white transition-opacity duration-700 ease-in-out ${
        desvanecer ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-5 text-center max-w-sm">
        <div className="relative w-56 h-28 sm:w-64 sm:h-32">
          <Image
            src="/logo.png"
            alt="Logo Abadía"
            fill
            priority
            className="object-contain filter brightness-0 invert"
          />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-[0.28em] uppercase text-white">
            Bienvenido
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/90 font-light">
            Momentos memorables en el corazón de la calma
          </p>
        </div>

        <div className="w-14 h-0.5 bg-white/20 rounded-full overflow-hidden mt-2">
          <div className="w-full h-full bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL HOME ---
export default function HomePage() {
  const [splashActivo, setSplashActivo] = useState(true);

  // Estados de control de video y audio
  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);
  const [habitacionSonido, setHabitacionSonido] = useState(false);
  const [espacioSonido, setEspacioSonido] = useState(false);
  const [experienciaSonido, setExperienciaSonido] = useState(false);

  // Habitaciones
  const [habitacionActivaIndex, setHabitacionActivaIndex] = useState(0);
  const [fotoHabitacionIndex, setFotoHabitacionIndex] = useState(0);
  const [llavesDesplegadas, setLlavesDesplegadas] = useState(false);

  // Otros espacios y Experiencias de destino
  const [espacioActivoIndex, setEspacioActivoIndex] = useState(0);
  const [experienciaActivaIndex, setExperienciaActivaIndex] = useState(0);

  // Carrusel de Atardeceres
  const [atardecerActivoIndex, setAtardecerActivoIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Carrusel automático Hero (cada 9s)
  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalHero = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % VIDEOS_HERO.length);
    }, 9000);
    return () => clearInterval(intervalHero);
  }, [isMounted, splashActivo]);

  // 2. Carrusel automático de fotos/videos de la habitación activa (cada 6s)
  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalHab = setInterval(() => {
      setFotoHabitacionIndex((prev) => (prev + 1) % HABITACIONES[habitacionActivaIndex].medios.length);
    }, 6000);
    return () => clearInterval(intervalHab);
  }, [isMounted, splashActivo, habitacionActivaIndex]);

  // 3. Carrusel automático de Otros Espacios (cada 6s)
  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalEsp = setInterval(() => {
      setEspacioActivoIndex((prev) => (prev + 1) % OTROS_ESPACIOS.length);
    }, 6000);
    return () => clearInterval(intervalEsp);
  }, [isMounted, splashActivo]);

  // 4. Carrusel automático de las Experiencias en San Antero (cada 7s)
  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalExp = setInterval(() => {
      setExperienciaActivaIndex((prev) => (prev + 1) % EXPERIENCIAS_SAN_ANTERO.length);
    }, 7000);
    return () => clearInterval(intervalExp);
  }, [isMounted, splashActivo]);

  // 5. Carrusel automático de los 7 Atardeceres (cada 5s)
  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalAtardeceres = setInterval(() => {
      setAtardecerActivoIndex((prev) => (prev + 1) % ATARDECERES_FOTOS.length);
    }, 5000);
    return () => clearInterval(intervalAtardeceres);
  }, [isMounted, splashActivo]);

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

  const seleccionarHabitacionLlave = (index: number) => {
    setHabitacionActivaIndex(index);
    setFotoHabitacionIndex(0);
    setLlavesDesplegadas(false);
  };

  const cotizarWhatsApp = (asunto: string) => {
    const msj = encodeURIComponent(`Hola! Deseo cotizar reserva en Abadía Casa Hotel: ${asunto}`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  if (!isMounted) return <div className="min-h-screen bg-[#FAF7F2]" />;

  return (
    <main className="w-full bg-[#FAF7F2] text-[#2a2421] antialiased selection:bg-[#8c7355]/20 font-light overflow-x-hidden">

      {/* 0. BIENVENIDA */}
      {splashActivo && <BienvenidaAbadia onFinish={() => setSplashActivo(false)} />}

      {/* HEADER GLOBAL SIN BOTÓN DE RESERVAR */}
      <GlobalHeader />

      {/* ========================================================
          1. BANNER PRINCIPAL (SOLO BOTÓN, SIN TEXTOS - RESPONSIVE 100dvh)
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />
            </div>
          );
        })}

        {/* SELECTOR FLOTANTE PARA CAMBIAR MANUALMENTE ENTRE LOS 2 VIDEOS */}
        <div className="absolute top-20 sm:top-28 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20">
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
                    ? 'w-6 sm:w-7 h-2 bg-[#C5A059]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Ver video ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOTÓN FLOTANTE PARA ACTIVAR / SILENCIAR AUDIO DEL HERO */}
        <button
          onClick={() => setHeroSonido(!heroSonido)}
          className="absolute bottom-6 right-4 sm:right-12 z-30 bg-black/45 hover:bg-black/70 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all shadow-xl active:scale-90 cursor-pointer flex items-center gap-2"
          aria-label={heroSonido ? "Silenciar video" : "Activar sonido"}
          title={heroSonido ? "Silenciar video" : "Activar sonido"}
        >
          {heroSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
          <span className="text-[9px] uppercase font-mono tracking-widest hidden sm:inline">
            {heroSonido ? "Sonido ON" : "Sonido OFF"}
          </span>
        </button>

        {/* SOLO BOTÓN DE RESERVA EN EL BANNER (SIN TÍTULO NI SUBTÍTULO) */}
        <div className="relative z-20 flex flex-col items-center">
          <Link
            href="/reservas-y-pagos"
            className="bg-[#8c7355] hover:bg-[#735e45] text-white px-9 sm:px-12 py-3.5 sm:py-4 rounded-full text-xs font-semibold uppercase tracking-[0.25em] shadow-[0_15px_35px_rgba(0,0,0,0.55)] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2.5"
          >
            <span>Reservar Ahora</span>
            <Icons.ArrowUpRight />
          </Link>
        </div>
      </section>

      {/* ========================================================
          TRANSICIÓN 1: TÍTULO EN DORADO
          ======================================================== */}
      <section className="bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
            
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Nuestras Habitaciones
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Tarifas por persona la noche. Selecciona la llave para explorar cada Habitación (incluyendo videos y fotos en pantalla completa).
          </p>
        </div>
      </section>

      {/* ========================================================
          2. SECCIÓN: HABITACIÓN FULL SCREEN (CARRUSEL AUTOMÁTICO)
          ======================================================== */}
      <section 
        id="seccion-habitaciones" 
        className="relative h-[75dvh] sm:h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none"
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
              className="object-cover transition-all duration-700 scale-100 hover:scale-105"
            />
          )}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* BARRA SUPERIOR FLOTANTE CON INDICADOR SI ES VIDEO */}
        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-start justify-between pointer-events-none gap-2">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-[11px] sm:text-xs font-light flex items-center gap-1.5 sm:gap-2 shadow-xl">
            <span className="text-white font-mono font-semibold">0{habitacionActual.numero}</span>
            <span className="text-white/40">•</span>
            <span className="truncate max-w-[110px] sm:max-w-none">{habitacionActual.categoria}</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 font-mono text-[10px] sm:text-[11px] flex items-center gap-1">
              {esRecursoVideo && (
                <span className="bg-red-500/80 text-white text-[8px] uppercase px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                  <Icons.Play /> Video
                </span>
              )}
              <span>{fotoHabitacionIndex + 1}/{habitacionActual.medios.length}</span>
            </span>
          </div>

          <div className="pointer-events-auto relative flex flex-col items-end">
            <button
              onClick={() => setLlavesDesplegadas(!llavesDesplegadas)}
              className={`relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-2xl border transition-all duration-300 active:scale-95 cursor-pointer shadow-2xl ${
                llavesDesplegadas 
                  ? 'bg-[#8c7355] text-white border-white/40 ring-4 ring-[#8c7355]/30' 
                  : 'bg-black/55 hover:bg-black/75 text-white border-white/30 hover:border-white'
              }`}
              aria-label="Abrir selector de 6 habitaciones"
            >
              {!llavesDesplegadas && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8c7355]"></span>
                </span>
              )}

              <span className="p-0.5 rounded-full text-white">
                <Icons.Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </span>

              <div className="text-left hidden md:block">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white font-semibold block leading-none">
                  Elige habitación
                </span>
                <span className="text-[11px] font-light text-white/90">
                  Toca aquí (1 al 6)
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full border border-white/15">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">
                  0{habitacionActual.numero}
                </span>
                <span className={`text-[8px] sm:text-[9px] text-white transition-transform duration-300 ${llavesDesplegadas ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {llavesDesplegadas && (
              <div className="absolute top-12 sm:top-14 right-0 w-64 sm:w-80 p-3 sm:p-4 bg-black/85 backdrop-blur-3xl border border-white/25 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-40 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-white/15">
                  <div className="flex items-center gap-1.5">
                    <Icons.Key className="w-3 h-3 text-white" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white font-semibold">
                      Selecciona tu Habitación
                    </span>
                  </div>
                  <span className="text-[9px] text-white/70 font-mono">6 llaves</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {HABITACIONES.map((h, i) => {
                    const esSeleccionada = habitacionActivaIndex === i;
                    const tieneVideo = h.medios.some((m) => esVideo(m));

                    return (
                      <button
                        key={h.id}
                        onClick={() => seleccionarHabitacionLlave(i)}
                        className={`group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer border relative ${
                          esSeleccionada
                            ? 'bg-[#8c7355] text-white border-white/50 shadow-lg scale-105 ring-2 ring-white/30'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/10 hover:border-white/30'
                        }`}
                      >
                        {tieneVideo && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" title="Incluye Video" />
                        )}

                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:rotate-12 ${
                          esSeleccionada ? 'bg-white/25 text-white' : 'bg-black/30 text-white'
                        }`}>
                          <Icons.Key className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-mono font-bold leading-tight text-white">
                          0{h.numero}
                        </span>
                        <span className="text-[7.5px] uppercase tracking-wider text-white/90 truncate w-full text-center mt-0.5">
                          {h.titulo}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTROLES LATERALES DE FLECHA */}
        <button
          onClick={anteriorFoto}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Foto anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteFoto}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Siguiente foto"
        >
          <Icons.ChevronRight />
        </button>

        {/* BOTÓN DE AUDIO SI EL MEDIO ACTUAL DE LA HABITACIÓN ES VIDEO */}
        {esRecursoVideo && (
          <button
            onClick={() => setHabitacionSonido(!habitacionSonido)}
            className="absolute bottom-4 right-4 sm:right-12 z-30 bg-black/45 hover:bg-black/70 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={habitacionSonido ? "Silenciar video de habitación" : "Activar sonido de habitación"}
          >
            {habitacionSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {habitacionSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] sm:text-[11px] text-white/80 font-mono">
            {fotoHabitacionIndex + 1} / {habitacionActual.medios.length} {esRecursoVideo ? '(Video)' : 'fotos'}
          </span>
        </div>
      </section>

      {/* ========================================================
          3. INFORMACIÓN DE LA HABITACIÓN DEBAJO DEL FULL SCREEN
          ======================================================== */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-12 border-b border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-10 text-left">

          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#8c7355] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full">
                Habitación 0{habitacionActual.numero}
              </span>
              <span className="text-xs font-semibold text-[#8c7355]">
                {habitacionActual.categoria}
              </span>
              {habitacionActual.ubicacion && (
                <>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-light">
                    📍 {habitacionActual.ubicacion}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-stone-900">
              {habitacionActual.titulo}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {habitacionActual.descripcion}
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium">
                <span>👥 {habitacionActual.ocupacion}</span>
                <span>•</span>
                <span className="font-semibold text-stone-800">🛏️ {habitacionActual.camas}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-1.5">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Aire acondicionado</span>
                </div>
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-1.5">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Mininevera</span>
                </div>
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-1.5">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Smart TV</span>
                </div>
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DDD0] text-xs text-stone-800 flex items-center gap-1.5">
                  <span className="text-[#8c7355] font-bold">✓</span>
                  <span>Wi-Fi gratuito</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between gap-5 shrink-0 lg:w-80">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-500 font-bold block">
                Tarifa Oficial por Persona
              </span>
              <div className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                {habitacionActual.precio} <span className="text-xs text-stone-500 font-normal">{habitacionActual.noches}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-1">
                Acomodación: {habitacionActual.ocupacion}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => cotizarWhatsApp(`reservar la ${habitacionActual.titulo} (${habitacionActual.precio} por persona la noche)`)}
                className="w-full bg-[#8c7355] hover:bg-[#735e45] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icons.WhatsApp />
                <span>Reservar WhatsApp</span>
              </button>

              <Link
                href={`/habitaciones?id=${habitacionActual.id}`}
                className="w-full bg-white hover:bg-stone-100 text-stone-900 border border-[#E8DDD0] py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-1.5 text-center"
              >
                <span>Ver al Detalle</span>
                <Icons.ArrowUpRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. SECCIÓN: VIDEO EN LA MITAD DEL HOME (RESPONSIVE 70dvh/90dvh LIMPIO)
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
          TRANSICIÓN 2: OTROS ESPACIOS DE LA CASA
          ======================================================== */}
      <section className="bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
            
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Otros Espacios de la Casa
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Descubre las áreas comunes, piscina, patios y estacionamiento privado diseñados para tu comodidad absoluta.
          </p>
        </div>
      </section>

      {/* ========================================================
          5. SECCIÓN: OTROS ESPACIOS (CARRUSEL AUTOMÁTICO)
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

        {/* Barra superior de Otros Espacios */}
        <div className="relative z-20 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-between text-stone-900">
          <span className="bg-white/85 backdrop-blur-xl border border-white/60 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-stone-900 shadow-lg flex items-center gap-1.5">
            {espacioEsVideo && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {espacioActual.tag}
          </span>
          <div className="flex gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {OTROS_ESPACIOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setEspacioActivoIndex(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                  i === espacioActivoIndex ? 'bg-[#C5A059] scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ver espacio ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Botón flotante de audio para el espacio si es video */}
        {espacioEsVideo && (
          <button
            onClick={() => setEspacioSonido(!espacioSonido)}
            className="absolute top-32 right-4 sm:right-12 z-30 bg-black/45 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={espacioSonido ? "Silenciar video" : "Activar sonido"}
          >
            {espacioSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {espacioSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        {/* Tarjeta suspendida inferior de Otros Espacios */}
        <div className="relative z-20 w-full px-4 sm:px-12 pb-6 sm:pb-10">
          <div className="max-w-6xl mx-auto bg-white/85 backdrop-blur-2xl border border-white/60 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 text-left text-stone-900">
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8c7355] font-bold block">
                Comodidades del Hotel
              </span>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-stone-950">
                {espacioActual.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-normal max-w-xl leading-relaxed">
                {espacioActual.descripcion}
              </p>
            </div>

            <Link
              href="/otros-espacios"
              className="w-full sm:w-auto bg-[#8c7355] hover:bg-[#735e45] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] transition-all active:scale-95 shrink-0 shadow-lg text-center"
            >
              Explorar Todos los Espacios →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          TRANSICIÓN 3: GUÍA DE DESTINO (SAN ANTERO & ALREDEDORES)
          ======================================================== */}
      <section className="bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-3xl mx-auto space-y-2">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
            
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            ¿Qué hacer en San Antero y sus Alrededores?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Gastronomía típica, diversión náutica, playas y cultura local. El carrusel avanza automáticamente o puedes navegarlo con las flechas.
          </p>
        </div>
      </section>

      {/* ========================================================
          6. SECCIÓN: DESTINO (CARRUSEL AUTOMÁTICO 100% LIMPIO - SIN BARRA DE BOTONES)
          ======================================================== */}
      <section 
        id="seccion-que-hacer" 
        className="relative h-[75dvh] sm:h-[90dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none"
      >
        {/* RECURSO VISUAL LIMPIO DE BORDE A BORDE */}
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

        {/* ETIQUETA SUPERIOR FLOTANTE DINÁMICA: CAMBIA SOLA CON CADA RECURSO */}
        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-black/50 backdrop-blur-2xl border border-white/20 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-[11px] sm:text-xs font-light flex items-center gap-2 shadow-xl transition-all duration-500">
            <span className="text-[#C5A059] font-mono font-bold">0{experienciaActivaIndex + 1}</span>
            <span className="text-white/40">•</span>
            <span className="font-medium tracking-wide">{experienciaActual.titulo}</span>
            {experienciaEsVideo && (
              <span className="bg-red-500/85 text-white text-[8px] uppercase px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                <Icons.Play /> Video
              </span>
            )}
          </div>

          {/* Indicadores circulares sutiles de avance automático */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            {EXPERIENCIAS_SAN_ANTERO.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setExperienciaActivaIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === experienciaActivaIndex
                    ? 'w-6 h-1.5 bg-[#C5A059]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Ver experiencia ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CONTROLES LATERALES (FLECHAS DISCRETAS PARA AVANZAR MANUALMENTE) */}
        <button
          onClick={anteriorExperiencia}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Experiencia anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteExperiencia}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Siguiente experiencia"
        >
          <Icons.ChevronRight />
        </button>

        {/* BOTÓN FLOTANTE DE AUDIO (SOLO SI EL RECURSO ES VIDEO) */}
        {experienciaEsVideo && (
          <button
            onClick={() => setExperienciaSonido(!experienciaSonido)}
            className="absolute bottom-4 right-4 sm:right-12 z-30 bg-black/45 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={experienciaSonido ? "Silenciar video" : "Activar sonido"}
          >
            {experienciaSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {experienciaSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        {/* PIE DEL CARRUSEL: INDICADOR DISCRETO */}
        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white/80 font-mono">
            {experienciaActivaIndex + 1} de {EXPERIENCIAS_SAN_ANTERO.length} • {experienciaActual.tag}
          </span>
        </div>
      </section>

      {/* ========================================================
          7. SECCIÓN EDITORIAL: INFORMACIÓN Y ACCIONES DEBAJO DEL VIDEO
          ======================================================== */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-12 border-b border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-10 text-left">
          
          {/* Textos informativos de la experiencia */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#8c7355] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full">
                {experienciaActual.tag}
              </span>
              <span className="text-xs text-stone-500 font-light">
                📍 San Antero & Alrededores
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-stone-900">
              {experienciaActual.titulo}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {experienciaActual.descripcion}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-stone-500">
              <span className="text-[#8c7355] font-bold">✓</span>
              <span>Recomendación exclusiva de Abadía Casa Hotel</span>
            </div>
          </div>

          {/* Tarjeta de acción y cotización rápida */}
          <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between gap-4 shrink-0 lg:w-80">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-500 font-bold block">
                Planes & Destino
              </span>
              <div className="text-lg sm:text-xl font-semibold text-stone-900 mt-1">
                {experienciaActual.titulo}
              </div>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-0.5">
                Te asesoramos con transporte y horarios
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => cotizarWhatsApp(`conocer más sobre ${experienciaActual.titulo} en San Antero`)}
                className="w-full bg-[#8c7355] hover:bg-[#735e45] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icons.WhatsApp />
                <span>Consultar por WhatsApp</span>
              </button>

              <Link
                href="/que-hacer"
                className="w-full bg-white hover:bg-stone-100 text-stone-900 border border-[#E8DDD0] py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-1.5 text-center"
              >
                <span>Ver Guía Completa</span>
                <Icons.ArrowUpRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          8. SECCIÓN: LOS ATARDECERES EN SAN ANTERO PLAYA BLANCA
          (CARRUSEL AUTOMÁTICO - SOLO TÍTULO)
          ======================================================== */}
      <section id="atardeceres-san-antero" className="bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Los Atardeceres en San Antero • Playa Blanca
          </h2>
        </div>
      </section>

      <section className="relative h-[75dvh] sm:h-[90dvh] w-full overflow-hidden bg-black flex flex-col justify-between select-none">
        {/* FOTOGRAFÍAS EN CARRUSEL AUTOMÁTICO CON FUNDIDO SUAVE */}
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

        {/* ETIQUETA SUPERIOR FLOTANTE DEL ATARDECER */}
        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-black/50 backdrop-blur-2xl border border-white/20 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-[11px] sm:text-xs font-light flex items-center gap-2 shadow-xl transition-all duration-500">
            <span className="text-[#C5A059] font-mono font-bold">0{atardecerActivoIndex + 1}</span>
            <span className="text-white/40">•</span>
            <span className="font-medium tracking-wide">{atardecerActual.titulo}</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 font-mono text-[10px] hidden sm:inline">{atardecerActual.momento}</span>
          </div>

          {/* INDICADORES CIRCULARES DE AVANCE DE LAS 7 FOTOS */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            {ATARDECERES_FOTOS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setAtardecerActivoIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === atardecerActivoIndex
                    ? 'w-6 h-1.5 bg-[#C5A059]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Ver foto de atardecer ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* FLECHAS MANUALES LATERALES */}
        <button
          onClick={anteriorAtardecer}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Atardecer anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteAtardecer}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#8c7355] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Siguiente atardecer"
        >
          <Icons.ChevronRight />
        </button>

        {/* PIE DEL CARRUSEL: NÚMERO DE FOTOGRAFÍA */}
        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white/80 font-mono">
            {atardecerActivoIndex + 1} de {ATARDECERES_FOTOS.length} fotografías • Atardecer en San Antero
          </span>
        </div>
      </section>

      {/* 9. FOOTER AZUL ABADÍA UNIFICADO */}
      <GlobalFooter />

    </main>
  );
}