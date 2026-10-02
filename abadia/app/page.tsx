'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Montserrat, Alex_Brush, Outfit } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const alexBrush = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

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

const esVideo = (url?: string) => {
  if (!url) return false;
  const limpio = url.split('?')[0].toLowerCase();
  const extensiones = ['.mov', '.mp4', '.webm', '.ogg', '.m4v'];
  return extensiones.some((ext) => limpio.endsWith(ext));
};

interface DetalleServicio {
  nombre: string;
  icono: string;
  resumen: string;
  detalles: string[];
}

const INFO_SERVICIOS: Record<string, DetalleServicio> = {
  "Aire acondicionado": {
    nombre: "Aire acondicionado",
    icono: "❄️",
    resumen: "Climatización silenciosa individual inverter para mantener una temperatura fresca y confortable frente a la calidez caribeña.",
    detalles: [
      "Control remoto individual con ajuste digital de temperatura.",
      "Tecnología inverter de ultra bajo nivel sonoro para un descanso óptimo.",
      "Mantenimiento continuo y filtros higienizados periódicamente."
    ]
  },
  "Mininevera": {
    nombre: "Mininevera",
    icono: "🧊",
    resumen: "Refrigerador compacto privado dentro de tu habitación para mantener bebidas frías, agua y refrigerios a tu alcance.",
    detalles: [
      "Compartimiento de enfriamiento rápido integrado.",
      "Capacidad adecuada para agua, gaseosas, vinos y snacks personales.",
      "Ubicación silenciosa para no interrumpir tus horas de descanso."
    ]
  },
  "Smart TV": {
    nombre: "Smart TV",
    icono: "📺",
    resumen: "Pantalla plana de alta definición con conectividad inteligente para disfrutar de tus plataformas de entretenimiento favoritas.",
    detalles: [
      "Acceso directo a Netflix, YouTube y aplicaciones de streaming.",
      "Control ergonómico y puertos de conexión multimedia.",
      "Excelente ángulo de visión orientado hacia las camas principales."
    ]
  },
  "Wi-Fi gratuito": {
    nombre: "Wi-Fi gratuito",
    icono: "📶",
    resumen: "Conexión a internet inalámbrica de alta velocidad disponible en toda la habitación y áreas de la casa hotel.",
    detalles: [
      "Cobertura estable para streaming, trabajo remoto o videollamadas.",
      "Acceso ilimitado sin costo adicional durante toda tu estadía.",
      "Puntos de acceso dedicados que garantizan señal continua frente al mar."
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
  ocupacion: string;
  camas: string;
  descripcion: string;
  servicios: string[];
  medios: string[];
}

const HABITACIONES: Habitacion[] = [
  {
    id: "habitacion-1",
    numero: "1",
    categoria: "",
    titulo: "Habitación 1",
    ubicacion: "Playa Blanca • San Antero",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "2 a 3 Huéspedes",
    camas: "1 Cama doble + Camarote cama semidoble ",
    descripcion: "Habitación privada  equipada con aire acondicionado, televisor Smart TV, mininevera y Wi-Fi de alta velocidad para descansar a pasos del mar.",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi gratuito"],
    medios: [
      "/Habitaciones/habitacion1.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "/Habitaciones/habitacion101.png"
    ]
  },
  {
    id: "habitacion-2",
    numero: "2",
    categoria: "",
    titulo: "Habitación 2",
    ubicacion: "San antero ",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 3 Huéspedes",
    camas: "1 Cama doble + Camarote cama semidoble",
    descripcion: "Habitación privada  equipada con aire acondicionado, televisor Smart TV, mininevera y Wi-Fi de alta velocidad para descansar a pasos del mar.",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi gratuito"],
    medios: [
      "/Habitaciones/habitacion2.mov",
      "/Habitaciones/habitacion2.PNG",
      "/Habitaciones/habitacion2.2.PNG"
    ]
  },
  {
    id: "habitacion-3",
    numero: "3",
    categoria: "",
    titulo: "Habitación 3",
    ubicacion: "Planta Baja • Ala Silente",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "2 a 5 Huéspedes",
    camas: "1 Cama sencilla",
    descripcion: "Ambiente fresco y apacible para el descanso. Dotada con aire acondicionado, mininevera, Smart TV, baño privado y Wi-Fi.",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi gratuito"],
    medios: [
      "/Habitaciones/habitacion301.png",
      "/Habitaciones/habitacion3.jpeg",
      "/Habitaciones/301.png"
    ]
  },
  {
    id: "habitacion-4",
    numero: "4",
    categoria: "",
    titulo: "Habitación 4",
    ubicacion: "Acceso Directo a la Orilla",
    precio: "$70.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 Huéspedes",
    camas: "2 Camas Dobles",
    descripcion: "Amplitud y comodidad para compartir. Incluye aire acondicionado, mininevera, Smart TV, Wi-Fi de alta velocidad y salida rápida a la arena.",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi gratuito"],
    medios: [
      "/Habitaciones/habitacion4.jpeg",
      "/DSC05650.jpeg",
      "/DSC05657.jpeg",
    ]
  },
  {
    id: "habitacion-5",
    numero: "5",
    categoria: "",
    titulo: "Habitación 5",
    ubicacion: "Primera Línea • Terraza Privada",
    precio: "$80.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 - 5 Huéspedes",
    camas: "1 Cama Queen + 1 Cama Semidoble + 1 Cama Junior (Nido Deslizable)",
    descripcion: "Habitación espaciosa con excelente capacidad. Cuenta con 1 cama Queen, 1 cama semidoble y 1 cama junior deslizable desde abajo. Equipada con aire acondicionado, mininevera, Smart TV, Wi-Fi y video del espacio.",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi gratuito"],
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
    categoria: "",
    titulo: "Habitación 6",
    ubicacion: "",
    precio: "$80.000",
    noches: "/ noche por persona",
    ocupacion: "Hasta 4 - 5 Huéspedes",
    camas: "1 Cama Queen + 1 Cama Semidoble + 1 Cama Junior (Nido Deslizable)",
    descripcion: "Nuestra habitación más amplia con vista abierta. Dotada con 1 cama Queen, 1 cama semidoble y 1 cama junior deslizable inferior, además de aire acondicionado, mininevera, Smart TV y Wi-Fi.",
    servicios: ["Aire acondicionado", "Mininevera", "Smart TV", "Wi-Fi gratuito"],
    medios: [
      "/Habitaciones/habitacion6.jpeg",
    ]
  }
];

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
    tag: " • Recreación & Relax",
    titulo: "Piscina Abadía",
    descripcion: "Piscina grande adultos + kiosko asoleadoras, duchas y piscina infantil.",
    recurso: "/IMG_2254.mov"
  },
  {
    id: "Parqueadero",
    tag: " • Acceso & Seguridad",
    titulo: "Entrada y Parqueadero Privado",
    descripcion: "Acceso vehicular cerrado, vigilado y cómodo dentro del predio para la completa seguridad de tu vehículo.",
    recurso: "/IMG_2396.MOV"
  }
];

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
    momento: "",
    src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG"
  },
  {
    id: 2,
    titulo: "La Calma de la Marea Baja",
    momento: " ",
    src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG"
  },
  {
    id: 3,
    titulo: "Cielo Naranja entre Palmeras",
    momento: " ",
    src: "/atardeceres/DSC00012.JPG"
  },
  {
    id: 4,
    titulo: "Crepúsculo en Punta Bonita",
    momento: " ",
    src: "/sunshine.JPG"
  },
  {
    id: 5,
    titulo: "Amanecer en San Antero",
    momento: " ",
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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#071326] text-white border border-white/20 flex items-center justify-center shadow-xl active:scale-90 transition-all duration-300 cursor-pointer backdrop-blur-xl"
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

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#071326]/95 backdrop-blur-3xl p-6 sm:p-10 flex flex-col justify-between border-l border-white/15 shadow-2xl transition-transform duration-500 ease-out overflow-y-auto ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
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
            <Link href="/dashboard" className="text-[#C5A059] hover:underline font-bold">
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
    <footer className="w-full bg-[#071326] text-white py-12 sm:py-16 px-6 text-center border-t border-blue-950/60">
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

        <div className="space-y-1">
          <h1 className={`${montserrat.className} text-xl sm:text-3xl font-bold tracking-[0.25em] uppercase text-[#C5A059]`}>
            Bienvenido
          </h1>
          <p className={`${alexBrush.className} text-2xl sm:text-3xl text-white/90`}>
            Una experiencia inolvidable 
          </p>
        </div>

        <div className="w-14 h-0.5 bg-white/20 rounded-full overflow-hidden mt-2">
          <div className="w-full h-full bg-[#C5A059] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [splashActivo, setSplashActivo] = useState(true);

  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);
  const [habitacionSonido, setHabitacionSonido] = useState(false);
  const [espacioSonido, setEspacioSonido] = useState(false);
  const [experienciaSonido, setExperienciaSonido] = useState(false);

  const [habitacionActivaIndex, setHabitacionActivaIndex] = useState(0);
  const [fotoHabitacionIndex, setFotoHabitacionIndex] = useState(0);
  const [llavesDesplegadas, setLlavesDesplegadas] = useState(false);

  const [servicioSeleccionado, setServicioSeleccionado] = useState<DetalleServicio | null>(null);

  const [espacioActivoIndex, setEspacioActivoIndex] = useState(0);
  const [experienciaActivaIndex, setExperienciaActivaIndex] = useState(0);

  const [atardecerActivoIndex, setAtardecerActivoIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalHero = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % VIDEOS_HERO.length);
    }, 9000);
    return () => clearInterval(intervalHero);
  }, [isMounted, splashActivo]);

  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalHab = setInterval(() => {
      setFotoHabitacionIndex((prev) => (prev + 1) % HABITACIONES[habitacionActivaIndex].medios.length);
    }, 6000);
    return () => clearInterval(intervalHab);
  }, [isMounted, splashActivo, habitacionActivaIndex]);

  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalEsp = setInterval(() => {
      setEspacioActivoIndex((prev) => (prev + 1) % OTROS_ESPACIOS.length);
    }, 6000);
    return () => clearInterval(intervalEsp);
  }, [isMounted, splashActivo]);

  useEffect(() => {
    if (!isMounted || splashActivo) return;
    const intervalExp = setInterval(() => {
      setExperienciaActivaIndex((prev) => (prev + 1) % EXPERIENCIAS_SAN_ANTERO.length);
    }, 7000);
    return () => clearInterval(intervalExp);
  }, [isMounted, splashActivo]);

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

  const cambiarHabitacion = (idx: number) => {
    setHabitacionActivaIndex(idx);
    setFotoHabitacionIndex(0);
    setLlavesDesplegadas(false);
  };

  const abrirModalServicio = (nombreServicio: string) => {
    const data = INFO_SERVICIOS[nombreServicio];
    if (data) {
      setServicioSeleccionado(data);
    }
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

  if (!isMounted) return <div className="min-h-screen bg-[#FAF7F2]" />;

  return (
    <main className={`w-full bg-[#FAF7F2] text-[#2a2421] antialiased selection:bg-[#8c7355]/20 overflow-x-hidden ${outfit.className}`}>

      {/* 0. BIENVENIDA */}
      {splashActivo && <BienvenidaAbadia onFinish={() => setSplashActivo(false)} />}

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
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />
            </div>
          );
        })}

        {/* SELECTOR FLOTANTE EN HERO */}
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

        {/* BOTÓN FLOTANTE AUDIO HERO */}
        <button
          onClick={() => setHeroSonido(!heroSonido)}
          className="absolute bottom-6 right-4 sm:right-12 z-30 bg-black/45 hover:bg-[#071326] text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-2"
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
            className={`${montserrat.className} bg-[#8c7355] hover:bg-[#071326] text-white px-9 sm:px-12 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] shadow-[0_15px_35px_rgba(0,0,0,0.55)] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2.5`}
          >
            <span>Reservar Ahora</span>
            <Icons.ArrowUpRight />
          </Link>
        </div>
      </section>

      {/* ========================================================
          TRANSICIÓN 1: TÍTULO EN ESTILO EDITORIAL
          ======================================================== */}
      <section className="bg-[#FAF7F2] py-10 sm:py-14 px-4 sm:px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              NUESTRAS
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              Habitaciones?
            </span>
          </div>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
            Tarifas por persona la noche. Selecciona la llave del 1 al 6 para explorar cada habitación en pantalla completa.
          </p>
        </div>
      </section>

      {/* ========================================================
          2. SECCIÓN: HABITACIÓN FULL SCREEN
          (PÍLDORAS FLOTANTES DE COMODIDADES ELIMINADAS)
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

        {/* SELECTOR SUPERIOR DUPLICADO DEL 1 AL 6 */}
        <div className="relative z-30 pt-16 sm:pt-24 px-3 sm:px-12 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="bg-white/15 backdrop-blur-3xl border border-white/30 px-3.5 sm:px-4 py-1.5 rounded-full text-white text-[11px] sm:text-xs font-light flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
              <span className="font-mono font-bold text-[#C5A059]">0{habitacionActual.numero}</span>
              <span className="text-white/40">•</span>
              <span className={`${montserrat.className} font-semibold uppercase text-[10px] tracking-wider`}>{habitacionActual.categoria}</span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-white/80 font-mono text-[10px] hidden sm:inline">
                {fotoHabitacionIndex + 1} / {habitacionActual.medios.length} {esRecursoVideo ? '(Video)' : 'fotos'}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setLlavesDesplegadas(!llavesDesplegadas)}
                className="bg-white/15 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300 active:scale-95"
                aria-label="Abrir llaves"
              >
                <Icons.Key className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Llaves</span>
                <span className="font-bold">0{habitacionActual.numero}</span>
                <span className={`text-[8px] transition-transform ${llavesDesplegadas ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {llavesDesplegadas && (
                <div className="absolute top-11 right-0 w-64 p-3 bg-black/85 backdrop-blur-3xl border border-white/25 rounded-2xl shadow-2xl z-40 animate-in fade-in zoom-in-95">
                  <div className="grid grid-cols-3 gap-2">
                    {HABITACIONES.map((h, i) => (
                      <button
                        key={h.id}
                        onClick={() => cambiarHabitacion(i)}
                        className={`p-2 rounded-xl text-center border transition-all duration-300 cursor-pointer ${
                          habitacionActivaIndex === i
                            ? 'bg-[#8c7355] text-white border-white/50'
                            : 'bg-white/10 text-white/80 border-white/10 hover:bg-[#071326]'
                        }`}
                      >
                        <span className="block text-xs font-mono font-bold">0{h.numero}</span>
                        <span className={`${montserrat.className} block text-[8px] uppercase tracking-wider truncate`}>{h.titulo}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BARRA DE NÚMEROS DEL 1 AL 6 ESPECIAL PARA CELULARES */}
          <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-3xl p-1.5 rounded-full border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-x-auto no-scrollbar">
            <span className={`${montserrat.className} text-[10px] uppercase tracking-widest text-[#C5A059] px-2.5 hidden md:inline font-bold`}>
              Habitación:
            </span>
            <div className="flex items-center justify-between w-full gap-1.5">
              {HABITACIONES.map((hab, idx) => {
                const activa = idx === habitacionActivaIndex;
                return (
                  <button
                    key={hab.id}
                    onClick={() => cambiarHabitacion(idx)}
                    className={`flex-1 py-1.5 sm:py-2 px-2 rounded-full text-center text-xs sm:text-sm font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                      activa
                        ? 'bg-[#8c7355] text-white shadow-lg shadow-[#8c7355]/40 scale-105 ring-1 ring-white/50'
                        : 'bg-white/15 hover:bg-[#071326] text-white/90 border border-white/20'
                    }`}
                    aria-label={`Ver Habitación 0${hab.numero}`}
                  >
                    0{hab.numero}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTROLES LATERALES */}
        <button
          onClick={anteriorFoto}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-90 cursor-pointer"
          aria-label="Foto anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteFoto}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-90 cursor-pointer"
          aria-label="Siguiente foto"
        >
          <Icons.ChevronRight />
        </button>

        {/* BOTÓN FLOTANTE AUDIO */}
        {esRecursoVideo && (
          <button
            onClick={() => setHabitacionSonido(!habitacionSonido)}
            className="absolute bottom-6 right-4 sm:right-12 z-30 bg-white/20 hover:bg-[#071326] text-white px-3.5 py-1.5 rounded-full backdrop-blur-3xl border border-white/30 transition-all duration-300 text-xs font-mono flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-pointer"
            aria-label={habitacionSonido ? "Silenciar video" : "Activar sonido"}
          >
            {habitacionSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[10px] uppercase hidden sm:inline">
              {habitacionSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        {/* PIE DEL VISOR FULL SCREEN (SOLO CONTADOR LIMPIO) */}
        <div className="relative z-20 pb-4 sm:pb-6 px-4 flex flex-col items-center pointer-events-none">
          <span className="bg-white/15 backdrop-blur-3xl border border-white/30 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white/90 font-mono shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            {fotoHabitacionIndex + 1} / {habitacionActual.medios.length} fotografías • Habitación 0{habitacionActual.numero}
          </span>
        </div>
      </section>

      {/* ========================================================
          3. FICHA TÉCNICA DEBAJO DEL FULL SCREEN
          ======================================================== */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-12 border-b border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-10 text-left">

          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${montserrat.className} bg-[#8c7355] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full`}>
                Habitación 0{habitacionActual.numero}
              </span>
              <span className={`${montserrat.className} text-xs font-semibold uppercase tracking-wider text-[#C5A059]`}>
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

            <div className="relative inline-block">
              <h3 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
                {habitacionActual.titulo}
              </h3>
              <span className={`${alexBrush.className} block text-3xl sm:text-5xl text-[#7C9D96] -mt-2 sm:-mt-4 tracking-wide`}>
                privacidad & confort
              </span>
            </div>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal pt-1">
              {habitacionActual.descripcion}
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-700 font-medium">
                <span>👥 {habitacionActual.ocupacion}</span>
                <span>•</span>
                <span className="font-semibold text-stone-900">🛏️ {habitacionActual.camas}</span>
              </div>

              {/* BOTONES DE SERVICIOS CON MODAL */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {habitacionActual.servicios.map((srv, i) => (
                  <button
                    key={i}
                    onClick={() => abrirModalServicio(srv)}
                    className="group bg-[#FAF7F2] hover:bg-[#071326] text-stone-800 hover:text-white p-2.5 rounded-xl border border-[#E8DDD0] hover:border-[#071326] text-xs font-medium flex items-center justify-between shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-[#8c7355] group-hover:text-[#C5A059] font-bold">✓</span>
                      <span className="truncate">{srv}</span>
                    </span>
                    <span className="text-[10px] text-stone-400 group-hover:text-white/80">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tarjeta de tarifa oficial y botón WhatsApp */}
          <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between gap-5 shrink-0 lg:w-80">
            <div>
              <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-500 font-bold block`}>
                
              </span>
              <div className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-[#C5A059] mt-1`}>
                {habitacionActual.precio} <span className="text-sm text-stone-500 font-normal">{habitacionActual.noches}</span>
              </div>
              <span className="text-xs text-stone-500 block mt-1">
                Acomodación: {habitacionActual.ocupacion}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => cotizarWhatsApp(`reservar la ${habitacionActual.titulo} (${habitacionActual.precio} por persona la noche)`)}
                className={`${montserrat.className} w-full bg-[#8c7355] hover:bg-[#071326] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
              >
                <Icons.WhatsApp />
                <span>Reservar WhatsApp</span>
              </button>

              <Link
                href={`/habitaciones?id=${habitacionActual.id}`}
                className={`${montserrat.className} w-full bg-white hover:bg-stone-100 text-stone-900 border border-[#E8DDD0] py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 text-center`}
              >
                <span>Ver al Detalle</span>
                <Icons.ArrowUpRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          MODAL DETALLE DE SERVICIOS
          ======================================================== */}
      {servicioSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            onClick={() => setServicioSeleccionado(null)} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] space-y-5 text-stone-900 z-10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD0]">
                  {servicioSeleccionado.icono}
                </span>
                <div>
                  <span className={`${montserrat.className} text-[10px] uppercase tracking-widest text-[#8c7355] font-bold block`}>
                    Comodidad Incluida
                  </span>
                  <h4 className={`${montserrat.className} text-xl sm:text-2xl font-bold text-[#C5A059]`}>
                    {servicioSeleccionado.nombre}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => setServicioSeleccionado(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm transition-all cursor-pointer"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
              {servicioSeleccionado.resumen}
            </p>

            <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DDD0]">
              <span className={`${montserrat.className} text-[10px] uppercase tracking-wider text-stone-500 font-bold block`}>
                Especificaciones del servicio:
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700">
                {servicioSeleccionado.detalles.map((det, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8c7355] font-bold mt-0.5">✓</span>
                    <span>{det}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setServicioSeleccionado(null)}
              className={`${montserrat.className} w-full bg-[#8c7355] hover:bg-[#071326] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md active:scale-95`}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          4. SECCIÓN: VIDEO MEDIO (LIMPIO)
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
        <div className="max-w-2xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              OTROS
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              Espacios?
            </span>
          </div>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
            Descubre las áreas comunes, piscina, patios y estacionamiento privado diseñados para tu comodidad absoluta.
          </p>
        </div>
      </section>

      {/* ========================================================
          5. SECCIÓN: OTROS ESPACIOS
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

        <div className="relative z-20 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-between text-stone-900">
          <span className={`${montserrat.className} bg-white/85 backdrop-blur-xl border border-white/60 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-stone-900 shadow-lg flex items-center gap-1.5 uppercase`}>
            {espacioEsVideo && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {espacioActual.tag}
          </span>
          <div className="flex gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {OTROS_ESPACIOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setEspacioActivoIndex(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  i === espacioActivoIndex ? 'bg-[#C5A059] scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ver espacio ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {espacioEsVideo && (
          <button
            onClick={() => setEspacioSonido(!espacioSonido)}
            className="absolute top-32 right-4 sm:right-12 z-30 bg-black/45 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={espacioSonido ? "Silenciar video" : "Activar sonido"}
          >
            {espacioSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {espacioSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 w-full px-4 sm:px-12 pb-6 sm:pb-10">
          <div className="max-w-6xl mx-auto bg-white/85 backdrop-blur-2xl border border-white/60 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 text-left text-stone-900">
            <div className="space-y-1">
              <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8c7355] font-bold block`}>
                
              </span>
              <h3 className={`${montserrat.className} text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#C5A059]`}>
                {espacioActual.titulo}
              </h3>
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                {espacioActual.descripcion}
              </p>
            </div>

            <Link
              href="/otros-espacios"
              className={`${montserrat.className} w-full sm:w-auto bg-[#8c7355] hover:bg-[#071326] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 shrink-0 shadow-lg text-center`}
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
        <div className="max-w-3xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              QUÉ HACER
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              en San Antero?
            </span>
          </div>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
            Gastronomía típica, diversión náutica, playas y cultura local. El carrusel avanza automáticamente o puedes navegarlo con las flechas.
          </p>
        </div>
      </section>

      {/* ========================================================
          6. SECCIÓN: DESTINO
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

        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-black/50 backdrop-blur-2xl border border-white/20 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-[11px] sm:text-xs font-light flex items-center gap-2 shadow-xl transition-all duration-500">
            <span className="text-[#C5A059] font-mono font-bold">0{experienciaActivaIndex + 1}</span>
            <span className="text-white/40">•</span>
            <span className={`${montserrat.className} font-bold tracking-wide uppercase text-[10px]`}>{experienciaActual.titulo}</span>
            {experienciaEsVideo && (
              <span className="bg-red-500/85 text-white text-[8px] uppercase px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                <Icons.Play /> Video
              </span>
            )}
          </div>

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

        <button
          onClick={anteriorExperiencia}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#071326] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Experiencia anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteExperiencia}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-[#071326] text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 cursor-pointer"
          aria-label="Siguiente experiencia"
        >
          <Icons.ChevronRight />
        </button>

        {experienciaEsVideo && (
          <button
            onClick={() => setExperienciaSonido(!experienciaSonido)}
            className="absolute bottom-4 right-4 sm:right-12 z-30 bg-black/45 hover:bg-[#071326] text-white p-2.5 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-xl active:scale-90 cursor-pointer flex items-center gap-1.5"
            aria-label={experienciaSonido ? "Silenciar video" : "Activar sonido"}
          >
            {experienciaSonido ? <Icons.VolumeUp /> : <Icons.VolumeMute />}
            <span className="text-[9px] uppercase font-mono tracking-wider hidden sm:inline">
              {experienciaSonido ? "Audio ON" : "Audio OFF"}
            </span>
          </button>
        )}

        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white/80 font-mono">
            {experienciaActivaIndex + 1} de {EXPERIENCIAS_SAN_ANTERO.length} • {experienciaActual.tag}
          </span>
        </div>
      </section>

      {/* ========================================================
          7. SECCIÓN EDITORIAL: INFORMACIÓN Y ACCIONES
          ======================================================== */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-12 border-b border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-10 text-left">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`${montserrat.className} bg-[#8c7355] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full`}>
                {experienciaActual.tag}
              </span>
              <span className="text-xs text-stone-500 font-light">
                📍 San Antero & Alrededores
              </span>
            </div>

            <div className="relative inline-block">
              <h3 className={`${montserrat.className} text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
                {experienciaActual.titulo}
              </h3>
              <span className={`${alexBrush.className} block text-3xl sm:text-5xl text-[#7C9D96] -mt-2 sm:-mt-4 tracking-wide`}>
                experiencia de destino
              </span>
            </div>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal pt-1">
              {experienciaActual.descripcion}
            </p>

            <div className="flex items-center gap-2 pt-1 text-sm text-stone-600">
              <span className="text-[#8c7355] font-bold">✓</span>
              <span>Recomendación exclusiva de Abadía Casa Hotel</span>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between gap-4 shrink-0 lg:w-80">
            <div>
              <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-500 font-bold block`}>
                
              </span>
              <div className={`${montserrat.className} text-lg sm:text-xl font-bold text-[#C5A059] mt-1`}>
                {experienciaActual.titulo}
              </div>
              <span className="text-xs text-stone-500 block mt-0.5">
                Te asesoramos con transporte y horarios
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => cotizarWhatsApp(`conocer más sobre ${experienciaActual.titulo} en San Antero`)}
                className={`${montserrat.className} w-full bg-[#8c7355] hover:bg-[#071326] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
              >
                <Icons.WhatsApp />
                <span>Consultar por WhatsApp</span>
              </button>

              <Link
                href="/que-hacer"
                className={`${montserrat.className} w-full bg-white hover:bg-stone-100 text-stone-900 border border-[#E8DDD0] py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 text-center`}
              >
                <span>Ver Guía Completa</span>
                <Icons.ArrowUpRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          8. SECCIÓN: ATARDECERES EN SAN ANTERO
          ======================================================== */}
      <section id="atardeceres-san-antero" className="bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-3xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              LOS ATARDECERES
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              en San Antero?
            </span>
          </div>
        </div>
      </section>

      {/* 1er CARRUSEL: VISOR PRINCIPAL */}
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

        <div className="relative z-30 pt-16 sm:pt-24 px-4 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-white/20 backdrop-blur-3xl border border-white/30 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-[11px] sm:text-xs font-medium flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-all duration-500">
            <span className="text-[#C5A059] font-mono font-bold">0{atardecerActivoIndex + 1}</span>
            <span className="text-white/40">•</span>
            <span className={`${montserrat.className} tracking-wide text-white uppercase text-[10px] font-semibold`}>{atardecerActual.titulo}</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 font-mono text-[10px] hidden sm:inline">{atardecerActual.momento}</span>
          </div>

          <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-white/20 backdrop-blur-3xl px-3 py-1.5 rounded-full border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
            {ATARDECERES_FOTOS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setAtardecerActivoIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === atardecerActivoIndex
                    ? 'w-6 h-1.5 bg-[#C5A059]'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Ver foto de atardecer ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={anteriorAtardecer}
          className="absolute left-3 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-90 cursor-pointer"
          aria-label="Atardecer anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={siguienteAtardecer}
          className="absolute right-3 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-90 cursor-pointer"
          aria-label="Siguiente atardecer"
        >
          <Icons.ChevronRight />
        </button>

        <div className="relative z-20 pb-4 sm:pb-6 text-center pointer-events-none">
          <span className="bg-white/20 backdrop-blur-3xl border border-white/30 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] text-white font-mono shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
            {atardecerActivoIndex + 1} de {ATARDECERES_FOTOS.length} fotografías • Atardecer en San Antero
          </span>
        </div>
      </section>

      {/* 2do CARRUSEL: TIRA INFINITA */}
      <section className="bg-[#FAF7F2] py-6 px-4 border-b border-[#E8DDD0] overflow-hidden">
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
                      ? 'border-[#C5A059] scale-105 shadow-lg ring-2 ring-[#C5A059]/40'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/80'
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

      {/* 9. FOOTER AZUL ABADÍA UNIFICADO */}
      <GlobalFooter />

    </main>
  );
}