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

const Icons = {
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
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
  ExternalLink: () => (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
};

interface OpcionTransporte {
  id: string;
  numero: string;
  titulo: string;
  duracion: string;
  tipo: string;
  precio: string;
  descripcion: string;
  beneficios: string[];
  imagen: string;
  mapEmbedUrl?: string;
  wazeUrl?: string;
}

const RECOMENDACIONES_TRANSPORTE: OpcionTransporte[] = [
  {
    id: "transfer-tolu",
    numero: "01",
    titulo: "Transfer Privado desde Aeropuerto de Tolú (TLU)",
    duracion: "25 minutos de recorrido",
    tipo: "Camioneta SUV Privada con Aire Acondicionado",
    precio: "Desde $120.000 COP por trayecto",
    descripcion:
      "La terminal aérea más cercana a Abadía Casa Hotel, con vuelos directos regulares desde Medellín y Bogotá. Nuestro conductor te espera directamente en la sala de llegadas con identificación personalizada y asistencia completa de equipaje.",
    beneficios: [
      "Monitoreo de vuelo en tiempo real ante demoras",
      "Capacidad hasta 4 pasajeros con equipaje de bodega",
      "Agua mineral fría y toallas refrescantes a bordo",
      "Ruta directa por vía asfaltada costera del Golfo"
    ],
    imagen: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://www.google.com/maps?q=Aeropuerto+Golfo+de+Morrosquillo+Tolu&output=embed",
    wazeUrl: "https://www.google.com/maps/dir/?api=1&origin=Aeropuerto+Golfo+de+Morrosquillo+Tolu&destination=San+Antero+Cordoba"
  },
  {
    id: "transfer-monteria",
    numero: "02",
    titulo: "Transfer Privado desde Aeropuerto de Montería (MTR)",
    duracion: "1 hora y 15 minutos",
    tipo: "Camioneta Familiar / Van Ejecutiva",
    precio: "Desde $230.000 COP por trayecto",
    descripcion:
      "El aeropuerto Los Garzones de Montería ofrece la mayor frecuencia de aerolíneas nacionales (Avianca, LATAM, Clic) y amplia gama de horarios. Brindamos traslados exclusivos sin esperas en vehículos modernos con conductores certificados.",
    beneficios: [
      "Disponible las 24 horas del día con reserva previa",
      "Vehículos amplios para familias o grupos de hasta 6 personas",
      "Seguro contractual de pasajeros incluido",
      "Parada opcional en tiendas tradicionales de la región"
    ],
    imagen: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://www.google.com/maps?q=Aeropuerto+Los+Garzones+Monteria&output=embed",
    wazeUrl: "https://www.google.com/maps/dir/?api=1&origin=Aeropuerto+Los+Garzones+Monteria&destination=San+Antero+Cordoba"
  },
  {
    id: "llegada-vehiculo",
    numero: "03",
    titulo: "Llegada en Vehículo Propio o Alquilado",
    duracion: "Acceso pavimentado total",
    tipo: "Parqueadero Privado & Cerrado",
    precio: "Cortesía para Huéspedes",
    descripcion:
      "Si viajas en tu propio vehículo o alquilado, la carretera desde Coveñas o Lorica se encuentra en óptimas condiciones y totalmente pavimentada. Contamos con parqueadero privado, cerrado dentro de la propiedad y con vigilancia permanente.",
    beneficios: [
      "Espacio cerrado y cómodo para camionetas y automóviles",
      "Vigilancia física 24/7 y cámaras de seguridad dentro del predio",
      "Ubicación exacta compartida en Waze y Google Maps",
      "Paso directo e inmediato hacia recepción y habitaciones"
    ],
    imagen: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://www.google.com/maps?q=Playa+Blanca+San+Antero+Cordoba&output=embed",
    wazeUrl: "https://www.google.com/maps?q=Playa+Blanca+San+Antero+Cordoba"
  },
  {
    id: "lancha-maritimo",
    numero: "04",
    titulo: "Traslados Náuticos & Excursiones en Lancha",
    duracion: "A convenir según destino",
    tipo: "Embarcación Rápida con Chalecos Salvavidas",
    precio: "Tarifa personalizada",
    descripcion:
      "Zarpa directamente desde la orilla de nuestro hotel hacia el Archipiélago de San Bernardo (Islas Tintipán y Múcura) o hacia los muelles ecológicos de la Bahía de Cispatá con capitanes nativos de amplia trayectoria en el mar Caribe.",
    beneficios: [
      "Embarque directo frente a las instalaciones del hotel",
      "Chalecos certificados y permiso oficial de Capitanía de Puerto",
      "Capacidad para parejas o grupos familiares completos",
      "Nevera con hielo y bebidas refrescantes a bordo"
    ],
    imagen: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://www.google.com/maps?q=Islas+San+Bernardo+Colombia&output=embed",
    wazeUrl: "https://www.google.com/maps?q=Islas+San+Bernardo+Colombia"
  }
];

// --- COMPONENTE CARD FULL SCREEN CON RESPALDO AL TAP ---
function TransporteFullScreenCard({ item }: { item: OpcionTransporte }) {
  const [esRespaldo, setEsRespaldo] = useState(false);

  const coordinarTransporte = () => {
    const msj = encodeURIComponent(
      `Hola! Deseo coordinar el servicio de transporte / transfer hacia Abadía Casa Hotel: ${item.titulo}`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <section className="relative h-[90vh] sm:h-screen w-full overflow-hidden bg-[#071326] select-none border-0">
      
      {/* ========================================================
          VISTA FRENTE: FOTO FULL SCREEN CON TÍTULO Y COSTO
          ======================================================== */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          esRespaldo ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
        }`}
      >
        <Image
          src={item.imagen}
          alt={item.titulo}
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
                  {item.numero}
                </span>
                <span className="text-xs text-slate-300 uppercase tracking-wider font-light">
                  {item.tipo}
                </span>
              </div>

              <h2 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-md`}>
                {item.titulo}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="flex items-center gap-1">
                  <Icons.Clock /> {item.duracion}
                </span>
                <span>•</span>
                <span className="font-mono text-white font-semibold">
                  {item.precio}
                </span>
              </div>
            </div>

            {/* BOTÓN TAP PARA VOLTEAR AL RESPALDO */}
            <button
              onClick={() => setEsRespaldo(true)}
              className={`${bitter.className} bg-white hover:bg-slate-100 text-[#071326] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl cursor-pointer border-0 shrink-0`}
            >
              <Icons.Refresh />
              <span>Ver Respaldo & Ruta</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          VISTA RESPALDO (BACK): DETALLES, BENEFICIOS & MAPA
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
                RESPALDO • {item.tipo}
              </span>
              <h3 className={`${bitter.className} text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white`}>
                {item.titulo}
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

          {/* Duración y tarifa */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Icons.Clock /> {item.duracion}
            </span>
            <span>•</span>
            <span className="bg-white/5 px-3 py-1.5 rounded-full font-mono text-white font-semibold">
              {item.precio}
            </span>
          </div>

          {/* Descripción completa */}
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
            {item.descripcion}
          </p>

          {/* Beneficios con punticos limpios */}
          <div className="bg-white/5 p-5 rounded-2xl space-y-3">
            <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-300 block`}>
              Detalles del Servicio & Garantías:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {item.beneficios.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa referencial del trayecto */}
          {item.mapEmbedUrl && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className={`${bitter.className} text-xs uppercase tracking-wider font-bold text-slate-400`}>
                  Ruta y Ubicación
                </span>
                {item.wazeUrl && (
                  <a
                    href={item.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/90 hover:text-white inline-flex items-center gap-1 underline underline-offset-4"
                  >
                    <span>Abrir en Google Maps / GPS</span>
                    <Icons.ExternalLink />
                  </a>
                )}
              </div>

              <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner">
                <iframe
                  src={item.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Ruta de ${item.titulo}`}
                />
              </div>
            </div>
          )}

          {/* Botón WhatsApp */}
          <div className="pt-2">
            <button
              onClick={coordinarTransporte}
              className={`${bitter.className} w-full sm:w-auto bg-white hover:bg-slate-100 text-[#071326] py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xl cursor-pointer border-0`}
            >
              Coordinar Chofer o Transfer por WhatsApp
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}

export default function PaginaTransporte() {
  const [menuAbierto, setMenuAbierto] = useState(false);

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
        <Image
          src="/caimanera.png"
          alt="Rutas y Transporte hacia Abadía Casa Hotel"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45 pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto space-y-3 px-4">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold block`}>
            Playa Blanca • San Antero, Córdoba
          </span>
          <h1 className={`${bitter.className} text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg`}>
            Cómo Llegar & Transporte
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-xl mx-auto leading-relaxed">
            Tu viaje hacia la calma debe ser placentero desde el primer instante. Coordinamos tu transfer privado puerta a puerta desde los aeropuertos principales.
          </p>

          <div className="pt-2">
            <Link
              href="#seccion-transporte-fullscreen"
              className={`${bitter.className} inline-flex items-center gap-2 bg-[#071326] hover:bg-[#0d2242] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 active:scale-95 border-0`}
            >
              <span>Ver Opciones de Traslado</span>
              <Icons.ArrowUpRight />
            </Link>
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
      <section id="seccion-transporte-fullscreen" className="bg-white py-10 px-6 text-center border-0">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className={`${bitter.className} text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold block`}>
            RUTAS DE LLEGADA
          </span>
          <h2 className={`${bitter.className} text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#071326]`}>
            Movilidad & Accesos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Explora cada opción en pantalla completa y toca el botón del respaldo para ver detalles de la ruta, mapa y coordinar tu servicio.
          </p>
        </div>
      </section>

      {/* ========================================================
          3. LAS CARDS FULL SCREEN SEGUIDAS (CON RESPALDO AL TAP)
          ======================================================== */}
      <div className="w-full flex flex-col">
        {RECOMENDACIONES_TRANSPORTE.map((item) => (
          <TransporteFullScreenCard key={item.id} item={item} />
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