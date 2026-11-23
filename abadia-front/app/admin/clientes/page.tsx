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
  IdentificationIcon,
  XMarkIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import ClienteModal from "@/components/ClienteModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

// Variantes de tarjetas con la paleta "Indigo Infinity" y letra blanca
const CLIENT_CARD_THEMES = [
  {
    bg: "bg-[#1A2458]", // Índigo Profundo
    avatar: "bg-[#A5C5E2] text-[#1A2458]",
    badge: "bg-white/15 text-[#A5C5E2]",
    subtext: "text-white/75",
    divider: "border-white/15",
    actionBtn: "bg-white/15 hover:bg-white/25 text-white",
  },
  {
    bg: "bg-[#473C8F]", // Violeta Índigo
    avatar: "bg-white text-[#1A2458]",
    badge: "bg-white/15 text-white",
    subtext: "text-white/80",
    divider: "border-white/15",
    actionBtn: "bg-white/15 hover:bg-white/25 text-white",
  },
  {
    bg: "bg-[#534FA6]", // Azul Lavanda Medio
    avatar: "bg-[#A5C5E2] text-[#1A2458]",
    badge: "bg-[#1A2458]/30 text-white",
    subtext: "text-white/80",
    divider: "border-white/15",
    actionBtn: "bg-white/15 hover:bg-white/25 text-white",
  },
  {
    bg: "bg-[#4F67B5]", // Azul Bígaro / Periwinkle
    avatar: "bg-[#1A2458] text-white",
    badge: "bg-white/20 text-white",
    subtext: "text-white/85",
    divider: "border-white/15",
    actionBtn: "bg-white/15 hover:bg-white/25 text-white",
  },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [previewCliente, setPreviewCliente] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [contactFilter, setContactFilter] = useState<"all" | "withPhone" | "withEmail">("all");

  const fetchClientes = async (search = "") => {
    setLoading(true);
    try {
      const url = search
        ? `/clientes?search=${encodeURIComponent(search)}&limit=50`
        : "/clientes?limit=50";
      const response = await fetchApi(url);
      setClientes(response.data || []);
    } catch (error) {
      console.error("Error cargando clientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClientes(searchTerm);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenNew = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await fetchApi(`/clientes/${id}`, { method: "DELETE" });
        if (previewCliente?.id === id) setPreviewCliente(null);
        fetchClientes(searchTerm);
      } catch (error) {
        alert("Error al eliminar el cliente. Es posible que tenga reservas asociadas.");
      }
    }
  };

  // Filtrado rápido en cliente
  const filteredClientes = useMemo(() => {
    return clientes.filter((c) => {
      if (contactFilter === "withPhone") return Boolean(c.telefono?.trim());
      if (contactFilter === "withEmail") return Boolean(c.correo?.trim());
      return true;
    });
  }, [clientes, contactFilter]);

  // Métricas del directorio
  const stats = useMemo(() => {
    const total = clientes.length;
    const withPhone = clientes.filter((c) => Boolean(c.telefono?.trim())).length;
    const withEmail = clientes.filter((c) => Boolean(c.correo?.trim())).length;
    return { total, withPhone, withEmail };
  }, [clientes]);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "H";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const cleanPhoneForWhatsApp = (phone = "") => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    return digits.startsWith("57") ? digits : `57${digits}`;
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 relative flex flex-col justify-between pb-28 antialiased">
      <div>
        {/* TOP HEADER & METRICS */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4F67B5] mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#473C8F]" />
              <span>CRM & Base de Huéspedes</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A2458]">
              Directorio de Clientes
            </h1>
            <p className="text-xs md:text-sm text-[#4F67B5] mt-1">
              Gestiona perfiles, documentos de identidad y contacto directo de tus huéspedes.
            </p>
          </div>

          {/* KPIs */}
          <div className="flex items-center gap-8 md:gap-10 bg-white px-6 py-4 rounded-[24px] border border-[#A5C5E2]/40 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Registrados
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A2458] mt-0.5">
                {stats.total}
              </p>
            </div>
            <div className="h-8 w-px bg-[#A5C5E2]/40" />
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Con WhatsApp
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#473C8F] mt-0.5">
                {stats.withPhone}
              </p>
            </div>
            <div className="h-8 w-px bg-[#A5C5E2]/40" />
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Con Correo
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A2458] mt-0.5">
                {stats.withEmail}
              </p>
            </div>
          </div>
        </div>

        {/* BARRA DE CONTROLES: FILTROS + BUSCADOR + VISTAS + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
          {/* Pills de filtro + Switcher de Vista */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex bg-white p-1.5 rounded-full border border-[#A5C5E2]/50 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === "cards"
                    ? "bg-[#1A2458] text-white shadow-sm"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                <Squares2X2Icon className="w-3.5 h-3.5" />
                Tarjetas
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-[#1A2458] text-white shadow-sm"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                <ListBulletIcon className="w-3.5 h-3.5" />
                Tabla
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setContactFilter("all")}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  contactFilter === "all"
                    ? "bg-[#473C8F] text-white"
                    : "bg-white text-[#1A2458] hover:bg-[#A5C5E2]/30"
                }`}
              >
                Todos ({clientes.length})
              </button>
              <button
                type="button"
                onClick={() => setContactFilter("withPhone")}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  contactFilter === "withPhone"
                    ? "bg-[#473C8F] text-white"
                    : "bg-white text-[#1A2458] hover:bg-[#A5C5E2]/30"
                }`}
              >
                Con teléfono
              </button>
              <button
                type="button"
                onClick={() => setContactFilter("withEmail")}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  contactFilter === "withEmail"
                    ? "bg-[#473C8F] text-white"
                    : "bg-white text-[#1A2458] hover:bg-[#A5C5E2]/30"
                }`}
              >
                Con correo
              </button>
            </div>
          </div>

          {/* Buscador + Botón Nuevo Cliente */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative sm:w-72">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F67B5]" />
              <input
                type="text"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-[#A5C5E2]/50 rounded-full focus:ring-2 focus:ring-[#473C8F]/30 outline-none text-xs text-[#1A2458] placeholder-[#4F67B5]/70 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F67B5] hover:text-[#1A2458]"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center justify-center gap-2 bg-[#1A2458] hover:bg-[#473C8F] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              Nuevo Cliente
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin" />
            <span className="text-xs font-medium text-[#4F67B5]">Cargando directorio...</span>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 border border-[#A5C5E2]/50 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#A5C5E2]/35 text-[#1A2458] flex items-center justify-center">
              <UserPlusIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#1A2458]">
              No se encontraron clientes
            </h3>
            <p className="text-xs text-[#4F67B5] max-w-sm">
              No hay huéspedes que coincidan con tu búsqueda o filtro actual. Puedes registrar uno nuevo en segundos.
            </p>
            <button
              type="button"
              onClick={handleOpenNew}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#1A2458] text-white text-xs font-bold hover:bg-[#473C8F] transition-colors"
            >
              + Registrar Primer Cliente
            </button>
          </div>
        ) : viewMode === "cards" ? (
          /* ============================================================
              1. VISTA TARJETAS BENTO (PALETA INDIGO INFINITY + LETRA BLANCA)
             ============================================================ */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredClientes.map((cliente, index) => {
              const theme = CLIENT_CARD_THEMES[index % CLIENT_CARD_THEMES.length];
              const waPhone = cleanPhoneForWhatsApp(cliente.telefono);

              return (
                <div
                  key={cliente.id}
                  onClick={() => setPreviewCliente(cliente)}
                  className={`${theme.bg} rounded-[28px] p-5 flex flex-col justify-between min-h-[215px] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-lg group relative overflow-hidden`}
                >
                  {/* Reflejo decorativo */}
                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/[0.06] pointer-events-none transition-transform duration-500 group-hover:scale-150" />

                  <div>
                    {/* Cabecera Card: Avatar + Documento */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white/25 ${theme.avatar}`}
                      >
                        {getInitials(cliente.nombre)}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${theme.badge}`}
                      >
                        <IdentificationIcon className="w-3.5 h-3.5" />
                        {cliente.documento || "Sin doc."}
                      </span>
                    </div>

                    {/* Nombre */}
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                      {cliente.nombre}
                    </h3>

                    {/* Datos de contacto */}
                    <div className={`mt-2.5 space-y-1 text-xs ${theme.subtext}`}>
                      <p className="flex items-center gap-2 truncate">
                        <PhoneIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span>{cliente.telefono || "Sin teléfono"}</span>
                      </p>
                      <p className="flex items-center gap-2 truncate">
                        <EnvelopeIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{cliente.correo || "Sin correo"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Footer Card: Acciones Rápidas */}
                  <div
                    className={`flex items-center justify-between gap-2 mt-5 pt-3 border-t ${theme.divider}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Escribir por WhatsApp"
                          className={`p-2 rounded-full transition-colors ${theme.actionBtn}`}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </a>
                      )}
                      {cliente.correo && (
                        <a
                          href={`mailto:${cliente.correo}`}
                          title="Enviar correo"
                          className={`p-2 rounded-full transition-colors ${theme.actionBtn}`}
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
                            onClick={() => handleOpenEdit(cliente)}
                            className={`p-2 rounded-full transition-colors ${theme.actionBtn}`}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Editar Cliente</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleDelete(cliente.id)}
                            className="p-2 rounded-full bg-white/10 hover:bg-rose-500 text-white transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Eliminar Cliente</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Tarjeta de Acceso Rápido Nuevo Cliente (#A5C5E2) */}
            <div
              onClick={handleOpenNew}
              className="bg-[#A5C5E2] hover:bg-[#92B7D9] rounded-[28px] p-5 min-h-[215px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm group"
            >
              <span className="self-start px-3 py-1 rounded-full text-[10px] font-bold bg-white/85 text-[#1A2458]">
                Acceso rápido
              </span>

              <div>
                <h3 className="text-lg font-bold text-[#1A2458]">Nuevo Huésped</h3>
                <p className="text-xs font-medium text-[#1A2458]/75 mt-0.5">
                  Agregar cliente al directorio del hotel
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-[#1A2458]/15">
                <span className="w-8 h-8 rounded-full bg-[#1A2458] text-white group-hover:bg-[#473C8F] flex items-center justify-center transition-colors">
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className="text-xs font-bold text-[#1A2458]">Crear registro</span>
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
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">
                      Huésped
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A5C5E2]/30">
                  {filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      onClick={() => setPreviewCliente(cliente)}
                      className="hover:bg-[#A5C5E2]/15 transition-colors cursor-pointer group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#473C8F] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(cliente.nombre)}
                          </div>
                          <span className="font-bold text-sm text-[#1A2458]">
                            {cliente.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#A5C5E2]/30 text-[#1A2458]">
                          {cliente.documento || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-[#1A2458]">
                            {cliente.telefono || "Sin teléfono"}
                          </span>
                          <span className="text-[#4F67B5]">
                            {cliente.correo || "Sin correo"}
                          </span>
                        </div>
                      </td>
                      <td
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(cliente)}
                                className="p-2 text-[#4F67B5] hover:text-white hover:bg-[#1A2458] rounded-full transition-all"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Editar Cliente</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleDelete(cliente.id)}
                                className="p-2 text-[#4F67B5] hover:text-white hover:bg-rose-600 rounded-full transition-all"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar Cliente</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PANEL LATERAL DE DETALLE RÁPIDO (SLIDE-OVER) */}
      {previewCliente && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#1A2458]/35 backdrop-blur-sm p-3"
          onClick={() => setPreviewCliente(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[30px] h-full shadow-2xl p-7 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#A5C5E2]/30 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A2458] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {getInitials(previewCliente.nombre)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2458]">
                      {previewCliente.nombre}
                    </h3>
                    <p className="text-xs font-medium text-[#4F67B5]">
                      Doc: {previewCliente.documento || "No registrado"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewCliente(null)}
                  className="p-2 text-[#4F67B5] hover:text-[#1A2458] bg-[#A5C5E2]/25 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F4F6FB] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F67B5]">
                      Teléfono / WhatsApp
                    </p>
                    <p className="text-sm font-bold text-[#1A2458] mt-0.5">
                      {previewCliente.telefono || "Sin teléfono"}
                    </p>
                  </div>
                  {cleanPhoneForWhatsApp(previewCliente.telefono) && (
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(previewCliente.telefono)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-full bg-[#473C8F] text-white text-xs font-bold hover:bg-[#1A2458] transition-colors"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F6FB] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F67B5]">
                      Correo Electrónico
                    </p>
                    <p className="text-sm font-bold text-[#1A2458] mt-0.5 truncate">
                      {previewCliente.correo || "Sin correo"}
                    </p>
                  </div>
                  {previewCliente.correo && (
                    <a
                      href={`mailto:${previewCliente.correo}`}
                      className="px-3.5 py-2 rounded-full bg-[#A5C5E2] text-[#1A2458] text-xs font-bold hover:bg-[#92B7D9] transition-colors shrink-0"
                    >
                      Escribir
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#A5C5E2]/30">
              <button
                type="button"
                onClick={() => {
                  const target = previewCliente;
                  setPreviewCliente(null);
                  handleOpenEdit(target);
                }}
                className="flex-1 py-3.5 rounded-full bg-[#1A2458] text-white text-xs font-bold hover:bg-[#473C8F] transition-colors"
              >
                Editar Datos
              </button>
              <button
                type="button"
                onClick={() => setPreviewCliente(null)}
                className="px-6 py-3.5 rounded-full bg-[#A5C5E2]/35 text-[#1A2458] text-xs font-bold hover:bg-[#A5C5E2]/55 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal existente intacto */}
      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={selectedCliente}
        onSuccess={() => fetchClientes(searchTerm)}
      />
    </div>
  );
}