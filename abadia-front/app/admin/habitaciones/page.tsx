"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import HabitacionModal from "@/components/HabitacionModal";

interface Habitacion {
  id: string;
  titulo: string;
  subtitulo: string;
  precio: number;
  ocupacion: string;
  estado: string;
  estadoLimpieza: string;
}

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitacion, setSelectedHabitacion] = useState<any>(null);

  const fetchHabitaciones = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/habitaciones");
      setHabitaciones(data);
    } catch (error) {
      console.error("Error cargando habitaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const handleOpenNew = () => {
    setSelectedHabitacion(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hab: any) => {
    setSelectedHabitacion(hab);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta habitación? Se perderán las reservas asociadas a menos que tengan borrado en cascada configurado.")) {
      try {
        await fetchApi(`/habitaciones/${id}`, { method: "DELETE" });
        fetchHabitaciones();
      } catch (error) {
        alert("Error al eliminar la habitación. Puede que tenga reservas asociadas.");
      }
    }
  const handleToggleLimpieza = async (hab: Habitacion) => {
    const nuevoEstado = hab.estadoLimpieza === 'LIMPIA' ? 'POR_ASEAR' : 'LIMPIA';
    try {
      await fetchApi(`/habitaciones/${hab.id}/limpieza`, {
        method: "PATCH",
        body: JSON.stringify({ estadoLimpieza: nuevoEstado })
      });
      fetchHabitaciones();
    } catch (error) {
      alert("Error al actualizar el estado de limpieza.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Habitaciones</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona el inventario de estancias del hotel.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Habitación
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mv-cream)]/50 border-b border-[var(--mv-sage)]/10">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Habitación</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Precio Noche</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Ocupación</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Aseo</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mv-sage)]/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : habitaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No hay habitaciones registradas.</td>
                </tr>
              ) : (
                habitaciones.map((hab) => (
                  <tr key={hab.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--mv-ink)]">{hab.titulo}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{hab.subtitulo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[var(--mv-ink)]">
                        ${Number(hab.precio).toLocaleString("es-CO")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{hab.ocupacion}</span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleLimpieza(hab)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-sm border ${
                          hab.estadoLimpieza === 'LIMPIA' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                            : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                        }`}
                        title="Clic para cambiar estado de limpieza"
                      >
                        {hab.estadoLimpieza === 'LIMPIA' ? '✨ Limpia' : '🧹 Por Asear'}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                        hab.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-700' : 
                        hab.estado === 'MANTENIMIENTO' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {hab.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(hab)}
                          className="p-2 text-gray-400 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-lg transition-all"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(hab.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
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

      <HabitacionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitacion={selectedHabitacion}
        onSuccess={() => fetchHabitaciones()}
      />
    </div>
  );
}
