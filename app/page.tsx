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
  ocupacion: string; // Nueva propiedad para la capacidad de huéspedes
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
}

// --- IMÁGENES DEL CARRUSEL PRINCIPAL (HERO) ---
const IMAGENES_HERO: string[] = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80", // Fachada / Entrada Principal
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80", // Vista de las Estancias
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"  // Atardecer / Áreas Exteriores
];

// --- 6 HABITACIONES PARA LA GRILLA RESPONSIVE CON CAPACIDAD ---
const HABITACIONES_GRILLA: Habitacion[] = [
  {
    id: "grid-1",
    titulo: "Habitación 1",
    descripcion: "Nuestra suite insignia con tina de hidromasaje exterior y vistas infinitas al valle.",
    imagen: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    precio: "Desde $450.000 COP",
    ocupacion: "Máx. 2 Adultos"
  },
  {
    id: "grid-2",
    titulo: "Habitación 2",
    descripcion: "Equilibrio perfecto entre arquitectura rústica y confort moderno, equipada con chimenea.",
    imagen: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    precio: "Desde $320.000 COP",
    ocupacion: "Máx. 2 Adultos + 1 Niño"
  },
  {
    id: "grid-3",
    titulo: "Habitación 3",
    descripcion: "Un espacio diseñado para el silencio, la lectura y la reconexión espiritual interior.",
    imagen: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    precio: "Desde $280.000 COP",
    ocupacion: "Máx. 2 Adultos"
  },
  {
    id: "grid-4",
    titulo: "Habitación 4",
    descripcion: "Cabaña independiente rodeada de pinos con terraza privada elevada sobre el dosel arbóreo.",
    imagen: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    precio: "Desde $310.000 COP",
    ocupacion: "Hasta 3 Personas"
  },
  {
    id: "grid-5",
    titulo: "Habitación 5",
    descripcion: "Orientada al oeste, ofrece los mejores espectáculos cromáticos del crepúsculo desde la cama.",
    imagen: "https://i.pinimg.com/1200x/7e/b6/59/7eb65949b3b6080676f46c10587f7820.jpg",
    precio: "Desde $380.000 COP",
    ocupacion: "Máx. 2 Adultos"
  },
  {
    id: "grid-6",
    titulo: "Habitación 6",
    descripcion: "Techos altos, luz natural cenital y texturas orgánicas inspiradas en la naturaleza local.",
    imagen: "https://i.pinimg.com/1200x/26/47/04/26470495ccdb95f5283a5a2ff9f50796.jpg",
    precio: "Desde $290.000 COP",
    ocupacion: "Familiar — Hasta 4 Personas"
  }
];

const PLANES: PlanHotel[] = [
  {
    id: "romantica",
    titulo: "Noche Romántica",
    subtitulo: "BASIC",
    descripcion: "Cena de tres tiempos a la luz de las velas servida en nuestra cava privada, una botella de champaña premium de bienvenida, arreglo de rosas frescas seleccionadas y acceso nocturno exclusivo al circuito hídrico del spa.",
    precio: "$250.000 COP / pareja",
    imagen: "https://i.pinimg.com/736x/6e/e5/6d/6ee56dc274682fb52d8986c70c816349.jpg",
    etiqueta: "EXPERIENCIA EXCLUSIVA"
  },
  {
    id: "madre",
    titulo: "Mes de la Madre",
    subtitulo: "CLASIC",
    descripcion: "Un homenaje al amor incondicional. Incluye masaje terapéutico corporal de 90 minutos con aceites esenciales florales en nuestro spa de montaña, brunch dominical ilimitado preparado por nuestro chef y un regalo botánico artesanal.",
    precio: "$190.000 COP / persona",
    imagen: "https://i.pinimg.com/736x/53/0e/d7/530ed71269d7970063d8d12596cbd559.jpg",
    etiqueta: "TEMPORADA ESPECIAL"
  },
  {
    id: "escapada",
    titulo: "Escapada de Finde",
    subtitulo: "PREMIUM",
    descripcion: "Desconéctate de la rutina urbana desde el viernes por la tarde. Disfruta de desayunos buffet artesanales a la carta, caminatas guiadas por el sendero ecológico privado de la Abadía y fogata con cata de vinos bajo las estrellas.",
    precio: "$320.000 COP / estancia",
    imagen: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    etiqueta: "DESCONEXIÓN TOTAL"
  }
];

const CASA: EspacioCasa[] = [
  { id: "casa-1", titulo: "El Lobby Principal", imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
  { id: "casa-4", titulo: "La Piscina de Calma", imagen: "https://i.pinimg.com/736x/5a/27/d9/5a27d98eb8014c3754af2a16af649e6a.jpg" },
  { id: "casa-6", titulo: "Zona de parqueo", imagen: "https://i.pinimg.com/736x/00/e2/d8/00e2d88dc3d58b815f6678eccc353832.jpg" },
];

const ENTRETENIMIENTO_LOCAL: ActividadLocal[] = [
  { id: "act-1", lugar: "Coveñas", titulo: "Playas de la Coquerita", imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { id: "act-2", lugar: "San Antero", titulo: "Bahía de Cispatá y Manglares", imagen: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80" },
  { id: "act-3", lugar: "San Antero", titulo: "Mirador de la Guitarra", imagen: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80" }
];

export default function HomePage() {
  const [heroActivo, setHeroActivo] = useState<number>(0);
  const [planActivo, setPlanActivo] = useState<string>("romantica");
  const [logoError, setLogoError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [habitacionConPrecio, setHabitacionConPrecio] = useState<string | null>(null);

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

  const manejarCardClick = (id: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') return;
    setHabitacionConPrecio(prev => (prev === id ? null : id));
  };

  const hacerScrollASeccion = (idSeccion: string) => {
    setMenuAbierto(false);
    const elem = document.getElementById(idSeccion);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const planSeleccionado = PLANES.find(p => p.id === planActivo) || PLANES[0];

  return (
    <main className="min-h-screen bg-white text-[#3d342e] antialiased selection:bg-[#f4f1ea] selection:text-[#3d342e]" style={{ fontFamily: "'Raleway', sans-serif" }}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700;800&display=swap');
        body {
          font-family: 'Raleway', sans-serif;
        }
      `}</style>

      {/* --- BOTÓN HAMBURGUESA FIJO --- */}
      <nav className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="bg-white/80 backdrop-blur-md p-4 rounded-full shadow-md border border-[#f4f1ea] flex flex-col justify-center items-center gap-1.5 w-12 h-12 active:scale-95 transition-all"
          aria-label="Abrir Menú"
        >
          <span className={`h-[2px] w-5 bg-[#3d342e] rounded-full transition-all duration-300 ${menuAbierto ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`h-[2px] w-5 bg-[#3d342e] rounded-full transition-all duration-300 ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`h-[2px] w-5 bg-[#3d342e] rounded-full transition-all duration-300 ${menuAbierto ? '-rotate-45 translate-y-[-4px]' : ''}`} />
        </button>
      </nav>

      {/* --- PANEL LATERAL DEL MENÚ --- */}
      <div className={`fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-white shadow-2xl p-8 flex flex-col justify-between border-l border-[#f4f1ea] transition-transform duration-500 ease-out ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-16">
          <span className="text-[10px] uppercase tracking-widest text-[#3d342e]/50 font-bold block mb-8">— Navegación</span>
          <ul className="flex flex-col gap-6 text-lg font-bold text-[#3d342e]">
            <li className="cursor-pointer hover:text-neutral-500 transition-colors" onClick={() => hacerScrollASeccion('habitaciones')}>Habitaciones</li>
            <li className="cursor-pointer hover:text-neutral-500 transition-colors" onClick={() => hacerScrollASeccion('planes')}>Planes y Precios</li>
            <li className="cursor-pointer hover:text-neutral-500 transition-colors" onClick={() => hacerScrollASeccion('casa')}>Conoce Abadía</li>
            <li className="cursor-pointer hover:text-neutral-500 transition-colors" onClick={() => window.location.href = '/medios-de-pago'}>Medios de Pago</li>
            <li className="cursor-pointer hover:text-neutral-500 transition-colors" onClick={() => window.location.href = '/terminos'}>Términos y Condiciones</li>
          </ul>
        </div>
        <div className="text-[10px] text-neutral-400 font-medium tracking-wide">
          © 2026 Abadía Hotel Boutique.
        </div>
      </div>

      {/* 1. HERO SECTION WITH IMAGE CAROUSEL & FLOATING LOGO */}
      <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
        <div className="absolute top-12 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="relative w-64 h-24 md:w-80 md:h-32 flex items-center justify-center">
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
            <div className={`text-center absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${logoError ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="tracking-[0.35em] text-white text-4xl md:text-5xl uppercase block font-bold">
                Abadía
              </span>
              <span className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-neutral-200 block mt-2 font-semibold">
                Hotel Boutique
              </span>
            </div>
          </div>
        </div>

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

        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center px-4">
          <button className="bg-white text-neutral-900 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#f4f1ea] hover:scale-[1.03] active:scale-[0.98] rounded-full shadow-lg border border-transparent">
            Reservar Ahora
          </button>
        </div>
      </section>

      {/* --- 2. CINTURÓN PROMOCIONAL ENTRE EL CARRUSEL Y LAS HABITACIONES --- */}
      <section className="bg-[#f4f1ea] py-10 px-4 text-center border-y border-[#e6dfd1]/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-3xl font-extrabold tracking-widest text-[#3d342e] uppercase">
            Desconéctate desde $70.000 COP la noche
          </h3>
          <p className="text-neutral-500 text-xs mt-1 tracking-widest font-medium uppercase">
            Disfruta del caribe y del descanso que mereces
          </p>
        </div>
      </section>

      {/* --- 3. SECCIÓN: GRILLA DE HABITACIONES INTERACTIVA (3x2) --- */}
      <section id="habitaciones" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#3d342e]/60 font-bold block mb-3">
              — Estancias de Ensueño
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#3d342e] uppercase">
              Conoce las Habitaciones
            </h2>
            <div className="w-12 h-[3px] bg-[#3d342e] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {HABITACIONES_GRILLA.map((hab) => {
              const mostrarPrecio = habitacionConPrecio === hab.id;
              return (
                <div
                  key={hab.id}
                  onClick={(e) => manejarCardClick(hab.id, e)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-[#f4f1ea] rounded-2xl shadow-sm group cursor-pointer border border-[#f4f1ea]"
                >
                  <Image
                    src={hab.imagen}
                    alt={hab.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent z-10" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className="text-xl md:text-2xl font-bold tracking-wide mb-2">
                      {hab.titulo}
                    </h3>
                    <p className="text-neutral-200 text-xs font-light line-clamp-2 leading-relaxed opacity-90">
                      {hab.descripcion}
                    </p>
                  </div>

                  {/* REVERSO DE LA CARD CON LOGO SUPERIOR Y OCUPACIÓN */}
                  <div className={`absolute inset-0 bg-[#f4f1ea] z-20 flex flex-col justify-between p-6 text-center transition-all duration-500 ${mostrarPrecio ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    
                    {/* PARTE SUPERIOR: LOGO DE ABADÍA */}
                    <div className="w-full flex flex-col items-center border-b border-[#3d342e]/10 pb-3">
                      <div className="relative w-24 h-8 flex items-center justify-center">
                        {!logoError ? (
                          <Image 
                            src="/logo.png" 
                            alt="Logo Abadía" 
                            fill
                            className="object-contain"
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <span className="text-xs tracking-[0.2em] text-[#3d342e] font-bold uppercase">
                            Abadía
                          </span>
                        )}
                      </div>
                      {/* OCUPACIÓN DESTACADA */}
                      <span className="text-[9px] uppercase tracking-widest bg-[#3d342e]/10 text-[#3d342e] px-2.5 py-1 rounded-full font-bold mt-2">
                        {hab.ocupacion}
                      </span>
                    </div>

                    {/* CUERPO: DESCRIPCIÓN */}
                    <div className="flex-1 flex items-center justify-center py-2">
                      <p className="text-[#3d342e] text-xs md:text-sm font-medium leading-relaxed px-1">
                        {hab.descripcion}
                      </p>
                    </div>

                    {/* TARIFAS */}
                    <div className="mb-4">
                      <span className="text-[9px] uppercase tracking-widest text-[#3d342e]/50 block mb-0.5 font-bold">Tarifa Especial</span>
                      <p className="text-xl font-extrabold text-[#3d342e]">{hab.precio}</p>
                      <p className="text-[10px] font-bold text-[#3d342e]/80 tracking-wide mt-0.5">¡Desde 70 mil la noche!</p>
                    </div>

                    {/* BOTONES DE LLAMADO A LA ACCIÓN */}
                    <div className="flex flex-col gap-2 w-full">
                      <button onClick={() => window.location.href = `/reservar?room=${hab.id}`} className="w-full bg-[#3d342e] text-white py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-sm hover:bg-neutral-800 transition-all">Reservar Ya</button>
                      <button onClick={() => window.location.href = `/galeria?room=${hab.id}`} className="w-full bg-white text-[#3d342e] border border-[#3d342e]/20 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#fbf9f4] transition-all">Ver Fotos</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => window.location.href = '/habitaciones'}
              className="bg-[#3d342e] text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] rounded-full shadow-md hover:bg-neutral-800 transition-all"
            >
              Ver Precios
            </button>
          </div>
        </div>
      </section>

      {/* 4. VIDEO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full z-0">
          {isMounted && (
            <video autoPlay loop muted playsInline controls={false} className="w-full h-full object-cover opacity-90">
              <source src="/13597489-hd_1920_1080_30fps.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </section>

      {/* 5. SECCIÓN: CONOCE LA CASA */}
      <section id="casa" className="py-28 px-4 bg-white border-b border-[#f4f1ea]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#3d342e]/60 font-bold block mb-2">— Rincones Comunes</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#3d342e] uppercase">Conoce la Casa</h2>
            <div className="w-12 h-[3px] bg-[#3d342e] mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-4">
            {CASA.map((item) => (
              <div key={item.id} className="relative aspect-[4/5] overflow-hidden bg-[#f4f1ea] group cursor-pointer rounded-2xl shadow-sm">
                <Image src={item.imagen} alt={item.titulo} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 z-10">
                  <p className="text-white text-lg tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 font-bold">{item.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN DE PLANES INTERACTIVOS */}
      <section id="planes" className="py-28 px-4 bg-[#f4f1ea] relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3d342e]/60 font-bold block mb-2">— EXPERIENCIAS DISPONIBLES</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#3d342e] uppercase">Nuestros Planes</h2>
            <div className="w-12 h-[3px] bg-[#3d342e] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-lg mx-auto">
            {PLANES.map((plan) => (
              <button 
                key={plan.id}
                onClick={() => setPlanActivo(plan.id)}
                className={`flex-1 min-w-[120px] py-3.5 text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-300 shadow-sm rounded-xl ${planActivo === plan.id ? 'bg-[#3d342e] text-white' : 'bg-white text-[#3d342e]/70 hover:text-[#3d342e]'}`}
              >
                {plan.id === 'romantica' ? 'Romántica' : plan.id === 'madre' ? 'Mamá' : 'Escapada'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-neutral-100 flex flex-col md:flex-row gap-8 md:gap-10 items-stretch transition-all duration-500">
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-md">
              <Image src={planSeleccionado.imagen} alt={planSeleccionado.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-102" />
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] uppercase tracking-[0.2em] bg-[#f4f1ea] text-[#3d342e] px-3 py-1.5 rounded-full font-bold shadow-sm">{planSeleccionado.etiqueta}</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">ABADÍA RESORT</span>
                <h3 className="text-3xl md:text-4xl font-extrabold text-[#3d342e] mb-2">{planSeleccionado.titulo}</h3>
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-6 font-bold">{planSeleccionado.subtitulo}</p>
                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-light mb-8">{planSeleccionado.descripcion}</p>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase mb-0.5">Tarifa Especial</span>
                  <span className="text-xl md:text-2xl font-extrabold text-neutral-900">{planSeleccionado.precio}</span>
                </div>
                <button className="bg-[#3d342e] text-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-800 transition-all">Reservar Experiencia</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NUEVA SECCIÓN FINAL: QUÉ HACER EN SAN ANTERO Y COVEÑAS --- */}
      <section id="turismo" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#3d342e]/60 font-bold block mb-3">
              — Guía de Destino
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#3d342e] uppercase">
              Qué hacer en San Antero y Coveñas
            </h2>
            <div className="w-12 h-[3px] bg-[#3d342e] mx-auto mt-4 rounded-full"></div>
            <p className="text-neutral-400 text-xs mt-3 font-medium tracking-wider">
              Descubre los paraísos mágicos e inolvidables que rodean nuestra casa hotel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ENTRETENIMIENTO_LOCAL.map((item) => (
              <div key={item.id} className="relative aspect-[4/5] overflow-hidden rounded-2xl group shadow-sm border border-[#f4f1ea]">
                <Image 
                  src={item.imagen}
                  alt={item.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {item.lugar}
                  </span>
                  <h3 className="text-xl font-bold tracking-wide mt-3">
                    {item.titulo}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}