"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import {
  PlusIcon,
  PencilIcon,
  EyeSlashIcon,
  ArrowUturnLeftIcon,
  SparklesIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import HabitacionModal from "@/components/HabitacionModal";
import TareaModal from "@/components/TareaModal";
import AdminDialog, { AdminDialogConfig } from "@/components/AdminDialog";

interface Habitacion {
  id: string;
  titulo: string;
  subtitulo: string;
  precio: number;
  ocupacion: string;
  estado: string;
  estadoLimpieza: string;
  activo: boolean;
  imagenes?: string[];
}

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitacion, setSelectedHabitacion] = useState<any>(null);
  const [previewHabitacion, setPreviewHabitacion] = useState<Habitacion | null>(null);
  const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
  const [taskRoom, setTaskRoom] = useState<any>(null);
  const [dialog, setDialog] = useState<AdminDialogConfig | null>(null);

  const [filterTab, setFilterTab] = useState<"ALL" | "DISPONIBLE" | "LIMPIA" | "POR_ASEAR" | "INACTIVAS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resHab, resTar] = await Promise.all([
        fetchApi("/habitaciones/admin"),
        fetchApi("/tareas").catch(() => []),
      ]);
      const listHab = Array.isArray(resHab) ? resHab : resHab?.data || [];
      const listTar = Array.isArray(resTar) ? resTar : resTar?.data || [];
      setHabitaciones(listHab);
      setTareas(listTar);
    } catch (error) {
      console.error("Error cargando habitaciones y tareas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenTaskModal = (hab: Habitacion) => {
    setTaskRoom(hab);
    setIsTareaModalOpen(true);
  };

  const handleOpenNew = () => {
    setSelectedHabitacion(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hab: any) => {
    setSelectedHabitacion(hab);
    setIsModalOpen(true);
  };

  const handleToggleActivo = (hab: Habitacion) => {
    const activar = hab.activo === false;

    setDialog({
      title: activar ? "Reactivar habitación" : "Dar de baja habitación",
      message: activar ? (
        <>
          ¿Volver a mostrar <strong>{hab.titulo}</strong> en la web?
        </>
      ) : (
        <>
          ¿Dar de baja <strong>{hab.titulo}</strong>? Dejará de mostrarse en la
          web. Sus reservas y fotografías se conservan.
        </>
      ),
      variant: activar ? "confirm" : "warning",
      confirmLabel: activar ? "Reactivar" : "Dar de baja",
      onConfirm: async () => {
        try {
          await fetchApi(`/habitaciones/${hab.id}/activo`, {
            method: "PATCH",
            body: JSON.stringify({ activo: activar }),
          });
          if (!activar && previewHabitacion?.id === hab.id) {
            setPreviewHabitacion(null);
          }
          fetchData();
          return true;
        } catch (error) {
          setDialog({
            title: activar ? "No se pudo reactivar" : "No se pudo dar de baja",
            message:
              error instanceof Error
                ? error.message
                : "Inténtalo de nuevo en unos momentos.",
            variant: "error",
          });
          return false;
        }
      },
    });
  };

  const handleToggleLimpieza = async (hab: Habitacion) => {
    const nuevoEstado = hab.estadoLimpieza === "LIMPIA" ? "POR_ASEAR" : "LIMPIA";
    try {
      await fetchApi(`/habitaciones/${hab.id}/limpieza`, {
        method: "PATCH",
        body: JSON.stringify({ estadoLimpieza: nuevoEstado }),
      });
      fetchData();
    } catch {
      setDialog({
        title: "No se pudo actualizar",
        message: "No se pudo actualizar el estado de limpieza. Inténtalo de nuevo.",
        variant: "error",
      });
    }
  };

  const filteredHabitaciones = useMemo(() => {
    return habitaciones.filter((hab) => {
      if (filterTab === "INACTIVAS" && hab.activo !== false) return false;
      if (filterTab !== "INACTIVAS" && hab.activo === false) return false;
      if (filterTab === "DISPONIBLE" && hab.estado !== "DISPONIBLE") return false;
      if (filterTab === "LIMPIA" && hab.estadoLimpieza !== "LIMPIA") return false;
      if (filterTab === "POR_ASEAR" && hab.estadoLimpieza === "LIMPIA") return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        hab.titulo?.toLowerCase().includes(q) ||
        hab.subtitulo?.toLowerCase().includes(q) ||
        hab.ocupacion?.toLowerCase().includes(q)
      );
    });
  }, [habitaciones, filterTab, searchQuery]);

  const stats = useMemo(() => {
    const total = habitaciones.length;
    const disponibles = habitaciones.filter((h) => h.estado === "DISPONIBLE").length;
    const limpias = habitaciones.filter((h) => h.estadoLimpieza === "LIMPIA").length;
    const porAsear = habitaciones.filter((h) => h.estadoLimpieza !== "LIMPIA").length;
    const inactivas = habitaciones.filter((h) => h.activo === false).length;
    return { total, disponibles, limpias, porAsear, inactivas };
  }, [habitaciones]);

  const getRoomTasks = (hab: Habitacion) => {
    return (tareas || []).filter(
      (t) =>
        (t.descripcion?.includes(hab.id) ||
          t.titulo?.includes(`[${hab.titulo}]`) ||
          t.titulo?.toLowerCase().includes(hab.titulo.toLowerCase())) &&
        t.estado !== "COMPLETADA"
    );
  };

  const extractRoomNumber = (titulo: string, index: number) => {
    const match = String(titulo || "").match(/\d+/);
    return match ? match[0].padStart(2, "0") : String(index + 1).padStart(2, "0");
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 relative flex flex-col justify-between pb-24 antialiased">
      <div>
        {/* HEADER EN AZUL OSCURO (#1A2458) */}
        <div className="bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] text-white rounded-[30px] p-6 md:p-8 shadow-xl mb-7 relative overflow-hidden">
          {/* Detalle decorativo sutil */}
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#473C8F]/35 pointer-events-none" />

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#A5C5E2] mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#A5C5E2]" />
                Catálogo & Operaciones
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Habitaciones
              </h1>
              <p className="text-xs md:text-sm text-[#A5C5E2]/90 mt-1">
                Control visual de tarifas, estado de limpieza y mantenimiento por unidad.
              </p>
            </div>

            {/* Píldoras de resumen + Botón Nueva Habitación */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/15">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Disponibles</p>
                  <p className="text-lg font-extrabold text-white">
                    {stats.disponibles}/{stats.total}
                  </p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Limpias</p>
                  <p className="text-lg font-extrabold text-white">{stats.limpias}</p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Por Asear</p>
                  <p className="text-lg font-extrabold text-[#A5C5E2]">{stats.porAsear}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNew}
                className="flex items-center gap-2 bg-[#A5C5E2] hover:bg-white text-[#1A2458] px-5 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md hover:scale-[1.02] shrink-0"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Nueva Habitación
              </button>
            </div>
          </div>

          {/* Barra secundaria de filtros y buscador */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-5 border-t border-white/15 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "ALL", label: `Todas (${habitaciones.length})` },
                { key: "DISPONIBLE", label: `Disponibles (${stats.disponibles})` },
                { key: "LIMPIA", label: `✨ Limpias (${stats.limpias})` },
                { key: "POR_ASEAR", label: `🧹 Por Asear (${stats.porAsear})` },
                { key: "INACTIVAS", label: `🙈 Inactivas (${stats.inactivas})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterTab(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    filterTab === tab.key
                      ? "bg-[#A5C5E2] text-[#1A2458] shadow-sm"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <MagnifyingGlassIcon className="w-4 h-4 text-[#A5C5E2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar habitación..."
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

        {/* GALERÍA DE HABITACIONES (ESTILO BOUTIQUE MAGAZINE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center p-14 text-[#4F67B5] bg-white rounded-[28px] border border-[#A5C5E2]/50">
              <div className="w-9 h-9 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin mb-3" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Cargando catálogo...
              </span>
            </div>
          ) : filteredHabitaciones.length === 0 ? (
            <div className="col-span-full bg-white rounded-[28px] p-12 text-center border border-[#A5C5E2]/50">
              <p className="text-base font-bold text-[#1A2458]">
                No se encontraron habitaciones con este criterio.
              </p>
            </div>
          ) : (
            filteredHabitaciones.map((hab, idx) => {
              const roomTasks = getRoomTasks(hab);
              const isClean = hab.estadoLimpieza === "LIMPIA";
              const isAvailable = hab.estado === "DISPONIBLE";
              const roomCode = extractRoomNumber(hab.titulo, idx);

              return (
                <div
                  key={hab.id}
                  onClick={() => setPreviewHabitacion(hab)}
                  className="bg-white rounded-[30px] overflow-hidden border border-[#A5C5E2]/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer"
                >
                  {/* ZONA SUPERIOR: FOTOGRAFÍA PANORÁMICA + BADGES FLOTANTES */}
                  <div>
                    <div className="relative h-48 w-full bg-gradient-to-br from-[#1A2458] via-[#473C8F] to-[#4F67B5] overflow-hidden">
                      {hab.imagenes && hab.imagenes.length > 0 ? (
                        <img
                          src={hab.imagenes[0]}
                          alt={hab.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/70 gap-1.5">
                          <SparklesIcon className="w-8 h-8 text-[#A5C5E2]" />
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#A5C5E2]">
                            Habitación {roomCode}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2458]/65 via-transparent to-black/20" />

                      {/* Badge de Estado Operativo */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                            isAvailable
                              ? "bg-[#1A2458]/90 text-white"
                              : "bg-[#534FA6]/90 text-white"
                          }`}
                        >
                          {isAvailable ? (
                            <CheckCircleIcon className="w-3.5 h-3.5 text-[#A5C5E2]" />
                          ) : (
                            <WrenchScrewdriverIcon className="w-3.5 h-3.5 text-[#A5C5E2]" />
                          )}
                          {hab.estado}
                        </span>
                        {hab.activo === false && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1A2458] shadow-xs">
                            <EyeSlashIcon className="h-3.5 w-3.5" />
                            Dada de baja
                          </span>
                        )}
                      </div>

                      {/* Acciones Editar / Dar de baja */}
                      <div
                        className="absolute top-3.5 right-3.5 flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(hab)}
                          className="p-2 rounded-full bg-white/90 hover:bg-[#1A2458] text-[#1A2458] hover:text-white backdrop-blur-md transition-colors shadow-xs"
                          title="Editar habitación"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActivo(hab)}
                          className="p-2 rounded-full bg-white/90 hover:bg-[#1A2458] text-[#1A2458] hover:text-white backdrop-blur-md transition-colors shadow-xs"
                          title={
                            hab.activo === false
                              ? "Reactivar habitación"
                              : "Dar de baja habitación"
                          }
                        >
                          {hab.activo === false ? (
                            <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                          ) : (
                            <EyeSlashIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Precio + Contador de fotos */}
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#A5C5E2] tracking-wider">
                            Tarifa / Noche
                          </p>
                          <p className="text-xl font-extrabold tracking-tight leading-none mt-0.5">
                            ${Number(hab.precio).toLocaleString("es-CO")}
                          </p>
                        </div>

                        {hab.imagenes && hab.imagenes.length > 1 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold">
                            <PhotoIcon className="w-3.5 h-3.5 text-[#A5C5E2]" />
                            {hab.imagenes.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ZONA CENTRAL: TÍTULO + CAPACIDAD + CONTROLES DE LIMPIEZA */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-[#1A2458] group-hover:text-[#473C8F] transition-colors">
                            {hab.titulo}
                          </h3>
                          <p className="text-xs font-medium text-[#4F67B5] mt-0.5">
                            {hab.subtitulo || "Estancia Boutique"}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F4F6FB] text-[#1A2458] text-xs font-bold shrink-0">
                          <UserGroupIcon className="w-3.5 h-3.5 text-[#4F67B5]" />
                          {hab.ocupacion}
                        </span>
                      </div>

                      {/* Controles rápidos de Limpieza y Tareas */}
                      <div
                        className="flex items-center gap-2 pt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleLimpieza(hab)}
                          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isClean
                              ? "bg-[#A5C5E2]/40 text-[#1A2458] hover:bg-[#A5C5E2]"
                              : "bg-[#473C8F] text-white hover:bg-[#1A2458] shadow-xs"
                          }`}
                          title="Clic para cambiar estado de limpieza"
                        >
                          {isClean ? "✨ Limpia" : "🧹 Por Asear"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenTaskModal(hab)}
                          className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-[#F4F6FB] hover:bg-[#1A2458] text-[#1A2458] hover:text-white border border-[#A5C5E2]/50 transition-all flex items-center gap-1.5"
                          title="Asignar tarea"
                        >
                          <ClipboardDocumentCheckIcon className="w-4 h-4" />
                          + Tarea
                        </button>
                      </div>

                      {/* Alerta compacta de tareas pendientes */}
                      {roomTasks.length > 0 && (
                        <div className="bg-[#473C8F] text-white rounded-2xl p-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-[#A5C5E2] animate-pulse shrink-0" />
                            <span className="text-xs font-bold truncate">
                              {roomTasks.length}{" "}
                              {roomTasks.length === 1 ? "tarea pendiente" : "tareas pendientes"}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#A5C5E2] text-[#1A2458] shrink-0">
                            Ver
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER SUTIL */}
                  <div className="px-5 py-3 bg-[#F4F6FB]/70 border-t border-[#A5C5E2]/30 flex items-center justify-between text-[11px] font-bold text-[#4F67B5] group-hover:text-[#1A2458] transition-colors">
                    <span>Ver ficha y tareas</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PANEL LATERAL DE DETALLE (SLIDE-OVER) */}
      {previewHabitacion && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#1A2458]/35 backdrop-blur-sm p-3"
          onClick={() => setPreviewHabitacion(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[30px] h-full shadow-2xl p-7 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#A5C5E2]/30 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F67B5]">
                    Ficha de Habitación
                  </span>
                  <h3 className="text-xl font-bold text-[#1A2458] mt-0.5">
                    {previewHabitacion.titulo}
                  </h3>
                  <p className="text-xs text-[#4F67B5]">
                    {previewHabitacion.subtitulo || "Estancia Boutique"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewHabitacion(null)}
                  className="p-2 text-[#4F67B5] hover:text-[#1A2458] bg-[#A5C5E2]/25 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {previewHabitacion.imagenes && previewHabitacion.imagenes.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {previewHabitacion.imagenes.slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${previewHabitacion.titulo}-${idx}`}
                      className={`w-full object-cover rounded-2xl border border-[#A5C5E2]/40 ${
                        idx === 0 ? "col-span-2 h-44" : "h-24"
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#1A2458] text-white">
                  <p className="text-[10px] uppercase font-bold text-[#A5C5E2]">Tarifa Noche</p>
                  <p className="text-xl font-bold mt-1">
                    ${Number(previewHabitacion.precio).toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-[#A5C5E2]/40">
                  <p className="text-[10px] uppercase font-bold text-[#4F67B5]">Capacidad</p>
                  <p className="text-base font-bold text-[#1A2458] mt-1">
                    {previewHabitacion.ocupacion}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1A2458]">
                    Tareas de Limpieza / Mantenimiento
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenTaskModal(previewHabitacion)}
                    className="text-xs font-bold text-[#473C8F] hover:underline"
                  >
                    + Asignar tarea
                  </button>
                </div>

                {getRoomTasks(previewHabitacion).length === 0 ? (
                  <p className="text-xs text-[#4F67B5] bg-[#F4F6FB] p-4 rounded-2xl">
                    No hay tareas pendientes para esta habitación.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getRoomTasks(previewHabitacion).map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-2xl bg-[#473C8F] text-white flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-semibold">
                          {t.titulo.replace(/^\[.*?\]\s*/, "")}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#A5C5E2] text-[#1A2458] shrink-0">
                          {t.estado === "EN_PROGRESO" ? "En Curso" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#A5C5E2]/30">
              <button
                type="button"
                onClick={() => {
                  const target = previewHabitacion;
                  setPreviewHabitacion(null);
                  handleOpenEdit(target);
                }}
                className="flex-1 py-3.5 rounded-full bg-[#1A2458] text-white text-xs font-bold hover:bg-[#473C8F] transition-colors"
              >
                Editar Habitación
              </button>
              <button
                type="button"
                onClick={() => setPreviewHabitacion(null)}
                className="px-6 py-3.5 rounded-full bg-[#A5C5E2]/35 text-[#1A2458] text-xs font-bold hover:bg-[#A5C5E2]/55 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales existentes intactos */}
      <HabitacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitacion={selectedHabitacion}
        onSuccess={() => fetchData()}
      />

      <TareaModal
        isOpen={isTareaModalOpen}
        onClose={() => setIsTareaModalOpen(false)}
        habitacionPreseleccionada={taskRoom}
        onSuccess={() => fetchData()}
      />

      <AdminDialog config={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}