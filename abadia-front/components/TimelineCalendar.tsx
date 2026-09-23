"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, endOfMonth, isSameDay, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale/es";
import { fetchApi } from "@/lib/api";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface TimelineCalendarProps {
  events: any[];
  onSelectEvent: (event: any) => void;
  selectedDate?: Date;
}

export default function TimelineCalendar({ events, onSelectEvent, selectedDate }: TimelineCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await fetchApi('/habitaciones');
        setHabitaciones(Array.isArray(response) ? response : (response.data || []));
      } catch (error) {
        console.error("Error cargando habitaciones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabitaciones();
  }, []);

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
  });

  const getEventStyle = (event: any, habId: number) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Check if event belongs to this room
    const habTitulo = habitaciones.find(h => h.id === habId)?.titulo;
    const belongsToRoom = 
      String(event.reservationDetails?.habitacion?.id) === String(habId) || 
      String(event.reservationDetails?.habitacion_id) === String(habId) || 
      event.resource === habTitulo;

    if (!belongsToRoom) {
      return null;
    }

    // Filter by search term if active
    const clientName = event.reservationDetails?.cliente?.nombre || event.title || "";
    if (searchTerm && !clientName.toLowerCase().includes(searchTerm.toLowerCase()) && !habTitulo?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    // Check if event overlaps with current month
    if (eventEnd <= firstDay || eventStart >= lastDay) {
      return null;
    }

    // Calculate left position and width in percentage
    const startOffset = Math.max(0, (eventStart.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    const endOffset = Math.min(daysInMonth, (eventEnd.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    
    const width = (endOffset - startOffset);
    
    if (width <= 0) return null;

    const colorFamilies = [
      { 
        pending: { bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100', border: 'border-blue-200/80', text: 'text-blue-900', badge: 'bg-blue-500', indicator: 'bg-blue-400' }, 
        confirmed: { bg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700', border: 'border-blue-700', text: 'text-white', badge: 'bg-white/20 text-white', indicator: 'bg-emerald-400' } 
      },
      { 
        pending: { bg: 'bg-gradient-to-r from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100', border: 'border-purple-200/80', text: 'text-purple-900', badge: 'bg-purple-500', indicator: 'bg-purple-400' }, 
        confirmed: { bg: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700', border: 'border-purple-700', text: 'text-white', badge: 'bg-white/20 text-white', indicator: 'bg-emerald-400' } 
      },
      { 
        pending: { bg: 'bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100', border: 'border-emerald-200/80', text: 'text-emerald-900', badge: 'bg-emerald-500', indicator: 'bg-emerald-400' }, 
        confirmed: { bg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700', border: 'border-emerald-700', text: 'text-white', badge: 'bg-white/20 text-white', indicator: 'bg-emerald-300' } 
      },
      { 
        pending: { bg: 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100', border: 'border-amber-200/80', text: 'text-amber-900', badge: 'bg-amber-500', indicator: 'bg-amber-400' }, 
        confirmed: { bg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700', border: 'border-amber-700', text: 'text-white', badge: 'bg-white/20 text-white', indicator: 'bg-emerald-400' } 
      },
      { 
        pending: { bg: 'bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100', border: 'border-rose-200/80', text: 'text-rose-900', badge: 'bg-rose-500', indicator: 'bg-rose-400' }, 
        confirmed: { bg: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700', border: 'border-rose-700', text: 'text-white', badge: 'bg-white/20 text-white', indicator: 'bg-emerald-400' } 
      },
    ];
    
    // Hash the habId to consistently pick a color family
    const habIndex = typeof habId === 'number' ? habId : String(habId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const family = colorFamilies[habIndex % colorFamilies.length];

    let styleConfig;
    const status = event.reservationDetails?.status;
    
    if (status === 'confirmed' || status === 'completed') { 
      styleConfig = family.confirmed;
    } else if (status === 'cancelled') { 
      styleConfig = { bg: 'bg-gradient-to-r from-red-50 to-pink-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-200 text-red-700', indicator: 'bg-red-500' }; 
    } else { 
      styleConfig = family.pending;
    }

    const nights = Math.max(1, differenceInCalendarDays(eventEnd, eventStart));

    return {
      left: `${(startOffset / daysInMonth) * 100}%`,
      width: `${(width / daysInMonth) * 100}%`,
      nights,
      ...styleConfig
    };
  };

  // Calculate quick stats
  const totalEventsInMonth = events.filter(e => {
    const s = new Date(e.start);
    const end = new Date(e.end);
    return end > firstDay && s < lastDay;
  }).length;

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full mb-3"></div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cargando habitaciones y reservas...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-sm">
      {/* Dynamic Header Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToday} 
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 transition-all text-[var(--mv-ink)] shadow-xs flex items-center gap-1.5"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
            Hoy
          </button>
          
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-xs">
            <button 
              onClick={handlePrevMonth} 
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Mes Anterior"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 capitalize min-w-[120px] text-center">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <button 
              onClick={handleNextMonth} 
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Mes Siguiente"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar cliente o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Counter Badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {totalEventsInMonth} {totalEventsInMonth === 1 ? 'Reserva este mes' : 'Reservas este mes'}
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto mv-scrollbar relative" ref={scrollContainerRef}>
        <div className="inline-flex flex-col min-w-full w-max">
          
          {/* Header Row (Days) */}
          <div className="flex sticky top-0 z-20 bg-slate-50 border-b border-slate-200/80 shadow-xs">
            {/* Rooms Header */}
            <div className="w-56 flex-shrink-0 border-r border-slate-200/80 px-4 py-3 sticky left-0 z-30 bg-slate-50 flex items-center justify-between shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Habitación</span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{habitaciones.length} total</span>
            </div>
            
            {/* Days Grid Header */}
            <div className="flex flex-1 relative min-w-[1000px]">
              {daysArray.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const dayName = format(day, 'EEE', { locale: es }).charAt(0).toUpperCase();

                return (
                  <div 
                    key={i} 
                    className={`flex-1 min-w-[42px] flex flex-col items-center justify-center py-2 border-r border-slate-100 transition-colors ${
                      isToday ? 'bg-blue-500/10 text-blue-700 font-bold' : isWeekend ? 'bg-slate-100/60 text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold tracking-wider opacity-75">{dayName}</span>
                    <span className={`text-xs font-bold mt-0.5 ${
                      isToday 
                        ? 'bg-[var(--mv-blue)] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs ring-2 ring-blue-200' 
                        : ''
                    }`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows (Habitaciones) */}
          <div className="relative divide-y divide-slate-100">
            {habitaciones.map((hab) => {
              // Count active reservations for this room this month
              const roomReservations = events.filter(e => {
                const style = getEventStyle(e, hab.id);
                return style !== null;
              });
              const isOccupiedNow = roomReservations.some(e => {
                const now = new Date();
                return new Date(e.start) <= now && new Date(e.end) >= now;
              });

              return (
                <div key={hab.id} className="flex group hover:bg-slate-50/60 transition-colors h-16 relative">
                  {/* Sticky Room Label */}
                  <div className="w-56 flex-shrink-0 border-r border-slate-200/80 px-4 py-2 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors flex items-center justify-between shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isOccupiedNow ? 'bg-amber-400 shadow-xs' : 'bg-emerald-500 shadow-xs'}`} title={isOccupiedNow ? 'Ocupada actualmente' : 'Disponible actualmente'}></span>
                        <span className="text-xs font-bold text-slate-900 truncate group-hover:text-[var(--mv-blue)] transition-colors">{hab.titulo}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate mt-0.5 font-medium pl-3.5">
                        {hab.tipo_habitacion || hab.subtitulo || 'Estancia'}
                      </span>
                    </div>
                    {hab.precio && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0 border border-slate-200/50">
                        ${(hab.precio / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>

                  {/* Day Columns Grid Lines */}
                  <div className="flex flex-1 relative min-w-[1000px]">
                    <div className="absolute inset-0 flex pointer-events-none">
                      {daysArray.map((day, i) => {
                        const isToday = isSameDay(day, new Date());
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        return (
                          <div 
                            key={i} 
                            className={`flex-1 border-r border-slate-100 ${
                              isToday ? 'bg-blue-500/[0.04]' : isWeekend ? 'bg-slate-100/30' : ''
                            }`}
                          ></div>
                        );
                      })}
                    </div>

                    {/* Event Pills */}
                    {events.map((event, eventIdx) => {
                      const style = getEventStyle(event, hab.id);
                      if (!style) return null;

                      const guestName = event.reservationDetails?.cliente?.nombre || event.title || 'Reserva';
                      const initial = guestName.charAt(0).toUpperCase();

                      return (
                        <div
                          key={eventIdx}
                          onClick={() => onSelectEvent(event)}
                          className={`absolute top-2 bottom-2 ${style.bg} border ${style.border} rounded-xl shadow-xs z-10 flex items-center px-2.5 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:z-30 group/pill`}
                          style={{ left: style.left, width: style.width }}
                          title={`${guestName} (${style.nights} noche${style.nights > 1 ? 's' : ''})`}
                        >
                          {/* Guest Initials Circle */}
                          <div className={`w-5 h-5 rounded-full ${style.badge} flex items-center justify-center shrink-0 text-[10px] font-bold uppercase mr-1.5 shadow-2xs`}>
                            {initial}
                          </div>

                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-bold ${style.text} truncate leading-tight`}>
                                {guestName}
                              </span>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.indicator} shrink-0 hidden sm:inline-block`} title={event.reservationDetails?.status}></span>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`text-[9px] font-semibold ${style.text} opacity-75 truncate`}>
                                {style.nights} {style.nights === 1 ? 'noche' : 'noches'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {habitaciones.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                No hay habitaciones disponibles para mostrar en el timeline.
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
