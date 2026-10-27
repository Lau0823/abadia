'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  DoorOpen,
  Sparkles,
  Users2,
  DollarSign,
  Receipt,
  Globe2,
  Plus,
  Search,
  Bell,
  Sun,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Bed,
  Edit3,
  X,
  Star,
  Trash2,
  Phone,
  CheckCircle2,
  Printer,
  Image as ImageIcon
} from 'lucide-react';

// ==========================================
// 1. TIPOS DE DATOS
// ==========================================
export type RoomStatus = 'disponible' | 'ocupada' | 'aseo' | 'mantenimiento';

export interface Room {
  id: string;
  number: string;
  type: string;
  area: string;
  beds: string;
  description: string;
  baseGuests: number;
  maxGuests: number;
  basePrice: number;
  extraPersonPrice: number;
  highSeasonPrice: number;
  status: RoomStatus;
  qualities: string[];
  images: string[];
}

export interface Client {
  id: string;
  fullName: string;
  docType: 'CC' | 'CE' | 'Pasaporte';
  docNumber: string;
  phone: string;
  city: string;
  vehiclePlate: string;
  notes: string;
}

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  bedSheetsChanged: boolean;
  bathroomDisinfected: boolean;
  whiteTowelsStocked: boolean;
  minibarReplenished: boolean;
  acChecked: boolean;
  status: 'pendiente' | 'en_progreso' | 'aprobada';
}

// ==========================================
// 2. DATOS INICIALES
// ==========================================
const PRESET_QUALITIES = [
  'Cama King Size',
  'Aire Acondicionado Inverter',
  'Balcón Vista al Mar',
  'Hamaca de San Jacinto',
  'Jacuzzi Privado',
  'Ducha a Cielo Abierto',
  'WiFi 500 Mbps',
  'Desayuno Costeño Incluido'
];

const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-101',
    number: '101',
    type: 'Suite Colonial Balcón',
    area: '42 m²',
    beds: '1 Cama King Size',
    description: 'Habitación colonial con cielo raso en madera, baño privado a cielo abierto y salida directa al jardín central.',
    baseGuests: 2,
    maxGuests: 3,
    basePrice: 380000,
    extraPersonPrice: 85000,
    highSeasonPrice: 480000,
    status: 'ocupada',
    qualities: ['Cama King Size', 'Aire Acondicionado Inverter', 'Jacuzzi Privado'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'room-102',
    number: '102',
    type: 'Habitación Familiar Costeña',
    area: '48 m²',
    beds: '2 Camas Queen',
    description: 'Espacio fresco pensado para familias o grupos de amigos con vista a los manglares de Cispatá.',
    baseGuests: 4,
    maxGuests: 5,
    basePrice: 450000,
    extraPersonPrice: 70000,
    highSeasonPrice: 560000,
    status: 'disponible',
    qualities: ['Aire Acondicionado Inverter', 'Desayuno Costeño Incluido', 'WiFi 500 Mbps'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'room-103',
    number: '103',
    type: 'Junior Suite Palmera',
    area: '35 m²',
    beds: '1 Cama King Size',
    description: 'Iluminación natural con hamaca tradicional tejida y minibar con bebidas refrescantes locales.',
    baseGuests: 2,
    maxGuests: 2,
    basePrice: 320000,
    extraPersonPrice: 65000,
    highSeasonPrice: 410000,
    status: 'aseo',
    qualities: ['Cama King Size', 'Hamaca de San Jacinto', 'WiFi 500 Mbps'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'room-104',
    number: '104',
    type: 'Suite Romántica El Faro',
    area: '38 m²',
    beds: '1 Cama King Size',
    description: 'Ambiente privado y sereno, tina artesanal y vista privilegiada al atardecer de San Antero.',
    baseGuests: 2,
    maxGuests: 2,
    basePrice: 395000,
    extraPersonPrice: 85000,
    highSeasonPrice: 490000,
    status: 'disponible',
    qualities: ['Jacuzzi Privado', 'Balcón Vista al Mar', 'Desayuno Costeño Incluido'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'room-105',
    number: '105',
    type: 'Estándar Superior Jardín',
    area: '32 m²',
    beds: '1 Cama Queen + 1 Sencilla',
    description: 'Habitación silenciosa de techos altos rodeada de palmeras y helechos nativos.',
    baseGuests: 2,
    maxGuests: 3,
    basePrice: 280000,
    extraPersonPrice: 60000,
    highSeasonPrice: 360000,
    status: 'disponible',
    qualities: ['Aire Acondicionado Inverter', 'WiFi 500 Mbps'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'room-106',
    number: '106',
    type: 'Master Suite Presidencial',
    area: '56 m²',
    beds: '1 Cama King + Sala Lounge',
    description: 'La habitación más exclusiva de Abadía: terraza privada, jacuzzi exterior y servicio personalizado.',
    baseGuests: 2,
    maxGuests: 4,
    basePrice: 580000,
    extraPersonPrice: 95000,
    highSeasonPrice: 720000,
    status: 'ocupada',
    qualities: ['Jacuzzi Privado', 'Balcón Vista al Mar', 'Hamaca de San Jacinto', 'Desayuno Costeño Incluido'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
export default function AbadiaDashboard() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'calendario' | 'habitaciones' | 'aseo' | 'clientes' | 'finanzas' | 'facturacion' | 'web'>('resumen');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Estados de Tareas de Aseo
  const [cleaningTasks, setCleaningTasks] = useState<HousekeepingTask[]>([
    { id: 't-101', roomNumber: '101', bedSheetsChanged: true, bathroomDisinfected: true, whiteTowelsStocked: true, minibarReplenished: false, acChecked: true, status: 'en_progreso' },
    { id: 't-103', roomNumber: '103', bedSheetsChanged: false, bathroomDisinfected: false, whiteTowelsStocked: false, minibarReplenished: false, acChecked: false, status: 'pendiente' },
    { id: 't-106', roomNumber: '106', bedSheetsChanged: true, bathroomDisinfected: true, whiteTowelsStocked: true, minibarReplenished: true, acChecked: true, status: 'aprobada' },
  ]);

  // Clientes
  const [clients, setClients] = useState<Client[]>([
    { id: 'c-1', fullName: 'Carlos Mario Restrepo', docType: 'CC', docNumber: '98.541.220', phone: '+57 312 450 8899', city: 'Medellín', vehiclePlate: 'KLR-450', notes: 'Prefiere café sin azúcar y solicita toallas adicionales para la playa.' },
    { id: 'c-2', fullName: 'Juliana Gómez Silva', docType: 'CC', docNumber: '1.020.334.890', phone: '+57 300 876 5432', city: 'Bogotá', vehiclePlate: 'WNZ-112', notes: 'Alérgica a mariscos. Celebrando aniversario.' }
  ]);

  // Finanzas / Mes seleccionado
  const [selectedMonth, setSelectedMonth] = useState('Octubre 2026');

  // Modal Factura
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Alternar Estado de Habitación en 1 Clic (Doña Gloria)
  const toggleRoomStatus = (roomId: string) => {
    const sequence: Record<RoomStatus, RoomStatus> = {
      disponible: 'ocupada',
      ocupada: 'aseo',
      aseo: 'mantenimiento',
      mantenimiento: 'disponible'
    };
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: sequence[r.status] } : r));
  };

  const handleSaveRoom = (roomData: Partial<Room>) => {
    if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...roomData } as Room : r));
    } else {
      setRooms(prev => [...prev, roomData as Room]);
    }
    setEditingRoom(null);
  };

  const toggleCleaningItem = (taskId: string, field: keyof HousekeepingTask) => {
    setCleaningTasks(prev => prev.map(task => {
      if (task.id === taskId && typeof task[field] === 'boolean') {
        return { ...task, [field]: !task[field] };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-[#ede8df] text-[#121316] font-sans p-3 sm:p-6 flex justify-center items-center">
      {/* Contenedor Principal tipo Tableta Editorial Bento */}
      <div className="w-full max-w-[1600px] h-[95vh] bg-[#FAF8F5] border border-[#E3DCD1] rounded-[2.8rem] shadow-2xl flex overflow-hidden">
        
        {/* ========================================== */}
        {/* DOCK LATERAL IZQUIERDO (Negro Mate #121316) */}
        {/* ========================================== */}
        <aside className="w-64 bg-[#121316] text-white flex flex-col justify-between p-6 shrink-0">
          <div>
            {/* Logo e Identidad */}
            <div className="flex items-center gap-3 pb-8 border-b border-white/10">
              <div className="w-11 h-11 rounded-2xl bg-[#bef264] flex items-center justify-center text-[#121316] font-black text-xl shadow-lg shadow-[#bef264]/20">
                A
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight leading-tight">Abadía</h1>
                <p className="text-[11px] text-[#A19D94] font-medium tracking-wide">CASA HOTEL • SAN ANTERO</p>
              </div>
            </div>

            {/* Navegación Principal */}
            <div className="mt-6 space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B685F] px-3 mb-2">Operación</p>
              
              <button
                onClick={() => setActiveTab('resumen')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'resumen' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Panel Principal</span>
              </button>

              <button
                onClick={() => setActiveTab('habitaciones')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'habitaciones' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <DoorOpen className="w-4 h-4" /> Habitaciones (6)
                </span>
                <span className="text-[10px] bg-white/10 text-neutral-300 font-bold px-2 py-0.5 rounded-full">6</span>
              </button>

              <button
                onClick={() => setActiveTab('calendario')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'calendario' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Calendario Visual</span>
              </button>

              <button
                onClick={() => setActiveTab('aseo')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'aseo' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Aseo & Camarería</span>
              </button>

              <button
                onClick={() => setActiveTab('clientes')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'clientes' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users2 className="w-4 h-4" />
                <span>Huéspedes & Registro</span>
              </button>
            </div>

            {/* Sección Administrativa */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B685F] px-3 mb-2">Administración</p>

              <button
                onClick={() => setActiveTab('finanzas')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'finanzas' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Finanzas & Recaudo</span>
              </button>

              <button
                onClick={() => setActiveTab('facturacion')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'facturacion' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Facturas Descargables</span>
              </button>

              <button
                onClick={() => setActiveTab('web')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'web' ? 'bg-white/10 text-[#bef264]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>Banners Web San Antero</span>
              </button>
            </div>
          </div>

          {/* Perfil de Doña Gloria */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fef08a] flex items-center justify-center text-[#121316] font-bold text-sm">
                DG
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Doña Gloria</p>
                <p className="text-[10px] text-neutral-400">Administradora</p>
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#bef264] shadow-sm animate-pulse" />
          </div>
        </aside>

        {/* ========================================== */}
        {/* ÁREA CENTRAL PRINCIPAL */}
        {/* ========================================== */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Barra Superior con Saludo y Acciones */}
          <header className="px-8 py-6 border-b border-[#E8E2D8] flex items-center justify-between shrink-0 bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8C8275]">Abadía Casa Hotel • San Antero, Córdoba</p>
              <h2 className="text-2xl font-black text-[#121316] tracking-tight">Buenos días, Doña Gloria</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar huésped, cédula o reserva..."
                  className="pl-10 pr-4 py-2 bg-white border border-[#E3DCD1] rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#121316] w-64"
                />
              </div>

              <button
                onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
                className="bg-[#121316] text-[#bef264] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 transition shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" /> Crear Habitación
              </button>
            </div>
          </header>

          {/* VISTAS MODULARES */}
          <div className="p-8 space-y-8 flex-1">
            
            {/* VISTA 1: RESUMEN BENTO (Estilo idéntico a referencia Intelly) */}
            {activeTab === 'resumen' && (
              <div className="space-y-8">
                {/* 4 Cards Bento Pastel Superiores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Card 1: Amarillo Pastel */}
                  <div className="bg-[#FEF9C3] border border-[#FEF08A] rounded-[2rem] p-5 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#854D0E]">Habitaciones</span>
                      <DoorOpen className="w-5 h-5 text-[#854D0E] opacity-70" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-[#121316]">4 <span className="text-sm font-semibold text-neutral-600">/ 6 Ocupadas</span></h3>
                      <p className="text-xs text-[#854D0E] font-medium mt-1">66.6% de ocupación en Abadía</p>
                    </div>
                  </div>

                  {/* Card 2: Rosa Pastel */}
                  <div className="bg-[#FCE7F3] border border-[#FBCFE8] rounded-[2rem] p-5 flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#9D174D]">Llegadas Hoy</span>
                      <Users2 className="w-5 h-5 text-[#9D174D] opacity-70" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-[#121316]">2 Check-ins</h3>
                      <p className="text-xs text-[#9D174D] font-medium mt-1">Familia Restrepo (Hab 101 y 106)</p>
                    </div>
                  </div>

                  {/* Card 3: Verde Pastel */}
                  <div className="bg-[#DCFCE7] border border-[#BBF7D0] rounded-[2rem] p-5 flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#166534]">Aseo & Limpieza</span>
                      <Sparkles className="w-5 h-5 text-[#166534] opacity-70" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-[#121316]">1 Pendiente</h3>
                      <p className="text-xs text-[#166534] font-medium mt-1">Habitación 103 lista a las 2:00 PM</p>
                    </div>
                  </div>

                  {/* Card 4: Azul Cielo Pastel */}
                  <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-[2rem] p-5 flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#075985]">Recaudo Octubre</span>
                      <DollarSign className="w-5 h-5 text-[#075985] opacity-70" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#121316]">$24.850.000</h3>
                      <p className="text-xs text-[#075985] font-medium mt-1">+18% frente al mes anterior</p>
                    </div>
                  </div>
                </div>

                {/* Grid Rápido de las 6 Habitaciones */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-black text-[#121316]">Estado de las 6 Habitaciones</h3>
                      <p className="text-xs text-neutral-500">Toca el botón de estado para cambiarlo directamente sin rodeos.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('habitaciones')}
                      className="text-xs font-bold text-[#121316] flex items-center gap-1 hover:underline"
                    >
                      Ver fotos y detalles <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {rooms.map(room => (
                      <RoomCardComponent
                        key={room.id}
                        room={room}
                        onToggleStatus={() => toggleRoomStatus(room.id)}
                        onEdit={() => { setEditingRoom(room); setIsModalOpen(true); }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 2: HABITACIONES (Con subida de fotos, cualidades y precio) */}
            {activeTab === 'habitaciones' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-[#121316]">Habitaciones de Abadía Casa Hotel</h3>
                    <p className="text-xs text-neutral-500">Administra las 6 habitaciones, sube varias fotografías, edita precios y amenidades.</p>
                  </div>
                  <button
                    onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
                    className="bg-[#121316] text-[#bef264] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 transition"
                  >
                    <Plus className="w-4 h-4" /> Nueva Habitación
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <RoomCardComponent
                      key={room.id}
                      room={room}
                      onToggleStatus={() => toggleRoomStatus(room.id)}
                      onEdit={() => { setEditingRoom(room); setIsModalOpen(true); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 3: CALENDARIO VISUAL (Bloques y puntos de color sin tocar nada) */}
            {activeTab === 'calendario' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-[#121316]">Calendario Visual de Reservas</h3>
                    <p className="text-xs text-neutral-500">Identifica las reservas y ocupaciones de un solo vistazo por color.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#bef264] block" /> Hab 101</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#fbcfe8] block" /> Hab 102</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#fef08a] block" /> Hab 104</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#bae6fd] block" /> Hab 106</span>
                  </div>
                </div>

                {/* Cuadrícula de Calendario */}
                <div className="bg-white border border-[#E3DCD1] rounded-[2rem] p-6 shadow-sm">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-neutral-400 pb-4 border-b border-neutral-100">
                    <div>Lunes</div>
                    <div>Martes</div>
                    <div>Miércoles</div>
                    <div>Jueves</div>
                    <div>Viernes</div>
                    <div>Sábado</div>
                    <div>Domingo</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                      const has101 = [5, 6, 7, 22, 23, 24].includes(day);
                      const has106 = [12, 13, 14, 22, 23, 24, 25].includes(day);
                      const has104 = [18, 19, 20].includes(day);
                      const isToday = day === 22;

                      return (
                        <div
                          key={day}
                          className={`min-h-[100px] border border-[#EFECE6] rounded-2xl p-2 flex flex-col justify-between transition-all ${
                            isToday ? 'bg-[#FAF6EC] border-[#121316] ring-1 ring-[#121316]' : 'bg-[#FAF8F5]/60 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-black ${isToday ? 'bg-[#121316] text-[#bef264] px-2 py-0.5 rounded-full' : 'text-neutral-700'}`}>
                              {day}
                            </span>
                            {/* Puntos automáticos de color */}
                            <div className="flex gap-1">
                              {has101 && <div className="w-2 h-2 rounded-full bg-[#84cc16]" />}
                              {has106 && <div className="w-2 h-2 rounded-full bg-[#0284c7]" />}
                              {has104 && <div className="w-2 h-2 rounded-full bg-[#eab308]" />}
                            </div>
                          </div>

                          <div className="space-y-1 my-1">
                            {has101 && (
                              <div className="bg-[#d9f99d] text-[#365314] text-[10px] font-black px-2 py-1 rounded-lg truncate shadow-xs">
                                Hab 101 • Restrepo
                              </div>
                            )}
                            {has106 && (
                              <div className="bg-[#bae6fd] text-[#075985] text-[10px] font-black px-2 py-1 rounded-lg truncate shadow-xs">
                                Hab 106 • Dr. Olivia
                              </div>
                            )}
                            {has104 && (
                              <div className="bg-[#fef08a] text-[#854d0e] text-[10px] font-black px-2 py-1 rounded-lg truncate shadow-xs">
                                Hab 104 • Gómez
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 4: ASEO Y CAMARERÍA (Checklist en 1 Clic) */}
            {activeTab === 'aseo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-[#121316]">Control de Camarería & Aseo</h3>
                  <p className="text-xs text-neutral-500">Marca con un solo toque cada tarea realizada antes de dar la habitación por lista.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cleaningTasks.map(task => (
                    <div key={task.id} className="bg-white border border-[#E3DCD1] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Habitación</span>
                            <h4 className="text-2xl font-black text-[#121316]">N° {task.roomNumber}</h4>
                          </div>
                          <span className={`text-xs font-black px-3 py-1 rounded-xl ${
                            task.status === 'aprobada' ? 'bg-[#dcfce7] text-[#166534]' :
                            task.status === 'en_progreso' ? 'bg-[#fef08a] text-[#854d0e]' : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}>
                            {task.status === 'aprobada' ? 'Aprobada' : task.status === 'en_progreso' ? 'En Limpieza' : 'Pendiente'}
                          </span>
                        </div>

                        {/* Checklist */}
                        <div className="mt-4 space-y-2.5">
                          <button
                            onClick={() => toggleCleaningItem(task.id, 'bedSheetsChanged')}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 text-xs font-medium"
                          >
                            <span>Cambio de Sábanas y Almohadas</span>
                            <CheckCircle2 className={`w-4 h-4 ${task.bedSheetsChanged ? 'text-[#84cc16]' : 'text-neutral-300'}`} />
                          </button>

                          <button
                            onClick={() => toggleCleaningItem(task.id, 'bathroomDisinfected')}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 text-xs font-medium"
                          >
                            <span>Desinfección de Baño y Ducha</span>
                            <CheckCircle2 className={`w-4 h-4 ${task.bathroomDisinfected ? 'text-[#84cc16]' : 'text-neutral-300'}`} />
                          </button>

                          <button
                            onClick={() => toggleCleaningItem(task.id, 'whiteTowelsStocked')}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 text-xs font-medium"
                          >
                            <span>Dotación de Toallas Blancas</span>
                            <CheckCircle2 className={`w-4 h-4 ${task.whiteTowelsStocked ? 'text-[#84cc16]' : 'text-neutral-300'}`} />
                          </button>

                          <button
                            onClick={() => toggleCleaningItem(task.id, 'minibarReplenished')}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 text-xs font-medium"
                          >
                            <span>Reposición de Agua y Minibar</span>
                            <CheckCircle2 className={`w-4 h-4 ${task.minibarReplenished ? 'text-[#84cc16]' : 'text-neutral-300'}`} />
                          </button>

                          <button
                            onClick={() => toggleCleaningItem(task.id, 'acChecked')}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 text-xs font-medium"
                          >
                            <span>Revisión de Aire Acondicionado</span>
                            <CheckCircle2 className={`w-4 h-4 ${task.acChecked ? 'text-[#84cc16]' : 'text-neutral-300'}`} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCleaningTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'aprobada' ? 'pendiente' : 'aprobada' } : t));
                        }}
                        className="mt-6 w-full py-3 bg-[#121316] text-[#bef264] rounded-2xl text-xs font-bold hover:bg-neutral-800 transition"
                      >
                        {task.status === 'aprobada' ? 'Desmarcar Aprobación' : 'Aprobar Habitación Lista'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 5: CLIENTES & HUÉSPEDES */}
            {activeTab === 'clientes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-[#121316]">Directorio de Clientes & Huéspedes</h3>
                    <p className="text-xs text-neutral-500">Datos personales, placas de vehículos y notas directas para la atención de Doña Gloria.</p>
                  </div>
                  <button
                    onClick={() => {
                      const name = prompt('Nombre completo del cliente:');
                      if (name) {
                        setClients([...clients, {
                          id: `c-${Date.now()}`,
                          fullName: name,
                          docType: 'CC',
                          docNumber: 'Nuevo',
                          phone: '+57 300 000 0000',
                          city: 'Colombia',
                          vehiclePlate: '---',
                          notes: 'Cliente registrado en recepción.'
                        }]);
                      }
                    }}
                    className="bg-[#121316] text-[#bef264] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 transition"
                  >
                    <Plus className="w-4 h-4" /> Registrar Huésped
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.map(client => (
                    <div key={client.id} className="bg-white border border-[#E3DCD1] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-black text-[#121316]">{client.fullName}</h4>
                            <p className="text-xs text-neutral-500">{client.docType}: {client.docNumber} • De: {client.city}</p>
                          </div>
                          <span className="text-[11px] font-bold bg-[#FAF8F5] border border-neutral-200 px-3 py-1 rounded-xl">
                            🚗 Placa: {client.vehiclePlate}
                          </span>
                        </div>

                        <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl text-xs text-neutral-700 border border-neutral-100">
                          <p className="font-bold text-[10px] uppercase text-neutral-400 mb-1">Notas de Doña Gloria:</p>
                          {client.notes}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-600">{client.phone}</span>
                        <a
                          href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition"
                        >
                          <Phone className="w-3.5 h-3.5" /> Abrir WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 6: FINANZAS & RECAUDO */}
            {activeTab === 'finanzas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-[#121316]">Recaudo por Mes y por Habitación</h3>
                    <p className="text-xs text-neutral-500">Consulta los ingresos exactos generados por cada una de las 6 habitaciones.</p>
                  </div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-[#E3DCD1] rounded-2xl px-4 py-2 text-xs font-bold"
                  >
                    <option value="Octubre 2026">Octubre 2026</option>
                    <option value="Septiembre 2026">Septiembre 2026</option>
                    <option value="Agosto 2026">Agosto 2026</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#FAF8F5] border border-[#E3DCD1] rounded-[2rem] p-6">
                    <p className="text-xs font-bold uppercase text-neutral-400">Total Ingresos Hospedaje</p>
                    <h4 className="text-3xl font-black text-[#121316] mt-2">$24.850.000 COP</h4>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E3DCD1] rounded-[2rem] p-6">
                    <p className="text-xs font-bold uppercase text-neutral-400">Habitación Más Rentable</p>
                    <h4 className="text-3xl font-black text-[#121316] mt-2">Habitación 106</h4>
                    <p className="text-xs text-emerald-700 font-bold mt-1">$6.960.000 COP recaudados</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E3DCD1] rounded-[2rem] p-6">
                    <p className="text-xs font-bold uppercase text-neutral-400">Promedio por Noche</p>
                    <h4 className="text-3xl font-black text-[#121316] mt-2">$414.000 COP</h4>
                  </div>
                </div>

                {/* Desglose por Habitación */}
                <div className="bg-white border border-[#E3DCD1] rounded-[2rem] p-6">
                  <h4 className="text-sm font-black text-[#121316] mb-4">Desglose de Ingresos - {selectedMonth}</h4>
                  <div className="space-y-3">
                    {[
                      { num: '101', val: 4560000, pct: '18%' },
                      { num: '102', val: 3600000, pct: '14%' },
                      { num: '103', val: 2880000, pct: '11%' },
                      { num: '104', val: 3950000, pct: '16%' },
                      { num: '105', val: 2900000, pct: '12%' },
                      { num: '106', val: 6960000, pct: '29%' },
                    ].map(item => (
                      <div key={item.num} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6]">
                        <span className="font-bold text-xs">Habitación {item.num}</span>
                        <div className="w-1/3 bg-neutral-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#121316] h-full" style={{ width: item.pct }} />
                        </div>
                        <span className="text-xs font-black">${item.val.toLocaleString('es-CO')} COP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 7: FACTURACIÓN */}
            {activeTab === 'facturacion' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-[#121316]">Facturación de Reservas Pagadas</h3>
                  <p className="text-xs text-neutral-500">Visualiza comprobantes detallados con membrete oficial de San Antero listos para imprimir.</p>
                </div>

                <div className="bg-white border border-[#E3DCD1] rounded-[2rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E3DCD1] text-neutral-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Factura #</th>
                        <th className="p-4">Huésped</th>
                        <th className="p-4">Habitación</th>
                        <th className="p-4">Noches</th>
                        <th className="p-4">Total Pagado</th>
                        <th className="p-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {[
                        { id: 'FAC-2026-089', client: 'Carlos Mario Restrepo', room: '101', nights: 3, total: 1140000 },
                        { id: 'FAC-2026-088', client: 'Juliana Gómez Silva', room: '104', nights: 2, total: 790000 },
                        { id: 'FAC-2026-087', client: 'Dr. Olivia Bennett', room: '106', nights: 4, total: 2320000 },
                      ].map(inv => (
                        <tr key={inv.id} className="hover:bg-neutral-50">
                          <td className="p-4 font-bold">{inv.id}</td>
                          <td className="p-4">{inv.client}</td>
                          <td className="p-4 font-semibold">Hab {inv.room}</td>
                          <td className="p-4">{inv.nights} noches</td>
                          <td className="p-4 font-black">${inv.total.toLocaleString('es-CO')} COP</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1.5 bg-[#121316] text-[#bef264] rounded-xl text-xs font-bold hover:bg-neutral-800"
                            >
                              Ver Comprobante
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VISTA 8: BANNERS WEB SAN ANTERO */}
            {activeTab === 'web' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-[#121316]">Gestión de Banners - Web Pública San Antero</h3>
                  <p className="text-xs text-neutral-500">Actualiza las fotografías y títulos de las 5 secciones de la página web de Abadía.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: '1. Banner Home / Principal', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', desc: 'Tu refugio boutique colonial en el Golfo de Morrosquillo.' },
                    { title: '2. Pestaña Gastronomía', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', desc: 'Sabores auténticos del Caribe: Pargo rojo, arroz con coco y patacón.' },
                    { title: '3. Lugares de la Casa', img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80', desc: 'Piscina, quiosco de palma, hamacas de descanso y jardines.' },
                    { title: '4. Qué Hacer en San Antero', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', desc: 'Manglares de la Bahía de Cispatá, avistamiento de delfines y volcanes de lodo.' },
                    { title: '5. Transporte & Traslados', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80', desc: 'Rutas seguras y traslados privados desde Montería, Tolú y Coveñas.' },
                  ].map((banner, idx) => (
                    <div key={idx} className="bg-white border border-[#E3DCD1] rounded-[2rem] overflow-hidden shadow-sm">
                      <div className="h-40 bg-neutral-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={banner.img} alt={banner.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                          <h4 className="text-white font-black text-base">{banner.title}</h4>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-neutral-600">{banner.desc}</p>
                        <button
                          onClick={() => alert(`Editor de foto activado para: ${banner.title}`)}
                          className="w-full py-2 bg-[#FAF8F5] border border-neutral-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-100"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Cambiar Fotografía del Banner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>

        {/* ========================================== */}
        {/* PANEL LATERAL DERECHO (Idéntico a Intelly UI) */}
        {/* ========================================== */}
        <aside className="w-80 bg-[#FAF8F5] border-l border-[#E3DCD1] p-6 flex flex-col justify-between shrink-0 overflow-y-auto hidden 2xl:flex">
          <div>
            {/* Header Calendario */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="text-xs font-black uppercase tracking-wider text-[#121316]">Octubre 2026</span>
              <span className="text-[10px] font-bold bg-[#bef264] text-[#121316] px-2 py-0.5 rounded-full">Hoy 22</span>
            </div>

            {/* Mini Calendario Numérico */}
            <div className="grid grid-cols-7 gap-1 text-center my-4 text-[11px]">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={i} className="text-neutral-400 font-bold py-1">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <div
                  key={day}
                  className={`py-1.5 rounded-xl font-bold transition-all ${
                    day === 22 ? 'bg-[#121316] text-[#bef264]' :
                    [5, 12, 18, 23].includes(day) ? 'bg-[#fef08a] text-[#854d0e]' : 'text-neutral-700 hover:bg-white'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Botón Acción Principal */}
            <button
              onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
              className="w-full py-3 bg-[#121316] text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition shadow-sm mb-6 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#bef264]" /> Crear Habitación
            </button>

            {/* Timeline del Día (Hoy) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#121316]">Actividad de Hoy</span>
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white border border-[#E3DCD1] rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">11:00 AM</span>
                  <h5 className="font-black text-xs text-[#121316] mt-1">Check-out Habitación 103</h5>
                  <p className="text-[11px] text-neutral-500">Revisión de minibar y entrega de llaves.</p>
                </div>

                <div className="p-3 bg-white border border-[#E3DCD1] rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">02:00 PM</span>
                  <h5 className="font-black text-xs text-[#121316] mt-1">Llegada Familia Restrepo</h5>
                  <p className="text-[11px] text-neutral-500">Habitaciones 101 y 106 preparadas.</p>
                </div>

                <div className="p-3 bg-white border border-[#E3DCD1] rounded-2xl">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">04:30 PM</span>
                  <h5 className="font-black text-xs text-[#121316] mt-1">Tour Manglares Cispatá</h5>
                  <p className="text-[11px] text-neutral-500">Coordinación de lancha en el muelle.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Clima San Antero */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-500" /> San Antero: 31°C</span>
            <span className="font-bold text-[#121316]">Brisa Marina</span>
          </div>
        </aside>
      </div>

      {/* ========================================== */}
      {/* MODAL: CREAR / EDITAR HABITACIÓN PRO */}
      {/* ========================================== */}
      {isModalOpen && (
        <CreateRoomModalComponent
          room={editingRoom}
          onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
          onSave={handleSaveRoom}
        />
      )}

      {/* ========================================== */}
      {/* MODAL: FACTURA / COMPROBANTE OFICIAL */}
      {/* ========================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-200 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-start pb-6 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8C8275]">Comprobante de Hospedaje</span>
                <h3 className="text-xl font-black text-[#121316] mt-1">{selectedInvoice.id}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            <div className="my-6 space-y-4 text-xs">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl">
                <p className="font-bold text-[#121316]">ABADÍA CASA HOTEL</p>
                <p className="text-neutral-500">NIT: 901.442.128-4 • RNT: 84920</p>
                <p className="text-neutral-500">San Antero, Córdoba, Colombia</p>
              </div>

              <div className="space-y-1">
                <p><span className="font-bold">Huésped:</span> {selectedInvoice.client}</p>
                <p><span className="font-bold">Habitación Asignada:</span> N° {selectedInvoice.room}</p>
                <p><span className="font-bold">Estadía:</span> {selectedInvoice.nights} Noches</p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-sm font-black">
                <span>Total Cancelado (COP):</span>
                <span className="text-lg">${selectedInvoice.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#121316] text-[#bef264] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-800"
              >
                <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. SUBCOMPONENTES AUXILIARES
// ==========================================

function RoomCardComponent({
  room,
  onToggleStatus,
  onEdit
}: {
  room: Room;
  onToggleStatus: () => void;
  onEdit: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(prev => (prev + 1) % room.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(prev => (prev - 1 + room.images.length) % room.images.length);
  };

  const statusConfig: Record<RoomStatus, { label: string; bg: string; text: string }> = {
    disponible: { label: 'Disponible', bg: 'bg-[#bef264]', text: 'text-[#121316]' },
    ocupada: { label: 'Huésped en Casa', bg: 'bg-[#fbcfe8]', text: 'text-[#831843]' },
    aseo: { label: 'Aseo Requerido', bg: 'bg-[#fed7aa]', text: 'text-[#7c2d12]' },
    mantenimiento: { label: 'Mantenimiento', bg: 'bg-[#e2e8f0]', text: 'text-[#334155]' },
  };

  return (
    <div className="bg-white border border-[#E3DCD1] rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Carrusel de Fotos */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 mb-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.images[imgIdx] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427'}
            alt={`Habitación ${room.number}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {room.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={prevImg} className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={nextImg} className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 bg-[#121316] text-white px-2.5 py-1 rounded-xl text-[11px] font-black">
            Habitación {room.number}
          </div>

          <button
            onClick={onEdit}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 hover:bg-white"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <h4 className="font-bold text-sm text-[#121316] leading-tight">{room.type}</h4>
          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{room.description}</p>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#6B6358] my-2.5">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {room.maxGuests} pax</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {room.area}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {room.qualities.slice(0, 2).map(q => (
            <span key={q} className="text-[9px] font-bold bg-[#FAF8F5] border border-neutral-200 px-2 py-0.5 rounded-md text-neutral-700">
              {q}
            </span>
          ))}
          {room.qualities.length > 2 && (
            <span className="text-[9px] text-neutral-400 font-bold self-center">+{room.qualities.length - 2}</span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Noche</span>
          <span className="text-xs font-black text-[#121316]">${room.basePrice.toLocaleString('es-CO')}</span>
        </div>

        <button
          onClick={onToggleStatus}
          title="Toca para alternar estado en 1 clic"
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-transform active:scale-95 shadow-xs ${
            statusConfig[room.status].bg
          } ${statusConfig[room.status].text}`}
        >
          {statusConfig[room.status].label}
        </button>
      </div>
    </div>
  );
}

function CreateRoomModalComponent({
  room,
  onClose,
  onSave
}: {
  room: Room | null;
  onClose: () => void;
  onSave: (data: Partial<Room>) => void;
}) {
  const [number, setNumber] = useState(room?.number || '');
  const [type, setType] = useState(room?.type || 'Suite Colonial');
  const [area, setArea] = useState(room?.area || '38 m²');
  const [beds, setBeds] = useState(room?.beds || '1 Cama King');
  const [description, setDescription] = useState(room?.description || '');
  const [baseGuests, setBaseGuests] = useState(room?.baseGuests || 2);
  const [maxGuests, setMaxGuests] = useState(room?.maxGuests || 4);
  const [basePrice, setBasePrice] = useState(room?.basePrice || 350000);
  const [extraPersonPrice, setExtraPersonPrice] = useState(room?.extraPersonPrice || 75000);
  const [highSeasonPrice, setHighSeasonPrice] = useState(room?.highSeasonPrice || 480000);
  const [qualities, setQualities] = useState<string[]>(room?.qualities || ['Cama King Size', 'Aire Acondicionado Inverter']);
  const [images, setImages] = useState<string[]>(
    room?.images || ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
  );
  const [imgUrl, setImgUrl] = useState('');
  const [customQuality, setCustomQuality] = useState('');

  const addImage = () => {
    if (imgUrl.trim()) {
      setImages([...images, imgUrl.trim()]);
      setImgUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const setPrimary = (index: number) => {
    const item = images[index];
    setImages([item, ...images.filter((_, i) => i !== index)]);
  };

  const toggleQuality = (q: string) => {
    setQualities(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q]);
  };

  const addCustomQuality = () => {
    if (customQuality.trim() && !qualities.includes(customQuality.trim())) {
      setQualities([...qualities, customQuality.trim()]);
      setCustomQuality('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: room?.id || `room-${Date.now()}`,
      number,
      type,
      area,
      beds,
      description,
      baseGuests: Number(baseGuests),
      maxGuests: Number(maxGuests),
      basePrice: Number(basePrice),
      extraPersonPrice: Number(extraPersonPrice),
      highSeasonPrice: Number(highSeasonPrice),
      qualities,
      images,
      status: room?.status || 'disponible'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FAF8F5] border border-[#E3DCD1] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 text-[#121316]">
        <div className="flex items-center justify-between pb-6 border-b border-[#E3DCD1]">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C8275]">Abadía Casa Hotel</span>
            <h3 className="text-2xl font-black mt-1">
              {room ? `Editar Habitación ${room.number}` : 'Nueva Habitación'}
            </h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#E3DCD1] flex items-center justify-center hover:bg-neutral-100">
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Subida de Múltiples Fotos */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#8C8275] mb-2">Galería de Fotos (Múltiples)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={imgUrl}
                onChange={e => setImgUrl(e.target.value)}
                placeholder="Pega enlace de foto (URL directa)..."
                className="flex-1 bg-white border border-[#E3DCD1] rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#121316]"
              />
              <button
                type="button"
                onClick={addImage}
                className="bg-[#121316] text-[#bef264] px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-neutral-800"
              >
                + Añadir Foto
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-neutral-200 border border-neutral-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Img ${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[#bef264] text-[#121316] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      Portada
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {i !== 0 && (
                      <button type="button" onClick={() => setPrimary(i)} className="p-1 bg-white rounded-md text-black hover:bg-[#bef264]">
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(i)} className="p-1 bg-red-500 rounded-md text-white hover:bg-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Datos Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#8C8275] mb-1">Número de Habitación</label>
              <input
                type="text"
                required
                value={number}
                onChange={e => setNumber(e.target.value)}
                placeholder="101"
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#8C8275] mb-1">Nombre / Categoría</label>
              <input
                type="text"
                required
                value={type}
                onChange={e => setType(e.target.value)}
                placeholder="Suite Colonial"
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#8C8275] mb-1">Área / Camas</label>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="40 m² - Cama King"
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>

          {/* Tarifas y Huéspedes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#F2EDE4] rounded-2xl">
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Base Huéspedes</label>
              <input
                type="number"
                min={1}
                value={baseGuests}
                onChange={e => setBaseGuests(Number(e.target.value))}
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Aforo Máximo</label>
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={e => setMaxGuests(Number(e.target.value))}
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Tarifa Noche (COP)</label>
              <input
                type="number"
                step={5000}
                value={basePrice}
                onChange={e => setBasePrice(Number(e.target.value))}
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2 text-xs font-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Persona Extra (COP)</label>
              <input
                type="number"
                step={5000}
                value={extraPersonPrice}
                onChange={e => setExtraPersonPrice(Number(e.target.value))}
                className="w-full bg-white border border-[#E3DCD1] rounded-xl p-2 text-xs font-bold"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8C8275] mb-1">Descripción de la Habitación</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalles de la habitación para Doña Gloria y los huéspedes..."
              className="w-full bg-white border border-[#E3DCD1] rounded-xl p-3 text-xs"
            />
          </div>

          {/* Cualidades & Amenidades */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8C8275] mb-1.5">Cualidades / Amenidades</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_QUALITIES.map(q => {
                const sel = qualities.includes(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => toggleQuality(q)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                      sel ? 'bg-[#121316] text-[#bef264]' : 'bg-white border border-[#E3DCD1] text-neutral-700'
                    }`}
                  >
                    {sel ? '✓ ' : '+ '} {q}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                value={customQuality}
                onChange={e => setCustomQuality(e.target.value)}
                placeholder="Otra cualidad..."
                className="flex-1 bg-white border border-[#E3DCD1] rounded-xl px-2.5 py-1 text-xs"
              />
              <button
                type="button"
                onClick={addCustomQuality}
                className="px-3 py-1 bg-neutral-200 rounded-xl text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E3DCD1]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[#E3DCD1] hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#121316] text-[#bef264] hover:bg-neutral-800"
            >
              Guardar Habitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}