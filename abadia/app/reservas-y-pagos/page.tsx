'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NUMERO_WHATSAPP = "573122373415";

export default function PaginaReservasPagos() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const contactarWhatsApp = () => {
    const msj = encodeURIComponent("Hola! Deseo verificar disponibilidad, cuentas de pago y formalizar mi reserva en Casa Hotel Abadía.");
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  return (
    <main className="w-full bg-[#FAF7F2] text-[#2a2421] antialiased min-h-screen font-light">
      
      {/* HEADER: SIN BOTÓN IZQUIERDO, LOGO CENTRADO Y MENÚ DERECHO */}
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
        <div onClick={() => setMenuAbierto(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />

        <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#14100e]/85 backdrop-blur-3xl p-10 sm:p-12 flex flex-col justify-between border-l border-white/15 shadow-2xl transition-transform duration-500 ease-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              Menú Abadía
            </span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-left my-auto">
            <Link onClick={() => setMenuAbierto(false)} href="/" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Inicio</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/habitaciones" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Nuestras Habitaciones</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/otros-espacios" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Otros Espacios de la Casa</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/que-hacer" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Qué hacer en San Antero</Link>
            <Link onClick={() => setMenuAbierto(false)} href="/reservas-y-pagos" className="text-lg sm:text-2xl font-medium uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors">Dashboard de Reservas & Pagos</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span>Playa Blanca • San Antero</span>
            <span>Caribe</span>
          </div>
        </div>
      </div>

      {/* BANNER EDITORIAL FULL SCREEN (TÍTULO EN BLANCO) */}
      <section className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden bg-black flex flex-col justify-end pb-12 px-6 text-white text-center">
        <Image
          src="/121017.jpg"
          alt="Reservas y Pagos Hotel Abadía"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/80 font-semibold block">
            Guía Oficial de Reserva
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold uppercase tracking-wide text-white">
            Cómo Reservar & Pagos
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 font-light">
            Transparente, directo y sin comisiones de plataformas intermediarias.
          </p>
        </div>
      </section>

      {/* PASO A PASO (TÍTULOS EN DORADO SOBRE FONDO BLANCO/ARENA) */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto space-y-14 text-left">
        
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c7355] font-semibold block">
            Proceso de Reserva
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-[#C5A059]">
            Reserva tu Estadía en 3 Pasos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E8DDD0] shadow-sm space-y-3">
            <span className="text-3xl font-mono font-light text-[#8c7355]">Paso 01</span>
            <h3 className="text-base font-semibold uppercase text-stone-800">Elige tu Estancia</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Selecciona en nuestro catálogo la habitación o suite que mejor se adapte a tus fechas y número de acompañantes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8DDD0] shadow-sm space-y-3">
            <span className="text-3xl font-mono font-light text-[#8c7355]">Paso 02</span>
            <h3 className="text-base font-semibold uppercase text-stone-800">Confirmación WhatsApp</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Nuestro concierge verifica la disponibilidad en tiempo real y te suministra la liquidación formal de tu estadía.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8DDD0] shadow-sm space-y-3">
            <span className="text-3xl font-mono font-light text-[#8c7355]">Paso 03</span>
            <h3 className="text-base font-semibold uppercase text-stone-800">Anticipo & Voucher</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Garantizas con un 50% de anticipo y recibes tu voucher digital de confirmación con ubicación y detalles de llegada.
            </p>
          </div>
        </div>

        {/* MÉTODOS DE PAGO */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DDD0] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c7355] font-bold">Transacciones Seguras</span>
            <h3 className="text-xl sm:text-2xl font-semibold uppercase text-[#C5A059]">Métodos de Pago Autorizados</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD0] space-y-1">
              <span className="font-bold text-stone-900 block">Transferencias Bancarias</span>
              <p className="font-light text-stone-600">Cuenta de Ahorros Bancolombia / Davivienda a nombre de la empresa hotelera.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD0] space-y-1">
              <span className="font-bold text-stone-900 block">Billeteras Digitales</span>
              <p className="font-light text-stone-600">Nequi, Daviplata y pagos inmediatos mediante código QR oficial.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD0] space-y-1">
              <span className="font-bold text-stone-900 block">Tarjetas & PSE</span>
              <p className="font-light text-stone-600">Link de pago seguro para tarjetas de crédito (Visa, Mastercard, Amex) y débito PSE.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD0] space-y-1">
              <span className="font-bold text-stone-900 block">Pago en Sitio</span>
              <p className="font-light text-stone-600">El saldo restante (50%) se cancela en la recepción al momento del check-in.</p>
            </div>
          </div>
        </div>

        {/* ACCIÓN DIRECTA */}
        <div className="bg-[#241b14] text-white p-10 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-semibold uppercase tracking-wide text-white">¿Listo para asegurar tu fecha?</h3>
            <p className="text-xs text-stone-300 font-light">Nuestro concierge está disponible para asistirte de inmediato.</p>
          </div>
          <button
            onClick={contactarWhatsApp}
            className="bg-[#8c7355] hover:bg-[#735e45] text-white px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all cursor-pointer shrink-0 shadow-lg"
          >
            Hablar con Concierge WhatsApp
          </button>
        </div>

      </section>

      {/* FOOTER AZUL ABADÍA */}
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
            © 2026 Hotel Abadía. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}