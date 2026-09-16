"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, endOfMonth, isSameDay, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale/es";
import { fetchApi } from "@/lib/api";

interface TimelineCalendarProps {
  events: any[];
  onSelectEvent: (event: any) => void;
}

export default function TimelineCalendar({ events, onSelectEvent }: TimelineCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return d;
  });

  const getEventStyle = (event: any, habId: number) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Check if event belongs to this room
    const habTitulo = habitaciones.find(h => h.id === habId)?.titulo;
    const belongsToRoom = 
      event.reservationDetails?.habitacion?.id === habId || 
      event.reservationDetails?.habitacion_id === habId || 
      event.resource === habTitulo;

    if (!belongsToRoom) {
      return null;
    }

    // Check if event overlaps with current month
    if (eventEnd < firstDay || eventStart > lastDay) {
      return null;
    }

    // Calculate left position and width in percentage
    const startOffset = Math.max(0, (eventStart.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    const endOffset = Math.min(daysInMonth, (eventEnd.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    
    const width = (endOffset - startOffset);
    
    if (width <= 0) return null;

    let bgColor = 'bg-[var(--mv-blue)]';
    let borderColor = 'border-[#0b3c66]';
    
    const status = event.reservationDetails?.status;
    if (status === 'confirmed') { bgColor = 'bg-green-500'; borderColor = 'border-green-700'; }
    if (status === 'pending') { bgColor = 'bg-yellow-500'; borderColor = 'border-yellow-700'; }
    if (status === 'cancelled') { bgColor = 'bg-red-500'; borderColor = 'border-red-700'; }

    return {
      left: `${(startOffset / daysInMonth) * 100}%`,
      width: `${(width / daysInMonth) * 100}%`,
      bgColor,
      borderColor
    };
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex gap-2">
          <button onClick={handleToday} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[var(--mv-ink)] shadow-sm">
            Hoy
          </button>
          <div className="flex rounded-full border border-gray-200 overflow-hidden bg-white shadow-sm">
            <button onClick={handlePrevMonth} className="px-3 py-1.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-[var(--mv-ink)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="w-[1px] bg-gray-200"></div>
            <button onClick={handleNextMonth} className="px-3 py-1.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-[var(--mv-ink)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold text-[var(--mv-ink)] capitalize">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h3>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto mv-scrollbar relative" ref={scrollContainerRef}>
        <div className="inline-flex flex-col min-w-full w-max">
          
          {/* Header (Days) */}
          <div className="flex sticky top-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm">
            <div className="w-48 flex-shrink-0 border-r border-gray-200 p-3 sticky left-0 z-30 bg-gray-50 flex items-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Habitaciones</span>
            </div>
            <div className="flex flex-1 relative min-w-[900px]">
              {daysArray.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <div 
                    key={i} 
                    className={`flex-1 min-w-[40px] flex flex-col items-center justify-center py-2 border-r border-gray-100 ${isToday ? 'bg-blue-50/50 text-[var(--mv-blue)]' : isWeekend ? 'bg-gray-50/50 text-gray-400' : 'text-gray-600'}`}
                  >
                    <span className="text-[10px] uppercase font-semibold">{format(day, 'EEE', { locale: es }).charAt(0)}</span>
                    <span className={`text-sm font-bold ${isToday ? 'bg-[var(--mv-blue)] text-white w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shadow-sm' : ''}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows (Rooms) */}
          <div className="relative">
            {habitaciones.map((hab, index) => (
              <div key={hab.id} className="flex group border-b border-gray-100 hover:bg-gray-50/50 transition-colors h-14">
                <div className="w-48 flex-shrink-0 border-r border-gray-200 px-3 py-2 sticky left-0 z-10 bg-white group-hover:bg-gray-50/50 transition-colors flex flex-col justify-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <span className="text-sm font-bold text-[var(--mv-ink)] truncate">{hab.titulo}</span>
                  <span className="text-[10px] text-gray-500 uppercase truncate">{hab.tipo_habitacion}</span>
                </div>
                <div className="flex flex-1 relative min-w-[900px]">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex">
                    {daysArray.map((day, i) => {
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                      return (
                        <div key={i} className={`flex-1 border-r border-gray-100 ${isWeekend ? 'bg-gray-50/30' : ''}`}></div>
                      );
                    })}
                  </div>

                  {/* Events for this room */}
                  {events.map((event, eventIdx) => {
                    const style = getEventStyle(event, hab.id);
                    if (!style) return null;

                    return (
                      <div
                        key={eventIdx}
                        onClick={() => onSelectEvent(event)}
                        className={`absolute top-2 bottom-2 ${style.bgColor} border ${style.borderColor} rounded-md shadow-sm z-10 flex items-center px-2 overflow-hidden cursor-pointer hover:brightness-110 transition-all hover:shadow-md hover:scale-[1.02]`}
                        style={{ left: style.left, width: style.width }}
                        title={event.title}
                      >
                        <span className="text-xs font-bold text-white truncate drop-shadow-md whitespace-nowrap">
                          {event.reservationDetails?.cliente?.nombre || event.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {habitaciones.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No hay habitaciones registradas.
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
