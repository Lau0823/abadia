"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMonths, subMonths, getDaysInMonth, startOfMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchApi } from "@/lib/api";
import { UserGroupIcon, CalendarDaysIcon, Bars3BottomLeftIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from "@heroicons/react/24/outline";
import HuespedesModal from "@/components/HuespedesModal";
import TimelineCalendar from "@/components/TimelineCalendar";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarioPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isHuespedesModalOpen, setIsHuespedesModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'classic' | 'timeline'>('timeline');
  
  // Selected date state for sync with timeline
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [miniCalendarMonth, setMiniCalendarMonth] = useState<Date>(new Date());

  // Filter states
  const [filterConfirmed, setFilterConfirmed] = useState(true);
  const [filterPending, setFilterPending] = useState(true);
  const [filterCancelled, setFilterCancelled] = useState(false);

  const fetchReservas = async () => {
    try {
      const response = await fetchApi('/reservations');
      const data = Array.isArray(response) ? response : (response?.data || []);

      const mappedEvents = data.map((d: any) => ({ 
        title: `${d.cliente?.nombre || 'Sin Cliente'} - ${d.habitacion?.titulo || 'Habitación'}`, 
        start: new Date(d.checkIn), 
        end: new Date(d.checkOut),
        resource: d.habitacion?.titulo,
        reservationDetails: d
      }));

      if (mappedEvents.length > 0) {
        setEvents(mappedEvents);
      } else {
        throw new Error("Sin reservas en backend, usando reservas de muestra");
      }
    } catch (error) {
      console.log("Cargando reservas de muestra para el timeline:", error);
      const today = new Date();
      setEvents([
        {
          title: "María Pérez - Habitación 101",
          start: new Date(new Date(today).setHours(14, 0, 0, 0)),
          end: new Date(new Date(today).setDate(today.getDate() + 3)),
          resource: "Habitación 101",
          reservationDetails: { id: 101, status: 'confirmed', habitacion_id: 1, habitacion: { id: 1, titulo: 'Habitación 101' }, cliente: { nombre: 'María Pérez', correo: 'maria@ejemplo.com' }, value: 450000, numeroAdultos: 2, numeroNinos: 0 }
        },
        {
          title: "Carlos López - Habitación 102",
          start: new Date(new Date(today).setDate(today.getDate() + 1)),
          end: new Date(new Date(today).setDate(today.getDate() + 4)),
          resource: "Habitación 102",
          reservationDetails: { id: 102, status: 'pending', habitacion_id: 2, habitacion: { id: 2, titulo: 'Habitación 102' }, cliente: { nombre: 'Carlos López', correo: 'carlos@ejemplo.com' }, value: 320000, numeroAdultos: 1, numeroNinos: 1 }
        },
        {
          title: "Ana Gómez - Habitación 103",
          start: new Date(new Date(today).setDate(today.getDate() - 1)),
          end: new Date(new Date(today).setDate(today.getDate() + 2)),
          resource: "Habitación 103",
          reservationDetails: { id: 103, status: 'confirmed', habitacion_id: 3, habitacion: { id: 3, titulo: 'Habitación 103' }, cliente: { nombre: 'Ana Gómez', correo: 'ana@ejemplo.com' }, value: 680000, numeroAdultos: 2, numeroNinos: 2 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Filter events according to checkboxes
  const filteredEvents = events.filter(e => {
    const status = e.reservationDetails?.status || 'confirmed';
    if (status === 'confirmed' || status === 'completed') return filterConfirmed;
    if (status === 'pending') return filterPending;
    if (status === 'cancelled') return filterCancelled;
    return true;
  });

  // Calculations for Mini Calendar
  const miniDaysInMonth = getDaysInMonth(miniCalendarMonth);
  const miniStartDayOfWeek = (startOfMonth(miniCalendarMonth).getDay() + 6) % 7; // Monday start
  const miniDaysArray = Array.from({ length: miniDaysInMonth }, (_, i) => i + 1);

  // Status counts
  const confirmedCount = events.filter(e => e.reservationDetails?.status === 'confirmed' || e.reservationDetails?.status === 'completed').length;
  const pendingCount = events.filter(e => e.reservationDetails?.status === 'pending').length;
  const cancelledCount = events.filter(e => e.reservationDetails?.status === 'cancelled').length;

  return (
    <div className="flex gap-5 h-[calc(100vh-140px)]">
      {/* Sidebar Navigation Widget */}
      <div className="w-72 flex-shrink-0 bg-white rounded-3xl shadow-xs border border-slate-200/70 p-5 flex flex-col gap-6 overflow-y-auto mv-scrollbar">
        {/* Action Button */}
        <div>
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--mv-blue)] to-[#0b3c66] hover:from-[#0b3c66] hover:to-[#082a48] text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-900/10 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]">
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            Nueva Reserva
          </button>
        </div>
        
        {/* Interactive Mini Calendar */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 capitalize tracking-wide">
              {format(miniCalendarMonth, "MMMM yyyy", { locale: es })}
            </h3>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setMiniCalendarMonth(prev => subMonths(prev, 1))}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setMiniCalendarMonth(prev => addMonths(prev, 1))}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors"
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</div>
            ))}
            
            {/* Blank padding for start day */}
            {Array.from({ length: miniStartDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="p-1"></div>
            ))}

            {miniDaysArray.map((day) => {
              const dayDate = new Date(miniCalendarMonth.getFullYear(), miniCalendarMonth.getMonth(), day);
              const isToday = isSameDay(dayDate, new Date());
              const isSelected = isSameDay(dayDate, selectedDate);
              
              // Check if any reservation touches this day
              const hasReservation = events.some(e => {
                const start = new Date(e.start);
                const end = new Date(e.end);
                return dayDate >= new Date(start.setHours(0,0,0,0)) && dayDate <= new Date(end.setHours(23,59,59,999));
              });

              return (
                <button 
                  key={day} 
                  onClick={() => {
                    setSelectedDate(dayDate);
                  }}
                  className={`text-xs p-1.5 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isSelected 
                      ? 'bg-[var(--mv-blue)] text-white font-bold shadow-xs' 
                      : isToday 
                        ? 'bg-blue-100/80 text-[var(--mv-blue)] font-bold' 
                        : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{day}</span>
                  {hasReservation && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Filters Widget */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-500" />
              Filtros
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">({filteredEvents.length} activas)</span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors cursor-pointer group border border-transparent hover:border-slate-200/50">
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox" 
                  checked={filterConfirmed} 
                  onChange={(e) => setFilterConfirmed(e.target.checked)}
                  className="rounded text-[var(--mv-blue)] focus:ring-[var(--mv-blue)] border-slate-300 w-4 h-4 cursor-pointer" 
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Confirmadas</span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">{confirmedCount}</span>
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors cursor-pointer group border border-transparent hover:border-slate-200/50">
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox" 
                  checked={filterPending} 
                  onChange={(e) => setFilterPending(e.target.checked)}
                  className="rounded text-[var(--mv-blue)] focus:ring-[var(--mv-blue)] border-slate-300 w-4 h-4 cursor-pointer" 
                />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Pendientes</span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">{pendingCount}</span>
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors cursor-pointer group border border-transparent hover:border-slate-200/50">
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox" 
                  checked={filterCancelled} 
                  onChange={(e) => setFilterCancelled(e.target.checked)}
                  className="rounded text-[var(--mv-blue)] focus:ring-[var(--mv-blue)] border-slate-300 w-4 h-4 cursor-pointer" 
                />
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0"></span>
                <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Canceladas</span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">{cancelledCount}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-xs border border-slate-200/70 p-5 flex flex-col min-w-0">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Vista General de Ocupación</h2>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'timeline' 
                  ? 'bg-white text-[var(--mv-ink)] shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bars3BottomLeftIcon className="w-4 h-4 stroke-[2.5]" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('classic')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'classic' 
                  ? 'bg-white text-[var(--mv-ink)] shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarDaysIcon className="w-4 h-4 stroke-[2.5]" />
              Mes Completo
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
        <style>{`
          .rbc-calendar { font-family: var(--font-montserrat), sans-serif; }
          .rbc-event { 
            background-color: var(--mv-blue) !important; 
            border-radius: 8px; 
            padding: 4px 8px; 
            border: none; 
            font-size: 0.75rem; 
            font-weight: 600; 
            line-height: 1.2;
            box-shadow: 0 2px 6px -1px rgba(15, 76, 129, 0.25); 
            transition: all 0.2s ease;
          }
          .rbc-event:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 12px -2px rgba(15, 76, 129, 0.35);
            filter: brightness(1.05);
          }
          .rbc-today { background-color: rgba(15, 76, 129, 0.05) !important; }
          .rbc-toolbar { margin-bottom: 20px; gap: 8px; }
          .rbc-toolbar button { 
            border-radius: 12px;
            color: var(--mv-ink); 
            border: 1px solid #e2e8f0; 
            padding: 8px 18px; 
            font-weight: 700; 
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s ease;
          }
          .rbc-toolbar button.rbc-active { 
            background-color: var(--mv-blue); 
            color: white; 
            border-color: var(--mv-blue); 
            box-shadow: 0 4px 10px rgba(15, 76, 129, 0.25);
          }
          .rbc-toolbar button:active, .rbc-toolbar button:hover { 
            background-color: var(--mv-blue) !important; 
            color: white; 
            border-color: var(--mv-blue);
          }
          .rbc-header { 
            padding: 12px 0; 
            font-weight: 700; 
            text-transform: uppercase; 
            font-size: 0.7rem; 
            letter-spacing: 0.1em;
            color: #64748b; 
            border-bottom: 1px solid #e2e8f0;
          }
          .rbc-month-view { border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
          .rbc-day-bg { border-color: #f1f5f9; transition: background-color 0.2s ease; }
          .rbc-day-bg:hover { background-color: #f8fafc; }
          .rbc-off-range-bg { background-color: #f8fafc; }
        `}</style>
        
        {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full mb-3"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cargando calendario...</span>
            </div>
        ) : viewMode === 'timeline' ? (
            <TimelineCalendar 
              events={filteredEvents} 
              onSelectEvent={setSelectedEvent} 
              selectedDate={selectedDate}
            />
        ) : (
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              culture="es"
              date={selectedDate}
              onNavigate={(d) => setSelectedDate(d)}
              messages={{
                  next: "Sig.",
                  previous: "Ant.",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  date: "Fecha",
                  time: "Hora",
                  event: "Reserva",
                  noEventsInRange: "No hay reservas en este rango.",
                  allDay: "Todo el día",
                  showMore: (total) => `+ Ver más (${total})`
              }}
              views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
              defaultView={Views.MONTH}
              popup
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
        )}
      </div>

      {/* Modern High-End Modal Details */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] relative animate-in zoom-in-95 duration-200 border border-slate-100">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[var(--mv-blue)] font-bold text-lg border border-blue-100 shadow-xs">
                {selectedEvent.reservationDetails?.cliente?.nombre?.charAt(0).toUpperCase() || 'R'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Reserva de Estancia</h3>
                <p className="text-xs text-slate-500 font-medium">Ref ID: #{selectedEvent.reservationDetails?.id?.toString().slice(-6) || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Huésped Principal</p>
                <p className="text-slate-900 font-bold text-base">{selectedEvent.reservationDetails?.cliente?.nombre || selectedEvent.title || 'N/A'}</p>
                {selectedEvent.reservationDetails?.cliente?.correo && (
                  <p className="text-xs text-slate-500 mt-0.5">{selectedEvent.reservationDetails.cliente.correo}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Habitación</p>
                  <p className="text-slate-800 font-bold text-sm truncate">{selectedEvent.reservationDetails?.habitacion?.titulo || selectedEvent.resource || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Estado</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    selectedEvent.reservationDetails?.status === 'confirmed' || selectedEvent.reservationDetails?.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800' 
                      : selectedEvent.reservationDetails?.status === 'pending' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-rose-100 text-rose-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedEvent.reservationDetails?.status === 'confirmed' || selectedEvent.reservationDetails?.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></span>
                    {selectedEvent.reservationDetails?.status || 'Confirmada'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Check In</p>
                  <p className="text-slate-800 font-bold text-sm">{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(selectedEvent.start)}</p>
                  <p className="text-[10px] text-slate-400">{new Intl.DateTimeFormat('es-CO', { timeStyle: 'short' }).format(selectedEvent.start)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Check Out</p>
                  <p className="text-slate-800 font-bold text-sm">{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(selectedEvent.end)}</p>
                  <p className="text-[10px] text-slate-400">{new Intl.DateTimeFormat('es-CO', { timeStyle: 'short' }).format(selectedEvent.end)}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Acompañantes</p>
                  <p className="text-slate-800 font-bold text-sm">
                    {selectedEvent.reservationDetails?.numeroAdultos || 1} Adulto(s) 
                    {selectedEvent.reservationDetails?.numeroNinos > 0 ? `, ${selectedEvent.reservationDetails?.numeroNinos} Niño(s)` : ''}
                  </p>
                </div>
                <button 
                  onClick={() => setIsHuespedesModalOpen(true)}
                  className="flex items-center gap-1.5 text-white bg-[var(--mv-blue)] hover:bg-[#0b3c66] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <UserGroupIcon className="w-4 h-4 stroke-[2.5]" />
                  Registro TRA
                </button>
              </div>

              <div className="flex justify-between items-center bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                 <div>
                    <p className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">Importe Total</p>
                    <p className="text-2xl font-black text-[var(--mv-ink)]">
                      ${Number(selectedEvent.reservationDetails?.value || 0).toLocaleString('es-CO')}
                    </p>
                 </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl bg-slate-900 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <HuespedesModal 
          isOpen={isHuespedesModalOpen}
          onClose={() => setIsHuespedesModalOpen(false)}
          reservation={selectedEvent.reservationDetails}
          onSuccess={() => {
            fetchReservas();
          }}
        />
      )}
      </div>
    </div>
  );
}
