'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// --- INTERFACES DE DATOS ---
interface Habitacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  precio: string;
  ocupacion: string;
  camas: string;
  servicios: string[];
}

interface PlanHotel {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  precio: string;
  imagen: string;
  etiqueta: string;
  incluye: string[];
}

interface EspacioGaleria {
  id: string;
  titulo: string;
  subtitulo: string;
  imagen: string;
  categoria: string;
}

interface Testimonio {
  id: string;
  nombre: string;
  origen: string;
  comentario: string;
  puntuacion: number;
  fecha: string;
}

// --- IMÁGENES DEL CARRUSEL PRINCIPAL (HERO) ---
const IMAGENES_HERO: string[] = [
  "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg", 
  "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", 
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"  
];

// --- SERVICIOS / AMENITIES GENERALES ---
const SERVICIOS_HOTEL = [
  { id: 'srv-1', nombre: 'Piscina de Calma', icon: '🏊‍♂️', desc: 'Área húmeda al aire libre' },
  { id: 'srv-2', nombre: 'Gastronomía Local', icon: '🍽️', desc: 'Cocina de autor y desayunos' },
  { id: 'srv-3', nombre: 'Zona de Bienestar', icon: '🌿', desc: 'Masajes y aromaterapia' },
  { id: 'srv-4', nombre: 'Pet Friendly', icon: '🐾', desc: 'Mascotas educadas bienvenidas' },
  { id: 'srv-5', nombre: 'Parqueadero Privado', icon: '🚗', desc: 'Vigilado 24/7 sin costo' },
  { id: 'srv-6', nombre: 'Internet de Alta Velocidad', icon: '📶', desc: 'Fibra óptica en todas las áreas' },
];

// --- HABITACIONES CON MÚLTIPLES FOTOS Y SERVICIOS ---
const HABITACIONES_CATALOGO: Habitacion[] = [
  {
    id: "suite-imperial",
    titulo: "Suite Real con Hidromasaje",
    descripcion: "Nuestra suite insignia con tina de hidromasaje privada, balcón panorámico y acabados de lujo rústico.",
    imagenes: [
      "/121017.jpg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    ],
    precio: "$450.000 COP",
    ocupacion: "Máx. 2 Adultos",
    camas: "1 Cama King Size",
    servicios: ["Tina Hidromasaje", "Balcón Privado", "Smart TV 55\"", "Aire Acondicionado", "Minibar"]
  },
  {
    id: "suite-valle",
    titulo: "Cabaña Vista a los Pinos",
    descripcion: "Equilibrio perfecto entre arquitectura rústica y confort moderno, rodeada de jardines con terraza elevada.",
    imagenes: [
      "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    precio: "$320.000 COP",
    ocupacion: "Hasta 3 Personas",
    camas: "1 Queen + 1 Sencilla",
    servicios: ["Terraza Jardín", "Nevera Pequeña", "Wi-Fi Fibra", "Baño Privado", "Aire Acondicionado"]
  },
  {
    id: "suite-ancestral",
    titulo: "Estancia Silencio y Confort",
    descripcion: "Un espacio diseñado para el descanso absoluto, la lectura y la reconexión, con luz cenital tenue.",
    imagenes: [
      "/WhatsApp Image 2026-07-06 at 20.33.43.jpeg",
      "/121017.jpg",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
    ],
    precio: "$280.000 COP",
    ocupacion: "Máx. 2 Personas",
    camas: "1 Cama Queen",
    servicios: ["Cama Queen", "Nevera Ejecutiva", "Wi-Fi", "Baño de Lujo", "Smart TV"]
  },
  {
    id: "suite-familiar",
    titulo: "Cabaña Familiar Abadía",
    descripcion: "Espacios amplios y confort integral para grupos y familias. Ambiente sereno con sala de descanso.",
    imagenes: [
      "/WhatsApp Image 2026-07-06 at 20.33.44.jpeg",
      "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
    ],
    precio: "$390.000 COP",
    ocupacion: "Hasta 4 Personas",
    camas: "2 Camas Dobles",
    servicios: ["Sala de Estar", "Comedor", "2 Smart TV", "Nevera Mediana", "Aire Acondicionado"]
  }
];

// --- PLANES Y EXPERIENCIAS ---
const PLANES_EXPERIENCIAS: PlanHotel[] = [
  { 
    id: "romantica", 
    titulo: "Escapada Romántica", 
    subtitulo: "EXPERIENCIA EXCLUSIVA", 
    descripcion: "Cena a 3 tiempos a la luz de las velas, decoración especial con flores, botella de vino o champaña de bienvenida y acceso nocturno a la piscina de hidromasaje.", 
    precio: "$260.000 COP / pareja", 
    imagen: "https://i.pinimg.com/736x/6e/e5/6d/6ee56dc274682fb52d8986c70c816349.jpg", 
    etiqueta: "MÁS POPULAR",
    incluye: ["Cena romántica privada", "Botella de espumoso", "Decoración con pétalos", "Desayuno a la habitación"]
  },
  { 
    id: "pasadia-spa", 
    titulo: "Pasadía Relax & Bienestar", 
    subtitulo: "DESCONEXIÓN TOTAL", 
    descripcion: "Disfruta un día completo en nuestras instalaciones. Incluye sesión de masaje corporal relajante de 60 minutos, almuerzo gourmet y uso de piscina.", 
    precio: "$140.000 COP / persona", 
    imagen: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", 
    etiqueta: "BIENESTAR",
    incluye: ["Masaje relajante", "Almuerzo del chef", "Acceso a zonas húmedas", "Cóctel refrescante"]
  },
  { 
    id: "celebracion", 
    titulo: "Celebración de Aniversario / Cumpleaños", 
    subtitulo: "MOMENTO INOLVIDABLE", 
    descripcion: "Paquete personalizado de fiesta íntima con tarta artesanal, sesión de fotos en locaciones exclusivas del hotel y brindis al atardecer.", 
    precio: "$310.000 COP / paquete", 
    imagen: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80", 
    etiqueta: "CELEBRACIONES",
    incluye: ["Pastel personalizado", "Brindis al atardecer", "Fotografía digital", "Cortesía del hotel"]
  }
];

// --- MOSAICO DE GALERÍA Y ENTORNO ---
const FOTOS_MOSAICO: EspacioGaleria[] = [
  { id: 'mos-1', titulo: 'La Piscina Principal', subtitulo: 'Ambiente tranquilo', imagen: 'https://i.pinimg.com/736x/5a/27/d9/5a27d98eb8014c3754af2a16af649e6a.jpg', categoria: 'Zonas Comunes' },
  { id: 'mos-2', titulo: 'Cena & Coctelería', subtitulo: 'Sabor local', imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', categoria: 'Gastronomía' },
  { id: 'mos-3', titulo: 'Playas de Coveñas', subtitulo: 'A solo 10 minutos', imagen: 'https://i.pinimg.com/736x/7e/49/82/7e4982b5eceb9ddd9cbb78b3be98bcf5.jpg', categoria: 'Entorno' },
  { id: 'mos-4', titulo: 'Lobby Colonial', subtitulo: 'Diseño boutique', imagen: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', categoria: 'Arquitectura' },
  { id: 'mos-5', titulo: 'Manglares de Cispatá', subtitulo: 'Tour ecológico', imagen: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', categoria: 'Tours' },
  { id: 'mos-6', titulo: 'Rincones de Lectura', subtitulo: 'Paz absoluta', imagen: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', categoria: 'Confort' },
];

// --- TESTIMONIOS REALES ---
const TESTIMONIOS: Testimonio[] = [
  { id: 't-1', nombre: 'Carolina Martínez', origen: 'Medellín, Colombia', comentario: 'Un hotel impecable, silencioso y con una atención sumamente cálida. Las habitaciones son más hermosas en persona y la comida estuvo insuperable.', puntuacion: 5, fecha: 'Hace 2 semanas' },
  { id: 't-2', nombre: 'Felipe & Andrea', origen: 'Bogotá, Colombia', comentario: 'Tomamos el plan romántico y superó todas las expectativas. Los detalles de la cena y el ambiente privado de la piscina hicieron nuestro fin de semana mágico.', puntuacion: 5, fecha: 'Hace 1 mes' },
  { id: 't-3', nombre: 'Mateo Gómez', origen: 'Montería, Colombia', comentario: 'Excelente ubicación entre Coveñas y San Antero. Muy cómodo para descansar, parqueadero seguro y el WiFi funcionó perfecto para trabajar.', puntuacion: 5, fecha: 'Hace 3 semanas' },
];

// --- COMPONENTE TARJETA DE HABITACIÓN CON CARRUSEL PROPIO ---
function CardHabitacionCatalogo({ habitacion }: { habitacion: Habitacion }) {
  const [fotoActiva, setFotoActiva] = useState<number>(0);

  const prevFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoActiva((prev) => (prev === 0 ? habitacion.imagenes.length - 1 : prev - 1));
  };

  const nextFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoActiva((prev) => (prev === habitacion.imagenes.length - 1 ? 0 : prev + 1));
  };

  const contactarWhatsApp = () => {
    const msj = encodeURIComponent(`Hola! Deseo cotizar la ${habitacion.titulo} (${habitacion.precio}/noche) en Abadía Hotel Boutique.`);
    window.open(`https://wa.me/573000000000?text=${msj}`, '_blank');
  };

  return (
    <div className="bg-[#efebe4]/60 backdrop-blur-md border border-[#d6c7b2]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#3c2f27] transition-all duration-300 flex flex-col justify-between group">
      
      {/* Carrusel de Imágenes en la Tarjeta */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-300">
        <Image
          src={habitacion.imagenes[fotoActiva]}
          alt={`${habitacion.titulo} - Foto ${fotoActiva + 1}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Controles del Carrusel de la Tarjeta */}
        <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={prevFoto}
            className="w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all text-xs"
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button 
            onClick={nextFoto}
            className="w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all text-xs"
            aria-label="Foto siguiente"
          >
            ›
          </button>
        </div>

        {/* Indicador de Dots de Fotos */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {habitacion.imagenes.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === fotoActiva ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>

        {/* Badge de Capacidad */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#241b14]/80 backdrop-blur-md text-[#efebe4] text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 font-medium">
            {habitacion.ocupacion}
          </span>
        </div>
      </div>

      {/* Contenido / Ficha Rápida de Datos */}
      <div className="p-6 flex flex-col flex-1 justify-between text-left">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-light uppercase text-[#3c2f27] font-luxury-title tracking-wide">
              {habitacion.titulo}
            </h3>
          </div>
          
          <p className="text-[11px] text-[#3c2f27]/70 font-light mb-4 line-clamp-2 leading-relaxed">
            {habitacion.descripcion}
          </p>

          {/* Ocupación y Camas */}
          <div className="flex items-center gap-4 text-xs text-[#3c2f27]/80 pb-3 border-b border-[#d6c7b2]/30 mb-3">
            <span className="flex items-center gap-1 font-light">
              <span className="text-stone-500">🛏️</span> {habitacion.camas}
            </span>
            <span className="flex items-center gap-1 font-light">
              <span className="text-stone-500">👥</span> {habitacion.ocupacion}
            </span>
          </div>

          {/* Servicios Clave (Pills) */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {habitacion.servicios.slice(0, 4).map((srv, idx) => (
              <span key={idx} className="text-[9px] uppercase tracking-wider bg-[#efebe4] text-[#3c2f27] px-2.5 py-1 rounded-md border border-[#d6c7b2]/40 font-light">
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Precio y Botones de Acción */}
        <div className="pt-4 border-t border-[#d6c7b2]/30">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#3c2f27]/60">Tarifa por noche</span>
            <span className="text-xl font-medium text-[#3c2f27] font-luxury-title">{habitacion.precio}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => window.location.href = `/habitaciones#${habitacion.id}`}
              className="w-full py-2.5 px-3 rounded-xl border border-[#3c2f27]/30 text-[#3c2f27] text-[10px] uppercase tracking-widest font-medium hover:bg-[#3c2f27] hover:text-[#efebe4] transition-all text-center"
            >
              Ver Detalles
            </button>
            <button
              onClick={contactarWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-[#3c2f27] text-[#efebe4] text-[10px] uppercase tracking-widest font-medium hover:bg-[#5a483c] transition-all text-center shadow-sm"
            >
              Cotizar
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function HomePage() {
  const [heroActivo, setHeroActivo] = useState<number>(0);
  const [planActivo, setPlanActivo] = useState<string>("romantica");
  const [logoError, setLogoError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);

  // Estados Formulario Reservas
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [huespedes, setHuespedes] = useState<string>('2 Huéspedes');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const intervaloHero = setInterval(() => {
      setHeroActivo((prev) => (prev + 1) % IMAGENES_HERO.length);
    }, 6000);
    return () => clearInterval(intervaloHero);
  }, [isMounted]);

  const hacerScrollASeccion = (idSeccion: string) => {
    setMenuAbierto(false);
    const elem = document.getElementById(idSeccion);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ejecutarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({ checkIn, checkOut, huespedes }).toString();
    window.location.href = `/habitaciones?${query}`;
  };

  const planSeleccionado = PLANES_EXPERIENCIAS.find(p => p.id === planActivo) || PLANES_EXPERIENCIAS[0];

  const abrirWhatsAppGeneral = () => {
    const msj = encodeURIComponent("¡Hola! Me gustaría obtener más información y disponibilidad en Abadía Hotel Boutique.");
    window.open(`https://wa.me/573000000000?text=${msj}`, '_blank');
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#f7f4ee]" />;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#3c2f27] antialiased selection:bg-[#c4a482]/20 style-font-override relative">
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@1,400;1,600&family=Raleway:wght@200;300;400;500;600&display=swap" />
      <style>{`
        .style-font-override, select, input, button, p, span {
          font-family: 'Raleway', sans-serif !important;
          font-weight: 300;
        }
        .font-luxury-title {
          font-family: 'Raleway', sans-serif !important;
          font-weight: 300 !important;
          letter-spacing: 0.08em;
        }
        .font-luxury-script {
          font-family: 'Alex Brush', cursive !important;
          font-weight: 400 !important;
        }
        .font-editorial-italic {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
        }
      `}</style>

      {/* BOTÓN HAMBURGUESA FIJO */}
      <nav className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="bg-[#efebe4]/90 backdrop-blur-md p-4 rounded-full shadow-md border border-[#d6c7b2]/40 flex flex-col justify-center items-center gap-1.5 w-12 h-12 active:scale-95 hover:bg-[#3c2f27] hover:border-[#3c2f27] transition-all z-50 relative group"
          aria-label="Alternar menú"
        >
          <span className={`h-[1.5px] w-5 bg-[#3c2f27] group-hover:bg-[#f7f4ee] transition-all duration-300 ${menuAbierto ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
          <span className={`h-[1.5px] w-5 bg-[#3c2f27] group-hover:bg-[#f7f4ee] transition-all duration-300 ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`h-[1.5px] w-5 bg-[#3c2f27] group-hover:bg-[#f7f4ee] transition-all duration-300 ${menuAbierto ? '-rotate-45 translate-y-[4.5px]' : ''}`} />
        </button>
      </nav>

      {/* PANEL LATERAL DE MENÚ */}
      <div className={`fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-[#efebe4]/95 backdrop-blur-lg shadow-2xl p-8 flex flex-col justify-between border-l border-[#d6c7b2]/40 transition-transform duration-500 ease-out ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#3c2f27] font-medium block mb-8">— Navegación</span>
          <ul className="flex flex-col gap-6 text-lg text-[#3c2f27] font-light tracking-wide">
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => { setMenuAbierto(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Inicio</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('habitaciones')}>Catálogo de Habitaciones</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('servicios')}>Servicios & Comodidades</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('planes')}>Planes & Experiencias</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('galeria')}>Galería de Espacios</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('testimonios')}>Opiniones de Huéspedes</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('ubicacion')}>Ubicación y Contacto</li>
          </ul>
        </div>
        <div className="text-[10px] text-[#3c2f27]/70 font-medium tracking-wide">© 2026 Abadía Hotel Boutique.</div>
      </div>

      {/* 1. HERO SECTION & BANNER PRINCIPAL (INTACTO) */}
      <section className="relative h-screen w-full overflow-hidden bg-[#241b14] flex flex-col justify-between">
        
        <div className="absolute top-12 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="relative w-64 h-24 md:w-80 md:h-32 flex items-center justify-center">
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${logoError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <Image src="/logo.png" alt="Logo Abadía" fill priority sizes="(max-width: 768px) 256px, 320px" className="object-contain" onError={() => setLogoError(true)} />
            </div>
            <div className={`text-center absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${logoError ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="tracking-[0.4em] text-[#efebe4] text-3xl md:text-4xl uppercase block font-light">Abadía</span>
              <span className="text-[9px] uppercase tracking-[0.5em] text-[#d6c7b2] block mt-2 font-light">Hotel Boutique</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10">
          {IMAGENES_HERO.map((imgUrl, idx) => {
            const isHeroActive = idx === heroActivo;
            return (
              <div key={idx} className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out ${isHeroActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/35 z-10" />
                <Image src={imgUrl} alt={`Abadía Vista Principal ${idx + 1}`} fill priority={idx === 0} unoptimized sizes="100vw" className="object-cover" />
              </div>
            );
          })}
        </div>

        {/* BARRA DE RESERVAS GLASSMORPHISM */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-30 flex justify-center px-4">
          <div className="w-full max-w-5xl bg-[#efebe4]/35 backdrop-blur-md border border-white/30 rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_0_rgba(36,27,20,0.25)] transition-all">
            <form onSubmit={ejecutarReserva} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
              
              <div className="flex flex-col text-left">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#efebe4] font-medium mb-1.5 ml-1">Check-In</label>
                <input 
                  type="date" 
                  required 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-[#f7f4ee]/20 backdrop-blur-sm border border-white/40 rounded-2xl px-4 py-3 text-xs text-[#efebe4] placeholder-[#efebe4]/60 outline-none focus:bg-[#efebe4]/40 focus:border-[#d6c7b2] transition-all font-light" 
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#efebe4] font-medium mb-1.5 ml-1">Check-Out</label>
                <input 
                  type="date" 
                  required 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-[#f7f4ee]/20 backdrop-blur-sm border border-white/40 rounded-2xl px-4 py-3 text-xs text-[#efebe4] placeholder-[#efebe4]/60 outline-none focus:bg-[#efebe4]/40 focus:border-[#d6c7b2] transition-all font-light" 
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#efebe4] font-medium mb-1.5 ml-1">Huéspedes</label>
                <select 
                  value={huespedes}
                  onChange={(e) => setHuespedes(e.target.value)}
                  className="w-full bg-[#f7f4ee]/20 backdrop-blur-sm border border-white/40 rounded-2xl px-4 py-3 text-xs text-[#efebe4] outline-none focus:bg-[#efebe4]/40 focus:border-[#d6c7b2] transition-all font-light [&>option]:text-[#3c2f27]"
                >
                  <option value="1 Huésped">1 Huésped</option>
                  <option value="2 Huéspedes">2 Huéspedes</option>
                  <option value="3 Huéspedes">3 Huéspedes</option>
                  <option value="4+ Huéspedes">4+ Huéspedes</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#efebe4] text-[#3c2f27] hover:bg-[#3c2f27] hover:text-[#efebe4] py-3.5 px-6 text-[10px] uppercase tracking-[0.25em] rounded-2xl hover:scale-[1.02] transition-all duration-300 font-medium shadow-lg active:scale-95 border border-[#d6c7b2]/50"
              >
                Buscar Reserva
              </button>

            </form>
          </div>
        </div>

      </section>

      {/* CINTURÓN PROMOCIONAL */}
      <section className="bg-[#efebe4] py-12 px-4 text-center border-y border-[#d6c7b2]/40">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-3xl font-light tracking-[0.1em] text-[#3c2f27] uppercase leading-tight font-luxury-title">
            Tu refugio de calma y descanso en el <span className="font-editorial-italic text-[#3c2f27] font-normal lowercase tracking-normal">Caribe colombiano</span>
          </h3>
          <p className="text-[#3c2f27]/80 text-[10px] mt-2 tracking-[0.3em] uppercase font-light">
            San Antero & Coveñas — Tarifas directas y atención personalizada
          </p>
        </div>
      </section>

      {/* 2. CATÁLOGO DE HABITACIONES (GRID RESPONSIVE MODULAR) */}
      <section id="habitaciones" className="py-24 px-4 md:px-8 bg-[#f7f4ee]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 select-none gap-6 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#3c2f27] font-medium block mb-2">— NUESTRO CATÁLOGO</span>
              <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col">
                <span className="font-luxury-title tracking-tight">Estancias de</span>
                <span className="font-luxury-script text-5xl md:text-8xl text-[#3c2f27] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Ensueño</span>
              </h2>
            </div>
            <p className="text-xs text-[#3c2f27]/70 font-light max-w-sm">
              Cada habitación está equipada con climatización, detalles botánicos y sábanas de algodón de alto gramaje para un descanso profundo.
            </p>
          </div>

          {/* Grid de Tarjetas de Catálogo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {HABITACIONES_CATALOGO.map((hab) => (
              <CardHabitacionCatalogo key={hab.id} habitacion={hab} />
            ))}
          </div>

        </div>
      </section>

      {/* 3. SERVICIOS & COMODIDADES (CARDS ICONOGRÁFICAS) */}
      <section id="servicios" className="py-20 px-4 md:px-8 bg-[#efebe4]/60 border-y border-[#d6c7b2]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3c2f27] font-medium block mb-2">— COMODIDADES INCLUIDAS</span>
            <h2 className="text-3xl md:text-5xl text-[#3c2f27] uppercase font-luxury-title">Servicios del Hotel</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICIOS_HOTEL.map((srv) => (
              <div 
                key={srv.id} 
                className="bg-[#f7f4ee] p-6 rounded-2xl border border-[#d6c7b2]/40 text-center flex flex-col items-center justify-center hover:border-[#3c2f27] hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{srv.icon}</span>
                <h4 className="text-xs font-medium uppercase tracking-wider text-[#3c2f27] mb-1">{srv.nombre}</h4>
                <p className="text-[10px] text-[#3c2f27]/60 font-light">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCIAS Y PAQUETES ADICIONALES TIPO CATÁLOGO */}
      <section id="planes" className="py-24 px-4 bg-[#f7f4ee] relative">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 select-none">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3c2f27] font-medium block mb-2">— EXPERIENCIAS & PAQUETES</span>
            <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col items-center">
              <span className="font-luxury-title tracking-tight">Nuestros</span>
              <span className="font-luxury-script text-4xl md:text-7xl text-[#3c2f27] capitalize -mt-2 md:-mt-5 normal-case tracking-normal">Planes Especiales</span>
            </h2>
          </div>

          {/* Selectores de Plan */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-xl mx-auto">
            {PLANES_EXPERIENCIAS.map((plan) => (
              <button 
                key={plan.id}
                onClick={() => setPlanActivo(plan.id)}
                className={`flex-1 min-w-[150px] py-3 text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 font-medium ${planActivo === plan.id ? 'bg-[#3c2f27] text-[#efebe4] shadow-sm' : 'bg-[#efebe4] text-[#3c2f27]/70 hover:text-[#3c2f27] hover:bg-[#d6c7b2]/30'}`}
              >
                {plan.titulo.split(' ')[0]} {plan.titulo.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Tarjeta Detallada de Plan */}
          <div className="bg-[#efebe4]/80 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-[#d6c7b2]/40 flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden">
              <Image src={planSeleccionado.imagen} alt={planSeleccionado.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] uppercase tracking-widest bg-[#efebe4] text-[#3c2f27] px-3 py-1.5 rounded-full font-medium shadow-sm">{planSeleccionado.etiqueta}</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between py-2 text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#3c2f27]/70 block mb-2 font-medium">{planSeleccionado.subtitulo}</span>
                <h3 className="text-2xl md:text-3xl font-light uppercase text-[#3c2f27] font-luxury-title mb-3">{planSeleccionado.titulo}</h3>
                <p className="text-[#3c2f27]/90 text-xs font-light leading-relaxed mb-6">{planSeleccionado.descripcion}</p>

                {/* Lo que incluye el paquete */}
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-wider text-[#3c2f27] font-semibold block mb-2">Este plan incluye:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {planSeleccionado.incluye.map((item, idx) => (
                      <span key={idx} className="text-xs text-[#3c2f27]/80 flex items-center gap-1.5 font-light">
                        <span className="text-[#3c2f27] text-xs">✓</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6 pt-4 border-t border-[#d6c7b2]/40">
                  <span className="text-[9px] uppercase tracking-widest text-[#3c2f27]/60 block mb-1">Inversión del Paquete</span>
                  <p className="text-2xl font-light text-[#3c2f27] font-luxury-title">{planSeleccionado.precio}</p>
                </div>
                <button 
                  onClick={() => {
                    const msj = encodeURIComponent(`Hola! Quiero reservar el paquete: ${planSeleccionado.titulo}`);
                    window.open(`https://wa.me/573000000000?text=${msj}`, '_blank');
                  }}
                  className="w-full bg-[#3c2f27] text-[#efebe4] hover:bg-[#5a483c] border border-[#3c2f27] py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md"
                >
                  Reservar este Paquete
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. GALERÍA TIPO FEED / MOSAICO INSTAGRAM */}
      <section id="galeria" className="py-24 px-4 md:px-8 bg-[#efebe4]/40 border-t border-[#d6c7b2]/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-14 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3c2f27] font-medium block mb-2">— FEED VISUAL</span>
            <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col">
              <span className="font-luxury-title tracking-tight">Espacios y</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#3c2f27] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Momentos</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {FOTOS_MOSAICO.map((foto) => (
              <div 
                key={foto.id} 
                className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer border border-[#d6c7b2]/40 shadow-sm"
              >
                <Image 
                  src={foto.imagen} 
                  alt={foto.titulo} 
                  fill 
                  unoptimized 
                  sizes="(max-width: 768px) 50vw, 33vw" 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-left">
                  <span className="text-[9px] uppercase tracking-widest text-[#d6c7b2] block">{foto.categoria}</span>
                  <h4 className="text-sm md:text-base font-light text-white uppercase font-luxury-title">{foto.titulo}</h4>
                  <p className="text-[10px] text-white/80 font-light">{foto.subtitulo}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CONFIANZA & OPINIONES (TESTIMONIOS) */}
      <section id="testimonios" className="py-24 px-4 md:px-8 bg-[#f7f4ee]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3c2f27] font-medium block mb-2">— PRUEBA SOCIAL</span>
            <h2 className="text-3xl md:text-5xl text-[#3c2f27] uppercase font-luxury-title mb-4">Lo que dicen nuestros huéspedes</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-600 text-sm">★★★★★</span>
              <span className="text-xs text-[#3c2f27] font-medium tracking-wide">4.9 / 5.0 en Google Reviews & Booking</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIOS.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#efebe4]/60 p-8 rounded-3xl border border-[#d6c7b2]/40 flex flex-col justify-between text-left shadow-sm hover:border-[#3c2f27] transition-all"
              >
                <div>
                  <div className="text-yellow-600 text-xs mb-3">{'★'.repeat(item.puntuacion)}</div>
                  <p className="text-xs text-[#3c2f27]/90 font-light leading-relaxed mb-6 italic">
                    "{item.comentario}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#d6c7b2]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#3c2f27] block">{item.nombre}</span>
                    <span className="text-[10px] text-[#3c2f27]/60 font-light">{item.origen}</span>
                  </div>
                  <span className="text-[9px] text-[#3c2f27]/40 uppercase tracking-widest">{item.fecha}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. UBICACIÓN & CÓMO LLEGAR */}
      <section id="ubicacion" className="py-20 px-4 md:px-8 bg-[#efebe4] border-t border-[#d6c7b2]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3c2f27] font-medium block mb-2">— CÓMO LLEGAR</span>
            <h2 className="text-3xl md:text-5xl text-[#3c2f27] uppercase font-luxury-title mb-6">Ubicación Privilegiada</h2>
            <p className="text-xs text-[#3c2f27]/80 font-light leading-relaxed mb-6">
              Ubicados estratégicamente sobre el corredor turístico entre Coveñas y San Antero, permitiendo rápido acceso a las mejores playas del Golfo de Morrosquillo y al ecoturismo de la Bahía de Cispatá.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-xs text-[#3c2f27]/90 font-light">
                <span className="text-stone-600 font-medium">📍</span> A 7 minutos de la playa principal de Coveñas
              </div>
              <div className="flex items-center gap-3 text-xs text-[#3c2f27]/90 font-light">
                <span className="text-stone-600 font-medium">🚤</span> A 12 minutos del embarcadero de manglares de Cispatá
              </div>
              <div className="flex items-center gap-3 text-xs text-[#3c2f27]/90 font-light">
                <span className="text-stone-600 font-medium">✈️</span> A 45 minutos del Aeropuerto de Tolú
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#3c2f27] text-[#efebe4] px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-medium hover:bg-[#5a483c] transition-all shadow-sm"
              >
                Abrir en Google Maps
              </a>
              <a 
                href="https://waze.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-transparent border border-[#3c2f27]/40 text-[#3c2f27] px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-medium hover:bg-black/5 transition-all"
              >
                Ruta con Waze
              </a>
            </div>
          </div>

          {/* Mapa Embed o Contenedor Visual */}
          <div className="w-full h-80 md:h-96 rounded-3xl overflow-hidden border border-[#d6c7b2]/50 shadow-md relative bg-stone-200">
            <iframe 
              title="Mapa Ubicacion Hotel"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125748.16335967665!2d-75.76008154673854!3d9.432653245781358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e5967406987f651%3A0xeefb5168cfb84df4!2sCove%C3%B1as%2C%20Sucre!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[30%] contrast-[1.05]"
            />
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#241b14] text-[#efebe4] py-16 px-6 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="relative w-40 h-16 filter brightness-0 invert opacity-90">
            <Image src="/logo.png" alt="Logo Abadía Footer" fill sizes="160px" className="object-contain" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d6c7b2] font-light max-w-md leading-relaxed">
            San Antero & Coveñas — Colombia <br /> Un espacio para la desconexión total y la calma.
          </p>
          <div className="w-12 h-[1px] bg-[#d6c7b2]/30 my-2" />
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#efebe4]/50 font-light">
            © {new Date().getFullYear()} Abadía Hotel Boutique. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* 8. BOTÓN FLOTANTE DE WHATSAPP (FIJO EN MÓVILES Y DESKTOP) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={abrirWhatsAppGeneral}
          aria-label="Contactar por WhatsApp"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-medium pl-0 group-hover:pl-2">
            ¿Deseas cotizar?
          </span>
        </button>
      </div>

    </main>
  );
}