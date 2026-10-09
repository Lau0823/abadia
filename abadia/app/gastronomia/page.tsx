'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

// Iconografía SVG estilizada
const Icons = {
  ChevronLeft: () => (
    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 fill-amber-400 stroke-amber-400" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  GourmetCross: () => (
    <svg className="w-6 h-6 stroke-[#C5A059] fill-none" viewBox="0 0 24 24" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16M7 4c0 3 1.5 5 3 5m0-5c0 3-1.5 5-3 5m0-5v5m13 11l-4.5-4.5m4.5 4.5l-2-2m-13.5-3.5L8.5 14" />
      <circle cx="12" cy="12" r="1.5" className="fill-[#C5A059]" />
    </svg>
  ),
  Cloche: () => (
    <svg className="w-5 h-5 stroke-[#C5A059] fill-none" viewBox="0 0 24 24" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m-8 12h16m-16 0a8 8 0 0116 0" />
      <circle cx="12" cy="4" r="1" className="fill-[#C5A059]" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
};

const FOTOS_BANNER = [
  {
    url: "https://i.pinimg.com/736x/a0/25/6a/a0256a38ae441bb54e5c0856d48558d4.jpg",
    caption: "Mariscos frescos y cocina de mar en el Golfo de Morrosquillo"
  },
  {
    url: "https://i.pinimg.com/736x/3b/64/29/3b64299db8c9c2e125a08d9a5ed000aa.jpg",
    caption: "Atardeceres y sazón auténtica en Playa Blanca & Coveñas"
  },
  {
    url: "https://i.pinimg.com/236x/f0/72/ea/f072ea717327a15ea06b55d96c63dc0e.jpg",
    caption: "Cenas íntimas con la brisa del Caribe colombiano"
  }
];

interface LugarGastronomico {
  id: string;
  puesto: string;
  nombre: string;
  categoria: string;
  distancia: string;
  precioPromedio: string;
  calificacion: string;
  horario: string;
  resumen: string;
  descripcionCompleta: string;
  especialidades: string[];
  fotos: string[];
  mapUrl: string;
  embedMapUrl: string;
}

const TOP_RESTAURANTES_SECTOR: LugarGastronomico[] = [
  {
    id: "restaurante-pesecar",
    puesto: "01",
    nombre: "Restaurante Pesecar",
    categoria: "Pesca Artesanal & Marisquería",
    distancia: "A 5 min del hotel",
    precioPromedio: "$35.000 — $65.000 COP",
    calificacion: "4.9",
    horario: "11:00 AM — 6:30 PM",
    resumen: "Tradición culinaria de mar, pesca fresca seleccionada diariamente, patacones crocantes y auténtico arroz con coco.",
    descripcionCompleta: "Uno de los referentes gastronómicos más tradicionales y recomendados de la zona. Se distingue por su sazón costera auténtica, porciones muy generosas y pescado recién salido de las faenas locales cocinado al término perfecto.",
    especialidades: [
      "Pargo rojo frito con arroz con coco y ensalada dulce",
      "Cazuela marinera gratinada con suero casero",
      "Filete de róbalo a la plancha en salsa de ajo criollo"
    ],
    fotos: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80"
    ],
    mapUrl: "https://maps.google.com/?q=Restaurante+Pesecar+San+Antero",
    embedMapUrl: "https://www.google.com/maps?q=Restaurante+Pesecar+San+Antero&output=embed"
  },
  {
    id: "ranchon-marino",
    puesto: "02",
    nombre: "Restaurante Ranchón Marino",
    categoria: "Cocina Criolla Frente al Mar",
    distancia: "A 7 min del hotel",
    precioPromedio: "$30.000 — $60.000 COP",
    calificacion: "4.8",
    horario: "10:30 AM — 7:00 PM",
    resumen: "Kiosko tradicional sobre la brisa marina con ceviches frescos, sopas reconfortantes y pescado frito al momento.",
    descripcionCompleta: "Ambiente caribeño relajado bajo la sombra de la palma y con la brisa marina. Ideal para almorzar platos típicos playeros, ceviches frescos y compartir una cerveza helada junto al mar.",
    especialidades: [
      "Sierra frita o pargo con patacón pisao y limón criollo",
      "Ceviche fresco de camarón con toque costeño",
      "Sopa de pescado reconfortante de la casa"
    ],
    fotos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80"
    ],
    mapUrl: "https://maps.google.com/?q=Restaurante+Ranchon+Marino+San+Antero",
    embedMapUrl: "https://www.google.com/maps?q=Restaurante+Ranchon+Marino+San+Antero&output=embed"
  },
  {
    id: "restaurante-el-mirador",
    puesto: "03",
    nombre: "Restaurante El Mirador",
    categoria: "Comida Típica & Vista Panorámica",
    distancia: "A 10 min en vehículo",
    precioPromedio: "$28.000 — $55.000 COP",
    calificacion: "4.8",
    horario: "11:00 AM — 9:00 PM",
    resumen: "Comedor elevado con vista panorámica abierta, carnes a la brasa, sancochos y sazón sabanera.",
    descripcionCompleta: "El punto predilecto para contemplar el paisaje y los atardeceres del Golfo. Su carta combina sancochos en leña, carnes asadas al carbón y platos tradicionales cordobeses.",
    especialidades: [
      "Carne asada al carbón con yuca y suero atollao",
      "Sancocho de gallina criolla o trifásico",
      "Mote de queso costeño tradicional"
    ],
    fotos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
    ],
    mapUrl: "https://maps.google.com/?q=Restaurante+El+Mirador+San+Antero",
    embedMapUrl: "https://www.google.com/maps?q=Restaurante+El+Mirador+San+Antero&output=embed"
  },
  {
    id: "bahia-cispata-gourmet",
    puesto: "04",
    nombre: "Cocina Nativa Bahía Cispatá",
    categoria: "Sabores del Manglar & Mar",
    distancia: "A 12 min del hotel",
    precioPromedio: "$40.000 — $70.000 COP",
    calificacion: "4.7",
    horario: "11:30 AM — 6:00 PM",
    resumen: "Experiencia sobre muelle entre manglares, mariscos salteados y bebidas tropicales.",
    descripcionCompleta: "Ubicado en el entorno ecológico de la Bahía de Cispatá. Brinda una experiencia gastronómica tranquila rodeada de naturaleza con recetas enfocadas en jaibas, langostinos y pesca del día.",
    especialidades: [
      "Langostinos al ajillo con patacones dorados",
      "Ceviche de jaiba y pulpo marinado",
      "Limonada de coco artesanal"
    ],
    fotos: [
      "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    ],
    mapUrl: "https://maps.google.com/?q=Bahia+Cispata+San+Antero",
    embedMapUrl: "https://www.google.com/maps?q=Bahia+Cispata+San+Antero&output=embed"
  },
  {
    id: "asados-el-fogon",
    puesto: "05",
    nombre: "El Fogón de San Antero",
    categoria: "Asados al Carbón & Comida Casera",
    distancia: "A 8 min en el casco urbano",
    precioPromedio: "$22.000 — $45.000 COP",
    calificacion: "4.6",
    horario: "12:00 PM — 9:30 PM",
    resumen: "Opción recomendada para cenar en la noche: carnes al carbón, arepas y platos típicos.",
    descripcionCompleta: "Para quienes desean recorrer el pueblo por la tarde o noche y probar opciones diferentes a la comida de mar. Destaca por sus cortes al carbón con bollo limpio y queso costeño.",
    especialidades: [
      "Punta de anca o lomo al carbón con bollo limpio",
      "Picada criolla mixta para compartir",
      "Arepa rellena de queso costeño y carne desmechada"
    ],
    fotos: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
    ],
    mapUrl: "https://maps.google.com/?q=San+Antero+Cordoba+Centro",
    embedMapUrl: "https://www.google.com/maps?q=San+Antero+Cordoba+Centro&output=embed"
  }
];

const CONFIG_MAZO_APILADO = [
  { rotate: '-6deg', x: '-12px', y: '0px' },
  { rotate: '-3deg', x: '-6px',  y: '-4px' },
  { rotate: '0deg',  x: '0px',   y: '-8px' },
  { rotate: '3deg',  x: '6px',   y: '-12px' },
  { rotate: '6deg',  x: '12px',  y: '-16px' },
];

export default function PaginaGastronomia() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fotoBannerIndex, setFotoBannerIndex] = useState(0);

  // Estados del mazo interactivo
  const [mazoDesplegado, setMazoDesplegado] = useState(false);

  // Modal, carrusel y pestaña (detalle vs mapa)
  const [lugarSeleccionado, setLugarSeleccionado] = useState<LugarGastronomico | null>(null);
  const [fotoModalIndex, setFotoModalIndex] = useState(0);
  const [pestanaModal, setPestanaModal] = useState<'info' | 'mapa'>('info');

  useEffect(() => {
    const timer = setInterval(() => {
      setFotoBannerIndex((prev) => (prev + 1) % FOTOS_BANNER.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const abrirModal = (lugar: LugarGastronomico) => {
    setLugarSeleccionado(lugar);
    setFotoModalIndex(0);
    setPestanaModal('info');
  };

  const cerrarModal = () => {
    setLugarSeleccionado(null);
  };

  const consultarWhatsapp = (nombreLugar: string) => {
    const msj = encodeURIComponent(`Hola! Me estoy hospedando en Abadía Casa Hotel y deseo recomendaciones e indicaciones para ir a comer a: ${nombreLugar}.`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <main className="w-full bg-[#FAF7F2] text-[#2a2421] antialiased min-h-screen font-light">
      
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
            className="w-12 h-12 rounded-full bg-black/35 hover:bg-black/55 text-white border border-white/20 flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-xl"
            aria-label="Abrir Menú"
          >
            <span className="text-xl">☰</span>
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

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[#071326]/90 backdrop-blur-3xl p-10 sm:p-12 flex flex-col justify-between border-l border-white/15 shadow-2xl transition-transform duration-500 ease-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              Abadía Casa Hotel
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-5 text-left my-auto overflow-y-auto pr-2 py-4">
            <Link onClick={() => setMenuAbierto(false)} href="/" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Inicio</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Nuestras Habitaciones</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/gastronomia" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Gastronomía del Sector</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/matrimonios" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Matrimonios & Eventos</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/transporte" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Cómo Llegar & Transporte</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Otros Espacios de la Casa</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Qué hacer en San Antero</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/testimonios" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Testimonios & Huéspedes</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Cómo Reservar & Pagos</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <Link href="/dashboard" className="text-[#C5A059] hover:underline">Dashboard 🗝️</Link>
          </div>
        </div>
      </div>

      {/* 1. BANNER FULL SCREEN CON MENSAJE DE RECOMENDACIONES */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-end pb-16 px-6 sm:px-12 text-center text-white">
        {FOTOS_BANNER.map((foto, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              fotoBannerIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={foto.url}
              alt={foto.caption}
              fill
              priority={idx === 0}
              unoptimized
              className="object-cover transition-transform duration-[6000ms] ease-out transform"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

        <div className="relative z-20 max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C5A059] font-bold block">
         
          </span>
          <h1 className="text-3xl sm:text-6xl font-semibold uppercase tracking-wide text-white drop-shadow-lg">
            Estas son algunas de nuestras recomendaciones
          </h1>
          <p className="text-xs sm:text-base text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
            En Abadía no contamos con restaurante propio dentro del hotel, pero hemos seleccionado para ti los rincones gastronómicos más auténticos del sector para que disfrutes de la cocina del Golfo de Morrosquillo.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            {FOTOS_BANNER.map((_, i) => (
              <button
                key={i}
                onClick={() => setFotoBannerIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  fotoBannerIndex === i ? 'w-8 bg-[#C5A059]' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. MAZO DE CARTAS CON LOGO DE ABADÍA Y TEMÁTICA GASTRONÓMICA */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
            CARTA DE RECOMENDACIONES
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
          
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            {mazoDesplegado 
              ? "Toca cualquier carta para explorar la galería de fotos, menú y ubicación en Google Maps." 
              : "Toca el mazo para voltear las cartas y descubrir el Top 5 gastronómico de la zona."}
          </p>

          <div className="pt-3">
            <button
              onClick={() => setMazoDesplegado(!mazoDesplegado)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#071326] text-[#E8DDD0] hover:bg-[#C5A059] hover:text-black transition-all shadow-xl cursor-pointer active:scale-95 border border-[#C5A059]/40"
            >
              <Icons.Sparkles />
              <span>{mazoDesplegado ? 'Recoger el Mazo' : 'Tocar para Barajar & Abrir'}</span>
            </button>
          </div>
        </div>

        {/* CONTENEDOR DEL MAZO */}
        <div className="relative min-h-[580px] w-full flex items-center justify-center">
          
          {/* ESTADO 1: MAZO APILADO AL REVÉS */}
          {!mazoDesplegado && (
            <div 
              onClick={() => setMazoDesplegado(true)}
              className="relative w-[290px] sm:w-[330px] h-[480px] cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
            >
              {TOP_RESTAURANTES_SECTOR.map((item, index) => {
                const config = CONFIG_MAZO_APILADO[index];
                const esUltima = index === TOP_RESTAURANTES_SECTOR.length - 1;

                return (
                  <div
                    key={item.id}
                    style={{
                      transform: `translate(${config.x}, ${config.y}) rotate(${config.rotate})`,
                      zIndex: index
                    }}
                    className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-[#0a1b33] via-[#071326] to-[#040b17] border-2 border-[#C5A059]/80 shadow-2xl transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.25)] flex flex-col items-center justify-between p-6 overflow-hidden text-center"
                  >
                    <div className="absolute inset-2 border border-[#C5A059]/40 rounded-[1.8rem] pointer-events-none" />
                    <div className="absolute inset-3.5 border border-[#C5A059]/20 rounded-[1.5rem] pointer-events-none" />

                    <div className="absolute top-4 left-4 text-[#C5A059] opacity-80 pointer-events-none">
                      <Icons.Cloche />
                    </div>
                    <div className="absolute top-4 right-4 text-[#C5A059] opacity-80 pointer-events-none">
                      <Icons.Cloche />
                    </div>

                    <div className="w-full pt-4 space-y-1 relative z-10">
                      <span className="text-[9px] uppercase tracking-[0.35em] text-[#C5A059] font-mono font-bold block">
                        CARTA DE LA CASA
                      </span>
                      <span className="text-[8px] uppercase tracking-[0.25em] text-[#E8DDD0]/70 font-light block">
                        TOP 5 GASTRONOMÍA LOCAL
                      </span>
                    </div>

                    <div className="my-auto space-y-3 relative z-10 w-full flex flex-col items-center">
                      <div className="relative w-44 h-24 p-3 rounded-2xl bg-black/40 border border-[#C5A059]/60 backdrop-blur-md shadow-inner flex flex-col items-center justify-center">
                        <div className="relative w-36 h-12">
                          <Image 
                            src="/logo.png" 
                            alt="Logo Abadía Hotel" 
                            fill 
                            priority 
                            className="object-contain filter brightness-0 invert" 
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-1 text-[#C5A059]">
                        <span className="w-6 h-[1px] bg-[#C5A059]/50" />
                        <Icons.GourmetCross />
                        <span className="w-6 h-[1px] bg-[#C5A059]/50" />
                      </div>

                      <p className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
                        Guía Culinaria del Sector
                      </p>
                    </div>

                    <div className="absolute bottom-4 left-4 text-[#C5A059] opacity-80 pointer-events-none rotate-180">
                      <Icons.Cloche />
                    </div>
                    <div className="absolute bottom-4 right-4 text-[#C5A059] opacity-80 pointer-events-none rotate-180">
                      <Icons.Cloche />
                    </div>

                    {esUltima && (
                      <div className="relative z-10 w-full py-2.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/50 text-[#E8DDD0] text-[11px] uppercase tracking-wider font-semibold backdrop-blur-sm group-hover:bg-[#C5A059] group-hover:text-black transition-colors shadow-lg">
                        Toca para Destapar 
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ESTADO 2: CARTAS DESPLEGADAS */}
          {mazoDesplegado && (
            <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-8 transition-all duration-700 animate-in fade-in zoom-in-95">
              {TOP_RESTAURANTES_SECTOR.map((lugar, index) => (
                <div
                  key={lugar.id}
                  onClick={() => abrirModal(lugar)}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="w-[280px] sm:w-[310px] h-[470px] bg-white rounded-[2rem] border border-[#E8DDD0] shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group text-left relative"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-black">
                    <Image
                      src={lugar.fotos[0]}
                      alt={lugar.nombre}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 left-3 bg-[#071326] border border-[#C5A059] text-[#C5A059] font-mono text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <span>TOP #{lugar.puesto}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                      <Icons.Star />
                      <span>{lugar.calificacion}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex justify-between items-center">
                      <span className="flex items-center gap-1 text-white/90">
                        <Icons.MapPin />
                        {lugar.distancia}
                      </span>
                      <span className="bg-black/50 px-2 py-0.5 rounded text-[11px]">
                        {lugar.precioPromedio}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#8c7355] font-bold block">
                        {lugar.categoria}
                      </span>
                      <h4 className="text-lg font-semibold text-stone-900 group-hover:text-[#C5A059] transition-colors leading-tight">
                        {lugar.nombre}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 font-light">
                        {lugar.resumen}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-[#8c7355] font-semibold">
                      <span>Ver fotos, menú y mapa</span>
                      <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-gradient-to-r from-[#071326] via-[#C5A059] to-[#071326]" />
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 3. MODAL CON CARRUSEL DE FOTOS & DETALLES / GOOGLE MAPS */}
      {lugarSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div onClick={cerrarModal} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

          <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 my-auto border border-[#E8DDD0] animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* CARRUSEL DE FOTOS */}
            <div className="relative h-64 sm:h-80 w-full bg-black">
              <Image
                src={lugarSeleccionado.fotos[fotoModalIndex]}
                alt={`${lugarSeleccionado.nombre} foto ${fotoModalIndex + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFotoModalIndex((prev) => 
                    prev === 0 ? lugarSeleccionado.fotos.length - 1 : prev - 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              >
                <Icons.ChevronLeft />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFotoModalIndex((prev) => 
                    (prev + 1) % lugarSeleccionado.fotos.length
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              >
                <Icons.ChevronRight />
              </button>

              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                {fotoModalIndex + 1} / {lugarSeleccionado.fotos.length}
              </div>

              <div className="absolute bottom-4 left-4 flex gap-2">
                {lugarSeleccionado.fotos.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoModalIndex(i)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 relative transition-all cursor-pointer ${
                      fotoModalIndex === i ? 'border-[#C5A059] scale-105' : 'border-white/50 opacity-70'
                    }`}
                  >
                    <Image src={f} alt="miniatura" fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* TABS: INFORMACIÓN VS GOOGLE MAPS */}
            <div className="flex border-b border-[#E8DDD0] bg-[#FAF7F2] px-6 pt-3">
              <button
                onClick={() => setPestanaModal('info')}
                className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  pestanaModal === 'info'
                    ? 'border-b-2 border-[#C5A059] text-stone-900'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Información & Menú
              </button>
              <button
                onClick={() => setPestanaModal('mapa')}
                className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  pestanaModal === 'mapa'
                    ? 'border-b-2 border-[#C5A059] text-stone-900'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icons.MapPin />
                <span>Ubicación en Google Maps</span>
              </button>
            </div>

            {/* CONTENIDO SEGÚN LA PESTAÑA */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
              
              {pestanaModal === 'info' ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c7355] font-bold">
                      <span>TOP #{lugarSeleccionado.puesto}</span>
                      <span>•</span>
                      <span>{lugarSeleccionado.categoria}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                      {lugarSeleccionado.nombre}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2.5 text-xs text-stone-600">
                    <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E8DDD0]">
                      <Icons.MapPin /> {lugarSeleccionado.distancia}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E8DDD0]">
                      <Icons.Clock /> {lugarSeleccionado.horario}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E8DDD0]">
                      💵 {lugarSeleccionado.precioPromedio}
                    </span>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed font-light">
                    {lugarSeleccionado.descripcionCompleta}
                  </p>

                  <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E8DDD0] space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#8c7355] font-bold block">
                      Platos recomendados:
                    </span>
                    <div className="space-y-1.5">
                      {lugarSeleccionado.especialidades.map((esp, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-800">
                          <span className="text-[#8c7355] font-bold">✓</span>
                          <span>{esp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setPestanaModal('mapa')}
                      className="bg-[#FAF7F2] hover:bg-[#E8DDD0] text-stone-800 border border-[#E8DDD0] py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Icons.MapPin />
                      <span>Ver Mapa de Google</span>
                    </button>
                    
                    <button
                      onClick={() => consultarWhatsapp(lugarSeleccionado.nombre)}
                      className="bg-[#8c7355] hover:bg-[#735e45] text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-98 text-center"
                    >
                      Consultar por WhatsApp
                    </button>
                  </div>
                </>
              ) : (
                /* PESTAÑA: GOOGLE MAPS */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-stone-900">{lugarSeleccionado.nombre}</h4>
                      <p className="text-xs text-stone-600">{lugarSeleccionado.distancia}</p>
                    </div>

                    <a
                      href={lugarSeleccionado.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#C5A059] text-black px-4 py-2 rounded-xl hover:bg-[#a88746] transition-colors"
                    >
                      <span>Abrir en Google Maps</span>
                      <Icons.ExternalLink />
                    </a>
                  </div>

                  <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-inner bg-stone-100">
                    <iframe
                      src={lugarSeleccionado.embedMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Ubicación de ${lugarSeleccionado.nombre}`}
                    />
                  </div>

                  <p className="text-xs text-stone-500 font-light text-center">
                    Toca el botón superior o el mapa para trazar tu ruta a pie o en vehículo desde Abadía Casa Hotel.
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
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
            © 2026 Abadía Casa Hotel. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}