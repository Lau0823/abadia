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
    ruta: "/#atardeceres-san-antero",
    imagen: "/categorias/atardecer.png"
  }
];

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
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
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
    descripcionCompleta: "Uno de los referentes gastronómicos más tradicionales y recomendados de la zona. Se distingue por su sazón costera auténtica, porciones generosas y pescado recién salido de las faenas locales cocinado al término perfecto.",
    especialidades: [
      "Pargo rojo frito con arroz con coco y ensalada dulce",
      "Cazuela marinera gratinada con suero casero",
      "Filete de róbalo a la plancha en salsa de ajo criollo"
    ],
    fotos: [
      "https://i.pinimg.com/736x/79/bb/64/79bb6480b377724c81b99d7161239741.jpg",
      "https://i.pinimg.com/736x/5a/70/a1/5a70a119172e57660dab3de6688203e9.jpg",
      "https://i.pinimg.com/736x/cd/96/b2/cd96b2299ec00da49b018f2d548e17fb.jpg"
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
    descripcionCompleta: "Ambiente caribeño relajado bajo la sombra de la palma y con la brisa marina. Ideal para almorzar platos típicos playeros, ceviches frescos y compartir una bebida bien fría junto al mar.",
    especialidades: [
      "Sierra frita o pargo con patacón pisao y limón criollo",
      "Ceviche fresco de camarón con toque costeño",
      "Sopa de pescado reconfortante de la casa"
    ],
    fotos: [
      "https://i.pinimg.com/736x/17/96/cf/1796cf56d2484b6b00c7a54592e5832a.jpg",
      "https://i.pinimg.com/736x/08/73/6e/08736ea4effa9f4a02ed7895df69c291.jpg",
      "https://i.pinimg.com/1200x/81/81/34/81813470da1d0d8015b042d8e34456f8.jpg"
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
      "https://i.pinimg.com/736x/eb/a8/38/eba8384f59a11cfec4c7236f1a2a355d.jpg",
      "https://i.pinimg.com/1200x/47/98/06/479806d869bd573895bed86b2edd83fb.jpg",
      "https://i.pinimg.com/1200x/78/7c/3e/787c3e78cddee6c828d57b683e072b92.jpg"
    ],
    mapUrl: "https://maps.google.com/?q=Restaurante+El+Mirador+San+Antero",
    embedMapUrl: "https://www.google.com/maps?q=Restaurante+El+Mirador+San+Antero&output=embed"
  },

  
];

// --- COMPONENTE INDIVIDUAL DE CARD FULL SCREEN CON RESPALDO DESCRIPTIVO AL TAP ---
function CardRestauranteFullScreen({ lugar }: { lugar: LugarGastronomico }) {
  const [esRespaldo, setEsRespaldo] = useState(false);
  const [fotoIndex, setFotoIndex] = useState(0);

  const consultarWhatsapp = () => {
    const msj = encodeURIComponent(`Hola! Me estoy hospedando en Abadía Casa Hotel y deseo saber más sobre el restaurante: ${lugar.nombre}.`);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <section className="relative h-[90vh] sm:h-screen w-full overflow-hidden bg-[#071326] select-none border-0">
      
      {/* ========================================================
          VISTA FRENTE: FOTO FULL SCREEN CON TÍTULO
          ======================================================== */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          esRespaldo ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
        }`}
      >
        <Image
          src={lugar.fotos[fotoIndex]}
          alt={lugar.nombre}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/90 via-black/30 to-black/30 pointer-events-none" />

        {/* CONTROLES CARRUSEL DE FOTOS FRENTE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFotoIndex((prev) => (prev === 0 ? lugar.fotos.length - 1 : prev - 1));
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer shadow-xl border-0"
          aria-label="Foto anterior"
        >
          <Icons.ChevronLeft />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setFotoIndex((prev) => (prev + 1) % lugar.fotos.length);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#071326]/60 hover:bg-[#071326] text-white backdrop-blur-3xl flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer shadow-xl border-0"
          aria-label="Siguiente foto"
        >
          <Icons.ChevronRight />
        </button>

        {/* INFORMACIÓN BASE DEL FRENTE */}
        <div className="absolute bottom-10 left-6 right-6 z-20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`${bitter.className} bg-white text-[#071326] px-3.5 py-1 rounded-full text-xs font-bold font-mono shadow-md`}>
                  TOP #{lugar.puesto}
                </span>
                <span className="text-xs text-slate-300 uppercase tracking-wider font-light">
                  {lugar.categoria}
                </span>
              </div>

              <h2 className={`${bitter.className} text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-md`}>
                {lugar.nombre}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="flex items-center gap-1">
                  <Icons.MapPin /> {lugar.distancia}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Icons.Star /> {lugar.calificacion}
                </span>
                <span>•</span>
                <span className="font-mono">{lugar.precioPromedio}</span>
              </div>
            </div>

            {/* BOTÓN TAP PARA VOLTEAR AL RESPALDO */}
            <button
              onClick={() => setEsRespaldo(true)}
              className={`${bitter.className} bg-white hover:bg-slate-100 text-[#071326] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl cursor-pointer border-0 shrink-0`}
            >
              <Icons.Refresh />
              <span>Ver Respaldo & Menú</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          VISTA RESPALDO (BACK): DESCRIPCIÓN COMPLETA, PLATOS & MAPA
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
                RESPALDO #{lugar.puesto} • {lugar.categoria}
              </span>
              <h3 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white`}>
                {lugar.nombre}
              </h3>
            </div>

            {/* Botón para regresar al frente */}
            <button
              onClick={() => setEsRespaldo(false)}
              className={`${bitter.className} bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-0`}
            >
              <Icons.Refresh />
              <span>Volver a la Foto</span>
            </button>
          </div>

          {/* Atributos clave */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full">
              <Icons.MapPin /> {lugar.distancia}
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full">
              <Icons.Clock /> {lugar.horario}
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full font-mono">
              {lugar.precioPromedio}
            </span>
          </div>

          {/* Descripción completa */}
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
            {lugar.descripcionCompleta}
          </p>

          {/* Platos recomendados con punticos discretos */}
          <div className="bg-white/5 p-5 rounded-2xl space-y-2.5">
            <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-300 block`}>
              Platos Recomendados de la Casa:
            </span>
            <div className="space-y-2">
              {lugar.especialidades.map((esp, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>{esp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa de Google integrado */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-400`}>
                Ubicación exacta
              </span>
              <a
                href={lugar.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/90 hover:text-white inline-flex items-center gap-1 underline underline-offset-4"
              >
                <span>Abrir en Google Maps</span>
                <Icons.ExternalLink />
              </a>
            </div>

            <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner">
              <iframe
                src={lugar.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${lugar.nombre}`}
              />
            </div>
          </div>

          {/* Botón WhatsApp */}
          <div className="pt-2">
            <button
              onClick={consultarWhatsapp}
              className={`${bitter.className} w-full sm:w-auto bg-white hover:bg-slate-100 text-[#071326] py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xl cursor-pointer border-0`}
            >
              Pedir indicaciones o consultar por WhatsApp
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}

export default function PaginaGastronomia() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fotoBannerIndex, setFotoBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFotoBannerIndex((prev) => (prev + 1) % FOTOS_BANNER.length);
    }, 6000);
    return () => clearInterval(timer);
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
          1. BANNER PRINCIPAL FULL SCREEN
          ======================================================== */}
      <section className="relative h-[85vh] sm:h-[92vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 sm:pb-16 text-center text-white">
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

        <div className="relative z-20 max-w-3xl mx-auto space-y-3 px-4">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold block`}>
            Guía Exclusiva del Sector
          </span>
          <h1 className={`${bitter.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
            Gastronomía Local
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-xl mx-auto leading-relaxed">
            En Abadía no contamos con restaurante propio dentro del hotel, pero hemos seleccionado para ti los rincones gastronómicos más auténticos del sector.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            {FOTOS_BANNER.map((_, i) => (
              <button
                key={i}
                onClick={() => setFotoBannerIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  fotoBannerIndex === i ? 'w-7 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
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

      {/* TÍTULO INTRODUCTORIO AL TOP 5 FULL SCREEN */}
      <section className="bg-white py-10 px-6 text-center border-0">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold block`}>
            RECOMENDACIONES
          </span>
          <h2 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Top 5 Restaurantes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Desliza hacia abajo para recorrer cada lugar en pantalla completa y toca el botón del respaldo para ver detalles, menú y ubicación.
          </p>
        </div>
      </section>

      {/* ========================================================
          3. LAS 5 CARDS FULL SCREEN SEGUIDAS (CON RESPALDO AL TAP)
          ======================================================== */}
      <div className="w-full flex flex-col">
        {TOP_RESTAURANTES_SECTOR.map((lugar) => (
          <CardRestauranteFullScreen key={lugar.id} lugar={lugar} />
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