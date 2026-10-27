"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, CheckCircleIcon, ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import TareaModal from "@/components/TareaModal";
import { useAuthStore } from "@/store/authStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export default function TareasPage() {
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<any>(null);
  const { user } = useAuthStore();

  const userRole = (user?.rol || '').toLowerCase().replace(/_/g, '');
  const isAdmin = userRole === 'superadmin' || userRole === 'admin' || userRole === 'supervisor' || !user?.rol;

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const response = await fetchApi("/tareas");
      const list = Array.isArray(response) ? response : (response?.data || []);
      
      // Si no es admin, solo ve sus propias tareas o creadas por él
      if (!isAdmin && user?.id) {
        setTareas(list.filter((t: any) => t.asignado_a?.id === user?.id || t.creado_por?.id === user?.id));
      } else {
        setTareas(list);
      }
    } catch (error) {
      console.error("Error cargando tareas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTareas();
  }, [user]);

  const handleOpenNew = () => {
    setSelectedTarea(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tarea: any) => {
    setSelectedTarea(tarea);
    setIsModalOpen(true);
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      const task = tareas.find(t => t.id === id);

      await fetchApi(`/tareas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado: newStatus })
      });

      // Si la tarea está vinculada a una habitación, sincronizar el estado de limpieza
      if (task?.descripcion) {
        const habMatch = task.descripcion.match(/\[hab_id:([^\]]+)\]/);
        if (habMatch) {
          const habId = habMatch[1];
          const nuevoEstadoLimpieza = newStatus === 'COMPLETADA' ? 'LIMPIA' : 'POR_ASEAR';
          try {
            await fetchApi(`/habitaciones/${habId}/limpieza`, {
              method: "PATCH",
              body: JSON.stringify({ estadoLimpieza: nuevoEstadoLimpieza })
            });
          } catch (e) {
            console.warn("Error sincronizando estado de limpieza de habitación:", e);
          }
        }
      }

      fetchTareas();
    } catch (error) {
      alert("Error al cambiar el estado de la tarea.");
    }
  };

  const colPendiente = tareas.filter(t => t.estado === 'PENDIENTE');
  const colProgreso = tareas.filter(t => t.estado === 'EN_PROGRESO');
  const colCompletada = tareas.filter(t => t.estado === 'COMPLETADA');

  const TaskCard = ({ tarea }: { tarea: any }) => {
    // Extraer nombre de habitación si está en el título entre corchetes
    const roomMatch = tarea.titulo.match(/^\[(.*?)\]/);
    const roomName = roomMatch ? roomMatch[1] : null;
    const cleanTitle = roomMatch ? tarea.titulo.replace(/^\[(.*?)\]\s*/, '') : tarea.titulo;
    const cleanDesc = (tarea.descripcion || "").replace(/\[hab_id:[^\]]+\]\s*/g, "").trim();

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            {roomName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[var(--mv-blue)] text-[10px] font-bold border border-blue-100 self-start">
                🚪 {roomName}
              </span>
            )}
            <h4 className="font-semibold text-gray-800 text-sm leading-snug">{cleanTitle}</h4>
          </div>
          <button 
            onClick={() => handleOpenEdit(tarea)}
            className="text-xs text-[var(--mv-blue)] opacity-0 group-hover:opacity-100 transition-opacity font-medium hover:underline shrink-0 ml-1"
          >
            Editar
          </button>
        </div>
        
        {cleanDesc && (
          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{cleanDesc}</p>
        )}
        
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 mt-auto">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="font-medium truncate max-w-[150px]">
              👤 {tarea.asignado_a ? (tarea.asignado_a.nombre || tarea.asignado_a.username) : "Sin asignar"}
            </span>
            {tarea.fecha_limite && (
              <span className="font-semibold text-red-400 shrink-0">
                📅 {new Date(tarea.fecha_limite).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Selector de Cambio de Estado en Vivo */}
          <div className="flex items-center justify-between gap-2 mt-2 pt-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Estado:</span>
            <select 
              value={tarea.estado}
              onChange={(e) => handleChangeStatus(tarea.id, e.target.value)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                tarea.estado === 'PENDIENTE' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                tarea.estado === 'EN_PROGRESO' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <option value="PENDIENTE">🟡 Pendiente</option>
              <option value="EN_PROGRESO">🔵 En Progreso</option>
              <option value="COMPLETADA">🟢 Completada</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Tablero de Tareas</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona y supervisa las actividades operativas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shrink-0 cursor-pointer"
          >
            <PlusIcon className="w-5 h-5" />
            Nueva Tarea
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 p-6 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="flex gap-6 h-full overflow-x-auto pb-4">
            
            {/* Columna Pendiente */}
            <div className="flex-1 min-w-[280px] flex flex-col bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  Pendientes
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{colPendiente.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {colPendiente.map(t => <TaskCard key={t.id} tarea={t} />)}
              </div>
            </div>

            {/* Columna En Progreso */}
            <div className="flex-1 min-w-[280px] flex flex-col bg-yellow-50/30 rounded-2xl p-4 border border-yellow-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 text-yellow-500" />
                  En Progreso
                </h3>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{colProgreso.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {colProgreso.map(t => <TaskCard key={t.id} tarea={t} />)}
              </div>
            </div>

            {/* Columna Completada */}
            <div className="flex-1 min-w-[280px] flex flex-col bg-green-50/30 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-green-800 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  Completadas
                </h3>
                <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{colCompletada.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {colCompletada.map(t => <TaskCard key={t.id} tarea={t} />)}
              </div>
            </div>

          </div>
        )}
      </div>

      <TareaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tarea={selectedTarea}
        onSuccess={fetchTareas}
      />
    </div>
  );
}
