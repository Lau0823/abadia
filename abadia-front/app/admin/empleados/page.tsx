"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  XMarkIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import EmpleadoModal from "@/components/EmpleadoModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

// Asignación cromática por rol usando la paleta Indigo Infinity (letra blanca)
const getRoleTheme = (rol = "") => {
  const normalized = rol.toLowerCase().replace(/_/g, "");
  if (normalized.includes("superadmin") || normalized.includes("admin")) {
    return {
      bg: "bg-[#1A2458]", // Índigo Profundo
      badge: "bg-[#A5C5E2] text-[#1A2458]",
      avatar: "bg-[#A5C5E2] text-[#1A2458]",
      subtext: "text-[#A5C5E2]",
      tableBadge: "bg-[#1A2458] text-white",
    };
  }
  if (normalized.includes("supervisor") || normalized.includes("recepcion")) {
    return {
      bg: "bg-[#473C8F]", // Violeta Índigo
      badge: "bg-white/20 text-white",
      avatar: "bg-white text-[#1A2458]",
      subtext: "text-white/80",
      tableBadge: "bg-[#473C8F] text-white",
    };
  }
  return {
    bg: "bg-[#534FA6]", // Azul Lavanda Medio (Operativo / Camarería / Mantenimiento)
    badge: "bg-[#A5C5E2]/25 text-[#A5C5E2]",
    avatar: "bg-[#1A2458] text-white",
    subtext: "text-white/85",
    tableBadge: "bg-[#534FA6] text-white",
  };
};

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const fetchEmpleados = async (search = "") => {
    setLoading(true);
    try {
      const url = search
        ? `/users?search=${encodeURIComponent(search)}&limit=50`
        : "/users?limit=50";
      const response = await fetchApi(url);
      setEmpleados(response.data || response || []);
    } catch (error) {
      console.error("Error cargando empleados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmpleados(searchTerm);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenNew = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (empleado: any) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await fetchApi(`/users/${id}`, { method: "DELETE" });
        fetchEmpleados(searchTerm);
      } catch (error) {
        alert("Error al eliminar el empleado.");
      }
    }
  };

  // Roles únicos dinámicos para los filtros
  const availableRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    empleados.forEach((emp) => {
      if (emp.rol) rolesSet.add(String(emp.rol).toUpperCase());
    });
    return Array.from(rolesSet);
  }, [empleados]);

  const filteredEmpleados = useMemo(() => {
    if (roleFilter === "ALL") return empleados;
    return empleados.filter(
      (emp) => String(emp.rol || "").toUpperCase() === roleFilter
    );
  }, [empleados, roleFilter]);

  const stats = useMemo(() => {
    const total = empleados.length;
    const admins = empleados.filter((e) => {
      const r = (e.rol || "").toLowerCase();
      return r.includes("admin") || r.includes("supervisor");
    }).length;
    const staff = total - admins;
    return { total, admins, staff };
  }, [empleados]);

  const getInitials = (name = "", username = "") => {
    const base = (name || username || "E").trim();
    const parts = base.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const cleanPhoneForWhatsApp = (phone = "") => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    return digits.startsWith("57") ? digits : `57${digits}`;
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 relative flex flex-col justify-between pb-24 antialiased">
      <div>
        {/* HEADER EN AZUL OSCURO (#1A2458) */}
        <div className="bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] text-white rounded-[30px] p-6 md:p-8 shadow-xl mb-7 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#473C8F]/35 pointer-events-none" />

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#A5C5E2] mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#A5C5E2]" />
                Equipo & Permisos
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Directorio de Empleados
              </h1>
              <p className="text-xs md:text-sm text-[#A5C5E2]/90 mt-1">
                Gestiona los accesos, roles operativos y contacto de todo tu personal.
              </p>
            </div>

            {/* KPIs + Botón Nuevo Empleado */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/15">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Total Equipo</p>
                  <p className="text-lg font-extrabold text-white">{stats.total}</p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Admin / Sup.</p>
                  <p className="text-lg font-extrabold text-white">{stats.admins}</p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#A5C5E2]">Operativos</p>
                  <p className="text-lg font-extrabold text-[#A5C5E2]">{stats.staff}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNew}
                className="flex items-center gap-2 bg-[#A5C5E2] hover:bg-white text-[#1A2458] px-5 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md hover:scale-[1.02] shrink-0"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Nuevo Empleado
              </button>
            </div>
          </div>

          {/* Barra secundaria: Switcher Vista + Filtros por Rol + Buscador */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 pt-5 border-t border-white/15 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              {/* Switcher Tarjetas / Tabla */}
              <div className="inline-flex bg-white/10 p-1 rounded-full border border-white/15 mr-1">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    viewMode === "cards"
                      ? "bg-[#A5C5E2] text-[#1A2458] shadow-xs"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Squares2X2Icon className="w-3.5 h-3.5" />
                  Tarjetas
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    viewMode === "table"
                      ? "bg-[#A5C5E2] text-[#1A2458] shadow-xs"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <ListBulletIcon className="w-3.5 h-3.5" />
                  Tabla
                </button>
              </div>

              {/* Pills de Roles */}
              <button
                type="button"
                onClick={() => setRoleFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  roleFilter === "ALL"
                    ? "bg-[#A5C5E2] text-[#1A2458]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Todos ({empleados.length})
              </button>
              {availableRoles.map((rol) => (
                <button
                  key={rol}
                  type="button"
                  onClick={() => setRoleFilter(rol)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                    roleFilter === rol
                      ? "bg-[#A5C5E2] text-[#1A2458]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {rol}
                </button>
              ))}
            </div>

            {/* Buscador */}
            <div className="relative w-full lg:w-72">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5C5E2]" />
              <input
                type="text"
                placeholder="Buscar empleado o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white/10 border border-white/15 rounded-full text-xs text-white placeholder-[#A5C5E2]/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#A5C5E2]/50 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5C5E2] hover:text-white"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3 bg-white rounded-[28px] border border-[#A5C5E2]/50">
            <div className="w-9 h-9 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F67B5]">
              Cargando empleados...
            </span>
          </div>
        ) : filteredEmpleados.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 border border-[#A5C5E2]/50 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#A5C5E2]/35 text-[#1A2458] flex items-center justify-center">
              <UserPlusIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#1A2458]">
              No se encontraron empleados
            </h3>
            <p className="text-xs text-[#4F67B5] max-w-sm">
              No hay miembros del equipo que coincidan con tu búsqueda o filtro actual.
            </p>
            <button
              type="button"
              onClick={handleOpenNew}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#1A2458] text-white text-xs font-bold hover:bg-[#473C8F] transition-colors"
            >
              + Registrar Empleado
            </button>
          </div>
        ) : viewMode === "cards" ? (
          /* ============================================================
              1. VISTA TARJETAS BENTO (PALETA INDIGO INFINITY + LETRA BLANCA)
             ============================================================ */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredEmpleados.map((empleado) => {
              const theme = getRoleTheme(empleado.rol);
              const waPhone = cleanPhoneForWhatsApp(empleado.telefono);
              const displayName = empleado.nombre || empleado.username;

              return (
                <div
                  key={empleado.id}
                  className={`${theme.bg} text-white rounded-[28px] p-5 flex flex-col justify-between min-h-[225px] transition-all duration-300 hover:-translate-y-1.5 shadow-lg group relative overflow-hidden`}
                >
                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/[0.06] pointer-events-none transition-transform duration-500 group-hover:scale-150" />

                  <div>
                    {/* Cabecera: Avatar + Rol Badge */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white/25 ${theme.avatar}`}
                      >
                        {getInitials(empleado.nombre, empleado.username)}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}
                      >
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                        {empleado.rol || "Staff"}
                      </span>
                    </div>

                    {/* Nombre y Usuario */}
                    <h3 className="text-base font-bold text-white leading-snug truncate">
                      {displayName}
                    </h3>
                    <p className={`text-xs font-medium truncate ${theme.subtext}`}>
                      @{empleado.username} · ID #{empleado.id}
                    </p>

                    {/* Contacto */}
                    <div className="mt-3 space-y-1 text-xs text-white/85">
                      <p className="flex items-center gap-2 truncate">
                        <PhoneIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span>{empleado.telefono || "Sin teléfono"}</span>
                      </p>
                      <p className="flex items-center gap-2 truncate">
                        <EnvelopeIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{empleado.email || "Sin correo"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Footer: Contacto directo + Editar/Eliminar */}
                  <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/15">
                    <div className="flex items-center gap-1.5">
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Escribir por WhatsApp"
                          className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </a>
                      )}
                      {empleado.email && (
                        <a
                          href={`mailto:${empleado.email}`}
                          title="Enviar correo"
                          className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(empleado)}
                            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Editar Empleado</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleDelete(empleado.id)}
                            className="p-2 rounded-full bg-white/10 hover:bg-rose-500 text-white transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Eliminar Empleado</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Tarjeta de Acceso Rápido Nuevo Empleado (#A5C5E2) */}
            <div
              onClick={handleOpenNew}
              className="bg-[#A5C5E2] hover:bg-[#92B7D9] rounded-[28px] p-5 min-h-[225px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm group"
            >
              <span className="self-start px-3 py-1 rounded-full text-[10px] font-bold bg-white/85 text-[#1A2458]">
                Acceso rápido
              </span>

              <div>
                <h3 className="text-lg font-bold text-[#1A2458]">Nuevo Colaborador</h3>
                <p className="text-xs font-medium text-[#1A2458]/75 mt-0.5">
                  Crear usuario y asignar permisos de acceso
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-[#1A2458]/15">
                <span className="w-8 h-8 rounded-full bg-[#1A2458] text-white group-hover:bg-[#473C8F] flex items-center justify-center transition-colors">
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className="text-xs font-bold text-[#1A2458]">Agregar al equipo</span>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
              2. VISTA TABLA MODERNA
             ============================================================ */
          <div className="bg-white rounded-[28px] shadow-sm border border-[#A5C5E2]/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1A2458] text-white">
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">ID</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Empleado</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Contacto</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Rol</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A5C5E2]/30">
                  {filteredEmpleados.map((empleado) => {
                    const theme = getRoleTheme(empleado.rol);
                    return (
                      <tr
                        key={empleado.id}
                        className="hover:bg-[#A5C5E2]/15 transition-colors group"
                      >
                        <td className="p-4">
                          <span className="text-[#4F67B5] font-bold text-xs">
                            #{empleado.id}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1A2458] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {getInitials(empleado.nombre, empleado.username)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-[#1A2458]">
                                {empleado.nombre || empleado.username}
                              </span>
                              <span className="text-[#4F67B5] text-xs">
                                @{empleado.username}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-xs">
                            <span className="font-semibold text-[#1A2458]">
                              {empleado.telefono || "Sin teléfono"}
                            </span>
                            <span className="text-[#4F67B5]">
                              {empleado.email || "Sin correo"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.tableBadge}`}
                          >
                            {empleado.rol}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(empleado)}
                                  className="p-2 text-[#4F67B5] hover:text-white hover:bg-[#1A2458] rounded-full transition-all"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Editar Empleado</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(empleado.id)}
                                  className="p-2 text-[#4F67B5] hover:text-white hover:bg-rose-600 rounded-full transition-all"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Eliminar Empleado</TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal existente intacto */}
      <EmpleadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        empleado={selectedEmpleado}
        onSuccess={() => fetchEmpleados(searchTerm)}
      />
    </div>
  );
}