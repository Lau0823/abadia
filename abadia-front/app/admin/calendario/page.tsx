"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchApi } from "@/lib/api";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import HuespedesModal from "@/components/HuespedesModal";

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

  const fetchReservas = async () => {
    try {
      const data = await fetchApi('/reservations');
      const mappedEvents = data.map((d: any) => ({ 
        title: `${d.cliente?.nombre || 'Sin Cliente'} - ${d.habitacion?.titulo || 'Habitación'}`, 
        start: new Date(d.checkIn), 
        end: new Date(d.checkOut),
        resource: d.habitacion?.titulo,
        reservationDetails: d
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error al cargar reservas del backend, usando mock data:", error);
      // Mock data fallback
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 p-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-[0.05em]">Calendario de Ocupación</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Visualiza los ingresos y salidas de las estancias.</p>
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
          .rbc-calendar { font-family: var(--font-montserrat), sans-serif; }
          .rbc-event { 
            background-color: var(--mv-blue) !important; 
            border-radius: 8px; 
            padding: 6px 10px; 
            border: none; 
            font-size: 0.8rem; 
            font-weight: 500; 
            box-shadow: 0 4px 6px -1px rgba(15, 76, 129, 0.2); 
            transition: all 0.2s ease;
          }
          .rbc-event:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px -2px rgba(15, 76, 129, 0.3);
            filter: brightness(1.1);
          }
          .rbc-today { background-color: var(--mv-sage) !important; opacity: 0.1; }
          .rbc-toolbar { margin-bottom: 24px; gap: 8px; }
          .rbc-toolbar button { 
            border-radius: 9999px;
            color: var(--mv-ink); 
            border: 1px solid #e5e7eb; 
            padding: 8px 20px; 
            font-weight: 600; 
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            transition: all 0.3s ease;
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
            padding: 14px 0; 
            font-weight: 700; 
            text-transform: uppercase; 
            font-size: 0.7rem; 
            letter-spacing: 0.15em;
            color: var(--mv-ink); 
            border-bottom: 1px solid #f3f4f6;
          }
          .rbc-month-view { border-radius: 16px; overflow: hidden; border: 1px solid #f3f4f6; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
          .rbc-day-bg { border-color: #f3f4f6; transition: background-color 0.2s ease; }
          .rbc-day-bg:hover { background-color: #f9fafb; }
          .rbc-off-range-bg { background-color: #fafafa; }
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
            onSelectEvent={(event) => setSelectedEvent(event)}
            />
        )}
      </div>

      {/* Modal de Detalles del Evento */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--mv-ink)]/30 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-[var(--mv-ink)] mb-6 border-b border-[var(--mv-sage)]/20 pb-4">Detalles de la Reserva</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cliente</p>
                <p className="text-gray-800 font-medium">{selectedEvent.reservationDetails?.cliente?.nombre || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedEvent.reservationDetails?.cliente?.correo || ''}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Habitación</p>
                <p className="text-gray-800 font-medium">{selectedEvent.reservationDetails?.habitacion?.titulo || selectedEvent.resource || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Check In</p>
                  <p className="text-gray-800">{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(selectedEvent.start)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Check Out</p>
                  <p className="text-gray-800">{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(selectedEvent.end)}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Acompañantes ({selectedEvent.reservationDetails?.huespedes?.length || 0} Reg.)</p>
                  <p className="text-gray-800 font-medium">
                    {selectedEvent.reservationDetails?.numeroAdultos || 1} Adulto(s) 
                    {selectedEvent.reservationDetails?.numeroNinos > 0 ? `, ${selectedEvent.reservationDetails?.numeroNinos} Niño(s)` : ''}
                  </p>
                </div>
                <button 
                  onClick={() => setIsHuespedesModalOpen(true)}
                  className="flex items-center gap-1 text-[var(--mv-blue)] hover:text-[#0b3c66] bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Registro TRA
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Estado</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase mt-1 ${
                      selectedEvent.reservationDetails?.status === 'completed' ? 'bg-gray-200 text-gray-700' :
                      selectedEvent.reservationDetails?.status === 'confirmed' ? 'bg-green-200 text-green-800' : 
                      selectedEvent.reservationDetails?.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {selectedEvent.reservationDetails?.status || 'N/A'}
                    </span>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Valor Total</p>
                    <p className="text-lg font-bold text-[var(--mv-ink)]">
                      ${Number(selectedEvent.reservationDetails?.value || 0).toLocaleString('es-CO')}
                    </p>
                 </div>
              </div>
              {selectedEvent.reservationDetails?.notas_admin && (
                <div className="bg-yellow-50/50 p-3 rounded-xl border border-yellow-100">
                  <p className="text-xs text-yellow-700 uppercase tracking-wider font-semibold mb-1">Notas / Mensajes</p>
                  <p className="text-sm text-gray-700 italic">{selectedEvent.reservationDetails.notas_admin}</p>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="inline-flex items-center justify-center rounded-full bg-[var(--mv-ink)] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black hover:scale-105 active:scale-95 shadow-lg"
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
            // Para actualizar los datos del modal sin cerrarlo, habría que hacer fetch de nuevo a la reserva
            // Por simplicidad, el fetchReservas refrescará el state general en background
          }}
        />
      )}
    </div>
  );
}
