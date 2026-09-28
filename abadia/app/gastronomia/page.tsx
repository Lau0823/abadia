'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

const Icons = {
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),
  Utensils: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )
};

const RECOMENDACIONES_GASTRONOMIA = [
  {
    id: "desayuno-costeno",
    numero: "01",
    titulo: "Desayuno Abadía de Origen",
    subtitulo: "Incluido en la Estadía • Servido Frente al Mar",
    horario: "7:30 AM — 10:30 AM",
    precio: "Cortesía Huéspedes",
    descripcion: "Frutas tropicales de temporada cortadas al momento, café de especialidad de la Sierra Nevada, arepa de huevo tradicional crujiente, queso costeño fresco, huevos al gusto y jugos naturales prensados en frío.",
    detalles: [
      "Café espresso y filtrado ilimitado",
      "Canasta de panes artesanales de masa madre",
      "Mermeladas caseras de corozo y maracuyá",
      "Opciones veganas y sin gluten previa solicitud"
    ],
    imagen: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "pesca-brasa",
    numero: "02",
    titulo: "Pesca Artesanal del Día a la Brasa",
    subtitulo: "Cocina de Mar • Del Bote a la Mesa",
    horario: "12:30 PM — 4:00 PM",
    precio: "$65.000 COP",
    descripcion: "Pargo rojo, róbalo o sierra fresca seleccionada cada madrugada directamente con los pescadores nativos de San Antero. Se marina con limón criollo, hierbas frescas del huerto y se asa lentamente a las brasas de carbón vegetal, acompañado de arroz con coco negro y patacones crocantes.",
    detalles: [
      "Pesca fresca del Golfo de Morrosquillo",
      "Ensalada de aguacate criollo y mango biche",
      "Suero costeño artesanal preparado en casa",
      "Maridaje sugerido: Vino blanco fresco o cerveza artesanal"
    ],
    imagen: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cena-romantica",
    numero: "03",
    titulo: "Cena Romántica a la Luz de las Velas",
    subtitulo: "Experiencia Privada en la Playa",
    horario: "7:00 PM — 10:00 PM (Reserva Previa)",
    precio: "$280.000 COP (Pareja)",
    descripcion: "Montaje íntimo sobre la arena blanca a orillas del agua, rodeado de antorchas y fanales de cristal. Menú degustación de 4 tiempos diseñado por nuestro chef, botella de vino o cava espumante y atención dedicada de un mayordomo privado.",
    detalles: [
      "Mesa privada exclusiva en la orilla del mar",
      "Entrada, plato fuerte de mar o tierra y postre de autor",
      "Botella de vino reserva a elección",
      "Decoración floral y música ambiental personalizada"
    ],
    imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cocteleria-atardecer",
    numero: "04",
    titulo: "Coctelería de Autor & Sunset Lounge",
    subtitulo: "Deck de Palmeras & Solárium",
    horario: "4:00 PM — 10:00 PM",
    precio: "Desde $32.000 COP",
    descripcion: "Mixología botánica inspirada en el Caribe colombiano: gin tonics infusionados con flor de Jamaica, mojitos de corozo silvestre, cocadas líquidas con ron añejo y tapas ligeras para contemplar la puesta de sol en el deck.",
    detalles: [
      "Destilados premium y rones caribeños",
      "Bebidas y mocktails sin alcohol refrescantes",
      "Ceviches frescos y empanaditas de jaiba como picadas",
      "Servicio servido a las asoleadoras o camas balinesas"
    ],
    imagen: "/piscina.png"
  }
];

export default function PaginaGastronomia() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cotizarPlato = (plato: string) => {
    const msj = encodeURIComponent(`Hola! Deseo información y reserva para la experiencia gastronómica: ${plato} en Abadía Casa Hotel.`);
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

      {/* MENÚ LATERAL GLASS */}
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
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=85"
          alt="Gastronomía Abadía Casa Hotel"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />

        <div className="relative z-20 max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/80 font-bold block">
            Cocina Caribeña & Pesca de Origen
          </span>
          <h1 className="text-3xl sm:text-6xl font-semibold uppercase tracking-wide text-white drop-shadow-lg">
            Gastronomía de Autor
          </h1>
          <p className="text-xs sm:text-base text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
            Sabores frescos del Golfo de Morrosquillo, ingredientes cultivados por manos campesinas y cocina íntima frente a la brisa del mar.
          </p>

          <div className="pt-2">
            <button
              onClick={() => cotizarPlato("Menú General y Experiencias")}
              className="bg-[#8c7355] hover:bg-[#735e45] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Reservar Mesa o Experiencia</span>
              <Icons.ArrowUpRight />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          TRANSICIÓN EDITORIAL: TÍTULO EN DORADO
          ======================================================== */}
      <section className="bg-[#FAF7F2] py-14 sm:py-20 px-6 text-center border-b border-[#E8DDD0]">
        <div className="max-w-2xl mx-auto space-y-2.5">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#8c7355] font-semibold block">
            — NUESTRA MESA
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Recomendaciones del Chef
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Platos e itinerarios culinarios creados para que cada comida sea un momento de deleite y tranquilidad.
          </p>
        </div>
      </section>

      {/* ========================================================
          2. RECOMENDACIONES DEBAJO DEL BANNER
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 max-w-6xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {RECOMENDACIONES_GASTRONOMIA.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-[#E8DDD0] shadow-md flex flex-col justify-between hover:shadow-xl transition-all group"
            >
              <div className="relative h-72 w-full overflow-hidden bg-black">
                <Image
                  src={item.imagen}
                  alt={item.titulo}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-4 left-4 bg-black/55 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-full">
                  {item.horario}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest">
                    Opción {item.numero}
                  </span>
                  <span className="text-sm font-semibold text-[#E8DDD0] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    {item.precio}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c7355] font-bold block">
                    {item.subtitulo}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold uppercase text-stone-900">
                    {item.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-1">
                    {item.descripcion}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                    Incluye:
                  </span>
                  <div className="space-y-1.5">
                    {item.detalles.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                        <span className="text-[#8c7355] font-bold">✓</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => cotizarPlato(item.titulo)}
                  className="w-full mt-6 bg-[#FAF7F2] hover:bg-[#8c7355] text-stone-800 hover:text-white border border-[#E8DDD0] py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Consultar Disponibilidad en WhatsApp
                </button>
              </div>
            </article>
          ))}
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