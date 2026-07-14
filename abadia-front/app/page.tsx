'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useHabitacionesStore } from '../store/habitacionesStore';

// --- INTERFACES DE DATOS ---
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

interface MetodoPago {
  id: string;
  tipo: string;
  detalle: string;
  icono: string;
}

interface TerminoPolitica {
  id: string;
  titulo: string;
  contenido: string;
}

// --- IMÁGENES DEL CARRUSEL PRINCIPAL (HERO) ---
const IMAGENES_HERO: string[] = [
  "/WhatsApp Image 2026-07-08 at 10.54.20 (2).jpeg", 
  "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", 
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"  
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

const METODOS_PAGO: MetodoPago[] = [
  { id: "pago-1", tipo: "Transferencia Directa", detalle: "Bancolombia, Nequi o Daviplata sin costos adicionales.", icono: "📱" },
  { id: "pago-2", tipo: "Tarjetas de Crédito", detalle: "Visa, Mastercard y American Express mediante link seguro.", icono: "💳" },
  { id: "pago-3", tipo: "Efectivo / Corresponsal", detalle: "Pagos seguros a través de puntos Efecty o Gana.", icono: "💵" }
];

const TERMINOS_POLITICAS: TerminoPolitica[] = [
  { id: "term-1", titulo: "Políticas de Check-in y Check-out", contenido: "El ingreso a las habitaciones está habilitado a partir de las 3:00 PM y la salida debe realizarse antes de la 1:00 PM para garantizar el correcto flujo de desinfección." },
  { id: "term-2", titulo: "Cancelaciones y Modificaciones", contenido: "Puedes reprogramar o cancelar tu estadía sin penalidad hasta 48 horas antes de tu fecha de llegada. Pasado este tiempo se cobrará el valor de la primera noche." },
  { id: "term-3", titulo: "Normas de Convivencia y Mascotas", contenido: "Somos un espacio de desconexión y calma. Se admiten mascotas de razas pequeñas bajo previa solicitud y con responsabilidad directa de sus cuidadores." }
];

export default function HomePage() {
  const { habitaciones, fetchHabitaciones, isLoading } = useHabitacionesStore();
  const [heroActivo, setHeroActivo] = useState<number>(0);
  const [planActivo, setPlanActivo] = useState<string>("romantica");
  const [logoError, setLogoError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const [habitacionConPrecio, setHabitacionConPrecio] = useState<string | null>(null);
  
  const [pagoActivo, setPagoActivo] = useState<number>(0);
  const [acordeonAbierto, setAcordeonAbierto] = useState<string | null>("term-1");
  const [seccionReservaAbierta, setSeccionReservaAbierta] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    fetchHabitaciones();
  }, [fetchHabitaciones]);

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
    const elem = document.getElementById(idSeccion);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const planSeleccionado = PLANES.find(p => p.id === planActivo) || PLANES[0];

  // Cortafuegos de hidratación seguro
  if (!isMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <main className="min-h-screen bg-white text-[#3d342e] antialiased selection:bg-[#f4f1ea] style-font-override">
      
      {/* Inyección asincrónica optimizada para Next.js */}
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
      <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
        <div className="absolute top-12 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="relative w-64 h-24 md:w-80 md:h-32 flex items-center justify-center">
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${logoError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <Image src="/logo.png" alt="Logo Abadía" fill priority sizes="(max-width: 768px) 256px, 320px" className="object-contain" onError={() => setLogoError(true)} />
            </div>
            <div className={`text-center absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${logoError ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="tracking-[0.4em] text-white text-3xl md:text-4xl uppercase block font-light">Abadía</span>
              <span className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 block mt-2 font-light">Hotel Boutique</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10">
          {IMAGENES_HERO.map((imgUrl, idx) => {
            const isHeroActive = idx === heroActivo;
            return (
              <div key={idx} className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out bg-black/40 ${isHeroActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/35 z-10" />
                <Image src={imgUrl} alt={`Abadía Vista Principal ${idx + 1}`} fill priority={idx === 0} unoptimized sizes="100vw" className="object-cover" />
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center px-4">
          <button onClick={() => hacerScrollASeccion('seccion-reservas-mid')} className="bg-white/90 backdrop-blur-sm text-neutral-900 px-10 py-4 text-[11px] uppercase tracking-[0.3em] transition-all duration-300 hover:bg-white hover:scale-[1.02] rounded-full shadow-md">
            Reservar Ahora
          </button>
        </div>
      </section>

      {/* --- 2. CINTURÓN PROMOCIONAL --- */}
      <section className="bg-[#f4f1ea]/60 py-14 px-4 text-center border-y border-[#e6dfd1]/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-3xl font-light tracking-[0.1em] text-[#3d342e] uppercase leading-tight font-luxury-title">
            Desconéctate desde <span className="font-editorial-italic text-[#7a6e5d] font-normal lowercase tracking-normal">$70.000 cop</span> la noche
          </h3>
          <p className="text-neutral-400 text-[10px] mt-2 tracking-[0.3em] uppercase font-light">
            Tu refugio de paz en la costa de San Antero y Coveñas
          </p>
        </div>
      </section>

      {/* --- 3. SECCIÓN HABITACIONES --- */}
      <section id="habitaciones" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3d342e]/40 font-medium block mb-2">— HABITACIONES</span>
            <h2 className="text-4xl md:text-6xl text-[#3d342e] uppercase leading-none flex flex-col">
              <span className="font-luxury-title tracking-tight">Estancias de</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#7a6e5d] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Ensueño</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading && <p className="text-center w-full col-span-full">Cargando habitaciones...</p>}
            {habitaciones.map((hab) => {
              const tarjetaVolteada = habitacionConPrecio === hab.id;
              return (
                <div key={hab.id} className="relative aspect-[4/5] w-full bg-[#f4f1ea] rounded-[2.5rem] shadow-sm overflow-hidden border border-[#f4f1ea]/30 transition-all duration-500 hover:scale-[1.01] hover:shadow-md group">
                  
                  {/* FRONT */}
                  <div className={`absolute inset-0 w-full h-full p-8 flex flex-col justify-end transition-all duration-500 ease-in-out ${tarjetaVolteada ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'}`}>
                    <Image src={hab.imagen} alt={hab.titulo} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
                    
                    <div className="relative z-20 text-white text-left">
                      <span className="text-[9px] font-medium uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{hab.ocupacion}</span>
                      <h3 className="text-2xl font-light tracking-wide mt-3 mb-1 uppercase font-luxury-title">{hab.titulo}</h3>
                      <p className="text-neutral-300 text-xs font-light tracking-wider mb-4">Desde ${hab.precio?.toLocaleString('es-CO')} COP / noche</p>
                      <button 
                        onClick={() => activarVolteoCard(hab.id)}
                        className="bg-white/10 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl border border-white/20 w-full hover:bg-white hover:text-[#3d342e] transition-all duration-300 font-medium"
                      >
                        Descubrir Habitación
                      </button>
                    </div>
                  </div>

                  {/* REVERSO EN COLOR CAFÉ */}
                  <div className={`absolute inset-0 bg-[#3d342e] z-20 flex flex-col justify-between p-8 text-center transition-all duration-500 ease-in-out ${tarjetaVolteada ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    
                    <div className="w-full flex flex-col items-center border-b border-white/10 pb-3">
                      <div className="relative w-36 h-12 flex items-center justify-center filter brightness-0 invert opacity-90">
                        <Image src="/logo.png" alt="Logo Abadía" fill sizes="(max-width: 768px) 150px, 150px" className="object-contain" />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest bg-white/10 text-[#f4f1ea] px-3 py-1 rounded-full font-medium mt-2">
                        {hab.ocupacion}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-3 py-2 flex-1">
                      <p className="text-[#f4f1ea]/90 text-xs font-light leading-relaxed px-1 text-left">{hab.subtitulo}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left w-full max-w-[220px] mx-auto pt-3 border-t border-white/10 text-[#f4f1ea]/70 font-light text-[11px]">
                        <span>❄️ Nevera pequeña</span>
                        <span>育 Baño privado</span>
                        <span>📺 Smart TV</span>
                        <span>📶 WiFi Libre</span>
                      </div>
                    </div>

                    <div className="mb-4 bg-white/5 py-2.5 rounded-2xl border border-white/10">
                      <span className="text-[9px] uppercase tracking-widest text-[#f4f1ea]/50 block font-medium">Reserva</span>
                      <p className="text-xl font-light text-white font-luxury-title">{hab.precio}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => window.location.href = `/reservar?room=${hab.id}`} className="bg-white text-[#3d342e] py-3 text-[9px] uppercase tracking-widest rounded-xl hover:bg-[#f4f1ea] transition-all font-medium">Reservar</button>
                        <button onClick={() => window.location.href = '/habitaciones'} className="bg-transparent text-white border border-white/20 py-3 text-[9px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all font-medium">Ver Fotos</button>
                      </div>
                      <button onClick={() => activarVolteoCard(hab.id)} className="text-[9px] uppercase tracking-widest text-[#f4f1ea]/50 font-light underline py-1">Cerrar</button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <button onClick={() => window.location.href = '/habitaciones'} className="bg-white text-[#3d342e] border border-[#3d342e]/20 px-10 py-4 text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-[#3d342e] hover:text-white transition-all duration-300">Ver al detalle</button>
          </div>
        </div>
      </section>

      {/* --- 4. SECCIÓN RESERVAS INTEGRADA --- */}
      <section id="seccion-reservas-mid" className="py-20 px-4 bg-[#f4f1ea]/40 border-y border-[#e6dfd1]/30">
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 shadow-sm text-center border border-[#f4f1ea]">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#3d342e]/40 font-medium block mb-2">— PLANIFICA TU ESTADÍA</span>
          <h2 className="text-2xl md:text-3xl font-light text-[#3d342e] uppercase font-luxury-title">Establecer Reserva</h2>
          <p className="text-neutral-400 text-xs max-w-sm mx-auto mb-8 font-light tracking-wide">Indícanos tus fechas ideales de descanso para comprobar la disponibilidad del hotel.</p>

          <button 
            onClick={() => setSeccionReservaAbierta(!seccionReservaAbierta)}
            className="bg-[#3d342e] text-white px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 shadow-sm transition-all duration-300 font-medium"
          >
            {seccionReservaAbierta ? 'Ocultar Panel' : 'Configurar Fechas Aquí'}
          </button>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden mt-8 ${seccionReservaAbierta ? 'max-h-[500px] opacity-100 border-t border-[#f4f1ea] pt-8' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div>
                <label className="text-[10px] uppercase font-medium text-[#3d342e]/50 tracking-wider block mb-2">Check-In</label>
                <input type="date" className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-xs text-[#3d342e] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-medium text-[#3d342e]/50 tracking-wider block mb-2">Check-Out</label>
                <input type="date" className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-xs text-[#3d342e] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-medium text-[#3d342e]/50 tracking-wider block mb-2">Huéspedes</label>
                <select className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-xs text-[#3d342e] outline-none">
                  <option>1 Huésped</option>
                  <option>2 Huéspedes</option>
                  <option>3 Huéspedes</option>
                  <option>4+ Huéspedes</option>
                </select>
              </div>
            </div>
            <button onClick={() => window.location.href = '/habitaciones'} className="w-full bg-[#3d342e] text-white py-3.5 rounded-xl text-[10px] uppercase tracking-widest mt-6 hover:bg-neutral-800 transition-colors shadow-sm font-medium">
              Buscar Disponibilidad Inmediata
            </button>
          </div>
        </div>
      </section>

      {/* 5. VIDEO SECTION */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full z-0">
          <video autoPlay loop muted playsInline controls={false} className="w-full h-full object-cover opacity-85">
            <source src="/13597489-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* --- 6. CONOCE LA CASA --- */}
      <section id="casa" className="py-24 px-4 md:px-8 bg-white border-b border-[#f4f1ea]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3d342e]/40 font-medium block mb-2">— NUESTROS ESPACIOS</span>
            <h2 className="text-4xl md:text-6xl text-[#3d342e] uppercase leading-none flex flex-col">
              <span className="font-luxury-title tracking-tight">Conoce la</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#7a6e5d] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Casa hotel</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {CASA.map((item) => (
              <div key={item.id} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#f4f1ea] shadow-sm border border-[#f4f1ea]/30 transition-transform duration-500 hover:scale-[1.01] group cursor-pointer">
                <Image src={item.imagen} alt={item.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-8 z-10 text-left">
                  <p className="text-white text-xl font-light tracking-wide uppercase font-luxury-title">
                    {item.titulo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECCIÓN DE PLANES INTERACTIVOS */}
      <section id="planes" className="py-24 px-4 bg-[#f4f1ea]/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12 select-none">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3d342e]/40 font-medium block mb-2">— EXPERIENCIAS</span>
            <h2 className="text-4xl md:text-6xl text-[#3d342e] uppercase leading-none flex flex-col items-center">
              <span className="font-luxury-title tracking-tight">Nuestros</span>
              <span className="font-luxury-script text-4xl md:text-7xl text-[#7a6e5d] capitalize -mt-2 md:-mt-5 normal-case tracking-normal">Planes</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-md mx-auto">
            {PLANES.map((plan) => (
              <button 
                key={plan.id}
                onClick={() => setPlanActivo(plan.id)}
                className={`flex-1 min-w-[140px] py-3 text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 ${planActivo === plan.id ? 'bg-[#3d342e] text-white shadow-sm' : 'bg-white text-[#3d342e]/70'}`}
              >
                {plan.id === 'romantica' ? 'Romántica' : plan.id === 'madre' ? 'Mamá' : 'Escapada'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-[#f4f1ea] flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden">
              <Image src={planSeleccionado.imagen} alt={planSeleccionado.titulo} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] uppercase tracking-widest bg-white/90 backdrop-blur-md text-[#3d342e] px-3 py-1.5 rounded-full font-medium shadow-sm">{planSeleccionado.etiqueta}</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between py-2 text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">ABADÍA RESORT</span>
                <h3 className="text-2xl font-light uppercase text-[#3d342e] font-luxury-title mb-1">{planSeleccionado.titulo}</h3>
                <p className="text-[10px] tracking-widest uppercase text-neutral-300 mb-5 font-light">{planSeleccionado.subtitulo}</p>
                <p className="text-neutral-400 text-xs leading-relaxed font-light mb-6">{planSeleccionado.descripcion}</p>
              </div>

              <div className="pt-6 border-t border-[#f4f1ea] flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">Tarifa</span>
                  <span className="text-lg font-light text-neutral-900 font-luxury-title">{planSeleccionado.precio}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => window.location.href = '/planes'} className="flex-1 bg-white text-[#3d342e] border border-[#3d342e]/10 px-5 py-3 text-[9px] uppercase tracking-wider rounded-full hover:bg-[#f4f1ea] transition-all whitespace-nowrap">Detalles</button>
                  <button className="flex-1 bg-[#3d342e] text-white px-5 py-3 text-[9px] uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-all whitespace-nowrap">Reservar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECCIÓN ALREDEDORES */}
      <section id="turismo" className="py-24 px-4 md:px-8 bg-[#f4f1ea]/20 border-t border-[#f4f1ea]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16 select-none">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3d342e]/40 font-medium block mb-2">— ENTORNO NATURAL</span>
            <h2 className="text-4xl md:text-7xl text-[#3d342e] uppercase leading-none flex flex-col">
              <span className="font-luxury-title tracking-tight">Qué hacer en San</span>
              <span className="font-luxury-script text-5xl md:text-8xl text-[#7a6e5d] capitalize -mt-3 md:-mt-6 normal-case tracking-normal">Antero y Coveñas</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {ENTRETENIMIENTO_LOCAL.map((item) => (
              <div key={item.id} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-sm border border-[#f4f1ea]/50 transition-all duration-500 hover:scale-[1.01] hover:shadow-md">
                <Image src={item.imagen} alt={item.titulo} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white flex flex-col items-start gap-1 text-left">
                  <span className="text-[9px] uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">{item.lugar}</span>
                  <h3 className="text-xl font-light tracking-wide mt-2 font-luxury-title uppercase">{item.titulo}</h3>
                  <span className="text-[11px] text-neutral-300 tracking-wider mt-1 block">
                    Desde <span className="text-white font-normal">{item.precioDesde}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => window.location.href = '/conoce-abadia'} 
              className="bg-[#3d342e] text-white px-10 py-4 text-[11px] uppercase tracking-[0.3em] rounded-full shadow-sm hover:bg-neutral-800 transition-all"
            >
              Explorar Guía Turística
            </button>
          </div>
        </div>
      </section>

      {/* 9. SECCIÓN DINÁMICA: MEDIOS DE PAGO & TÉRMINOS */}
      <section id="finanzas" className="py-24 px-4 md:px-8 bg-white border-t border-[#f4f1ea]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* MEDIOS DE PAGO */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#f4f1ea] text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#3d342e]/40 font-medium block mb-1">— TRANSPARENCIA</span>
            <h3 className="text-2xl font-light text-[#3d342e] uppercase font-luxury-title mb-6">Medios de Pago</h3>
            
            <div className="flex gap-2 mb-6">
              {METODOS_PAGO.map((metodo, idx) => (
                <button
                  key={metodo.id}
                  onClick={() => setPagoActivo(idx)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-wider rounded-xl transition-all ${pagoActivo === idx ? 'bg-[#3d342e] text-white' : 'bg-[#f4f1ea]/60 text-[#3d342e]/60'}`}
                >
                  {metodo.tipo.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#f4f1ea]/30 border border-[#f4f1ea]/50 min-h-[120px] flex items-start gap-4">
              <span className="text-2xl">{METODOS_PAGO[pagoActivo].icono}</span>
              <div>
                <h4 className="text-sm font-medium text-[#3d342e] mb-1 uppercase tracking-wide">{METODOS_PAGO[pagoActivo].tipo}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">{METODOS_PAGO[pagoActivo].detalle}</p>
              </div>
            </div>
          </div>

          {/* TÉRMINOS Y CONDICIONES */}
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#3d342e]/40 font-medium block mb-1">— RESPALDO</span>
            <h3 className="text-2xl font-light text-[#3d342e] uppercase font-luxury-title mb-6">Términos</h3>
            
            <div className="flex flex-col gap-3">
              {TERMINOS_POLITICAS.map((politica) => {
                const abierto = acordeonAbierto === politica.id;
                return (
                  <div key={politica.id} className="bg-white rounded-2xl shadow-sm border border-[#f4f1ea] overflow-hidden">
                    <button
                      onClick={() => setAcordeonAbierto(abierto ? null : politica.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-[#f4f1ea]/20 transition-colors"
                    >
                      <span className="text-xs md:text-sm font-medium text-[#3d342e] tracking-wide">{politica.titulo}</span>
                      <span className={`text-[10px] text-neutral-400 transform transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${abierto ? 'max-h-40 border-t border-[#f4f1ea] p-6' : 'max-h-0 pointer-events-none'}`}>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light">{politica.contenido}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}