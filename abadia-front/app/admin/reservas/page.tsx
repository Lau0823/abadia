"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const data = await fetchApi("/reservations");
        setReservas(data);
      } catch (error) {
        console.error("Error cargando reservas", error);
        // Fallback for UI demo
        setReservas([
          { 
            id: "1", 
            cliente: { nombre: "María Pérez", correo: "maria@example.com" }, 
            habitacion: { titulo: "Habitación 1" }, 
            checkIn: new Date().toISOString(), 
            checkOut: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), 
            estado: "CONFIRMED",
            value: 900000 
          },
          { 
            id: "2", 
            cliente: { nombre: "Carlos López", correo: "carlos@example.com" }, 
            habitacion: { titulo: "Habitación 2" }, 
            checkIn: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), 
            checkOut: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), 
            estado: "PENDING",
            value: 960000 
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Reservaciones</h2>
          <p className="text-gray-500 mt-1 text-sm">Listado de estancias y huéspedes.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md">
          <PlusIcon className="w-5 h-5" />
          Nueva Reserva
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mv-cream)]/50 border-b border-[var(--mv-sage)]/10">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Huésped</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Habitación</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estancia</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Valor</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mv-sage)]/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando reservas...</span>
                    </div>
                  </td>
                </tr>
              ) : reservas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No hay reservas registradas.</td>
                </tr>
              ) : (
                reservas.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--mv-ink)]">{res.cliente.nombre}</span>
                        <span className="text-xs text-gray-500">{res.cliente.correo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[var(--mv-ink)]">{res.habitacion.titulo}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-sm text-gray-600">
                        <span>In: {formatDate(res.checkIn)}</span>
                        <span>Out: {formatDate(res.checkOut)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[var(--mv-ink)]">
                        ${Number(res.value).toLocaleString("es-CO")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                        res.estado === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                        res.estado === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                        res.estado === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {res.estado === 'COMPLETED' ? 'Completada' :
                         res.estado === 'CONFIRMED' ? 'Confirmada' :
                         res.estado === 'PENDING' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-lg transition-all">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
