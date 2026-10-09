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

// --- 2 VIDEOS PARA EL BANNER SUPERIOR (HERO) ---
const VIDEOS_HERO_ESPACIOS = [
  {
    id: 1,
    titulo: "Piscina & Parqueadero ",
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

// --- DATA: PISCINA Y PARQUEADERO (CADA UNO CON SU VIDEO Y 2 FOTOS) ---
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
      },
     
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
      },
     
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
  )
};

export default function PaginaOtrosEspacios() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videoHeroActivo, setVideoHeroActivo] = useState(0);
  const [heroSonido, setHeroSonido] = useState(false);
  const [espacioActivo, setEspacioActivo] = useState(0);

  // Cambio automático entre los 2 videos cada 9s
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoHeroActivo((prev) => (prev + 1) % VIDEOS_HERO_ESPACIOS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const espacioSeleccionado = ESPACIOS_CASA[espacioActivo];

  const consultarWhatsApp = (espacioNombre: string) => {
    const msj = encodeURIComponent(
      `Hola! Deseo más información sobre los espacios y comodidades de Abadía Casa Hotel (especialmente ${espacioNombre}).`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

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
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-left my-auto">
            <Link onClick={() => setMenuAbierto(false)} href="/" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Inicio</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Nuestras Habitaciones</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Otros Espacios de la Casa</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Qué hacer en San Antero</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className={`${montserrat.className} text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors`}>Dashboard de Reservas & Pagos</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <span>Caribe</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. BANNER PRINCIPAL (HERO) CON 2 VIDEOS .MOV DE LAS ÁREAS
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

        {/* SELECTOR FLOTANTE PARA CAMBIAR ENTRE LOS 2 VIDEOS */}
        <div className="absolute top-24 sm:top-28 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20">
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-white/70">
            Video {videoHeroActivo + 1}/2: {VIDEOS_HERO_ESPACIOS[videoHeroActivo].titulo}
          </span>
          <div className="flex items-center gap-1.5">
            {VIDEOS_HERO_ESPACIOS.map((_, i) => (
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

        {/* TÍTULO EDITORIAL HERO */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-2 text-center px-4">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-white/80 font-bold block`}>
            Rincones de Calma & Comodidad
          </span>
          <div className="relative inline-block">
            <h1 className={`${montserrat.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
              OTROS
            </h1>
            <span className={`${alexBrush.className} block text-5xl sm:text-7xl text-[#7C9D96] -mt-3 sm:-mt-6 tracking-wide drop-shadow-md`}>
              Espacios de la Casa?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-200 font-light max-w-lg mx-auto pt-1">
            Conoce nuestra piscina cristalina con kiosko y el parqueadero privado vigilado dentro del predio.
          </p>

          <div className="pt-2">
            <Link
              href="#detalle-espacios"
              className={`${montserrat.className} inline-flex items-center gap-2 bg-[#8c7355] hover:bg-[#071326] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(0,0,0,0.55)] transition-all duration-300 active:scale-95`}
            >
              <span>Explorar Espacios</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSICIÓN EDITORIAL: TÍTULO EN DORADO */}
      <section id="detalle-espacios" className="bg-[#FAF7F2] py-12 sm:py-16 px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              PISCINA &
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              Parqueadero Privado?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-2">
            Selecciona el espacio para conocer su descripción, características y fotografías detalladas.
          </p>
        </div>
      </section>

      {/* SELECTOR MODERNO DE LOS DOS ESPACIOS (PISCINA / PARQUEADERO) */}
      <section className="bg-white border-b border-[#E8DDD0] py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 sm:gap-6">
          {ESPACIOS_CASA.map((item, idx) => {
            const activo = idx === espacioActivo;
            return (
              <button
                key={item.id}
                onClick={() => setEspacioActivo(idx)}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activo
                    ? 'bg-[#8c7355] text-white shadow-md scale-105 ring-2 ring-[#8c7355]/30'
                    : 'bg-[#FAF7F2] hover:bg-[#071326] text-stone-700 hover:text-white border border-[#E8DDD0]'
                }`}
              >
                0{item.numero} • {item.nombre}
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          2. DETALLE PRINCIPAL DEL ESPACIO ACTIVO (CON SU VIDEO Y FICHA)
          ======================================================== */}
      <section className="py-12 sm:py-16 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E8DDD0] shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* VIDEO PRINCIPAL DEL ESPACIO */}
          <div className="relative w-full lg:w-1/2 h-[55vh] lg:h-auto bg-black overflow-hidden">
            <video
              key={espacioSeleccionado.video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover scale-105"
            >
              <source src={espacioSeleccionado.video} type="video/quicktime" />
              <source src={espacioSeleccionado.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-3xl border border-white/30 px-3.5 py-1 rounded-full text-white text-[10px] font-mono">
              Video en vivo • 0{espacioSeleccionado.numero}
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] block">
                {espacioSeleccionado.horario}
              </span>
              <h3 className={`${montserrat.className} text-xl sm:text-2xl font-bold uppercase`}>
                {espacioSeleccionado.nombre}
              </h3>
            </div>
          </div>

          {/* DESCRIPCIÓN Y ESPECIFICACIONES */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`${montserrat.className} bg-[#8c7355] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full`}>
                  Área 0{espacioSeleccionado.numero}
                </span>
                <span className={`${montserrat.className} text-xs font-semibold uppercase text-[#C5A059]`}>
                  {espacioSeleccionado.etiqueta}
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className={`${montserrat.className} text-2xl sm:text-3xl font-extrabold uppercase text-[#2a2421]`}>
                  {espacioSeleccionado.nombre}
                </h3>
                <span className={`${alexBrush.className} block text-3xl sm:text-4xl text-[#7C9D96]`}>
                  comodidad garantizada
                </span>
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal pt-1">
                {espacioSeleccionado.descripcionLarga}
              </p>

              {/* LISTA DE CARACTERÍSTICAS */}
              <div className="pt-2">
                <span className={`${montserrat.className} text-[10px] uppercase tracking-[0.2em] text-[#7d6553] font-bold block mb-2`}>
                  Servicios y Comodidades Incluidas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {espacioSeleccionado.caracteristicas.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#071326]/10 text-xs text-stone-800">
                      <span className="text-[#8c7355] font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTÓN WHATSAPP */}
            <div className="pt-2">
              <button
                onClick={() => consultarWhatsApp(espacioSeleccionado.nombre)}
                className={`${montserrat.className} w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8c7355] hover:bg-[#071326] text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-all duration-300 active:scale-95 cursor-pointer`}
              >
                <Icons.WhatsApp />
                <span>Consultar Disponibilidad por WhatsApp</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. SECCIÓN: 2 FOTOS ABAJO CON SU DESCRIPCIÓN INDIVIDUAL
          ======================================================== */}
      <section className="bg-white py-12 sm:py-16 px-6 sm:px-12 border-t border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <span className={`${montserrat.className} text-[9px] uppercase tracking-[0.3em] text-[#8c7355] font-bold block`}>
              Fotografías del Espacio
            </span>
            <h3 className={`${montserrat.className} text-xl sm:text-3xl font-extrabold uppercase text-[#2a2421]`}>
              Galería de {espacioSeleccionado.nombre}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Detalles visuales para que conozcas cada rincón antes de tu llegada.
            </p>
          </div>

          {/* CUADRÍCULA CON LAS 2 FOTOS ABAJO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {espacioSeleccionado.fotosAbajo.map((foto, index) => (
              <div
                key={index}
                className="group bg-[#FAF7F2] rounded-3xl border border-[#E8DDD0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
                  <Image
                    src={foto.src}
                    alt={foto.titulo}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-2xl border border-white/30 px-3 py-1 rounded-full text-white text-[10px] font-mono">
                    Foto 0{index + 1} de 02
                  </div>
                </div>

                <div className="p-6 space-y-1.5 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className={`${montserrat.className} text-base sm:text-lg font-bold uppercase text-[#2a2421]`}>
                      {foto.titulo}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-1">
                      {foto.pie}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-[#8c7355] font-mono">
                    <span>Abadía Casa Hotel</span>
                    <span className="font-semibold">{espacioSeleccionado.nombre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER AZUL ABADÍA UNIFICADO */}
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