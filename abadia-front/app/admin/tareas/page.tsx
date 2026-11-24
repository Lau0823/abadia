"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import {
  PlusIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import TareaModal from "@/components/TareaModal";
import { useAuthStore } from "@/store/authStore";

// Paleta "Indigo Infinity" aplicada a cada columna y estado del tablero
const COLUMN_THEMES = {
  PENDIENTE: {
    colBg: "bg-[#473C8F]/10 border-[#473C8F]/25",
    headerBadge: "bg-[#473C8F] text-white",
    cardBg: "bg-[#473C8F]",
    roomPill: "bg-white/20 text-white",
    subtext: "text-white/80",
    nextLabel: "Iniciar",
    nextStatus: "EN_PROGRESO",
    nextBtnClass: "bg-[#A5C5E2] hover:bg-white text-[#1A2458]",
  },
  EN_PROGRESO: {
    colBg: "bg-[#534FA6]/10 border-[#534FA6]/25",
    headerBadge: "bg-[#534FA6] text-white",
    cardBg: "bg-[#534FA6]",
    roomPill: "bg-[#A5C5E2] text-[#1A2458]",
    subtext: "text-white/85",
    nextLabel: "Completar",
    nextStatus: "COMPLETADA",
    nextBtnClass: "bg-white hover:bg-[#A5C5E2] text-[#1A2458]",
  },
  COMPLETADA: {
    colBg: "bg-[#A5C5E2]/25 border-[#1A2458]/15",
    headerBadge: "bg-[#1A2458] text-white",
    cardBg: "bg-[#1A2458]",
    roomPill: "bg-[#A5C5E2]/20 text-[#A5C5E2]",
    subtext: "text-[#A5C5E2]",
    nextLabel: "Reabrir",
    nextStatus: "PENDIENTE",
    nextBtnClass: "bg-white/15 hover:bg-white/25 text-white",
  },
};

export default function TareasPage() {
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const { user } = useAuthStore();

  const userRole = (user?.rol || "").toLowerCase().replace(/_/g, "");
  const isAdmin =
    userRole === "superadmin" ||
    userRole === "admin" ||
    userRole === "supervisor" ||
    !user?.rol;

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const response = await fetchApi("/tareas");
      const list = Array.isArray(response) ? response : response?.data || [];

      if (!isAdmin && user?.id) {
        setTareas(
          list.filter(
            (t: any) => t.asignado_a?.id === user?.id || t.creado_por?.id === user?.id
          )
        );
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
      const task = tareas.find((t) => t.id === id);

      await fetchApi(`/tareas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado: newStatus }),
      });

      // Sincronizar el estado de limpieza de la habitación vinculada
      if (task?.descripcion) {
        const habMatch = task.descripcion.match(/\[hab_id:([^\]]+)\]/);
        if (habMatch) {
          const habId = habMatch[1];
          const nuevoEstadoLimpieza = newStatus === "COMPLETADA" ? "LIMPIA" : "POR_ASEAR";
          try {
            await fetchApi(`/habitaciones/${habId}/limpieza`, {
              method: "PATCH",
              body: JSON.stringify({ estadoLimpieza: nuevoEstadoLimpieza }),
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

  // Filtrado por búsqueda y filtro "Mis tareas"
  const filteredTareas = useMemo(() => {
    return tareas.filter((t) => {
      if (onlyMine && user?.id) {
        const isMine = t.asignado_a?.id === user.id || t.creado_por?.id === user.id;
        if (!isMine) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (t.titulo || "").toLowerCase();
      const desc = (t.descripcion || "").toLowerCase();
      const assignee = (t.asignado_a?.nombre || t.asignado_a?.username || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || assignee.includes(q);
    });
  }, [tareas, searchQuery, onlyMine, user]);

  const colPendiente = filteredTareas.filter((t) => t.estado === "PENDIENTE");
  const colProgreso = filteredTareas.filter((t) => t.estado === "EN_PROGRESO");
  const colCompletada = filteredTareas.filter((t) => t.estado === "COMPLETADA");

  const completionRate = useMemo(() => {
    if (tareas.length === 0) return 0;
    const done = tareas.filter((t) => t.estado === "COMPLETADA").length;
    return Math.round((done / tareas.length) * 100);
  }, [tareas]);

  const TaskCard = ({
    tarea,
    statusKey,
  }: {
    tarea: any;
    statusKey: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA";
  }) => {
    const theme = COLUMN_THEMES[statusKey];
    const roomMatch = tarea.titulo.match(/^\[(.*?)\]/);
    const roomName = roomMatch ? roomMatch[1] : null;
    const cleanTitle = roomMatch ? tarea.titulo.replace(/^\[(.*?)\]\s*/, "") : tarea.titulo;
    const cleanDesc = (tarea.descripcion || "").replace(/\[hab_id:[^\]]+\]\s*/g, "").trim();
    const hasLinkedRoom = Boolean(tarea.descripcion?.match(/\[hab_id:([^\]]+)\]/));

    return (
      <div
        className={`${theme.cardBg} text-white p-5 rounded-[24px] shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between gap-3.5 group relative`}
      >
        <div>
          {/* Cabecera: Badge Habitación + Botón Editar */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {roomName && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${theme.roomPill}`}
                >
                  🚪 {roomName}
                </span>
              )}
              {hasLinkedRoom && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-semibold text-[#A5C5E2]"
                  title="Sincroniza automáticamente el estado de limpieza"
                >
                  <SparklesIcon className="w-3 h-3" /> Sync Aseo
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleOpenEdit(tarea)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors shrink-0"
              title="Editar tarea"
            >
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Título */}
          <h4 className="font-bold text-white text-sm leading-snug">{cleanTitle}</h4>

          {/* Descripción */}
          {cleanDesc && (
            <p className={`text-xs line-clamp-3 leading-relaxed mt-1.5 ${theme.subtext}`}>
              {cleanDesc}
            </p>
          )}
        </div>

        {/* Footer: Responsable + Fecha + Cambio de Estado */}
        <div className="pt-3 border-t border-white/15 space-y-3 mt-auto">
          <div className="flex justify-between items-center text-[11px]">
            <span className={`font-semibold truncate max-w-[145px] flex items-center gap-1.5 ${theme.subtext}`}>
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              {tarea.asignado_a
                ? tarea.asignado_a.nombre || tarea.asignado_a.username
                : "Sin asignar"}
            </span>

            {tarea.fecha_limite && (
              <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shrink-0">
                <CalendarIcon className="w-3 h-3 text-[#A5C5E2]" />
                {new Date(tarea.fecha_limite).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            )}
          </div>

          {/* Controles de Estado: Selector + Botón de Avance Directo */}
          <div className="flex items-center justify-between gap-2">
            <select
              value={tarea.estado}
              onChange={(e) => handleChangeStatus(tarea.id, e.target.value)}
              aria-label="Cambiar estado de tarea"
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-full bg-white/15 text-white border border-white/20 outline-none cursor-pointer hover:bg-white/25 transition-all"
            >
              <option value="PENDIENTE" className="text-[#1A2458]">
                Pendiente
              </option>
              <option value="EN_PROGRESO" className="text-[#1A2458]">
                En Progreso
              </option>
              <option value="COMPLETADA" className="text-[#1A2458]">
                Completada
              </option>
            </select>

            <button
              type="button"
              onClick={() => handleChangeStatus(tarea.id, theme.nextStatus)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-xs ${theme.nextBtnClass}`}
            >
              <span>{theme.nextLabel}</span>
              <ArrowRightIcon className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 flex flex-col justify-between pb-12 antialiased">
      <div className="flex-1 flex flex-col">
        {/* HEADER EN ÍNDIGO PROFUNDO (#1A2458) */}
        <div className="bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] text-white rounded-[30px] p-6 md:p-8 shadow-xl mb-7 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#473C8F]/35 pointer-events-none" />

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#A5C5E2] mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#A5C5E2]" />
                Operación & Mantenimiento
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Tablero de Tareas
              </h1>
              <p className="text-xs md:text-sm text-[#A5C5E2]/90 mt-1">
                Supervisa limpieza, mantenimiento y actividades sincronizadas con tus habitaciones.
              </p>
            </div>

            {/* KPIs + Botón Nueva Tarea */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/15">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Pendientes</p>
                  <p className="text-lg font-extrabold text-white">{colPendiente.length}</p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">En Curso</p>
                  <p className="text-lg font-extrabold text-white">{colProgreso.length}</p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Avance</p>
                  <p className="text-lg font-extrabold text-[#A5C5E2]">{completionRate}%</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNew}
                className="flex items-center gap-2 bg-[#A5C5E2] hover:bg-white text-[#1A2458] px-5 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md hover:scale-[1.02] shrink-0 cursor-pointer"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Nueva Tarea
              </button>
            </div>
          </div>

          {/* Barra de Filtros y Buscador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-white/15 relative z-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyMine(false)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  !onlyMine
                    ? "bg-[#A5C5E2] text-[#1A2458] shadow-sm"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Todas ({tareas.length})
              </button>
              {user?.id && (
                <button
                  type="button"
                  onClick={() => setOnlyMine(true)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    onlyMine
                      ? "bg-[#A5C5E2] text-[#1A2458] shadow-sm"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Asignadas a mí
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-72">
              <MagnifyingGlassIcon className="w-4 h-4 text-[#A5C5E2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tarea, habitación o responsable..."
                className="w-full bg-white/10 text-xs text-white placeholder-[#A5C5E2]/70 pl-9 pr-8 py-2.5 rounded-full border border-white/15 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#A5C5E2]/50 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A5C5E2] hover:text-white"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLERO KANBAN DE 3 COLUMNAS */}
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20 bg-white rounded-[30px] border border-[#A5C5E2]/50">
            <div className="animate-spin w-9 h-9 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F67B5]">
              Cargando tablero operativo...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* COLUMNA 1: PENDIENTES */}
            <div
              className={`flex flex-col rounded-[28px] p-5 border ${COLUMN_THEMES.PENDIENTE.colBg}`}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-[#1A2458] text-sm flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-[#473C8F]" />
                  <span>Pendientes</span>
                </h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${COLUMN_THEMES.PENDIENTE.headerBadge}`}
                >
                  {colPendiente.length}
                </span>
              </div>

              <div className="flex-1 space-y-3.5">
                {colPendiente.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#473C8F]/30 p-8 text-center text-xs font-medium text-[#473C8F]/70">
                    No hay tareas pendientes
                  </div>
                ) : (
                  colPendiente.map((t) => (
                    <TaskCard key={t.id} tarea={t} statusKey="PENDIENTE" />
                  ))
                )}
              </div>
            </div>

            {/* COLUMNA 2: EN PROGRESO */}
            <div
              className={`flex flex-col rounded-[28px] p-5 border ${COLUMN_THEMES.EN_PROGRESO.colBg}`}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-[#1A2458] text-sm flex items-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 text-[#534FA6]" />
                  <span>En Progreso</span>
                </h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${COLUMN_THEMES.EN_PROGRESO.headerBadge}`}
                >
                  {colProgreso.length}
                </span>
              </div>

              <div className="flex-1 space-y-3.5">
                {colProgreso.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#534FA6]/30 p-8 text-center text-xs font-medium text-[#534FA6]/70">
                    Ninguna tarea en ejecución
                  </div>
                ) : (
                  colProgreso.map((t) => (
                    <TaskCard key={t.id} tarea={t} statusKey="EN_PROGRESO" />
                  ))
                )}
              </div>
            </div>

            {/* COLUMNA 3: COMPLETADAS */}
            <div
              className={`flex flex-col rounded-[28px] p-5 border ${COLUMN_THEMES.COMPLETADA.colBg}`}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-[#1A2458] text-sm flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#1A2458]" />
                  <span>Completadas</span>
                </h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${COLUMN_THEMES.COMPLETADA.headerBadge}`}
                >
                  {colCompletada.length}
                </span>
              </div>

              <div className="flex-1 space-y-3.5">
                {colCompletada.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#1A2458]/20 p-8 text-center text-xs font-medium text-[#1A2458]/60">
                    Aún no hay tareas completadas
                  </div>
                ) : (
                  colCompletada.map((t) => (
                    <TaskCard key={t.id} tarea={t} statusKey="COMPLETADA" />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal existente intacto */}
      <TareaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tarea={selectedTarea}
        onSuccess={fetchTareas}
      />
    </div>
  );
}