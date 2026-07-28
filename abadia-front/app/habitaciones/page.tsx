'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HabitacionPreview {
  id: string;
  titulo: string;
  subtitulo: string;
  precio: string;
  imagen: string;
  ocupacion: string;
}

export default function CatalogPage() {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [habitaciones, setHabitaciones] = useState<HabitacionPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/habitaciones`)
      .then(res => res.json())
      .then(data => {
        // Map backend data to the preview format
        const formatted = data.map((h: any) => ({
          id: h.id,
          titulo: h.titulo,
          subtitulo: h.subtitulo,
          precio: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(h.precio),
          imagen: h.imagenes && h.imagenes.length > 0 ? h.imagenes[0] : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
          ocupacion: h.ocupacion || "Máx. 2 Personas"
        }));
        setHabitaciones(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-[#3d342e] antialiased pb-24">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@1,400;1,600&family=Raleway:wght@200;300;400;500;600;700&display=swap" />
      <style>{`
        main, select, button, p, span { font-family: 'Raleway', sans-serif !important; font-weight: 300; }
        .font-luxury-title { font-family: 'Raleway', sans-serif !important; font-weight: 300 !important; letter-spacing: 0.08em; }
        .font-luxury-script { font-family: 'Alex Brush', cursive !important; font-weight: 400 !important; }
      `}</style>

      {/* --- BOTÓN HAMBURGUESA --- */}
      <nav className="fixed top-6 right-6 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-md border border-[#f4f1ea] flex flex-col justify-center items-center gap-1.5 w-12 h-12 active:scale-95 transition-all">
          <span className={`h-px w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? 'rotate-45 translate-y-0.75' : ''}`} />
          <span className={`h-px w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`h-px w-5 bg-[#3d342e] transition-all duration-300 ${menuAbierto ? '-rotate-45 translate-y-0.75' : ''}`} />
        </button>
      </nav>

      {/* --- PANEL LATERAL --- */}
      <div className={`fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-white/95 backdrop-blur-md shadow-2xl p-8 flex flex-col justify-between border-l border-[#f4f1ea] transition-transform duration-500 ease-out ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-16">
          <span className="text-[10px] uppercase tracking-widest text-[#3d342e]/50 font-bold block mb-8">— Menú</span>
          <ul className="flex flex-col gap-6 text-lg font-light text-[#3d342e]">
            <li className="cursor-pointer hover:text-neutral-400" onClick={() => window.location.href = '/'}>Inicio</li>
            <li className="cursor-pointer hover:text-neutral-400 font-medium" onClick={() => setMenuAbierto(false)}>Nuestras Habitaciones</li>
          </ul>
        </div>
        <div className="text-[10px] text-neutral-400 font-medium tracking-wide">© 2026 Abadía Hotel Boutique.</div>
      </div>

      {/* --- HEADER ASIMÉTRICO VOGUE --- */}
      <section className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-left select-none">
        <span className="text-[11px] uppercase tracking-[0.5em] text-[#3d342e]/50 font-bold block mb-3">— PORTAFOLIO EXCLUSIVO</span>
        <h1 className="text-5xl md:text-8xl text-[#3d342e] uppercase leading-none flex flex-col">
          <span className="font-luxury-title tracking-tight">Nuestras</span>
          <span className="font-luxury-script text-6xl md:text-9xl text-[#7a6e5d] -mt-4 md:-mt-8 normal-case tracking-normal">Estancias</span>
        </h1>
      </section>

      {/* --- REJILLA CON ENFOQUE FOTOGRÁFICO SLIM --- */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-[#3d342e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {habitaciones.map((hab) => (
              <div
                key={hab.id}
                onClick={() => router.push(`/habitaciones/${hab.id}`)}
                className="relative aspect-4/5 w-full overflow-hidden bg-white rounded-[2.5rem] shadow-sm border border-[#f4f1ea]/40 group cursor-pointer transition-all duration-500 hover:scale-[1.01] hover:shadow-md"
              >
                <Image src={hab.imagen} alt={hab.titulo} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                  <span className="text-[9px] font-medium uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{hab.ocupacion}</span>
                  {/* Modificación tipográfica limpia: Sin cursiva en la tarjeta */}
                  <h3 className="text-2xl font-luxury-title mt-3 mb-0.5 uppercase tracking-wide">{hab.titulo}</h3>
                  <p className="text-neutral-300 text-xs font-light uppercase tracking-widest opacity-90">{hab.subtitulo}</p>
                  <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold mt-4 block underline group-hover:text-white transition-colors">Explorar Espacio →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 