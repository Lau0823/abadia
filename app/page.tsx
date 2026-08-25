'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// --- INTERFACES DE DATOS ---
interface Habitacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  precio: string;
  ocupacion: string;
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

interface ActividadLocal {
  id: string;
  titulo: string;
  lugar: string;
  imagen: string;
  precioDesde: string;
}

// --- IMÁGENES DEL CARRUSEL PRINCIPAL (HERO) ---
const IMAGENES_HERO: string[] = [
  "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg", 
  "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", 
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"  
];

// --- VIDEOS DEL CARRUSEL CENTRAL ---
const VIDEOS_SECCION: string[] = [
  "/121015.mp4",
  "/121016.mp4"
];

// --- HABITACIONES ---
const HABITACIONES_GRILLA: Habitacion[] = [
  { id: "grid-1", titulo: "Habitación 1", descripcion: "Nuestra suite insignia con tina de hidromasaje exterior y vistas infinitas al valle.", imagen: "/121017.jpg", precio: "Desde $450.000 COP", ocupacion: "Máx. 2 Adultos" },
  { id: "grid-2", titulo: "Habitación 2", descripcion: "Equilibrio perfecto entre arquitectura rústica y confort moderno, equipada con chimenea.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg", precio: "Desde $320.000 COP", ocupacion: "Máx. 2 Adultos + 1 Niño" },
  { id: "grid-3", titulo: "Habitación 3", descripcion: "Un espacio diseñado para el silencio, la lectura y la reconexión espiritual interior.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.43.jpeg", precio: "Desde $280.000 COP", ocupacion: "Máx. 2 Adultos" },
  { id: "grid-4", titulo: "Habitación 4", descripcion: "Cabaña independiente rodeada de pinos con terraza privada elevada sobre el dosel arbóreo.", imagen: "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", precio: "Desde $310.000 COP", ocupacion: "Hasta 3 Personas" },
  { id: "grid-5", titulo: "Habitación 5", descripcion: "Orientada al oeste, ofrece los mejores espectáculos cromáticos del crepúsculo desde la cama.", imagen: "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", precio: "Desde $380.000 COP", ocupacion: "Máx. 2 Adultos" },
  { id: "grid-6", titulo: "Habitación 6", descripcion: "Techos altos, luz natural cenital y texturas orgánicas inspiradas en la naturaleza local.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.44.jpeg", precio: "Desde $290.000 COP", ocupacion: "Familiar — Hasta 4 Personas" }
];

const PLANES: PlanHotel[] = [
  { id: "romantica", titulo: "Noche Romántica", subtitulo: "BASIC", descripcion: "Cena de tres tiempos a la luz de las velas servida en nuestra cava privada, una botella de champaña premium de bienvenida y acceso exclusivo al spa.", precio: "$250.000 COP / pareja", imagen: "https://i.pinimg.com/736x/6e/e5/6d/6ee56dc274682fb52d8986c70c816349.jpg", etiqueta: "EXPERIENCIA EXCLUSIVA" },
  { id: "madre", titulo: "Mes de la Madre", subtitulo: "CLASIC", descripcion: "Un homenaje al amor incondicional. Incluye masaje terapéutico corporal de 90 minutos con aceites esenciales florales en nuestro spa y brunch dominical.", precio: "$190.000 COP / persona", imagen: "https://i.pinimg.com/736x/53/0e/d7/530ed71269d7970063d8d12596cbd559.jpg", etiqueta: "TEMPORADA ESPECIAL" },
  { id: "escapada", titulo: "Escapada de Finde", subtitulo: "PREMIUM", descripcion: "Desconéctate de la rutina urbana desde el viernes por la tarde. Disfruta de desayunos buffet artesanales a la carta y caminatas guiadas privadas.", precio: "$320.000 COP / estancia", imagen: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80", etiqueta: "DESCONEXIÓN TOTAL" }
];

const CASA: EspacioCasa[] = [
  { id: "casa-1", titulo: "El Lobby Principal", imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
  { id: "casa-4", titulo: "La Piscina de Calma", imagen: "https://i.pinimg.com/736x/5a/27/d9/5a27d98eb8014c3754af2a16af649e6a.jpg" },
  { id: "casa-6", titulo: "Zona de parqueo", imagen: "https://i.pinimg.com/736x/00/e2/d8/00e2d88dc3d58b815f6678eccc353832.jpg" },
];

const ENTRETENIMIENTO_LOCAL: ActividadLocal[] = [
  { id: "act-1", lugar: "Coveñas", titulo: "Playas de la Coquerita", imagen: "https://i.pinimg.com/736x/7e/49/82/7e4982b5eceb9ddd9cbb78b3be98bcf5.jpg", precioDesde: "$45.000 COP" },
  { id: "act-2", lugar: "San Antero", titulo: "Bahía de Cispatá y Manglares", imagen: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80", precioDesde: "$60.000 COP" },
  { id: "act-3", lugar: "San Antero", titulo: "Mirador de la Guitarra", imagen: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80", precioDesde: "Entrada Libre" }
];

export default function HomePage() {
  const [heroActivo, setHeroActivo] = useState<number>(0);
  const [planActivo, setPlanActivo] = useState<string>("romantica");
  const [logoError, setLogoError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [habitacionConPrecio, setHabitacionConPrecio] = useState<string | null>(null);

  // Estado carrusel habitaciones
  const [indiceHabitacion, setIndiceHabitacion] = useState<number>(0);
  const [itemsVisibles, setItemsVisibles] = useState<number>(3);

  // Estado carrusel de videos central
  const [videoActivo, setVideoActivo] = useState<number>(0);

  // Estados Formulario Reservas
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [huespedes, setHuespedes] = useState<string>('2 Huéspedes');

  useEffect(() => {
    setIsMounted(true);

    const calcularVisibles = () => {
      if (window.innerWidth < 640) {
        setItemsVisibles(1);
      } else if (window.innerWidth < 1024) {
        setItemsVisibles(2);
      } else {
        setItemsVisibles(3);
      }
    };

    calcularVisibles();
    window.addEventListener('resize', calcularVisibles);
    return () => window.removeEventListener('resize', calcularVisibles);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const intervaloHero = setInterval(() => {
      setHeroActivo((prev) => (prev + 1) % IMAGENES_HERO.length);
    }, 6000);
    return () => clearInterval(intervaloHero);
  }, [isMounted]);

  const activarVolteoCard = (id: string) => {
    setHabitacionConPrecio(habitacionConPrecio === id ? null : id);
  };

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

  const maxIndice = Math.max(0, HABITACIONES_GRILLA.length - itemsVisibles);

  const habAnterior = () => {
    setIndiceHabitacion((prev) => (prev <= 0 ? maxIndice : prev - 1));
  };

  const habSiguiente = () => {
    setIndiceHabitacion((prev) => (prev >= maxIndice ? 0 : prev + 1));
  };

  const videoAnterior = () => {
    setVideoActivo((prev) => (prev === 0 ? VIDEOS_SECCION.length - 1 : prev - 1));
  };

  const videoSiguiente = () => {
    setVideoActivo((prev) => (prev === VIDEOS_SECCION.length - 1 ? 0 : prev + 1));
  };

  const planSeleccionado = PLANES.find(p => p.id === planActivo) || PLANES[0];

  if (!isMounted) {
    return <div className="min-h-screen bg-[#f7f4ee]" />;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#3c2f27] antialiased selection:bg-[#c4a482]/20 style-font-override">
      
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
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('habitaciones')}>Habitaciones</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('casa')}>Conoce la Casa</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('planes')}>Planes y Precios</li>
            <li className="cursor-pointer hover:text-[#8c7355] transition-colors" onClick={() => hacerScrollASeccion('turismo')}>Entorno Local</li>
          </ul>
        </div>
        <div className="text-[10px] text-[#3c2f27]/70 font-medium tracking-wide">© 2026 Abadía Hotel Boutique.</div>
      </div>

      {/* 1. HERO SECTION */}
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

      {/* 2. CINTURÓN PROMOCIONAL */}
      <section className="bg-[#efebe4] py-14 px-4 text-center border-y border-[#d6c7b2]/40">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-3xl font-light tracking-[0.1em] text-[#3c2f27] uppercase leading-tight font-luxury-title">
            Desconéctate desde <span className="font-editorial-italic text-[#3c2f27] font-normal lowercase tracking-normal">$70.000 cop</span> la noche
          </h3>
          <p className="text-[#3c2f27] text-[10px] mt-2 tracking-[0.3em] uppercase font-light">
            Tu refugio de paz en la costa de San Antero y Coveñas
          </p>
        </div>
      </section>

      {/* 3. SECCIÓN HABITACIONES CON CARRUSEL CORREGIDO */}
      <section id="habitaciones" className="py-24 px-4 md:px-8 bg-[#f7f4ee] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 select-none gap-6">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#3c2f27] font-medium block mb-2">— HABITACIONES</span>
              <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col">
                <span className="font-luxury-title tracking-tight">Estancias de</span>
                <span className="font-luxury-script text-5xl md:text-8xl text-[#3c2f27] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Ensueño</span>
              </h2>
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto">
              <button 
                onClick={habAnterior}
                className="w-12 h-12 rounded-full border border-[#3c2f27]/20 flex items-center justify-center text-[#3c2f27] hover:bg-[#3c2f27] hover:text-[#efebe4] hover:border-[#3c2f27] transition-all duration-300 active:scale-90"
                aria-label="Habitación anterior"
              >
                ←
              </button>
              <button 
                onClick={habSiguiente}
                className="w-12 h-12 rounded-full border border-[#3c2f27]/20 flex items-center justify-center text-[#3c2f27] hover:bg-[#3c2f27] hover:text-[#efebe4] hover:border-[#3c2f27] transition-all duration-300 active:scale-90"
                aria-label="Habitación siguiente"
              >
                →
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out gap-6"
              style={{ transform: `translateX(calc(-${indiceHabitacion} * (100% / ${itemsVisibles} + ${(24 * (itemsVisibles - 1)) / itemsVisibles}px)))` }}
            >
              {HABITACIONES_GRILLA.map((hab) => {
                const tarjetaVolteada = habitacionConPrecio === hab.id;
                return (
                  <div key={hab.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0">
                    <div className="relative aspect-[4/5] w-full bg-[#efebe4] rounded-[2.5rem] shadow-sm overflow-hidden border border-[#d6c7b2]/40 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl hover:border-[#3c2f27] group">
                      
                      <div className={`absolute inset-0 w-full h-full p-8 flex flex-col justify-end transition-all duration-500 ease-in-out ${tarjetaVolteada ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'}`}>
                        <Image src={hab.imagen} alt={hab.titulo} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#241b14]/90 via-[#241b14]/20 to-transparent z-10" />
                        
                        <div className="relative z-20 text-[#efebe4] text-left">
                          <span className="text-[9px] font-medium uppercase tracking-widest bg-[#efebe4]/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 group-hover:bg-[#efebe4] group-hover:text-[#3c2f27] transition-all">
                            {hab.ocupacion}
                          </span>
                          <h3 className="text-2xl font-light tracking-wide mt-3 mb-1 uppercase font-luxury-title group-hover:text-[#d6c7b2] transition-colors">
                            {hab.titulo}
                          </h3>
                          <p className="text-[#d6c7b2] text-xs font-light tracking-wider mb-4">{hab.precio} / noche</p>
                          <button 
                            onClick={() => activarVolteoCard(hab.id)}
                            className="bg-[#efebe4]/15 backdrop-blur-sm text-[#efebe4] text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl border border-white/20 w-full hover:bg-[#efebe4] hover:text-[#3c2f27] hover:border-[#efebe4] transition-all duration-300 font-medium"
                          >
                            Descubrir Habitación
                          </button>
                        </div>
                      </div>

                      <div className={`absolute inset-0 bg-[#3c2f27] z-20 flex flex-col justify-between p-8 text-center transition-all duration-500 ease-in-out ${tarjetaVolteada ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        
                        <div className="w-full flex flex-col items-center border-b border-[#d6c7b2]/20 pb-3">
                          <div className="relative w-36 h-12 flex items-center justify-center filter brightness-0 invert opacity-90">
                            <Image src="/logo.png" alt="Logo Abadía" fill sizes="(max-width: 768px) 150px, 150px" className="object-contain" />
                          </div>
                          <span className="text-[9px] uppercase tracking-widest bg-[#efebe4]/15 text-[#d6c7b2] px-3 py-1 rounded-full font-medium mt-2 border border-[#d6c7b2]/30">
                            {hab.ocupacion}
                          </span>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3 py-2 flex-1">
                          <p className="text-[#efebe4]/90 text-xs font-light leading-relaxed px-1 text-left">{hab.descripcion}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left w-full max-w-[220px] mx-auto pt-3 border-t border-[#d6c7b2]/20 text-[#d6c7b2] font-light text-[11px]">
                            <span>❄️ Nevera pequeña</span>
                            <span>🛁 Baño privado</span>
                            <span>📺 Smart TV</span>
                            <span>📶 WiFi Libre</span>
                          </div>
                        </div>

                        <div className="mb-4 bg-black/20 py-2.5 rounded-2xl border border-white/10">
                          <span className="text-[9px] uppercase tracking-widest text-[#d6c7b2] block font-medium">Reserva</span>
                          <p className="text-xl font-light text-[#efebe4] font-luxury-title">{hab.precio}</p>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => window.location.href = `/reservar?room=${hab.id}`} className="bg-[#efebe4] text-[#3c2f27] py-3 text-[9px] uppercase tracking-widest rounded-xl hover:bg-[#d6c7b2] transition-all font-medium">Reservar</button>
                            <button onClick={() => window.location.href = '/habitaciones'} className="bg-transparent text-[#efebe4] border border-[#efebe4]/20 py-3 text-[9px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all font-medium">Ver Fotos</button>
                          </div>
                          <button onClick={() => activarVolteoCard(hab.id)} className="text-[9px] uppercase tracking-widest text-[#d6c7b2]/60 font-light underline py-1 hover:text-[#efebe4]">Cerrar</button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <button onClick={() => window.location.href = '/habitaciones'} className="bg-[#efebe4] text-[#3c2f27] border border-[#3c2f27]/20 px-10 py-4 text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-[#3c2f27] hover:text-[#efebe4] hover:border-[#3c2f27] transition-all duration-300">
              Ver al detalle
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN VIDEO INTERACTIVO CON CARRUSEL DE VIDEOS Y FLECHAS */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black group">
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
        
        {/* VIDEOS */}
        <div className="absolute inset-0 w-full h-full z-0">
          {VIDEOS_SECCION.map((videoSrc, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === videoActivo ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                controls={false} 
                className="w-full h-full object-cover opacity-85"
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        {/* CONTROLES CON FLECHAS EN EL VIDEO */}
        <div className="absolute inset-y-0 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button 
            onClick={videoAnterior}
            className="w-12 h-12 rounded-full bg-[#efebe4]/20 backdrop-blur-md border border-white/30 text-[#efebe4] flex items-center justify-center hover:bg-[#3c2f27] hover:text-[#efebe4] hover:border-[#3c2f27] transition-all duration-300 pointer-events-auto shadow-lg active:scale-90"
            aria-label="Video anterior"
          >
            ←
          </button>
          <button 
            onClick={videoSiguiente}
            className="w-12 h-12 rounded-full bg-[#efebe4]/20 backdrop-blur-md border border-white/30 text-[#efebe4] flex items-center justify-center hover:bg-[#3c2f27] hover:text-[#efebe4] hover:border-[#3c2f27] transition-all duration-300 pointer-events-auto shadow-lg active:scale-90"
            aria-label="Video siguiente"
          >
            →
          </button>
        </div>

        {/* INDICADORES DEL CARRUSEL DE VIDEO */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
          {VIDEOS_SECCION.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setVideoActivo(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === videoActivo ? 'w-8 bg-[#efebe4]' : 'w-2 bg-[#efebe4]/40'}`}
              aria-label={`Ir al video ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 5. CONOCE LA CASA */}
      <section id="casa" className="py-24 px-4 md:px-8 bg-[#f7f4ee] border-b border-[#efebe4]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3c2f27] font-medium block mb-2">— NUESTROS ESPACIOS</span>
            <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col">
              <span className="font-luxury-title tracking-tight">Conoce la</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#3c2f27] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Casa hotel</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {CASA.map((item) => (
              <div key={item.id} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#efebe4] shadow-sm border border-[#d6c7b2]/40 transition-transform duration-500 hover:scale-[1.01] hover:border-[#3c2f27] group cursor-pointer">
                <Image src={item.imagen} alt={item.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241b14]/80 via-[#241b14]/20 to-transparent p-8 z-10 text-left flex items-end">
                  <p className="text-[#efebe4] text-xl font-light tracking-wide uppercase font-luxury-title group-hover:text-[#d6c7b2] transition-colors">
                    {item.titulo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN DE PLANES INTERACTIVOS */}
      <section id="planes" className="py-24 px-4 bg-[#efebe4]/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12 select-none">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3c2f27] font-medium block mb-2">— EXPERIENCIAS</span>
            <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col items-center">
              <span className="font-luxury-title tracking-tight">Nuestros</span>
              <span className="font-luxury-script text-4xl md:text-7xl text-[#3c2f27] capitalize -mt-2 md:-mt-5 normal-case tracking-normal">Planes</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-md mx-auto">
            {PLANES.map((plan) => (
              <button 
                key={plan.id}
                onClick={() => setPlanActivo(plan.id)}
                className={`flex-1 min-w-[140px] py-3 text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 ${planActivo === plan.id ? 'bg-[#3c2f27] text-[#efebe4] shadow-sm' : 'bg-[#f7f4ee] text-[#3c2f27]/70 hover:text-[#3c2f27] hover:bg-[#efebe4]'}`}
              >
                {plan.id === 'romantica' ? 'Romántica' : plan.id === 'madre' ? 'Mamá' : 'Escapada'}
              </button>
            ))}
          </div>

          <div className="bg-[#f7f4ee] rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-[#d6c7b2]/40 flex flex-col md:flex-row gap-8 md:gap-10 items-stretch hover:border-[#3c2f27] transition-all">
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden">
              <Image src={planSeleccionado.imagen} alt={planSeleccionado.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] uppercase tracking-widest bg-[#efebe4] text-[#3c2f27] px-3 py-1.5 rounded-full font-medium shadow-sm">{planSeleccionado.etiqueta}</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between py-2 text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#3c2f27] block mb-2 font-medium">ABADÍA RESORT</span>
                <h3 className="text-2xl font-light uppercase text-[#3c2f27] font-luxury-title mb-1">{planSeleccionado.titulo}</h3>
                <p className="text-[10px] tracking-widest uppercase text-[#3c2f27]/70 mb-5 font-light">{planSeleccionado.subtitulo}</p>
                <p className="text-[#3c2f27]/90 text-xs font-light leading-relaxed mb-6">{planSeleccionado.descripcion}</p>
              </div>

              <div>
                <div className="mb-6 pt-4 border-t border-[#d6c7b2]/30">
                  <span className="text-[9px] uppercase tracking-widest text-[#3c2f27]/60 block mb-1">Inversión</span>
                  <p className="text-2xl font-light text-[#3c2f27] font-luxury-title">{planSeleccionado.precio}</p>
                </div>
                <button 
                  onClick={() => window.location.href = `/reservar?plan=${planSeleccionado.id}`}
                  className="w-full bg-[#3c2f27] text-[#efebe4] hover:bg-[#efebe4] hover:text-[#3c2f27] border border-[#3c2f27] py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md"
                >
                  Reservar Experiencia
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. ENTORNO LOCAL / TURISMO */}
      <section id="turismo" className="py-24 px-4 md:px-8 bg-[#f7f4ee]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3c2f27] font-medium block mb-2">— ALREDEDORES</span>
            <h2 className="text-4xl md:text-6xl text-[#3c2f27] uppercase leading-none flex flex-col">
              <span className="font-luxury-title tracking-tight">Explora el</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#3c2f27] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Entorno</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {ENTRETENIMIENTO_LOCAL.map((act) => (
              <div key={act.id} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#efebe4] border border-[#d6c7b2]/40 group cursor-pointer hover:scale-[1.01] transition-all">
                <Image src={act.imagen} alt={act.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241b14]/90 via-[#241b14]/20 to-transparent p-8 z-10 flex flex-col justify-end text-left">
                  <span className="text-[9px] uppercase tracking-widest text-[#d6c7b2] block mb-1 font-medium">{act.lugar}</span>
                  <h3 className="text-xl font-light uppercase text-[#efebe4] font-luxury-title mb-2">{act.titulo}</h3>
                  <p className="text-xs text-[#d6c7b2] font-light tracking-wider">{act.precioDesde}</p>
                </div>
              </div>
            ))}
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

    </main>
  );
}