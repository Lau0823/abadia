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
  )
};

const RECOMENDACIONES_TRANSPORTE = [
  {
    id: "transfer-tolu",
    numero: "01",
    titulo: "Transfer Privado desde Aeropuerto de Tolú (TLU)",
    duracion: "25 minutos de recorrido",
    tipo: "Camioneta SUV Privada con Aire Acondicionado",
    precio: "Desde $120.000 COP por trayecto",
    descripcion: "La terminal aérea más cercana a Casa Abadía con vuelos directos diarios desde Medellín y Bogotá. Nuestro conductor te espera en la sala de llegadas con identificación personalizada y equipaje asistido.",
    beneficios: [
      "Monitoreo de vuelo en tiempo real",
      "Capacidad hasta 4 pasajeros con equipaje de bodega",
      "Agua mineral fría y toallas refrescantes a bordo",
      "Ruta directa por vía asfaltada costera"
    ],
    imagen: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "transfer-monteria",
    numero: "02",
    titulo: "Transfer Privado desde Aeropuerto de Montería (MTR)",
    duracion: "1 hora y 15 minutos",
    tipo: "Camioneta Familiar / Van Ejecutiva",
    precio: "Desde $230.000 COP por trayecto",
    descripcion: "El aeropuerto Los Garzones de Montería cuenta con mayor oferta de aerolíneas y horarios nacionales. Ofrecemos traslados sin esperas en vehículos modernos con conductores certificados.",
    beneficios: [
      "Disponible las 24 horas con reserva previa",
      "Vehículos amplios para familias o grupos de hasta 6 personas",
      "Seguro contractual de pasajeros incluido",
      "Parada opcional en miradores o tiendas tradicionales"
    ],
    imagen: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "llegada-vehiculo",
    numero: "03",
    titulo: "Llegada en Vehículo Propio o Alquilado",
    duracion: "Acceso pavimentado total",
    tipo: "Parqueadero Privado & Cerrado",
    precio: "Cortesía para Huéspedes",
    descripcion: "Si viajas en tu propio carro, la carretera desde Coveñas o Lorica se encuentra en óptimas condiciones. Contamos con parqueadero privado, cerrado dentro de la propiedad y con vigilancia permanente.",
    beneficios: [
      "Espacio cubierto para vehículos y camionetas",
      "Vigilancia física 24/7 y cámaras de seguridad",
      "Ubicación exacta compartida en Waze y Google Maps",
      "Asistencia de equipaje al momento del check-in"
    ],
    imagen: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "lancha-maritimo",
    numero: "04",
    titulo: "Traslados Náuticos & Excursiones en Lancha",
    duracion: "A convenir según destino",
    tipo: "Embarcación Rápida con Chalecos Salvavidas",
    precio: "Tarifa personalizada",
    descripcion: "Zarpa directamente desde la orilla de nuestro hotel hacia las Islas de San Bernardo (Tintipán, Múcura) o hacia los muelles de Cispatá con capitanes nativos de amplia experiencia.",
    beneficios: [
      "Embarque directo frente a las instalaciones",
      "Chalecos certificados y permiso de Capitanía de Puerto",
      "Capacidad para parejas o grupos familiares",
      "Nevera con hielo y bebidas a bordo"
    ],
    imagen: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function PaginaTransporte() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const coordinarTransporte = (ruta: string) => {
    const msj = encodeURIComponent(`Hola! Quiero coordinar servicio de transporte / transfer hacia Abadía Casa Hotel: ${ruta}`);
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
          src="/caimanera.png"
          alt="Rutas y Transporte hacia Abadía Casa Hotel"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45 pointer-events-none" />

        <div className="relative z-20 max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/80 font-bold block">
            Playa Blanca • San Antero, Córdoba
          </span>
          <h1 className="text-3xl sm:text-6xl font-semibold uppercase tracking-wide text-white drop-shadow-lg">
            Cómo Llegar & Transporte
          </h1>
          <p className="text-xs sm:text-base text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
            Tu viaje hacia la calma debe ser placentero desde el primer kilómetro. Coordinamos tu transfer privado puerta a puerta.
          </p>

          <div className="pt-2">
            <button
              onClick={() => coordinarTransporte("Transfer General Aeropuerto")}
              className="bg-[#8c7355] hover:bg-[#735e45] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Coordinar Chofer en WhatsApp</span>
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
            — RUTAS DE LLEGADA
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Opciones de Movilidad y Accesos
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Aeropuertos recomendados, vías pavimentadas y servicio exclusivo de traslados náuticos y terrestres.
          </p>
        </div>
      </section>

      {/* ========================================================
          2. RECOMENDACIONES DEBAJO DEL BANNER
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
        <div className="space-y-8 text-left">
          {RECOMENDACIONES_TRANSPORTE.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-[#E8DDD0] shadow-md flex flex-col lg:flex-row items-center justify-between gap-8 hover:shadow-xl transition-all"
            >
              <div className="relative w-full lg:w-72 h-48 rounded-2xl overflow-hidden bg-black shrink-0">
                <Image src={item.imagen} alt={item.titulo} fill unoptimized className="object-cover" />
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#FAF7F2] text-[#8c7355] border border-[#E8DDD0] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    ⏱️ {item.duracion}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    🚘 {item.tipo}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold uppercase text-stone-900">
                  {item.titulo}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  {item.descripcion}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {item.beneficios.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                      <span className="text-[#8c7355] font-bold">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 text-left lg:text-right w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Tarifa Referencial</span>
                  <span className="text-xl font-semibold text-stone-900">{item.precio}</span>
                </div>

                <button
                  onClick={() => coordinarTransporte(item.titulo)}
                  className="bg-[#8c7355] hover:bg-[#735e45] text-white px-7 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer text-center active:scale-95"
                >
                  Solicitar Transfer
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