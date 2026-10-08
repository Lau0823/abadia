"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- DATOS DE LA GUÍA ---
const SECCIONES_GUIA = [
  {
    id: "historia",
    titulo: "Nuestra Historia",
    subtitulo: "El Origen de Abadía",
    descripcion: "Lo que comenzó como una casa familiar de descanso frente al Mar Caribe, se ha transformado en un refugio exclusivo donde la arquitectura vernácula se encuentra con el confort moderno. Cada rincón de La Abadía ha sido cuidadosamente restaurado para preservar la esencia de la costa cordobesa.",
    imagen: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80",
    inverso: false
  },
  {
    id: "gastronomia",
    titulo: "Gastronomía",
    subtitulo: "Sabores del Caribe",
    descripcion: "Nuestra cocina es una celebración de los ingredientes locales. Trabajamos con pescadores artesanales de la región para llevar del mar a la mesa los pescados y mariscos más frescos, fusionando recetas ancestrales con técnicas de vanguardia.",
    imagen: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
    inverso: true
  },
  {
    id: "bienestar",
    titulo: "Bienestar",
    subtitulo: "Spa & Relajación",
    descripcion: "Sumérjase en un estado de calma absoluta. Nuestros rituales de spa utilizan esencias extraídas de la flora local, ofreciendo terapias de renovación corporal y mental a tan solo pasos de la suave brisa del océano.",
    imagen: "https://i.pinimg.com/736x/53/0e/d7/530ed71269d7970063d8d12596cbd559.jpg",
    inverso: false
  }
];

const LUGARES_INTERES = [
  {
    titulo: "Manglares de Cispatá",
    distancia: "15 min",
    descripcion: "Santuario de flora y fauna, hogar del cocodrilo aguja y aves exóticas.",
    imagen: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80"
  },
  {
    titulo: "Volcán de Lodo",
    distancia: "30 min",
    descripcion: "Piscinas naturales de lodo con propiedades terapéuticas y minerales.",
    imagen: "https://i.pinimg.com/736x/7e/49/82/7e4982b5eceb9ddd9cbb78b3be98bcf5.jpg"
  },
  {
    titulo: "Playas Blancas",
    distancia: "20 min",
    descripcion: "Aguas cristalinas y arena blanca perfectas para el descanso y snorkel.",
    imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  }
];

export default function ConoceAbadiaPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <main className="min-h-screen bg-white text-[#3d342e] antialiased selection:bg-[#f4f1ea] style-font-override overflow-x-hidden">
      
      {/* Tipografía */}
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

      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] w-full flex items-center justify-center bg-neutral-900">
        <Link href="/" className="absolute top-8 left-8 z-50 text-white/80 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-medium">
          ← Volver
        </Link>

        {/* LOGO ABADÍA COMO IMAGEN FLOTANTE (ESTILO ORIGINAL) */}
        <div className="absolute top-12 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="relative w-64 h-24 md:w-80 md:h-32 flex items-center justify-center">
            <div className="absolute inset-0 w-full h-full">
              <Image src="/logo.png" alt="Logo Abadía" fill priority sizes="(max-width: 768px) 256px, 320px" className="object-contain filter brightness-0 invert" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=80" 
            alt="Conoce Abadía" 
            fill 
            priority
            className="object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 mt-24">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/80 font-medium block mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            — DESCUBRE NUESTRO UNIVERSO —
          </span>
          <h1 className="text-5xl md:text-8xl text-white uppercase leading-none flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <span className="font-luxury-title tracking-tight drop-shadow-md">Guía</span>
            <span className="font-luxury-script text-6xl md:text-9xl text-[#f4f1ea] -mt-4 md:-mt-8 normal-case tracking-normal drop-shadow-lg">Turística</span>
          </h1>
        </div>
      </section>

      {/* 2. TEXTO INSPIRACIONAL */}
      <section className="py-24 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-light text-[#3d342e] leading-relaxed font-editorial-italic">
          "Más que un destino, ofrecemos un estado de <span className="text-[#7a6e5d]">desconexión y paz</span>, donde la naturaleza dicta el ritmo de sus días."
        </h2>
        <div className="w-16 h-px bg-[#7a6e5d]/50 mx-auto mt-12" />
      </section>

      {/* 3. BLOQUES DE CONTENIDO (ZIG-ZAG ORIGINAL) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24 md:space-y-32">
          {SECCIONES_GUIA.map((seccion, idx) => (
            <div key={seccion.id} className={`flex flex-col gap-10 md:gap-16 items-center ${seccion.inverso ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-lg group">
                <Image 
                  src={seccion.imagen} 
                  alt={seccion.titulo} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-center text-left md:px-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#7a6e5d] font-medium block mb-3">
                  0{idx + 1} — {seccion.subtitulo}
                </span>
                <h3 className="text-3xl md:text-5xl font-light text-[#3d342e] uppercase font-luxury-title mb-6">
                  {seccion.titulo}
                </h3>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light">
                  {seccion.descripcion}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. LUGARES DE INTERÉS (CARDS ORIGINALES) */}
      <section className="py-24 px-4 md:px-8 bg-[#f4f1ea]/30 border-t border-[#f4f1ea]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3d342e]/40 font-medium block mb-2">
              — EXPLORACIÓN LOCAL —
            </span>
            <h2 className="text-4xl md:text-6xl text-[#3d342e] uppercase leading-none flex flex-col items-center">
              <span className="font-luxury-title tracking-tight">Lugares de</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#7a6e5d] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Interés</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LUGARES_INTERES.map((lugar, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#f4f1ea]/80 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image 
                    src={lugar.imagen} 
                    alt={lugar.titulo} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                    <span className="text-[9px] uppercase tracking-widest text-[#3d342e] font-semibold">{lugar.distancia}</span>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h4 className="text-xl font-light uppercase tracking-wide font-luxury-title text-[#3d342e] mb-3">
                    {lugar.titulo}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {lugar.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-24 px-6 text-center bg-[#3d342e] text-white">
        <h2 className="text-3xl md:text-5xl font-light font-editorial-italic mb-8">
          Descubra el arte de no hacer nada.
        </h2>
        <Link href="/reservar" className="inline-block bg-[#f4f1ea] text-[#3d342e] px-10 py-4 text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg">
          Reserva tu estadía
        </Link>
      </section>

    </main>
  );
}
