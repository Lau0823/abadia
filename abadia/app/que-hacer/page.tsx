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

// --- 1 SOLO VIDEO PARA EL BANNER SUPERIOR ---
const VIDEO_HERO_DESTINO = {
  src: "/mar.mp4",
  poster: "/atardecer.jpg"
};

interface FotoLugar {
  src: string;
  titulo: string;
  pie: string;
}

interface PlanDestino {
  id: string;
  numero: string;
  nombre: string;
  subtitulo: string;
  tipo: string;
  distancia: string;
  descripcion: string;
  recursoPrincipal: string;
  esVideo: boolean;
  destacados: string[];
  fotosGaleria: FotoLugar[];
}

const PLANES_SAN_ANTERO: PlanDestino[] = [
  {
    id: "playa-blanca",
    numero: "01",
    nombre: "Playa Blanca • San Antero",
    subtitulo: "La Joya Natural Frente a Abadía",
    tipo: "Playa Serena & Desconexión",
    distancia: "Frente al hotel (paso directo)",
    descripcion:
      "Nuestra playa insignia en San Antero, caracterizada por su arena suave, oleaje sereno y aguas cálidas protegidas por el golfo. Es el espacio ideal para caminar temprano en la mañana, nadar con tranquilidad, disfrutar cocos fríos bajo la sombra de las palmeras y contemplar los atardeceres dorados más impresionantes de la región.",
    recursoPrincipal: "/mar.mp4",
    esVideo: true,
    destacados: [
      "Aguas cristalinas y oleaje muy suave",
      "Paso directo y privado desde Abadía Casa Hotel",
      "Kioskos de palma y brisa constante",
      "Los atardeceres más hermosos de San Antero"
    ],
    fotosGaleria: [
      {
        src: "/atardecer.jpg",
        titulo: "Atardecer Dorado en Playa Blanca",
        pie: "La hora en que el sol tiñe el horizonte de tonos ámbar y oro."
      },
      {
        src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
        titulo: "Marea Baja & Aguas Calmas",
        pie: "Piscina natural de mar perfecta para nadar y relajarse."
      },
      {
        src: "/atardeceres/DSC00012.JPG",
        titulo: "Sendero Costero entre Palmeras",
        pie: "Ruta de arena suave ideal para caminatas al amanecer."
      },
      {
        src: "/sunshine.JPG",
        titulo: "Reflejo Caribeño",
        pie: "Un rincón de calma sin aglomeraciones ni ruido."
      }
    ]
  },
  {
    id: "la-caimanera",
    numero: "02",
    nombre: "Ciénaga de la Caimanera",
    subtitulo: "Santuario de Manglares & Naturaleza",
    tipo: "Ecoturismo & Aventura Natural",
    distancia: "A 10 min de Abadía",
    descripcion:
      "Una reserva ecológica protegida de manglares y canales de agua calma. Realiza paseos guiados en canoa artesanal impulsada por palanca, observa aves migratorias, cangrejos azules y visita la famosa casa flotante en medio de la laguna para tomar un refrigerio típico.",
    recursoPrincipal: "/sunshine.JPG",
    esVideo: false,
    destacados: [
      "Paseo ecológico en canoa nativa a palanca",
      "Visita a la Casa Flotante en medio de la ciénaga",
      "Avistamiento de aves y manglar rojo",
      "Aguas completamente serenas y silenciosas"
    ],
    fotosGaleria: [
      {
        src: "/sunshine.JPG",
        titulo: "Canales de Manglar Rojo",
        pie: "Paseo entre las raíces de manglar en un silencio absoluto."
      },
      {
        src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
        titulo: "La Laguna Central",
        pie: "Espejo de agua donde convergen corrientes marinas y fluviales."
      },
      {
        src: "/amanecersan atnero.JPG",
        titulo: "Canoas Artesanales",
        pie: "Embarcaciones tradicionales guiadas por baquianos locales."
      }
    ]
  },
  {
    id: "donde-vicenta",
    numero: "03",
    nombre: "Donde Vicenta",
    subtitulo: "Arepa de Huevo & Tradición Costeña",
    tipo: "Gastronomía Tradicional Auténtica",
    distancia: "Punto gastronómico en San Antero",
    descripcion:
      "La parada culinaria más representativa del municipio. Famosa por sus arepas con huevo crujientes recién fritas, carimañolas de queso y carne, empanadas y café recién colado. Un sabor auténtico de la tradición cordobesa con historia y sazón familiar.",
    recursoPrincipal: "/vicenta.MOV",
    esVideo: true,
    destacados: [
      "Arepa de huevo tradicional recién preparada",
      "Carimañolas y fritos costeños típicos",
      "Atención cálida y autóctona",
      "Recomendado para desayunos o meriendas"
    ],
    fotosGaleria: [
      {
        src: "/121017.jpg",
        titulo: "Fogón Tradicional",
        pie: "Preparaciones calientes al instante con receta familiar."
      },
      {
        src: "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
        titulo: "El Auténtico Sabor Costeño",
        pie: "El manjar que todo huésped debe probar en San Antero."
      },
      {
        src: "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg",
        titulo: "Tradición que Conecta",
        pie: "Punto de encuentro gastronómico reconocido en todo Córdoba."
      }
    ]
  },
  {
    id: "covenas",
    numero: "04",
    nombre: "Playas de Coveñas",
    subtitulo: "Deportes Náuticos & Bahías Extensas",
    tipo: "Mar, Diversión & Vida Playera",
    distancia: "A 15 min por la troncal costera",
    descripcion:
      "A pocos minutos de San Antero se encuentran las extensas bahías de Coveñas, famosas por su oleaje suave y amplia oferta náutica. Es el lugar perfecto para alquilar motos de agua, pasear en banana boat, disfrutar quioscos de playa y degustar mariscos frescos a orillas del mar.",
    recursoPrincipal: "/IMG_2277.mov",
    esVideo: true,
    destacados: [
      "Alquiler de motos acuáticas y kayaks",
      "Playas sombreadas con quioscos de palma",
      "Restaurantes de pescado fresco y cazuelas",
      "Paseos en lancha por el Golfo de Morrosquillo"
    ],
    fotosGaleria: [
      {
        src: "/amanecersan atnero.JPG",
        titulo: "Orilla de Playa Coveñas",
        pie: "Kilómetros de playa con aguas tibias y palmeras."
      },
      {
        src: "/atardeceres/DSC00012.JPG",
        titulo: "Adrenalina Náutica",
        pie: "Motos de agua y paseos en lancha hacia puntos clave del golfo."
      },
      {
        src: "/atardecer.jpg",
        titulo: "Quioscos de Palma",
        pie: "Espacios de sombra para almorzar comida de mar frente a las olas."
      }
    ]
  },
  {
    id: "malecon",
    numero: "05",
    nombre: "Malecón de San Antero",
    subtitulo: "Brisa Marina, Paseo & Cultura",
    tipo: "Paseo Turístico & Atardeceres",
    distancia: "Centro costero de San Antero",
    descripcion:
      "El punto de encuentro para caminar al caer la tarde, sentir la brisa marina y contemplar la puesta de sol sobre el muelle. Cuenta con letras turísticas para fotos de recuerdo, puestos de artesanías en caña flecha, dulces tradicionales y música local en vivo los fines de semana.",
    recursoPrincipal: "/atardeceres/DSC00012.JPG",
    esVideo: false,
    destacados: [
      "Muelle panorámico para fotografías",
      "Muestra artesanal y recuerdos en caña flecha",
      "Puestos de helados, dulces típicos y bebidas",
      "Paseo seguro y familiar al anochecer"
    ],
    fotosGaleria: [
      {
        src: "/atardecer.jpg",
        titulo: "Vista hacia el Muelle",
        pie: "La hora dorada ilumina el malecón con tonalidades cálidas."
      },
      {
        src: "/sunshine.JPG",
        titulo: "Caminata al Atardecer",
        pie: "Sendero peatonal acompañado de la brisa marina del golfo."
      },
      {
        src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
        titulo: "Letras Turísticas",
        pie: "El recuerdo fotográfico imperdible de tu visita a San Antero."
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

export default function PaginaQueHacer() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [heroSonido, setHeroSonido] = useState(false);
  const [planActivo, setPlanActivo] = useState(0);
  const [fotoGaleriaActiva, setFotoGaleriaActiva] = useState(0);

  // Reiniciar el índice de fotos al cambiar de plan
  useEffect(() => {
    setFotoGaleriaActiva(0);
  }, [planActivo]);

  const planSeleccionado = PLANES_SAN_ANTERO[planActivo];
  const fotosActuales = planSeleccionado.fotosGaleria;
  const fotoActual = fotosActuales[fotoGaleriaActiva];

  const siguienteFoto = () => {
    setFotoGaleriaActiva((prev) => (prev + 1) % fotosActuales.length);
  };

  const anteriorFoto = () => {
    setFotoGaleriaActiva((prev) => (prev === 0 ? fotosActuales.length - 1 : prev - 1));
  };

  const consultarPlanWhatsApp = (nombrePlan: string) => {
    const msj = encodeURIComponent(
      `Hola! Estoy hospedándome / planeando visitar Abadía Casa Hotel y deseo coordinar información, transporte o tour para visitar: ${nombrePlan}.`
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
            <span>Caribe Colombiano</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. BANNER PRINCIPAL (HERO) CON 1 SOLO VIDEO
          ======================================================== */}
      <section className="relative h-[85vh] sm:h-[92vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 sm:pb-16 items-center">
        <video
          poster={VIDEO_HERO_DESTINO.poster}
          autoPlay
          muted={!heroSonido}
          loop
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            e.currentTarget.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src={VIDEO_HERO_DESTINO.src} type="video/mp4" />
          <source src={VIDEO_HERO_DESTINO.src} type="video/quicktime" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />

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
            Guía de Destino & Experiencias
          </span>
          <div className="relative inline-block">
            <h1 className={`${montserrat.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
              QUÉ HACER
            </h1>
            <span className={`${alexBrush.className} block text-5xl sm:text-7xl text-[#7C9D96] -mt-3 sm:-mt-6 tracking-wide drop-shadow-md`}>
              en San Antero?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-200 font-light max-w-lg mx-auto pt-1">
            Desde la magia de Playa Blanca hasta La Caimanera, la sazón de Vicenta, Coveñas y el Malecón.
          </p>

          <div className="pt-2">
            <Link
              href="#guia-planes"
              className={`${montserrat.className} inline-flex items-center gap-2 bg-[#8c7355] hover:bg-[#071326] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(0,0,0,0.55)] transition-all duration-300 active:scale-95`}
            >
              <span>Explorar Planes</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSICIÓN EDITORIAL: TÍTULO EN DORADO */}
      <section id="guia-planes" className="bg-[#FAF7F2] py-12 sm:py-16 px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-1">
          <span className={`${montserrat.className} text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-bold block`}>
            — 5 DESTINOS INOLVIDABLES
          </span>
          <div className="relative inline-block">
            <h2 className={`${montserrat.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2a2421]`}>
              PLAYA BLANCA &
            </h2>
            <span className={`${alexBrush.className} block text-4xl sm:text-6xl text-[#7C9D96] -mt-3 sm:-mt-5 tracking-wide`}>
              Alrededores del Golfo?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-2">
            Selecciona el lugar para ver su video o recurso principal, detalles y su galería de varias fotos.
          </p>
        </div>
      </section>

      {/* SELECTOR DE LOS 5 PLANES: EN AZUL ABADÍA Y SIN NÚMEROS */}
      <section className="bg-white border-b border-[#E8DDD0] py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {PLANES_SAN_ANTERO.map((item, idx) => {
            const activo = idx === planActivo;
            return (
              <button
                key={item.id}
                onClick={() => setPlanActivo(idx)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activo
                    ? 'bg-[#071326] text-white shadow-lg shadow-[#071326]/30 scale-105 ring-2 ring-[#071326]/40'
                    : 'bg-[#FAF7F2] hover:bg-[#071326] text-stone-700 hover:text-white border border-[#E8DDD0]'
                }`}
              >
                {item.nombre.split('•')[0].trim()}
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          2. DETALLE PRINCIPAL DEL PLAN ACTIVO
          ======================================================== */}
      <section className="py-12 sm:py-16 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E8DDD0] shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* RECURSO VISUAL PRINCIPAL (VIDEO O FOTO) */}
          <div className="relative w-full lg:w-1/2 h-[55vh] lg:h-auto bg-black overflow-hidden">
            {planSeleccionado.esVideo ? (
              <video
                key={planSeleccionado.recursoPrincipal}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover scale-105"
              >
                <source src={planSeleccionado.recursoPrincipal} type="video/mp4" />
                <source src={planSeleccionado.recursoPrincipal} type="video/quicktime" />
              </video>
            ) : (
              <Image
                key={planSeleccionado.recursoPrincipal}
                src={planSeleccionado.recursoPrincipal}
                alt={planSeleccionado.nombre}
                fill
                unoptimized
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-3xl border border-white/30 px-3.5 py-1 rounded-full text-white text-[10px] font-mono">
              {planSeleccionado.distancia}
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] block">
                {planSeleccionado.tipo}
              </span>
              <h3 className={`${montserrat.className} text-xl sm:text-2xl font-bold uppercase`}>
                {planSeleccionado.nombre}
              </h3>
            </div>
          </div>

          {/* DESCRIPCIÓN EDITORIAL Y CARACTERÍSTICAS */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`${montserrat.className} bg-[#8c7355] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full`}>
                  Experiencia Destacada
                </span>
                <span className={`${montserrat.className} text-xs font-semibold uppercase text-[#C5A059]`}>
                  {planSeleccionado.subtitulo}
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className={`${montserrat.className} text-2xl sm:text-3xl font-extrabold uppercase text-[#2a2421]`}>
                  {planSeleccionado.nombre}
                </h3>
                <span className={`${alexBrush.className} block text-3xl sm:text-4xl text-[#7C9D96]`}>
                  experiencia auténtica
                </span>
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal pt-1">
                {planSeleccionado.descripcion}
              </p>

              {/* LISTA DE HIGHLIGHTS */}
              <div className="pt-2">
                <span className={`${montserrat.className} text-[10px] uppercase tracking-[0.2em] text-[#7d6553] font-bold block mb-2`}>
                  Qué encontrarás en esta experiencia:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planSeleccionado.destacados.map((item, i) => (
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
                onClick={() => consultarPlanWhatsApp(planSeleccionado.nombre)}
                className={`${montserrat.className} w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8c7355] hover:bg-[#071326] text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-all duration-300 active:scale-95 cursor-pointer`}
              >
                <Icons.WhatsApp />
                <span>Coordinar Visita por WhatsApp</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. GALERÍA CON MÚLTIPLES FOTOS POR LUGAR (CARRUSEL INTERACTIVO)
          ======================================================== */}
      <section className="bg-white py-12 sm:py-16 px-6 sm:px-12 border-t border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <span className={`${montserrat.className} text-[9px] uppercase tracking-[0.3em] text-[#8c7355] font-bold block`}>
              Galería Fotográfica
            </span>
            <h3 className={`${montserrat.className} text-xl sm:text-3xl font-extrabold uppercase text-[#2a2421]`}>
              Vistas de {planSeleccionado.nombre.split('•')[0]}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Explora las diferentes fotografías de este lugar navegando con las flechas o seleccionando abajo.
            </p>
          </div>

          {/* VISOR PRINCIPAL DE LA FOTO SELECCIONADA */}
          <div className="relative h-[60vh] sm:h-[70vh] w-full bg-black rounded-3xl overflow-hidden shadow-xl group">
            <Image
              key={fotoActual.src}
              src={fotoActual.src}
              alt={fotoActual.titulo}
              fill
              unoptimized
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* ETIQUETA SUPERIOR */}
            <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
              <span className="bg-white/20 backdrop-blur-2xl border border-white/30 px-3.5 py-1.5 rounded-full text-white text-xs font-mono">
                Foto {fotoGaleriaActiva + 1} de {fotosActuales.length}
              </span>
              <span className="bg-white/20 backdrop-blur-2xl border border-white/30 px-3.5 py-1.5 rounded-full text-white text-xs font-medium hidden sm:inline">
                {planSeleccionado.nombre}
              </span>
            </div>

            {/* CONTROLES ‹ Y › */}
            <button
              onClick={anteriorFoto}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90 cursor-pointer"
              aria-label="Foto anterior"
            >
              <Icons.ChevronLeft />
            </button>

            <button
              onClick={siguienteFoto}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 hover:bg-[#071326] text-white backdrop-blur-3xl border border-white/30 flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90 cursor-pointer"
              aria-label="Siguiente foto"
            >
              <Icons.ChevronRight />
            </button>

            {/* PIE DE LA FOTO ACTUAL */}
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white text-left max-w-3xl">
              <h4 className={`${montserrat.className} text-xl sm:text-2xl font-bold uppercase drop-shadow-md`}>
                {fotoActual.titulo}
              </h4>
              <p className="text-xs sm:text-sm text-stone-200 font-light drop-shadow-md pt-0.5">
                {fotoActual.pie}
              </p>
            </div>
          </div>

          {/* TIRA DE MINIATURAS PARA SELECCIONAR FOTO DIRECTA */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2">
            {fotosActuales.map((foto, idx) => {
              const activa = idx === fotoGaleriaActiva;
              return (
                <button
                  key={idx}
                  onClick={() => setFotoGaleriaActiva(idx)}
                  className={`relative w-24 sm:w-32 h-16 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer ${
                    activa
                      ? 'border-[#071326] scale-105 shadow-md ring-2 ring-[#071326]/40'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={foto.src}
                    alt={foto.titulo}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1 left-2 text-[10px] text-white font-mono">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
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
            © 2026 Abadía Casa Hotel. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}