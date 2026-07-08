'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// --- INTERFACES DE DATOS ---
interface Habitacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  precio: string;
}

interface PlanHotel {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  precio: string;
  imagen: string;
  etiqueta: string;
}

interface EspacioCasa {
  id: string;
  titulo: string;
  imagen: string;
}

// --- IMÁGENES DEL CARRUSEL PRINCIPAL (HERO) ---
const IMAGENES_HERO: string[] = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80", // Fachada / Entrada Principal
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80", // Vista de las Estancias
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"  // Atardecer / Áreas Exteriores
];

const HABITACIONES: Habitacion[] = [
  {
    id: "hab-1",
    titulo: "Suite Real Abadía",
    descripcion: "Nuestra suite más exclusiva con terraza privada, jacuzzi exterior y vistas panorámicas a las montañas sagradas.",
    imagen: "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg",
    precio: "Desde $450 / noche"
  },
  {
    id: "hab-2",
    titulo: "Habitación Deluxe Terraza",
    descripcion: "Equilibrio perfecto entre diseño rústico y minimalismo moderno, equipada con chimenea privada.",
    imagen: "/WhatsApp Image 2026-07-06 at 20.33.43.jpeg",
    precio: "Desde $320 / noche"
  },
  {
    id: "hab-3",
    titulo: "Habitación de la Calma",
    descripcion: "Un santuario de silencio y luz natural ideal para desconectarse del ruido exterior.",
    imagen: "/WhatsApp Image 2026-07-06 at 20.33.44.jpeg",
    precio: "Desde $280 / noche"
  }
];

// Corregimos los IDs de los planes para que sean consistentes con el estado inicial
const PLANES: PlanHotel[] = [
  {
    id: "romantica",
    titulo: "Noche Romántica",
    subtitulo: "BASIC",
    descripcion: "Cena de tres tiempos a la luz de las velas servida en nuestra cava privada, una botella de champaña premium de bienvenida, arreglo de rosas frescas seleccionadas y acceso nocturno exclusivo al circuito hídrico del spa.",
    precio: "$250 / pareja",
    imagen: "https://i.pinimg.com/736x/6e/e5/6d/6ee56dc274682fb52d8986c70c816349.jpg",
    etiqueta: "EXPERIENCIA EXCLUSIVA"
  },
  {
    id: "madre",
    titulo: "Mes de la Madre",
    subtitulo: "CLASIC",
    descripcion: "Un homenaje al amor incondicional. Incluye masaje terapéutico corporal de 90 minutos con aceites esenciales florales en nuestro spa de montaña, brunch dominical ilimitado preparado por nuestro chef y un regalo botánico artesanal.",
    precio: "$190 / persona",
    imagen: "https://i.pinimg.com/736x/53/0e/d7/530ed71269d7970063d8d12596cbd559.jpg",
    etiqueta: "TEMPORADA ESPECIAL"
  },
  {
    id: "escapada",
    titulo: "Escapada de Finde",
    subtitulo: "PREMIUM",
    descripcion: "Desconéctate de la rutina urbana desde el viernes por la tarde. Disfruta de desayunos buffet artesanales a la carta, caminatas guiadas por el sendero ecológico privado de la Abadía y fogata con cata de vinos bajo las estrellas.",
    precio: "$320 / estancia",
    imagen: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    etiqueta: "DESCONEXIÓN TOTAL"
  }
];

const CASA: EspacioCasa[] = [
  { id: "casa-1", titulo: "El Lobby Principal", imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
 { id: "casa-4", titulo: "La Piscina de Calma", imagen: "https://i.pinimg.com/736x/5a/27/d9/5a27d98eb8014c3754af2a16af649e6a.jpg" },
 
  { id: "casa-6", titulo: "Zona de parqueo", imagen: "https://i.pinimg.com/736x/00/e2/d8/00e2d88dc3d58b815f6678eccc353832.jpg" },
];

export default function HomePage() {
  const [heroActivo, setHeroActivo] = useState<number>(0);
  const [planActivo, setPlanActivo] = useState<string>("romantica");
  const [habitacionActiva, setHabitacionActiva] = useState<number>(0);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Temporizador para controlar de manera independiente ambos carruseles
  useEffect(() => {
    if (!isMounted) return;

    // Rotación de imágenes del Hero (Fondo principal) cada 6 segundos
    const intervaloHero = setInterval(() => {
      setHeroActivo((prev) => (prev + 1) % IMAGENES_HERO.length);
    }, 6000);

    // Rotación del carrusel de habitaciones cada 8 segundos
    const intervaloHabitaciones = setInterval(() => {
      setHabitacionActiva((prev) => (prev + 1) % HABITACIONES.length);
    }, 8000);

    return () => {
      clearInterval(intervaloHero);
      clearInterval(intervaloHabitaciones);
    };
  }, [isMounted]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        setHabitacionActiva((prev) => (prev + 1) % HABITACIONES.length);
      } else {
        setHabitacionActiva((prev) => (prev - 1 + HABITACIONES.length) % HABITACIONES.length);
      }
    }
    touchStartX.current = null;
  };

  const planSeleccionado = PLANES.find(p => p.id === planActivo) || PLANES[0];

  return (
    <main className="min-h-screen bg-[#fcfbfa] text-[#1e1e1e] font-sans antialiased selection:bg-[#718f84]/20 selection:text-[#536d64]">
      
      {/* 1. HERO SECTION WITH IMAGE CAROUSEL & FLOATING LOGO */}
      <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
        
        {/* LOGO LOCAL: Centrado Horizontalmente y Fijo encima de las imágenes del carrusel */}
        <div className="absolute top-12 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="relative w-64 h-24 md:w-80 md:h-32 flex items-center justify-center">
            
            {/* Carga del Logo Local desde /public/logo.png */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${logoError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <Image 
                src="/logo.png" 
                alt="Logo Abadía" 
                fill
                priority
                sizes="(max-width: 768px) 256px, 320px"
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
            
            {/* Fallback tipográfico */}
            <div className={`text-center absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${logoError ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="font-serif tracking-[0.35em] text-white text-4xl md:text-5xl font-light uppercase block">
                Abadía
              </span>
              <span className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-neutral-300 block mt-2">
                Hotel Boutique
              </span>
            </div>
          </div>
        </div>

        {/* CARRUSEL DEL FONDO (HERO) */}
        <div className="absolute inset-0 z-10">
          {IMAGENES_HERO.map((imgUrl, idx) => {
            const isHeroActive = idx === heroActivo;
            return (
              <div
                key={idx}
                className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out bg-black/40 ${
                  isHeroActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              >
                <div className="absolute inset-0 bg-black/35 z-10" />
                <Image 
                  src={imgUrl} 
                  alt={`Abadía Vista Principal ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  unoptimized
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Botón de Reserva Blanco y Redondeado */}
        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center px-4">
          <button className="bg-white text-neutral-900 px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] transition-all duration-300 hover:bg-neutral-100 hover:scale-[1.03] active:scale-[0.98] rounded-full shadow-lg border border-transparent">
            Reservar Ahora
          </button>
        </div>
      </section>

      {/* 2. VIDEO SECTION (Totalmente inmersivo con protección contra Hydration Mismatch) */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        
        <div className="absolute inset-0 w-full h-full z-0">
          {isMounted && (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              controls={false}
              className="w-full h-full object-cover opacity-90"
            >
              <source src="/13597489-hd_1920_1080_30fps.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>
          )}
        </div>
      </section>

      {/* 3. SECCIÓN: CONOCE LOS CUARTOS (Carrusel Secundario) */}
      <section 
        className="relative h-screen w-full overflow-hidden bg-neutral-950 text-white select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-16 left-0 right-0 z-20 text-center px-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-300 block mb-2">— Estancias de Ensueño</span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide drop-shadow-sm">Conoce los Cuartos</h2>
        </div>

        {/* Slides de Habitaciones */}
        <div className="relative w-full h-full">
          {HABITACIONES.map((hab, index) => {
            const isActive = index === habitacionActiva;
            return (
              <div 
                key={hab.id}
                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
                }`}
              >
                <div className="absolute inset-0 brightness-[0.70]">
                  <Image 
                    src={hab.imagen} 
                    alt={hab.titulo} 
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                
                {/* Información de la Habitación */}
                <div className="absolute bottom-28 left-0 right-0 z-20 px-6 max-w-3xl mx-auto text-center md:text-left md:bottom-20 md:left-20">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#718f84] font-medium block mb-2">
                    {hab.precio}
                  </span>
                  <h3 className="font-serif text-2xl md:text-4xl font-light tracking-wide mb-3">
                    {hab.titulo}
                  </h3>
                  <p className="text-neutral-300 text-xs md:text-sm leading-relaxed max-w-xl font-light mb-6">
                    {hab.descripcion}
                  </p>
                  <button className="bg-white text-neutral-950 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-neutral-100 transition-all shadow-md">
                    Descubrir Suite
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flechas de Navegación */}
        <button 
          onClick={() => setHabitacionActiva((prev) => (prev - 1 + HABITACIONES.length) % HABITACIONES.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-black/10 hover:bg-white hover:text-black hover:border-white transition-all group"
          aria-label="Habitación anterior"
        >
          <span className="text-xl transform group-hover:-translate-x-0.5 transition-transform">←</span>
        </button>
        <button 
          onClick={() => setHabitacionActiva((prev) => (prev + 1) % HABITACIONES.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-black/10 hover:bg-white hover:text-black hover:border-white transition-all group"
          aria-label="Siguiente habitación"
        >
          <span className="text-xl transform group-hover:translate-x-0.5 transition-transform">→</span>
        </button>

        {/* Indicadores / Dots */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
          {HABITACIONES.map((_, index) => (
            <button
              key={index}
              onClick={() => setHabitacionActiva(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === habitacionActiva ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Ir a habitación ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN: CONOCE LA CASA (Grilla editorial 3x3) */}
      <section className="py-28 px-4 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 block mb-2">— Rincones Comunes</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-800">Conoce la Casa</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-4">
            {CASA.map((item) => (
              <div key={item.id} className="relative aspect-[4/5] overflow-hidden bg-neutral-100 group cursor-pointer rounded-sm">
                <Image 
                  src={item.imagen} 
                  alt={item.titulo} 
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 z-10">
                  <p className="text-white font-serif text-lg tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {item.titulo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE PLANES INTERACTIVOS */}
      <section className="py-28 px-4 bg-[#f8f6f2] relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 block mb-2">— EXPERIENCIAS DISPONIBLES</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-800">Nuestros Planes</h2>
          </div>

          {/* Menú de Tabs Estilo Cápsula */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-lg mx-auto">
            {PLANES.map((plan) => (
              <button 
                key={plan.id}
                onClick={() => setPlanActivo(plan.id)}
                className={`flex-1 min-w-[120px] py-3.5 text-[11px] tracking-[0.25em] uppercase font-semibold transition-all duration-300 shadow-sm rounded-xl ${
                  planActivo === plan.id 
                    ? 'bg-[#718f84] text-white' 
                    : 'bg-white text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {plan.id === 'romantica' ? 'Romántica' : plan.id === 'madre' ? 'Mamá' : 'Escapada'}
              </button>
            ))}
          </div>

          {/* Tarjeta de Contenido Dinámica */}
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-neutral-100 flex flex-col md:flex-row gap-8 md:gap-10 items-stretch transition-all duration-500">
            
            {/* Imagen del Plan Activo */}
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-md">
              <Image 
                src={planSeleccionado.imagen} 
                alt={planSeleccionado.titulo} 
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] uppercase tracking-[0.2em] bg-white/90 backdrop-blur-md text-neutral-800 px-3 py-1.5 rounded-full font-bold shadow-sm">
                  {planSeleccionado.etiqueta}
                </span>
              </div>
            </div>

            {/* Detalles del Plan Activo */}
            <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium block mb-3">
                  ABADÍA RESORT
                </span>
                
                <h3 className="font-serif italic text-3xl md:text-5xl font-light text-[#536d64] mb-1">
                  {planSeleccionado.titulo}
                </h3>
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-300 mb-6 font-medium">
                  {planSeleccionado.subtitulo}
                </p>

                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-light mb-8">
                  {planSeleccionado.descripcion}
                </p>
              </div>

              {/* Fila de Acción e Información de Precio */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase mb-0.5">Tarifa Especial</span>
                  <span className="font-serif text-xl md:text-2xl font-light text-neutral-900">
                    {planSeleccionado.precio}
                  </span>
                </div>
                
                <button className="bg-white text-neutral-950 px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-950 hover:text-white border border-neutral-200 transition-all shadow-sm">
                  Reservar Experiencia
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}