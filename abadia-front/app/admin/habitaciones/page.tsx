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
  imagenes?: string[];
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
  };
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
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-(--mv-sage)/10">
        <div>
          <h2 className="text-2xl font-bold text-(--mv-ink) uppercase tracking-wide">Habitaciones</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona el inventario de estancias del hotel.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-(--mv-blue) hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Habitación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-400">
            <div className="w-8 h-8 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-sm font-medium uppercase tracking-widest">Cargando habitaciones...</span>
          </div>
        ) : habitaciones.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-gray-400 border border-[var(--mv-sage)]/10 shadow-sm">
            No hay habitaciones registradas.
          </div>
        ) : (
          habitaciones.map((hab) => (
            <div key={hab.id} className="bg-white rounded-3xl p-5 shadow-sm border border-[var(--mv-sage)]/10 flex flex-col gap-5 hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {hab.imagenes && hab.imagenes.length > 0 ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-200 relative" title={hab.imagenes.length > 1 ? `Múltiples imágenes adjuntas (${hab.imagenes.length})` : 'Imagen de la habitación'}>
                      <img src={hab.imagenes[0]} alt={hab.titulo} className="w-full h-full object-cover" />
                      {hab.imagenes.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md">
                          +{hab.imagenes.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                      <span className="text-[10px] text-blue-400 font-bold uppercase">Sin foto</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--mv-ink)] text-lg leading-tight">{hab.titulo}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">{hab.subtitulo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(hab)} className="p-1.5 text-gray-400 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-xl transition-all">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(hab.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                  hab.estado === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-700' : 
                  hab.estado === 'MANTENIMIENTO' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {hab.estado}
                </span>
                <button 
                  onClick={() => handleToggleLimpieza(hab)}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all shadow-sm border ${
                    hab.estadoLimpieza === 'LIMPIA' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                      : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                  }`}
                  title="Clic para cambiar estado de limpieza"
                >
                  {hab.estadoLimpieza === 'LIMPIA' ? '✨ Limpia' : '🧹 Por Asear'}
                </button>
              </div>

              <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Precio Noche</p>
                  <p className="font-bold text-[var(--mv-ink)]">${Number(hab.precio).toLocaleString("es-CO")}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Ocupación</p>
                  <p className="font-semibold text-gray-700 text-sm">{hab.ocupacion}</p>
                </div>
              </div>
            </div>
          ))
        )}
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
