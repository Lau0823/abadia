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

  const isAdmin = user?.rol === 'superadmin' || user?.rol === 'admin' || user?.rol === 'supervisor';

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/tareas");
      
      // Si no es admin, solo ve sus propias tareas
      if (!isAdmin) {
        setTareas(data.filter((t: any) => t.asignado_a?.id === user?.id));
      } else {
        setTareas(data);
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
    if (isAdmin) {
      setSelectedTarea(tarea);
      setIsModalOpen(true);
    }
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      await fetchApi(`/tareas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado: newStatus })
      });
      fetchTareas();
    } catch (error) {
      alert("Error al cambiar el estado de la tarea.");
    }
  };

  const colPendiente = tareas.filter(t => t.estado === 'PENDIENTE');
  const colProgreso = tareas.filter(t => t.estado === 'EN_PROGRESO');
  const colCompletada = tareas.filter(t => t.estado === 'COMPLETADA');

  const TaskCard = ({ tarea }: { tarea: any }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 text-sm">{tarea.titulo}</h4>
        {isAdmin && (
          <button 
            onClick={() => handleOpenEdit(tarea)}
            className="text-xs text-[var(--mv-blue)] opacity-0 group-hover:opacity-100 transition-opacity font-medium"
          >
            Editar
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{tarea.descripcion || "Sin descripción"}</p>
      
      <div className="flex justify-between items-end mt-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-gray-400">
            Responsable: {tarea.asignado_a ? (tarea.asignado_a.nombre || tarea.asignado_a.username) : "Sin asignar"}
          </span>
          {tarea.fecha_limite && (
            <span className="text-[10px] font-medium text-red-400">
              Límite: {new Date(tarea.fecha_limite).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {/* Controles de Estado */}
        <div className="flex gap-1">
          {tarea.estado === 'PENDIENTE' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => handleChangeStatus(tarea.id, 'EN_PROGRESO')} className="p-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg">
                  <ArrowPathIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Iniciar Tarea</TooltipContent>
            </Tooltip>
          )}
          {tarea.estado === 'EN_PROGRESO' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => handleChangeStatus(tarea.id, 'COMPLETADA')} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Completar Tarea</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Tablero de Tareas</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona y supervisa las actividades operativas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={handleOpenNew}
              className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shrink-0"
            >
              <PlusIcon className="w-5 h-5" />
              Nueva Tarea
            </button>
          )}
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
