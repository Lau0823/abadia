'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

// --- ICONOS VECTORIALES DE ALTA PRECISIÓN ---
const Icons = {
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),
  Star: () => (
    <svg className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  // --- OJITOS VECTORIALES EDITORIALES (EYES ICON) ---
  Eyes: ({ className = "w-4 h-4 text-[#C5A059]" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12c1.8-3.6 5-5.5 8-5.5s6.2 1.9 8 5.5c-1.8 3.6-5 5.5-8 5.5s-6.2-1.9-8-5.5z" />
      <circle cx="10.5" cy="12" r="2.2" fill="currentColor" />
      <path strokeLinecap="round" d="M6 7.5L5 6m5 0V4.5m5 1.5l1-1.5" />
    </svg>
  ),
  Quote: () => (
    <svg className="w-8 h-8 text-[#C5A059]/20 fill-current" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
};

const TESTIMONIOS_DATA = [
  {
    id: 1,
    huesped: "Carolina Restrepo & Mateo",
    ciudad: "Medellín, Colombia",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    estancia: "Suite Real con Hidromasaje",
    fecha: "Agosto 2026",
    motivo: "Celebración de Aniversario",
    comentario: "El silencio y la privacidad de Casa Abadía son insuperables. Despertar viendo el mar caribeño desde la cama y terminar el día en el hidromasaje bajo las estrellas fue una experiencia mágica. La comida fresca y la calidez del equipo hicieron que superara todas nuestras expectativas.",
    calificacion: 5,
    destacado: "La tina de hidromasaje exterior con vista al atardecer."
  },
  {
    id: 2,
    huesped: "Familia Gómez Pineda",
    ciudad: "Bogotá, Colombia",
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
    estancia: "Cabaña Familiar Playa Blanca",
    fecha: "Julio 2026",
    motivo: "Vacaciones en Familia",
    comentario: "Buscábamos desconectarnos del ruido de la ciudad y encontramos el refugio perfecto. El acceso directo a la playa de aguas calmas fue ideal para los niños, mientras nosotros descansábamos en las camas balinesas. Desayunos inolvidables con fruta fresca y arepas nativas.",
    calificacion: 5,
    destacado: "Espacios amplios, seguros y atención personalizada 24/7."
  },
  {
    id: 3,
    huesped: "Sebastián Vergara",
    ciudad: "Cali, Colombia",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    estancia: "Bungalow Atardecer Caribe",
    fecha: "Septiembre 2026",
    motivo: "Escapada Romántica",
    comentario: "Dormir escuchando el rumor de las olas a escasos pasos de la habitación no tiene precio. Coordinamos desde la recepción el tour hacia los manglares de Cispatá y la visita a las islas; todo impecable, puntual y con un trato muy humano.",
    calificacion: 5,
    destacado: "El sendero privado a la orilla del mar y la comida de mar."
  },
  {
    id: 4,
    huesped: "Dra. Valentina Morales",
    ciudad: "Bucaramanga, Colombia",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    estancia: "Estancia Silencio",
    fecha: "Junio 2026",
    motivo: "Retiro de Desconexión",
    comentario: "La acústica y la frescura de la habitación permitieron el descanso profundo que necesitaba. Pude trabajar un par de horas frente al patio de las fuentes con un internet rápido y estable, y el resto del día desconectarme por completo frente a la brisa.",
    calificacion: 5,
    destacado: "Ambiente silencioso garantizado y excelente café matutino."
  },
  {
    id: 5,
    huesped: "Nicolás & Mariana",
    ciudad: "Barranquilla, Colombia",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    estancia: "Master Suite Abadía",
    fecha: "Mayo 2026",
    motivo: "Propuesta de Matrimonio",
    comentario: "El equipo de Abadía me ayudó a preparar una cena íntima con antorchas en la arena que superó todo lo soñado. La vista panorámica de 180 grados de la suite principal y los detalles con champaña y flores hicieron el momento perfecto. ¡Ella dijo que sí!",
    calificacion: 5,
    destacado: "La complicidad del staff y la cena privada en la playa."
  },
  {
    id: 6,
    huesped: "Jorge Eduardo Londoño",
    ciudad: "Manizales, Colombia",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
    estancia: "Cabaña Palmeras",
    fecha: "Abril 2026",
    motivo: "Descanso en Pareja",
    comentario: "Una arquitectura colonial fresca que se funde con la naturaleza. La hamaca en la terraza privada entre palmeras fue mi lugar favorito durante cuatro días. Regresamos renovados y ya estamos planeando la visita de fin de año.",
    calificacion: 5,
    destacado: "Sombra natural, brisa constante y privacidad absoluta."
  }
];

export default function PaginaTestimonios() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const contactarWhatsAppResena = () => {
    const msj = encodeURIComponent("Hola! Deseo consultar fechas disponibles para vivir la experiencia en Abadía Casa Hotel.");
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <main className="w-full bg-[#FAF7F2] text-[#2a2421] antialiased min-h-screen font-light">
      
      {/* HEADER GLOBAL IDÉNTICO AL HOME */}
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

      {/* MENÚ LATERAL GLASS (SIN NUMERACIONES) */}
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
            <Link onClick={() => setMenuAbierto(false)} href="/gastronomia" className="text-lg sm:text-xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Gastronomía de Autor</Link>
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

      {/* ========================================================
          1. BANNER PRINCIPAL FULL SCREEN
          ======================================================== */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-end pb-16 px-6 sm:px-12 text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=85"
          alt="Experiencia y Testimonios Abadía Casa Hotel"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45 pointer-events-none" />

        <div className="relative z-20 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
            <Icons.Eyes className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">
              Miradas Reales • Voces de Huéspedes
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-semibold uppercase tracking-wide text-white drop-shadow-lg">
            Testimonios & Huéspedes
          </h1>
          <p className="text-xs sm:text-base text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
            Historias reales de descanso, celebraciones y momentos inolvidables vividos con ojos propios frente al mar en Abadía Casa Hotel.
          </p>

          <div className="pt-2">
            <button
              onClick={contactarWhatsAppResena}
              className="bg-[#8c7355] hover:bg-[#735e45] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Vivir la Experiencia Abadía</span>
              <Icons.ArrowUpRight />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          MÉTRICAS EDITORIALES DE SATISFACCIÓN
          ======================================================== */}
      <section className="bg-white border-b border-[#E8DDD0] py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold text-[#8c7355] block">4.9 / 5</span>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Calificación Promedio</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold text-[#8c7355] block">100%</span>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Recomendación Directa</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold text-[#8c7355] block">6</span>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Suites Exclusivas</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold text-[#8c7355] block">+500</span>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Huéspedes Felices</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          TRANSICIÓN EDITORIAL: TÍTULO EN DORADO
          ======================================================== */}
      <section className="bg-[#FAF7F2] py-14 sm:py-20 px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 justify-center">
            <Icons.Eyes className="w-5 h-5 text-[#8c7355]" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
              — A OJOS DE NUESTROS HUÉSPEDES
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Lo que Cuentan Quienes Nos Visitan
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Cada estancia está pensada para dejar una huella imborrable de serenidad, gastronomía y buen trato.
          </p>
        </div>
      </section>

      {/* ========================================================
          2. LISTA DE TESTIMONIOS CON FOTOS REALES Y OJITOS
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {TESTIMONIOS_DATA.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-[#E8DDD0] shadow-md flex flex-col justify-between hover:shadow-xl transition-all relative group"
            >
              <div className="absolute top-8 right-8">
                <Icons.Quote />
              </div>

              <div className="space-y-4">
                {/* Cabecera de la tarjeta: Estrellas + Ojitos de Validación */}
                <div className="flex items-center justify-between pr-8">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.calificacion }).map((_, i) => (
                      <Icons.Star key={i} />
                    ))}
                  </div>

                  {/* OJITOS DE COMPROBACIÓN */}
                  <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E8DDD0] px-3 py-1 rounded-full">
                    <Icons.Eyes className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-600 font-mono">
                      Visto & Vivido
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c7355] font-bold block">
                    {t.motivo} • {t.fecha}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed italic pt-1">
                    "{t.comentario}"
                  </p>
                </div>

                {/* Bloque con ojito de inspección */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DDD0] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Icons.Eyes className="w-3.5 h-3.5 text-[#8c7355]" />
                    <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold block">
                      A ojos del huésped lo mejor fue:
                    </span>
                  </div>
                  <p className="text-xs font-medium text-stone-800 pl-5">
                    {t.destacado}
                  </p>
                </div>
              </div>

              {/* FOOTER DE LA TARJETA: FOTO DE LA PERSONA + NOMBRE + ESTANCIA */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between mt-6 gap-3">
                <div className="flex items-center gap-3.5">
                  {/* FOTOGRAFÍA DEL HUÉSPED */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059]/60 shadow-md shrink-0 bg-stone-100">
                    <Image
                      src={t.foto}
                      alt={t.huesped}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                      {t.huesped}
                    </h3>
                    <span className="text-[11px] text-stone-400 block font-light">
                      📍 {t.ciudad}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] uppercase font-mono text-[#8c7355] bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E8DDD0] shrink-0 text-center">
                  {t.estancia.replace('Suite', '').replace('Cabaña', '').replace('Estancia', '').replace('Bungalow', '').trim()}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA DE INVITACIÓN */}
        <div className="bg-[#071326] text-white rounded-[3rem] p-10 sm:p-14 text-center space-y-5 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 justify-center mb-1">
              <Icons.Eyes className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
                Tu Próxima Historia de Calma
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide">
              ¿Listo para mirar el Caribe con tus propios ojos?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Reserva tu estancia con atención personalizada y acompañamiento directo de nuestro concierge.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/reservas-y-pagos"
              className="bg-[#8c7355] hover:bg-[#735e45] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Disponibilidad & Reservar</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER OFICIAL AZUL ABADÍA */}
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