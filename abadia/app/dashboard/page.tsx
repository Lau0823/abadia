'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
});

const NUMERO_WHATSAPP = "573122373415";

// --- ICONOS VECTORIALES MÁS AMPLIOS Y LIMPIOS ---
const Icons = {
  Home: () => (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  ClipboardList: () => (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
};

// --- DATA: HABITACIONES ---
interface HabitacionFila {
  id: string;
  numero: string;
  nombre: string;
  tipo: string;
  tarifa: string;
  badgeColor: string;
}

const HABITACIONES_FILAS: HabitacionFila[] = [
  { id: 'hab-1', numero: '01', nombre: 'Habitación 1', tipo: 'SUITE REAL', tarifa: '$450k', badgeColor: 'bg-[#C5A059]/20 text-[#E8DDD0] border-[#C5A059]/30' },
  { id: 'hab-2', numero: '02', nombre: 'Habitación 2', tipo: 'PALMERAS', tarifa: '$320k', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'hab-3', numero: '03', nombre: 'Habitación 3', tipo: 'SILENCIO', tarifa: '$280k', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'hab-4', numero: '04', nombre: 'Habitación 4', tipo: 'PREMIUM', tarifa: '$450k', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'hab-5', numero: '05', nombre: 'Habitación 5', tipo: 'BUNGALOW', tarifa: '$360k', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'hab-6', numero: '06', nombre: 'Habitación 6', tipo: 'MASTER SUITE', tarifa: '$520k', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' }
];

// --- RESERVAS DEL GRID ---
interface ReservaGrid {
  id: string;
  habitacionId: string;
  habitacionNombre: string;
  huesped: string;
  mes: string;
  diaInicio: number;
  duracionDias: number;
  checkInHora: string;
  checkOutHora: string;
  colorGlass: string;
  estado: string;
  total: string;
  personas: string;
}

const RESERVAS_INICIALES: ReservaGrid[] = [
  {
    id: 'res-401',
    habitacionId: 'hab-4',
    habitacionNombre: 'Habitación 4 (Premium)',
    huesped: 'Carlos Mendoza',
    mes: 'Septiembre',
    diaInicio: 2,
    duracionDias: 3,
    checkInHora: '15:00',
    checkOutHora: '12:00',
    colorGlass: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/40 text-blue-100 shadow-[0_4px_16px_rgba(59,130,246,0.15)]',
    estado: 'Completada',
    total: '$1.350.000',
    personas: '4 Huéspedes'
  },
  {
    id: 'res-101',
    habitacionId: 'hab-1',
    habitacionNombre: 'Habitación 1 (Suite Real)',
    huesped: 'Camila Echeverry',
    mes: 'Septiembre',
    diaInicio: 4,
    duracionDias: 4,
    checkInHora: '14:00',
    checkOutHora: '11:00',
    colorGlass: 'bg-[#C5A059]/25 hover:bg-[#C5A059]/35 border-[#C5A059]/50 text-[#FAF7F2] shadow-[0_4px_16px_rgba(197,160,89,0.2)]',
    estado: 'Completada',
    total: '$1.800.000',
    personas: '2 Huéspedes'
  },
  {
    id: 'res-201',
    habitacionId: 'hab-2',
    habitacionNombre: 'Habitación 2 (Palmeras)',
    huesped: 'Familia Restrepo',
    mes: 'Septiembre',
    diaInicio: 20,
    duracionDias: 3,
    checkInHora: '15:00',
    checkOutHora: '12:00',
    colorGlass: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-100 shadow-[0_4px_16px_rgba(16,185,129,0.15)]',
    estado: 'Check-Out Hoy',
    total: '$960.000',
    personas: '5 Huéspedes'
  },
  {
    id: 'res-402',
    habitacionId: 'hab-4',
    habitacionNombre: 'Habitación 4 (Premium)',
    huesped: 'Santiago Morales',
    mes: 'Septiembre',
    diaInicio: 22,
    duracionDias: 4,
    checkInHora: '15:00',
    checkOutHora: '12:00',
    colorGlass: 'bg-cyan-500/25 hover:bg-cyan-500/35 border-cyan-400/50 text-cyan-50 shadow-[0_4px_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40',
    estado: 'Check-In Activo (Hospedado)',
    total: '$1.800.000',
    personas: '4 Huéspedes'
  },
  {
    id: 'res-601',
    habitacionId: 'hab-6',
    habitacionNombre: 'Habitación 6 (Master Suite)',
    huesped: 'Andrés & Daniela',
    mes: 'Septiembre',
    diaInicio: 23,
    duracionDias: 3,
    checkInHora: '14:00',
    checkOutHora: '11:30',
    colorGlass: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/40 text-purple-100 shadow-[0_4px_16px_rgba(168,85,247,0.15)]',
    estado: 'Llegada Hoy (Check-In)',
    total: '$1.560.000',
    personas: '2 Huéspedes'
  },
  {
    id: 'res-501',
    habitacionId: 'hab-5',
    habitacionNombre: 'Habitación 5 (Bungalow)',
    huesped: 'Valeria Gómez',
    mes: 'Octubre',
    diaInicio: 10,
    duracionDias: 3,
    checkInHora: '15:00',
    checkOutHora: '12:00',
    colorGlass: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-100 shadow-[0_4px_16px_rgba(245,158,11,0.15)]',
    estado: 'Confirmada (Próxima)',
    total: '$1.080.000',
    personas: '3 Huéspedes'
  }
];

const DIAS_MES_COMPLETO = Array.from({ length: 30 }, (_, i) => {
  const diaNum = i + 1;
  const letras = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return {
    num: diaNum,
    letra: letras[i % 7],
    esHoy: diaNum === 23
  };
});

const DIAS_SEMANA_ACTUAL = [
  { letra: 'L', num: 21 },
  { letra: 'M', num: 22 },
  { letra: 'M', num: 23, esHoy: true },
  { letra: 'J', num: 24 },
  { letra: 'V', num: 25 },
  { letra: 'S', num: 26 },
  { letra: 'D', num: 27 }
];

export default function DashboardAbadiaSpacious() {
  const [tabSidebar, setTabSidebar] = useState<'reservas' | 'home' | 'huespedes' | 'checklists' | 'llaves'>('reservas');
  const [filtroTiempo, setFiltroTiempo] = useState<'hoy' | 'semana' | 'mes' | 'ano'>('mes');
  const [diaActivo, setDiaActivo] = useState<number>(23);
  const [reservas, setReservas] = useState<ReservaGrid[]>(RESERVAS_INICIALES);
  const [reservaModal, setReservaModal] = useState<ReservaGrid | null>(null);
  const [modalNueva, setModalNueva] = useState<boolean>(false);

  // Formulario nueva reserva
  const [fHuesped, setFHuesped] = useState('');
  const [fHab, setFHab] = useState('hab-4');
  const [fDia, setFDia] = useState(23);
  const [fNoches, setFNoches] = useState(3);
  const [fMonto, setFMonto] = useState('$1.350.000');

  const crearReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fHuesped) return;

    const habObj = HABITACIONES_FILAS.find(h => h.id === fHab);

    const nueva: ReservaGrid = {
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      habitacionId: fHab,
      habitacionNombre: `${habObj?.nombre} (${habObj?.tipo})`,
      huesped: fHuesped,
      mes: 'Septiembre',
      diaInicio: Number(fDia),
      duracionDias: Number(fNoches),
      checkInHora: '15:00',
      checkOutHora: '12:00',
      colorGlass: 'bg-[#C5A059]/30 hover:bg-[#C5A059]/40 border-[#C5A059]/50 text-white shadow-[0_4px_16px_rgba(197,160,89,0.25)]',
      estado: 'Confirmada',
      total: fMonto,
      personas: '2 Huéspedes'
    };

    setReservas([...reservas, nueva]);
    setModalNueva(false);
    setFHuesped('');
  };

  const contactarWhatsApp = (r: ReservaGrid) => {
    const msj = encodeURIComponent(
      `¡Hola ${r.huesped}! Te saludamos de Abadía Casa Hotel.\n\n` +
      `Confirmamos tu reserva *${r.id.toUpperCase()}* en *${r.habitacionNombre}*:\n` +
      `📅 Check-in: ${r.mes} ${r.diaInicio} a las ${r.checkInHora}\n` +
      `📅 Check-out: ${r.mes} ${r.diaInicio + r.duracionDias} a las ${r.checkOutHora}\n` +
      `👥 Capacidad: ${r.personas}\n` +
      `💵 Monto Total: ${r.total}\n\n` +
      `¿En qué horario estimas tu llegada a San Antero?`
    );
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msj}`, '_blank');
  };

  const reservasHoy = reservas.filter(
    r => r.diaInicio <= 23 && (r.diaInicio + r.duracionDias) >= 23
  );

  const reservasSemana = reservas.filter(
    r => (r.diaInicio + r.duracionDias) >= 21 && r.diaInicio <= 27
  );

  const reservasMes = reservas.filter(r => r.mes === 'Septiembre');

  return (
    <div className="min-h-screen bg-[#06101E] relative overflow-hidden flex flex-col font-sans text-stone-200 antialiased selection:bg-[#C5A059]/30">
      
      {/* GLOWS DE FONDO ESPACIOSOS */}
      <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#1b3b6f]/25 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-[#C5A059]/15 blur-[180px] pointer-events-none" />

      {/* ========================================================
          1. HEADER ULTRA AMPLIO
          ======================================================== */}
      <header className="h-24 px-8 sm:px-12 flex items-center justify-between border-b border-white/10 bg-white/[0.03] backdrop-blur-3xl relative z-30">
        
        <div className="flex items-center gap-6">
          {/* Logo Abadía idéntico al Home: /logo.png */}
          <Link href="/" className="relative w-48 h-16 cursor-pointer drop-shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Logo Abadía"
              fill
              priority
              className="object-contain filter brightness-0 invert"
            />
          </Link>

          <div className="h-8 w-[1px] bg-white/15 hidden sm:block" />

          <div className="hidden sm:block">
            <h1 className={`${greatVibes.className} text-4xl text-white tracking-wider leading-none drop-shadow`}>
              Abadía Casa Hotel
            </h1>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-semibold block pt-1">
              Admin Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button 
            onClick={() => alert("Sincronización en vivo activada con Google Calendar y Booking")}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-sm font-medium tracking-wide transition-all active:scale-95 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Vincular Calendarios</span>
          </button>

          <Link
            href="/"
            className="text-sm text-[#E8DDD0] hover:text-[#C5A059] bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md hidden md:inline transition-colors"
          >
            Ir al Sitio Web ↗
          </Link>
        </div>
      </header>

      {/* ========================================================
          2. ESTRUCTURA: SIDEBAR Y CONTENIDO AMPLIADOS
          ======================================================== */}
      <div className="flex flex-1 relative z-20 overflow-hidden">
        
        {/* SIDEBAR MÁS ANCHO Y CÓMODO */}
        <aside className="w-28 bg-white/[0.02] border-r border-white/10 backdrop-blur-2xl py-10 flex flex-col items-center justify-between shrink-0 shadow-[4px_0_30px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center gap-8 w-full">
            
            <button
              onClick={() => setTabSidebar('home')}
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all cursor-pointer ${
                tabSidebar === 'home' ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              title="Dashboard Home"
            >
              <Icons.Home />
            </button>

            <button
              onClick={() => setTabSidebar('reservas')}
              className={`relative w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all cursor-pointer ${
                tabSidebar === 'reservas'
                  ? 'bg-gradient-to-br from-[#0B3B60]/90 to-[#124977]/90 text-white border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-110'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              title="Calendario de Reservas"
            >
              <Icons.Calendar />
              <span className="absolute -left-1 w-2 h-7 rounded-r-full bg-[#C5A059] shadow-[0_0_12px_#C5A059]" />
            </button>

            <button
              onClick={() => setTabSidebar('huespedes')}
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all cursor-pointer ${
                tabSidebar === 'huespedes' ? 'bg-white/20 text-white border border-white/30' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              title="Directorio de Huéspedes"
            >
              <Icons.Users />
            </button>

            <button
              onClick={() => setTabSidebar('checklists')}
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all cursor-pointer ${
                tabSidebar === 'checklists' ? 'bg-white/20 text-white border border-white/30' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              title="Housekeeping & Limpieza"
            >
              <Icons.ClipboardList />
            </button>

            <button
              onClick={() => setTabSidebar('llaves')}
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all cursor-pointer ${
                tabSidebar === 'llaves' ? 'bg-white/20 text-white border border-white/30' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              title="Control de Llaves"
            >
              <Icons.Key />
            </button>

          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-xs font-mono text-[#E8DDD0] font-bold shadow-inner">
            ACH
          </div>
        </aside>

        {/* ÁREA DE TRABAJO (MÁS ESPACIO Y PADDING) */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col xl:flex-row gap-10 overflow-hidden">
          
          {/* PANEL IZQUIERDO: NUEVA RESERVA + CALENDARIO DE SELECCIÓN */}
          <div className="w-full xl:w-[380px] flex flex-col gap-8 shrink-0">
            
            <div className="bg-white/[0.04] backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] space-y-8">
              
              <button
                onClick={() => setModalNueva(true)}
                className="w-full bg-gradient-to-r from-[#0B3B60] via-[#124977] to-[#0B3B60] hover:from-[#124977] hover:to-[#0B3B60] text-white py-5 px-6 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-[0_6px_30px_rgba(11,59,96,0.5)] border border-cyan-400/30 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span className="text-xl leading-none">+</span>
                <span>NUEVA RESERVA</span>
              </button>

              {/* CALENDARIO DE SELECCIÓN MUY AMPLIO */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 space-y-5">
                <div className="flex items-center justify-between text-sm px-1 pb-2">
                  <span className="font-bold text-base text-white tracking-wide">Septiembre 2026</span>
                  <div className="flex items-center gap-3 text-stone-400">
                    <button className="hover:text-white transition-colors text-lg">‹</button>
                    <button className="hover:text-white transition-colors text-lg">›</button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#C5A059] pb-2">
                  <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                </div>

                <div className="grid grid-cols-7 gap-y-4 text-center text-sm font-medium text-stone-300">
                  <span className="text-transparent">0</span>
                  <span className="cursor-pointer hover:text-white transition-all">1</span>
                  <span className="cursor-pointer hover:text-white transition-all">2</span>
                  <span className="cursor-pointer hover:text-white transition-all">3</span>
                  <span className="cursor-pointer hover:text-white transition-all">4</span>
                  <span className="cursor-pointer hover:text-white transition-all">5</span>
                  <span className="cursor-pointer hover:text-white transition-all">6</span>

                  <span className="cursor-pointer hover:text-white transition-all">7</span>
                  <span className="cursor-pointer hover:text-white transition-all">8</span>
                  <span className="cursor-pointer hover:text-white transition-all">9</span>
                  <span className="cursor-pointer hover:text-white transition-all">10</span>
                  <span className="cursor-pointer hover:text-white transition-all">11</span>
                  <span className="cursor-pointer hover:text-white transition-all">12</span>
                  <span className="cursor-pointer hover:text-white transition-all">13</span>

                  <span className="cursor-pointer hover:text-white transition-all">14</span>
                  <span className="cursor-pointer hover:text-white transition-all">15</span>
                  <span className="cursor-pointer hover:text-white transition-all">16</span>
                  <span className="cursor-pointer hover:text-white transition-all">17</span>
                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">18</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">19</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">20</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">21</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">22</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>

                  {/* Día 23 (Hoy) en Dorado */}
                  <div 
                    onClick={() => { setDiaActivo(23); setFiltroTiempo('hoy'); }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <span className="w-9 h-9 rounded-full border-2 border-[#C5A059] bg-[#C5A059]/20 text-[#FAF7F2] font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(197,160,89,0.6)] group-hover:scale-110 transition-transform">
                      23
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1" />
                  </div>

                  <span className="cursor-pointer hover:text-white flex items-center justify-center">24</span>

                  {/* Día 25 en Azul */}
                  <div 
                    onClick={() => { setDiaActivo(25); setFiltroTiempo('hoy'); }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <span className="w-9 h-9 rounded-full bg-blue-500/40 border border-blue-400/50 text-white font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform">
                      25
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">26</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="cursor-pointer hover:text-white">27</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-1" />
                  </div>
                </div>
              </div>

              {/* Status Box */}
              <div className="pt-4 text-sm space-y-3 border-t border-white/10">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Día Activo:</span>
                  <span className="font-bold text-[#E8DDD0]">{diaActivo} Septiembre 2026</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Llegadas de Hoy:</span>
                  <span className="font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 text-xs">2 Entradas</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Salidas de Hoy:</span>
                  <span className="font-semibold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 text-xs">1 Salida</span>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================
              4. PANEL DERECHO: PARRILLA DE OCUPACIÓN AMPLIA
              ======================================================== */}
          <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-8 sm:p-10 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between overflow-hidden">
            
            {/* Header de la Parrilla */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] inline-block" />
                <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                  Vista General de Ocupación
                </h2>
              </div>

              {/* Pestañas (Hoy, Semana, Mes, Año) más amplias */}
              <div className="bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-xl flex items-center gap-2 text-sm font-semibold text-stone-300">
                <button
                  onClick={() => { setFiltroTiempo('hoy'); setDiaActivo(23); }}
                  className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                    filtroTiempo === 'hoy'
                      ? 'bg-gradient-to-r from-[#0B3B60] to-[#124977] text-white border border-cyan-400/40 shadow-lg font-bold'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  Hoy
                </button>

                <button
                  onClick={() => setFiltroTiempo('semana')}
                  className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                    filtroTiempo === 'semana'
                      ? 'bg-gradient-to-r from-[#0B3B60] to-[#124977] text-white border border-cyan-400/40 shadow-lg font-bold'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  Semana
                </button>

                <button
                  onClick={() => setFiltroTiempo('mes')}
                  className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                    filtroTiempo === 'mes'
                      ? 'bg-gradient-to-r from-[#0B3B60] to-[#124977] text-white border border-cyan-400/40 shadow-lg font-bold'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  Mes
                </button>

                <button
                  onClick={() => setFiltroTiempo('ano')}
                  className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                    filtroTiempo === 'ano'
                      ? 'bg-gradient-to-r from-[#0B3B60] to-[#124977] text-white border border-cyan-400/40 shadow-lg font-bold'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  Año
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6">
              <button
                onClick={() => { setDiaActivo(23); setFiltroTiempo('hoy'); }}
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full border border-white/15 backdrop-blur-xl shadow-md text-sm font-semibold transition-all cursor-pointer"
              >
                <Icons.Sparkles />
                <span>IR A HOY</span>
              </button>

              <div className="flex items-center gap-2 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-xl text-sm text-stone-300 w-full sm:w-80 shadow-inner">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Buscar estancia o huésped..."
                  className="w-full bg-transparent outline-none text-white placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* ========================================================
                RUTEO INTERACTIVO DE LAS VISTAS (MUCHO MÁS AMPLIAS)
                ======================================================== */}

            {filtroTiempo === 'hoy' && (
              <div className="flex-1 py-4 space-y-6 animate-in fade-in duration-500 overflow-y-auto pr-2">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-lg font-bold text-[#C5A059] uppercase tracking-widest">
                    Operación de Hoy (Septiembre {diaActivo})
                  </h3>
                  <span className="text-sm text-stone-400">
                    {reservasHoy.length} Huéspedes Activos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reservasHoy.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setReservaModal(r)}
                      className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/15 p-8 rounded-3xl backdrop-blur-2xl shadow-xl cursor-pointer transition-all hover:scale-[1.02] space-y-5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">{r.huesped}</span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                          {r.estado}
                        </span>
                      </div>

                      <p className="text-sm text-[#C5A059] font-medium tracking-wide">{r.habitacionNombre}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-5 rounded-2xl border border-white/5">
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Check-in</span>
                          <span className="font-semibold text-white text-base">{r.mes} {r.diaInicio} • {r.checkInHora}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">Check-out</span>
                          <span className="font-semibold text-white text-base">{r.mes} {r.diaInicio + r.duracionDias} • {r.checkOutHora}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-stone-400">{r.personas}</span>
                        <span className="font-mono font-bold text-white text-xl">{r.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filtroTiempo === 'semana' && (
              <div className="flex-1 animate-in fade-in duration-500 flex flex-col">
                <div className="flex items-center justify-between pb-5 text-sm">
                  <span className="text-[#C5A059] font-bold text-lg tracking-wide">Semana 38: 21 al 27 de Septiembre</span>
                </div>

                <div className="flex-1 overflow-x-auto border border-white/10 rounded-3xl bg-black/20 backdrop-blur-md">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-white/[0.04] border-b border-white/10 text-stone-300 text-xs font-bold">
                        <th className="py-5 px-6 w-64 sticky left-0 bg-[#071326]/90 border-r border-white/10">ESTANCIA</th>
                        {DIAS_SEMANA_ACTUAL.map((d) => (
                          <th key={d.num} className={`py-4 px-4 text-center border-r border-white/5 ${d.esHoy ? 'bg-[#C5A059]/20 text-white shadow-inner' : ''}`}>
                            <span className="block text-[11px] text-stone-400 uppercase tracking-widest">{d.letra}</span>
                            <span className="text-lg mt-1 block">{d.num}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {HABITACIONES_FILAS.map((hab) => (
                        <tr key={hab.id} className="h-24 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 sticky left-0 bg-[#071326]/90 border-r border-white/10">
                            <span className="text-white font-bold text-sm block">{hab.nombre}</span>
                            <span className="text-xs text-[#C5A059] mt-1 block">{hab.tarifa}</span>
                          </td>
                          {DIAS_SEMANA_ACTUAL.map((d) => {
                            const res = reservas.find(
                              r => r.habitacionId === hab.id && r.diaInicio <= d.num && (r.diaInicio + r.duracionDias) > d.num
                            );
                            return (
                              <td key={d.num} className="p-2 border-r border-white/5 text-center relative">
                                {res && res.diaInicio === d.num && (
                                  <div
                                    onClick={() => setReservaModal(res)}
                                    style={{ width: `calc(${res.duracionDias * 100}% - 8px)` }}
                                    className={`absolute top-3 bottom-3 left-1 z-10 rounded-2xl px-4 py-2 backdrop-blur-xl border cursor-pointer flex flex-col justify-center text-left ${res.colorGlass} hover:scale-[1.01] transition-all`}
                                  >
                                    <span className="font-bold text-xs truncate drop-shadow-md">{res.huesped}</span>
                                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-md mt-1 w-max">
                                      IN {res.checkInHora} / OUT {res.checkOutHora}
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filtroTiempo === 'mes' && (
              <div className="flex-1 animate-in fade-in duration-500 flex flex-col">
                <div className="flex items-center justify-between pb-4 text-sm">
                  <span className="text-[#C5A059] font-bold text-lg tracking-wide">Parrilla Mensual: Septiembre 2026</span>
                </div>

                <div className="flex-1 overflow-x-auto border border-white/10 rounded-3xl bg-black/20 backdrop-blur-md">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-white/[0.04] border-b border-white/10 text-xs font-bold text-stone-300">
                        <th className="py-5 px-6 w-64 sticky left-0 bg-[#071326]/90 backdrop-blur-2xl z-20 border-r border-white/10">
                          HABITACIÓN
                        </th>
                        {DIAS_MES_COMPLETO.map((d) => (
                          <th
                            key={d.num}
                            onClick={() => { setDiaActivo(d.num); setFiltroTiempo('hoy'); }}
                            className={`py-3 px-2 text-center min-w-[60px] cursor-pointer transition-colors border-r border-white/5 ${
                              d.num === diaActivo ? 'bg-[#C5A059]/25 text-[#FAF7F2] font-black' : 'hover:bg-white/5'
                            }`}
                          >
                            <span className="block text-[10px] text-stone-400 mb-1">{d.letra}</span>
                            <span className="text-base">{d.num}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {HABITACIONES_FILAS.map((hab) => (
                        <tr key={hab.id} className="hover:bg-white/[0.02] transition-colors h-24">
                          <td className="py-4 px-6 sticky left-0 bg-[#071326]/90 backdrop-blur-2xl z-10 border-r border-white/10">
                            <span className="font-bold text-white block text-sm">{hab.nombre}</span>
                            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block pt-1.5">{hab.tipo}</span>
                          </td>
                          {DIAS_MES_COMPLETO.map((d) => {
                            const res = reservas.find(r => r.habitacionId === hab.id && r.diaInicio === d.num);
                            return (
                              <td key={d.num} className={`p-1.5 border-r border-white/5 relative align-middle ${d.num === diaActivo ? 'bg-[#C5A059]/10' : ''}`}>
                                {res && (
                                  <div
                                    onClick={() => setReservaModal(res)}
                                    style={{ width: `${res.duracionDias * 60 - 8}px` }}
                                    className={`absolute top-2.5 bottom-2.5 left-1.5 z-10 rounded-[1rem] px-3 py-2 backdrop-blur-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-center overflow-hidden ${res.colorGlass}`}
                                  >
                                    <div className="flex items-center justify-between text-[9px] font-bold font-mono pb-1">
                                      <span className="bg-black/40 px-1.5 py-0.5 rounded">IN {res.checkInHora}</span>
                                    </div>
                                    <span className="text-xs font-bold truncate block drop-shadow-md">{res.huesped}</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filtroTiempo === 'ano' && (
              <div className="flex-1 py-8 space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#C5A059] uppercase tracking-widest">
                    Balance Anual de Reservas • Abadía Casa Hotel 2026
                  </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre (Actual)', 'Octubre', 'Noviembre', 'Diciembre'].map((mes, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setFiltroTiempo('mes')}
                      className={`p-6 rounded-[2rem] border backdrop-blur-xl cursor-pointer transition-all hover:scale-105 text-left space-y-2 ${
                        idx === 8 
                          ? 'bg-[#0B3B60]/40 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                          : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#C5A059] uppercase block tracking-wider">Mes {idx + 1}</span>
                      <h4 className="text-lg font-bold text-white">{mes}</h4>
                      <p className="text-xs text-stone-400 pt-2">
                        {idx === 8 ? `${reservas.length} Reservas confirmadas` : 'Ocupación proyectada'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.04] p-8 rounded-[2rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                  <div>
                    <span className="text-xs text-stone-400 uppercase font-bold tracking-widest block pb-1">Ingreso Proyectado Anual</span>
                    <span className="text-3xl font-bold text-white">$148.500.000 COP</span>
                  </div>
                  <button 
                    onClick={() => setFiltroTiempo('mes')}
                    className="bg-[#0B3B60] hover:bg-[#124977] text-white px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider border border-cyan-400/30 shadow-lg cursor-pointer transition-all active:scale-95"
                  >
                    Ver Mes en Curso
                  </button>
                </div>
              </div>
            )}

            {/* PIE DEL PANEL */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400 border-t border-white/10 mt-6">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                  <span>Hospedado / Check-In</span>
                </span>
                <span className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                  <span>Confirmada</span>
                </span>
              </div>

              <span className="font-mono text-xs text-[#C5A059] tracking-widest">
                Abadía Casa Hotel • Sistema Central
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          MODALES ULTRA ESPACIOSOS EN GLASS
          ======================================================== */}
      {reservaModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setReservaModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#071326]/95 backdrop-blur-3xl rounded-[3rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.9)] border border-white/20 space-y-8 text-left text-white animate-in zoom-in-95 duration-300"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono tracking-widest text-[#C5A059] font-bold block">
                  Reserva #{reservaModal.id.toUpperCase()}
                </span>
                <h3 className="text-3xl font-bold text-white">
                  {reservaModal.huesped}
                </h3>
                <span className="text-sm text-stone-400 font-light block pt-1">
                  Habitación: <strong className="text-cyan-400">{reservaModal.habitacionNombre}</strong>
                </span>
              </div>
              <button 
                onClick={() => setReservaModal(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 text-sm">
              <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] space-y-2 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-md border border-emerald-500/30 inline-block">
                  Check-in (Entrada)
                </span>
                <p className="font-bold text-white text-lg pt-1">{reservaModal.mes} {reservaModal.diaInicio}</p>
                <p className="text-stone-400 text-sm">Hora estipulada: {reservaModal.checkInHora}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] space-y-2 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-md border border-amber-500/30 inline-block">
                  Check-out (Salida)
                </span>
                <p className="font-bold text-white text-lg pt-1">{reservaModal.mes} {reservaModal.diaInicio + reservaModal.duracionDias}</p>
                <p className="text-stone-400 text-sm">Hora límite: {reservaModal.checkOutHora}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <div>
                <span className="text-stone-400 block text-xs uppercase font-bold tracking-wider pb-1">Monto Liquidado</span>
                <span className="text-2xl font-bold text-[#C5A059]">{reservaModal.total}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block text-xs uppercase font-bold tracking-wider pb-1">Duración</span>
                <span className="text-base font-semibold text-stone-200">{reservaModal.duracionDias} Noches ({reservaModal.personas})</span>
              </div>
            </div>

            <button
              onClick={() => contactarWhatsApp(reservaModal)}
              className="w-full bg-[#25D366]/90 hover:bg-[#25D366] text-white py-5 px-6 rounded-[2rem] text-sm font-bold uppercase tracking-widest shadow-[0_4px_30px_rgba(37,211,102,0.4)] border border-emerald-300/40 backdrop-blur-xl transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Contactar vía WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL NUEVA RESERVA ESPACIOSO */}
      {modalNueva && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setModalNueva(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#071326]/95 backdrop-blur-3xl rounded-[3rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.9)] border border-white/20 space-y-8 text-left text-white animate-in zoom-in-95 duration-300"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-wide">Registrar Reserva</h3>
                <span className="text-sm text-[#C5A059] font-mono mt-1 block">Abadía Casa Hotel</span>
              </div>
              <button 
                onClick={() => setModalNueva(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={crearReserva} className="space-y-5 text-sm">
              <div className="space-y-2">
                <label className="font-semibold text-stone-300 uppercase tracking-widest text-xs ml-1">Huésped Titular</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={fHuesped}
                  onChange={(e) => setFHuesped(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 outline-none focus:border-[#C5A059] focus:bg-white/10 text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-stone-300 uppercase tracking-widest text-xs ml-1">Estancia Seleccionada</label>
                <select
                  value={fHab}
                  onChange={(e) => setFHab(e.target.value)}
                  className="w-full bg-[#071326] border border-white/15 rounded-2xl px-5 py-4 outline-none focus:border-[#C5A059] text-white transition-all"
                >
                  {HABITACIONES_FILAS.map((h) => (
                    <option key={h.id} value={h.id}>{h.nombre} ({h.tipo} - {h.tarifa})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-cyan-400 uppercase tracking-widest text-xs ml-1">Día Ingreso (Sept)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={fDia}
                    onChange={(e) => setFDia(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 outline-none text-white focus:border-cyan-400 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-[#C5A059] uppercase tracking-widest text-xs ml-1">Noches a Reservar</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={fNoches}
                    onChange={(e) => setFNoches(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 outline-none text-white focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 pb-2">
                <label className="font-semibold text-stone-300 uppercase tracking-widest text-xs ml-1">Tarifa Total Calculada</label>
                <input
                  type="text"
                  value={fMonto}
                  onChange={(e) => setFMonto(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 outline-none text-white font-mono text-lg transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0B3B60] via-[#124977] to-[#0B3B60] hover:from-[#124977] hover:to-[#0B3B60] text-white py-5 rounded-[2rem] font-bold uppercase tracking-widest shadow-[0_8px_30px_rgba(11,59,96,0.5)] border border-cyan-400/40 transition-all cursor-pointer mt-4 hover:scale-[1.02]"
              >
                Insertar en Parrilla Oficial
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}