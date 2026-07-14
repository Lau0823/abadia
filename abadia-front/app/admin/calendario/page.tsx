"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchApi } from "@/lib/api";

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

  useEffect(() => {
    // Aquí traeríamos las reservaciones del API.
    // Usaremos datos de ejemplo por ahora para visualizar.
    const fetchReservas = async () => {
      try {
        // const data = await fetchApi('/reservations');
        // setEvents(data.map(d => ({ title: `${d.cliente.nombre} - ${d.habitacion.titulo}`, start: new Date(d.checkIn), end: new Date(d.checkOut) })));
        
        // Mock data
        setEvents([
          {
            title: "María Pérez - Habitación 1",
            start: new Date(new Date().setHours(15, 0, 0, 0)),
            end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(12, 0, 0, 0)),
            resource: "Suite Insignia"
          },
          {
            title: "Carlos López - Habitación 2",
            start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)),
            end: new Date(new Date(new Date().setDate(new Date().getDate() + 4)).setHours(11, 0, 0, 0)),
            resource: "Refugio Rústico"
          }
        ]);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 p-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] font-sans uppercase tracking-wide">Calendario de Ocupación</h2>
          <p className="text-gray-500 mt-1">Visualiza los ingresos y salidas de las estancias.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--mv-blue)]"></div>
                <span className="text-xs text-gray-600 font-medium">Reservas</span>
            </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <style>{`
          .rbc-calendar { font-family: 'Raleway', sans-serif; }
          .rbc-event { background-color: var(--mv-blue) !important; border-radius: 6px; padding: 4px 8px; border: none; }
          .rbc-today { background-color: var(--mv-sage) !important; opacity: 0.05; }
          .rbc-toolbar button { border-radius: 8px; color: var(--mv-ink); border-color: #e5e7eb; padding: 6px 12px; font-weight: 500;}
          .rbc-toolbar button.rbc-active { background-color: var(--mv-blue); color: white; border-color: var(--mv-blue); }
          .rbc-toolbar button:active, .rbc-toolbar button:hover { background-color: var(--mv-blue) !important; color: white; opacity: 0.8; }
          .rbc-header { padding: 10px 0; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; color: var(--mv-ink); }
          .rbc-month-view { border-radius: 12px; overflow: hidden; border-color: #f3f4f6; }
          .rbc-day-bg { border-color: #f3f4f6; }
        `}</style>
        {loading ? (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full"></div>
            </div>
        ) : (
            <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            culture="es"
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
                noEventsInRange: "No hay reservas en este rango."
            }}
            views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
            defaultView={Views.MONTH}
            popup
            />
        )}
      </div>
    </div>
  );
}
