"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, PencilIcon, TrashIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-xs border border-slate-200/70 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-xl font-extrabold text-[var(--mv-ink)] tracking-tight">Inventario de Habitaciones</h2>
          </div>
          <p className="text-slate-500 mt-1 text-xs font-medium">Gestiona y consulta el catálogo de habitaciones, tarifas y estados de limpieza.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[var(--mv-blue)] to-[#0b3c66] hover:from-[#0b3c66] hover:to-[#082a48] text-white px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-900/10 hover:shadow-lg hover:scale-[1.01] shrink-0"
        >
          <PlusIcon className="w-4 h-4 stroke-[3]" />
          Nueva Habitación
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-3xl border border-slate-200/70">
            <div className="w-10 h-10 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Cargando habitaciones...</span>
          </div>
        ) : habitaciones.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/70 shadow-xs">
            No hay habitaciones registradas.
          </div>
        ) : (
          habitaciones.map((hab) => (
            <div key={hab.id} className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/70 flex flex-col gap-5 hover:shadow-md transition-all duration-200 group hover:-translate-y-1 relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  {hab.imagenes && hab.imagenes.length > 0 ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-xs border border-slate-200 relative" title={hab.imagenes.length > 1 ? `Múltiples imágenes adjuntas (${hab.imagenes.length})` : 'Imagen de la habitación'}>
                      <img src={hab.imagenes[0]} alt={hab.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {hab.imagenes.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md backdrop-blur-xs">
                          +{hab.imagenes.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-blue-50/70 flex items-center justify-center shrink-0 shadow-xs border border-blue-100">
                      <SparklesIcon className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-base leading-tight truncate group-hover:text-[var(--mv-blue)] transition-colors">{hab.titulo}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1 truncate">{hab.subtitulo || 'Estancia de lujo'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(hab)} className="p-2 text-slate-400 hover:text-[var(--mv-blue)] hover:bg-blue-50 rounded-xl transition-all">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(hab.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  hab.estado === 'DISPONIBLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 
                  hab.estado === 'MANTENIMIENTO' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hab.estado === 'DISPONIBLE' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                  {hab.estado}
                </span>

                <button 
                  onClick={() => handleToggleLimpieza(hab)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all border shadow-2xs ${
                    hab.estadoLimpieza === 'LIMPIA' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                  title="Clic para cambiar estado de limpieza"
                >
                  {hab.estadoLimpieza === 'LIMPIA' ? '✨ Limpia' : '🧹 Por Asear'}
                </button>
              </div>

              <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Precio Noche</p>
                  <p className="font-black text-slate-900 text-lg">${Number(hab.precio).toLocaleString("es-CO")}</p>
                </div>
                <div className="text-right flex items-center gap-1 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <UserGroupIcon className="w-3.5 h-3.5 text-slate-400" />
                  <p className="font-bold text-xs">{hab.ocupacion}</p>
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
