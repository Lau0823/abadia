'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

interface Suite {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  ocupacion: string;
  imagenes: string[];
  amenidades: string[];
}

const SUITES_DATA: Record<string, Suite> = {
  "suite-insignia": {
    id: "suite-insignia",
    titulo: "Habitación 1",
    subtitulo: "Suite Insignia",
    descripcion: "Nuestra estancia más majestuosa. Cuenta con una tina de hidromasaje exterior privada y vistas infinitas al valle. Su arquitectura interior expone techos altos con vigas de madera nativa, lencería de cama de 400 hilos y ventanales acústicos de piso a techo.",
    ocupacion: "Máx. 2 Adultos",
    imagenes: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    amenidades: ["❄️ Nevera pequeña", "🚿 Baño privado", "📺 Smart TV", "📶 Internet WiFi", "☕ Cafetera"]
  },
  "refugio-rustico": {
    id: "refugio-rustico",
    titulo: "Habitación 2",
    subtitulo: "Refugio Rústico",
    descripcion: "Equilibrio perfecto entre la calidez rústica caribeña y el minimalismo moderno. Viene equipada con una chimenea privada para las noches frescas y un balcón artesanal diseñado minuciosamente para disfrutar los amaneceres.",
    ocupacion: "Máx. 2 Adultos + 1 Niño",
    imagenes: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80"
    ],
    amenidades: ["❄️ Nevera pequeña", "🚿 Baño privado", "📺 Smart TV", "📶 Internet WiFi", "🔥 Chimenea"]
  }
};

export default function SuiteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [suite, setSuite] = useState<Suite | null>(null);
  const [imagenActivaIdx, setImagenActivaIdx] = useState<number>(0);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);

  // Estados del formulario y cotizador
  const [adultos, setAdultos] = useState<number>(1);
  const [ninos, setNinos] = useState<number>(0);
  const [precioTotal, setPrecioTotal] = useState<number>(70000);
  const [nombre, setNombre] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [fechaEntrada, setFechaEntrada] = useState<string>('');
  const [fechaSalida, setFechaSalida] = useState<string>('');

  useEffect(() => {
    if (id && SUITES_DATA[id as string]) {
      setSuite(SUITES_DATA[id as string]);
    } else {
      setSuite(SUITES_DATA["suite-insignia"]);
    }
  }, [id]);

  // --- LÓGICA DE COTIZACIÓN DINÁMICA ---
  useEffect(() => {
    const costoAdultos = adultos * 70000;
    const costoNinos = ninos * 40000;
    setPrecioTotal(costoAdultos + costoNinos);
  }, [adultos, ninos]);

  if (!suite) return <div className="min-h-screen bg-white" />;

  const formatoMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const enviarWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = `Hola Abadía Hotel Boutique, deseo gestionar la reserva de la siguiente estancia:\n\n` +
      `🏨 *Habitación:* ${suite.titulo} - ${suite.subtitulo}\n` +
      `👤 *Cliente:* ${nombre}\n` +
      `📞 *Teléfono:* ${telefono}\n` +
      `📅 *Check-In:* ${fechaEntrada}\n` +
      `📅 *Check-Out:* ${fechaSalida}\n` +
      `👥 *Huéspedes:* ${adultos} Adulto(s) y ${ninos} Niño(s)\n` +
      `💰 *Tarifa Total Cotizada:* ${formatoMoneda(precioTotal)} por noche.`;

    window.open(`https://api.whatsapp.com/send?phone=573000000000&text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white text-[#3d342e] antialiased pb-24">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@1,400;1,600&family=Raleway:wght@200;300;400;500;600;700&display=swap" />
      <style>{`
        main, select, input, button, p, span { font-family: 'Raleway', sans-serif !important; font-weight: 300; }
        .font-luxury-title { font-family: 'Raleway', sans-serif !important; font-weight: 300 !important; letter-spacing: 0.08em; }
        .font-luxury-script { font-family: 'Alex Brush', cursive !important; font-weight: 400 !important; }
        .font-editorial-italic { font-family: 'Playfair Display', serif !important; font-style: italic !important; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- NAV HAMBURGUESA --- */}
      <nav className="fixed top-6 right-6 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-md border border-[#f4f1ea] flex flex-col justify-center items-center gap-1.5 w-12 h-12">
          <span className={`h-[1px] w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`h-[1px] w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`h-[1px] w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? '-rotate-45 translate-y-[3px]' : ''}`} />
        </button>
      </nav>

      {/* --- PANEL LATERAL --- */}
      <div className={`fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-white/95 backdrop-blur-md shadow-2xl p-8 flex flex-col justify-between border-l border-[#f4f1ea] transition-transform duration-500 ease-out ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-16">
          <span className="text-[10px] uppercase tracking-widest text-[#3d342e]/50 font-bold block mb-8">— Menú</span>
          <ul className="flex flex-col gap-6 text-lg font-light text-[#3d342e]">
            <li className="cursor-pointer hover:text-neutral-400" onClick={() => window.location.href = '/'}>Inicio</li>
            <li className="cursor-pointer hover:text-neutral-400" onClick={() => router.push('/habitaciones')}>Volver a Habitaciones</li>
          </ul>
        </div>
        <div className="text-[10px] text-neutral-400 font-medium tracking-wide">© 2026 Abadía Hotel Boutique.</div>
      </div>

      {/* --- CONTENIDO CON DISEÑO EXCLUSIVO CINEMATOGRÁFICO --- */}
      <section className="pt-28 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* BOTÓN DE RETORNO SUPERIOR */}
        <div className="w-full flex justify-start mb-6">
          <button 
            onClick={() => router.push('/habitaciones')}
            className="text-xs uppercase tracking-[0.2em] text-[#3d342e]/60 hover:text-[#3d342e] transition-colors flex items-center gap-2 font-medium"
          >
            ← Volver a todas las habitaciones
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: VISUAL INTERACTIVO FULL-SCREEN FEEL */}
          <div className="lg:col-span-8 flex flex-col gap-5 w-full relative">
            <div className="relative h-[60vh] md:h-[78vh] w-full bg-[#f4f1ea] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#e6dfd1]/30">
              <Image 
                src={suite.imagenes[imagenActivaIdx]} 
                alt={suite.titulo} 
                fill 
                priority 
                sizes="(max-width: 1024px) 100vw, 70vw" 
                className="object-cover transition-all duration-700 ease-out" 
              />
              
              <div className="absolute bottom-6 left-6 z-30 flex gap-2">
                <button onClick={() => setImagenActivaIdx(prev => (prev - 1 + suite.imagenes.length) % suite.imagenes.length)} className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center font-bold text-[#3d342e] hover:bg-white active:scale-95 transition-all">←</button>
                <button onClick={() => setImagenActivaIdx(prev => (prev + 1) % suite.imagenes.length)} className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center font-bold text-[#3d342e] hover:bg-white active:scale-95 transition-all">→</button>
              </div>

              {/* TIRA DE MINIATURAS HORIZONTALES FLOTANTES */}
              <div className="absolute bottom-6 right-6 z-30 p-2.5 bg-black/10 backdrop-blur-md rounded-2xl flex gap-2.5 max-w-[220px] sm:max-w-none overflow-x-auto scrollbar-none border border-white/10 shadow-inner">
                {suite.imagenes.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenActivaIdx(index)}
                    className={`relative w-20 md:w-24 aspect-[16/10] rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${imagenActivaIdx === index ? 'border-white scale-[0.93] shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={imgUrl} alt="Vista miniatura" fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#f4f1ea]/20 rounded-3xl border border-[#f4f1ea]/60 text-left">
              <h4 className="text-[10px] uppercase tracking-widest text-[#3d342e]/60 font-bold mb-4">Servicios Especiales Incluidos</h4>
              <div className="flex flex-wrap gap-2">
                {suite.amenidades.map((amenidad, idx) => (
                  <span key={idx} className="text-xs font-bold text-[#3d342e]/80 bg-white border border-[#f4f1ea] px-4 py-2 rounded-xl shadow-sm">{amenidad}</span>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: TEXTOS & MOTOR DE RESERVA */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-[#f4f1ea] w-full text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#3d342e]/50 font-bold block mb-1">DETALLE DE LUJO</span>
            <h2 className="text-3xl font-luxury-title uppercase text-[#3d342e] tracking-tight mb-1">
              {suite.titulo} <span className="font-luxury-script text-3xl md:text-4xl text-[#7a6e5d] lowercase normal-case">{suite.subtitulo}</span>
            </h2>
            <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-[#3d342e]/5 text-[#3d342e] px-3 py-1 rounded-full mb-6">
              {suite.ocupacion}
            </span>

            <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-light mb-6 pb-6 border-b border-[#f4f1ea]">
              <span className="font-editorial-italic text-[#7a6e5d] text-sm block mb-2">Una atmósfera memorable desde el primer contacto.</span>
              {suite.descripcion}
            </p>

            <form onSubmit={enviarWhatsApp} className="flex flex-col gap-4">
              <input type="text" required placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/60 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#3d342e] outline-none focus:border-[#3d342e] transition-colors shadow-sm" />
              <input type="tel" required placeholder="Teléfono celular" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/60 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#3d342e] outline-none focus:border-[#3d342e] transition-colors shadow-sm" />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1 px-1">Adultos ($70k/u)</label>
                  <select value={adultos} onChange={(e) => setAdultos(Number(e.target.value))} className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/60 rounded-xl px-3 py-3 text-xs text-[#3d342e] outline-none shadow-sm">
                    <option value={1}>1 Adulto</option>
                    <option value={2}>2 Adultos</option>
                    <option value={3}>3 Adultos</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1 px-1">Niños ($40k/u)</label>
                  <select value={ninos} onChange={(e) => setNinos(Number(e.target.value))} className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/60 rounded-xl px-3 py-3 text-xs text-[#3d342e] outline-none shadow-sm">
                    <option value={0}>0 Niños</option>
                    <option value={1}>1 Niño</option>
                    <option value={2}>2 Niños</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1 px-1">Check-In</label>
                  <input type="date" required value={fechaEntrada} onChange={(e) => setFechaEntrada(e.target.value)} className="w-full bg-white border border-[#e6dfd1] rounded-xl px-3 py-3 text-xs text-[#3d342e] shadow-sm" />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1 px-1">Check-Out</label>
                  <input type="date" required value={fechaSalida} onChange={(e) => setFechaSalida(e.target.value)} className="w-full bg-white border border-[#e6dfd1] rounded-xl px-3 py-3 text-xs text-[#3d342e] shadow-sm" />
                </div>
              </div>

              {/* COTIZADOR INTELIGENTE DINÁMICO EN TIEMPO REAL */}
              <div className="mt-2 p-5 rounded-2xl bg-[#f4f1ea] border border-[#e6dfd1]/40 flex justify-between items-center shadow-inner">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#3d342e]/50 font-bold block">Valor Cotizado / Noche</span>
                  <span className="text-xl font-light text-[#3d342e] font-luxury-title transition-all duration-300">{formatoMoneda(precioTotal)}</span>
                </div>
                <span className="text-[10px] bg-white text-[#3d342e] border border-[#3d342e]/10 px-3 py-1.5 rounded-full font-bold">COP</span>
              </div>

              <button type="submit" className="w-full bg-[#3d342e] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest mt-2 hover:bg-neutral-800 transition-colors shadow-md">
                💬 Solicitar Disponibilidad vía WhatsApp
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}