'use client';

import React, { useState } from 'react';
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
    ruta: "/atardeceres",
    imagen: "/categorias/atardecer.png"
  }
];

const FOTOS_HERO_ATARDECERES = [
  {
    id: 1,
    url: "/atardecer.jpg",
    titulo: "Atardecer Dorado en Playa Blanca",
    descripcion: "La hora en que el sol tiñe el horizonte de tonos ámbar frente al mar sereno."
  },
  {
    id: 2,
    url: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
    titulo: "Marea Baja & Reflejo del Golfo",
    descripcion: "Piscina natural de mar en calma que refleja el cielo caribeño."
  },
  {
    id: 3,
    url: "/sunshine.JPG",
    titulo: "Punta Bonita al Caer la Tarde",
    descripcion: "Uno de los miradores más espectaculares de San Antero."
  }
];

interface FotoLugar {
  src: string;
  titulo: string;
  pie: string;
}

interface PuntoAtardecer {
  id: string;
  numero: string;
  nombre: string;
  subtitulo: string;
  tipo: string;
  horarioRecomendado: string;
  descripcion: string;
  recursoPrincipal: string;
  destacados: string[];
  fotosGaleria: FotoLugar[];
}

const ATARDECERES_SECTOR: PuntoAtardecer[] = [
  {
    id: "atardecer-playa-blanca",
    numero: "01",
    nombre: "Playa Blanca • San Antero",
    subtitulo: "La Puesta de Sol Frente a Abadía",
    tipo: "Frente al Mar & Paso Directo",
    horarioRecomendado: "5:15 PM — 6:15 PM",
    descripcion:
      "Vivir el atardecer directamente en la orilla de Playa Blanca es la experiencia insignia de Abadía Casa Hotel. Al encontrarse en una ensenada protegida, el oleaje disminuye hasta quedar como un espejo dorado, permitiendo caminar descalzo por la orilla o disfrutar un cóctel frío con la brisa marina.",
    recursoPrincipal: "/atardecer.jpg",
    destacados: [
      "Paso directo sin necesidad de transporte",
      "Oleaje en calma total durante la hora dorada",
      "Sillas y asoleadoras frente al horizonte",
      "La mejor panorámica del sol cayendo sobre el agua"
    ],
    fotosGaleria: [
      {
        src: "/atardecer.jpg",
        titulo: "Horizonte Ámbar",
        pie: "El contraste del sol ocultándose tras la línea del mar."
      },
      {
        src: "/atardeceres/DSC00012.JPG",
        titulo: "Palmeras al Atardecer",
        pie: "Sombras naturales y siluetas costeras al caer la tarde."
      },
      {
        src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
        titulo: "Reflejo en la Marea",
        pie: "Piscina natural con tonalidades rosadas y violetas."
      }
    ]
  },
  {
    id: "punta-bonita",
    numero: "02",
    nombre: "Punta Bonita",
    subtitulo: "Mirador Panorámico del Golfo",
    tipo: "Mirador Elevado & Paisaje",
    horarioRecomendado: "5:00 PM — 6:30 PM",
    descripcion:
      "Un punto geográfico privilegiado que se adentra en el Golfo de Morrosquillo. Ofrece una vista de 180 grados sin obstáculos hacia el oeste, ideal para amantes de la fotografía de paisaje y quienes buscan contemplar la puesta de sol con perspectiva abierta.",
    recursoPrincipal: "/sunshine.JPG",
    destacados: [
      "Perspectiva panorámica abierta de 180 grados",
      "Viento constante y clima fresco al final del día",
      "Sitio predilecto para fotografía profesional",
      "A pocos minutos en vehículo desde el hotel"
    ],
    fotosGaleria: [
      {
        src: "/sunshine.JPG",
        titulo: "Punta Bonita en la Hora Dorada",
        pie: "El sol iluminando la costa rocosa y el mar abierto."
      },
      {
        src: "/atardeceres/DSC00012.JPG",
        titulo: "Vegetación Costera",
        pie: "La flora nativa caribeña recortada contra el cielo."
      },
      {
        src: "/atardecer.jpg",
        titulo: "Calma Crepuscular",
        pie: "Tonalidades intensas que perduran tras la caída del sol."
      }
    ]
  },
  {
    id: "cispata-atardecer",
    numero: "03",
    nombre: "Bahía de Cispatá & Manglares",
    subtitulo: "Puesta de Sol Entre Laberintos Verdes",
    tipo: "Ecoturismo Náutico & Aguas Mansas",
    horarioRecomendado: "4:45 PM — 6:00 PM",
    descripcion:
      "Navegar los canales de manglar de la Bahía de Cispatá en el ocaso es una experiencia mística y serena. Las aguas mansas reflejan como vidrio los tonos naranjas y violetas del cielo, mientras bandadas de aves acuáticas regresan a descansar a las copas de los árboles.",
    recursoPrincipal: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
    destacados: [
      "Paseo en lancha o canoa artesanal por canales silenciosos",
      "Retorno de aves migratorias al anochecer",
      "Espejo de agua inmóvil perfecto para capturas visuales",
      "Ambiente de paz absoluta en medio de la naturaleza"
    ],
    fotosGaleria: [
      {
        src: "/atardeceres/abe23f00-6c34-41ab-920c-449ea7f703b0.JPG",
        titulo: "Espejo de Agua en Cispatá",
        pie: "Reflejo limpio del cielo entre el manglar protegido."
      },
      {
        src: "/amanecersan atnero.JPG",
        titulo: "Paseos al Atardecer",
        pie: "Embarcaciones tradicionales recorriendo la bahía."
      },
      {
        src: "/sunshine.JPG",
        titulo: "Luz Filtrada",
        pie: "Rayos de sol cayendo sobre las raíces y ramas nativas."
      }
    ]
  },
  {
    id: "muelle-malecon",
    numero: "04",
    nombre: "Muelle & Malecón de San Antero",
    subtitulo: "Paseo Costero & Tradición Local",
    tipo: "Caminata Cultural & Muelle Turístico",
    horarioRecomendado: "5:30 PM — 7:00 PM",
    descripcion:
      "El malecón de San Antero cobra vida durante la puesta del sol. El muelle de madera se interna en el agua ofreciendo un mirador clásico para observar el sol ocultarse, mientras la brisa fresca acompaña caminatas familiares, puestos de artesanías y dulces típicos.",
    recursoPrincipal: "/atardeceres/DSC00012.JPG",
    destacados: [
      "Muelle accesible para caminar sobre el agua",
      "Ambiente seguro, iluminado y familiar",
      "Puestos de helados artesanales y dulces tradicionales",
      "Muestra artesanal en caña flecha para recuerdos"
    ],
    fotosGaleria: [
      {
        src: "/atardeceres/DSC00012.JPG",
        titulo: "Siluetas del Malecón",
        pie: "La estructura del muelle recortándose frente al mar."
      },
      {
        src: "/atardecer.jpg",
        titulo: "Hora Dorada en el Muelle",
        pie: "Caminata placentera acompañada de la brisa marina."
      },
      {
        src: "/sunshine.JPG",
        titulo: "Horizonte Despejado",
        pie: "Punto de encuentro preferido por locales y viajeros."
      }
    ]
  },
  {
    id: "atardecer-covenas",
    numero: "05",
    nombre: "Bahía de Coveñas",
    subtitulo: "Extensas Playas & Tonos Pastel",
    tipo: "Playas Abiertas & Quioscos de Palma",
    horarioRecomendado: "5:00 PM — 6:15 PM",
    descripcion:
      "A solo 15 minutos de Abadía, las extensas playas de Coveñas ofrecen kilómetros de arena abierta donde el atardecer se despliega en tonos pastel suaves. Es el cierre de día perfecto tras una jornada de deportes náuticos o paseo en lancha por el golfo.",
    recursoPrincipal: "/amanecersan atnero.JPG",
    destacados: [
      "Kilómetros de playa abierta para recorrer",
      "Quioscos de palma con bebidas y comida de mar",
      "Cielo amplio con transiciones de color hasta la noche",
      "Fácil acceso sobre la troncal costera"
    ],
    fotosGaleria: [
      {
        src: "/amanecersan atnero.JPG",
        titulo: "Plegaria de Color en Coveñas",
        pie: "El mar tibio iluminado por los últimos rayos solares."
      },
      {
        src: "/atardecer.jpg",
        titulo: "Quioscos al Crepúsculo",
        pie: "Sombra y descanso frente a las olas del golfo."
      },
      {
        src: "/atardeceres/DSC00012.JPG",
        titulo: "Brisa de Fin de Tarde",
        pie: "Momento de calma absoluta en la costa cordobesa."
      }
    ]
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
  Clock: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  )
};

// --- COMPONENTE INDIVIDUAL DE CARD FULL SCREEN CON RESPALDO AL TAP ---
function AtardecerFullScreenCard({ punto }: { punto: PuntoAtardecer }) {
  const [esRespaldo, setEsRespaldo] = useState(false);
  const [fotoGaleriaIndex, setFotoGaleriaIndex] = useState(0);

  const fotoActual = punto.fotosGaleria[fotoGaleriaIndex] || punto.fotosGaleria[0];

  const coordinarPlanWhatsApp = () => {
    const msj = encodeURIComponent(
      `Hola! Estoy hospedándome / planeando visitar Abadía Casa Hotel y deseo coordinar información para ver el atardecer en: ${punto.nombre}.`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <section className="relative h-[90vh] sm:h-screen w-full overflow-hidden bg-[#071326] select-none border-0">
      
      {/* ========================================================
          VISTA FRENTE: FOTO FULL SCREEN CON TÍTULO Y HORA
          ======================================================== */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          esRespaldo ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
        }`}
      >
        <Image
          src={punto.recursoPrincipal}
          alt={punto.nombre}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/90 via-black/25 to-black/35 pointer-events-none" />

        {/* INFORMACIÓN BASE DEL FRENTE */}
        <div className="absolute bottom-10 left-6 right-6 z-20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`${bitter.className} bg-white text-[#071326] px-3.5 py-1 rounded-full text-xs font-bold font-mono shadow-md`}>
                  {punto.numero}
                </span>
                <span className="text-xs text-slate-300 uppercase tracking-wider font-light">
                  {punto.tipo}
                </span>
              </div>

              <h2 className={`${bitter.className} text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-md`}>
                {punto.nombre}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="flex items-center gap-1 font-mono">
                  <Icons.Clock /> {punto.horarioRecomendado}
                </span>
                <span>•</span>
                <span className="text-slate-300">{punto.subtitulo}</span>
              </div>
            </div>

            {/* BOTÓN TAP PARA VOLTEAR AL RESPALDO */}
            <button
              onClick={() => setEsRespaldo(true)}
              className={`${bitter.className} bg-white hover:bg-slate-100 text-[#071326] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl cursor-pointer border-0 shrink-0`}
            >
              <Icons.Refresh />
              <span>Ver Respaldo & Galería</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          VISTA RESPALDO (BACK): DETALLES, DESTACADOS & GALERÍA
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
                RESPALDO • {punto.tipo}
              </span>
              <h3 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white`}>
                {punto.nombre}
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

          {/* Horario y subtítulo */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="bg-white/5 px-3 py-1.5 rounded-full font-mono flex items-center gap-1">
              <Icons.Clock /> Hora dorada: {punto.horarioRecomendado}
            </span>
            <span>•</span>
            <span className="text-slate-400">
              {punto.subtitulo}
            </span>
          </div>

          {/* Descripción completa */}
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
            {punto.descripcion}
          </p>

          {/* Destacados con punticos limpios */}
          <div className="bg-white/5 p-5 rounded-2xl space-y-3">
            <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-300 block`}>
              Por qué contemplar este atardecer:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {punto.destacados.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Galería interactiva del lugar en el respaldo */}
          {punto.fotosGaleria.length > 0 && (
            <div className="space-y-3 pt-1">
              <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-300 block`}>
                Galería de Fotografías:
              </span>
              
              <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <div className="relative h-48 sm:h-64 w-full">
                  <Image
                    src={fotoActual.src}
                    alt={fotoActual.titulo}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5 bg-white/5 flex items-center justify-between">
                  <div>
                    <p className={`${bitter.className} text-xs font-bold text-white uppercase`}>
                      {fotoActual.titulo}
                    </p>
                    <p className="text-[11px] text-slate-300 font-light">
                      {fotoActual.pie}
                    </p>
                  </div>

                  {/* Selector de fotos de la galería */}
                  <div className="flex gap-1.5">
                    {punto.fotosGaleria.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoGaleriaIndex(i)}
                        className={`w-6 h-6 rounded-full text-[10px] font-mono flex items-center justify-center transition-all cursor-pointer ${
                          i === fotoGaleriaIndex
                            ? 'bg-white text-[#071326] font-bold'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón WhatsApp */}
          <div className="pt-2">
            <button
              onClick={coordinarPlanWhatsApp}
              className={`${bitter.className} w-full sm:w-auto bg-white hover:bg-slate-100 text-[#071326] py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xl cursor-pointer border-0`}
            >
              Consultar o Coordinar Plan por WhatsApp
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}

export default function PaginaAtardeceres() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

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
            <Link onClick={() => setMenuAbierto(false)} href="/atardeceres" className={`${bitter.className} text-base sm:text-lg uppercase tracking-wider text-white hover:text-slate-300 transition-colors`}>Atardeceres</Link>
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
        <Image
          src={FOTOS_HERO_ATARDECERES[heroIndex].url}
          alt={FOTOS_HERO_ATARDECERES[heroIndex].titulo}
          fill
          priority
          unoptimized
          className="object-cover transition-transform duration-1000 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45 pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto space-y-3 px-4">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold block`}>
            Hora Dorada • San Antero, Córdoba
          </span>
          <h1 className={`${bitter.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
            Los Atardeceres
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-xl mx-auto leading-relaxed">
            San Antero y Playa Blanca son reconocidos por ofrecer los atardeceres más cálidos y fotogénicos del Golfo de Morrosquillo.
          </p>

          <div className="pt-2">
            <Link
              href="#seccion-atardeceres-fullscreen"
              className={`${bitter.className} inline-flex items-center gap-2 bg-[#071326] hover:bg-[#0d2242] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 active:scale-95 border-0`}
            >
              <span>Ver Puntos de Atardecer</span>
              <Icons.ArrowUpRight />
            </Link>
          </div>

          {/* Selector sutil de imágenes hero */}
          <div className="flex items-center justify-center gap-2 pt-3">
            {FOTOS_HERO_ATARDECERES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  heroIndex === i ? 'w-7 bg-white' : 'w-2 bg-white/40'
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

      {/* TÍTULO INTRODUCTORIO */}
      <section id="seccion-atardeceres-fullscreen" className="bg-white py-10 px-6 text-center border-0">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold block`}>
            EXPERIENCIAS CREPUSCULARES
          </span>
          <h2 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Rutas de la Hora Dorada
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Explora cada mirador en pantalla completa y toca el botón del respaldo para ver detalles y fotografías.
          </p>
        </div>
      </section>

      {/* ========================================================
          3. LAS CARDS FULL SCREEN SEGUIDAS (CON RESPALDO AL TAP)
          ======================================================== */}
      <div className="w-full flex flex-col">
        {ATARDECERES_SECTOR.map((punto) => (
          <AtardecerFullScreenCard key={punto.id} punto={punto} />
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