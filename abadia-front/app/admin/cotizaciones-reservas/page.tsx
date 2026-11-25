"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchApi, API_URL } from "@/lib/api";
import {
  PlusIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightCircleIcon,
  HomeModernIcon,
  DocumentArrowDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import NuevaReservaModal from "@/components/NuevaReservaModal";
import CotizacionModal from "@/components/CotizacionModal";
import HuespedesModal from "@/components/HuespedesModal";
import TransferirReservaModal from "@/components/TransferirReservaModal";
import DetalleReservaModal from "@/components/DetalleReservaModal";
import ConvertirReservaModal from "@/components/ConvertirReservaModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

type FilterTab = "Todas" | "Cotizaciones" | "Pendientes" | "Realizadas" | "En Casa" | "Canceladas";

// Sistema de color unificado con la paleta Indigo Infinity
const STATUS_THEMES: Record<
  Exclude<FilterTab, "Todas">,
  {
    cardBg: string;
    cardText: string;
    subtext: string;
    pill: string;
    badgeTable: string;
    actionPrimary: string;
    actionSecondary: string;
  }
> = {
  Realizadas: {
    cardBg: "bg-[#1A2458]", // Índigo Profundo (Confirmadas)
    cardText: "text-white",
    subtext: "text-[#A5C5E2]",
    pill: "bg-[#A5C5E2]/20 text-[#A5C5E2] border-[#A5C5E2]/35",
    badgeTable: "bg-[#1A2458] text-white border-[#1A2458]",
    actionPrimary: "bg-[#A5C5E2] hover:bg-white text-[#1A2458]",
    actionSecondary: "bg-white/15 hover:bg-white/25 text-white",
  },
  "En Casa": {
    cardBg: "bg-gradient-to-br from-[#1A2458] to-[#473C8F]", // Huésped hospedado
    cardText: "text-white",
    subtext: "text-[#A5C5E2]",
    pill: "bg-white/20 text-white border-white/30",
    badgeTable: "bg-[#4F67B5] text-white border-[#4F67B5]",
    actionPrimary: "bg-white hover:bg-[#A5C5E2] text-[#1A2458]",
    actionSecondary: "bg-white/15 hover:bg-white/25 text-white",
  },
  Pendientes: {
    cardBg: "bg-[#473C8F]", // Violeta Índigo (Pendientes)
    cardText: "text-white",
    subtext: "text-white/80",
    pill: "bg-white/20 text-white border-white/30",
    badgeTable: "bg-[#473C8F] text-white border-[#473C8F]",
    actionPrimary: "bg-[#A5C5E2] hover:bg-white text-[#1A2458]",
    actionSecondary: "bg-white/15 hover:bg-white/25 text-white",
  },
  Cotizaciones: {
    cardBg: "bg-[#534FA6]", // Azul Lavanda Medio (Cotizaciones)
    cardText: "text-white",
    subtext: "text-white/85",
    pill: "bg-[#A5C5E2] text-[#1A2458] border-transparent",
    badgeTable: "bg-[#534FA6] text-white border-[#534FA6]",
    actionPrimary: "bg-white hover:bg-[#A5C5E2] text-[#1A2458]",
    actionSecondary: "bg-white/15 hover:bg-white/25 text-white",
  },
  Canceladas: {
    cardBg: "bg-[#A5C5E2]/45", // Azul Hortensia suave
    cardText: "text-[#1A2458]",
    subtext: "text-[#1A2458]/70",
    pill: "bg-white/80 text-[#1A2458] border-transparent",
    badgeTable: "bg-[#A5C5E2]/50 text-[#1A2458] border-[#A5C5E2]",
    actionPrimary: "bg-[#1A2458] text-white",
    actionSecondary: "bg-white/70 hover:bg-white text-[#1A2458]",
  },
};

export default function CotizacionesReservasPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("Todas");
  const [dateRange, setDateRange] = useState<"3m" | "all">("3m");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Modals state
  const [isNewReservaModalOpen, setIsNewReservaModalOpen] = useState(false);
  const [isNewCotizacionModalOpen, setIsNewCotizacionModalOpen] = useState(false);
  const [isHuespedesModalOpen, setIsHuespedesModalOpen] = useState(false);
  const [isTransferirModalOpen, setIsTransferirModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isConvertirModalOpen, setIsConvertirModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs: FilterTab[] = [
    "Todas",
    "Cotizaciones",
    "Pendientes",
    "Realizadas",
    "En Casa",
    "Canceladas",
  ];

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const mapCotizacionStatus = (status: string): Exclude<FilterTab, "Todas"> => {
    if (status === "PENDING") return "Cotizaciones";
    if (status === "ACCEPTED") return "Realizadas";
    if (status === "EXPIRED") return "Canceladas";
    return "Cotizaciones";
  };

  const mapReservaStatus = (status: string): Exclude<FilterTab, "Todas"> => {
    if (status === "pending") return "Pendientes";
    if (status === "confirmed") return "Realizadas";
    if (status === "in_house") return "En Casa";
    if (status === "completed") return "Realizadas";
    if (status === "cancelled") return "Canceladas";
    return "Realizadas";
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cotizacionesRes, reservasRes] = await Promise.all([
        fetchApi(`/cotizaciones?limit=100&search=${encodeURIComponent(search)}`).catch(() => ({
          data: [],
        })),
        fetchApi(`/reservations?limit=100&search=${encodeURIComponent(search)}`).catch(() => ({
          data: [],
        })),
      ]);

      const cotizaciones = (cotizacionesRes.data || cotizacionesRes || []).map((c: any) => ({
        ...c,
        dataType: "cotizacion",
        uiStatus: mapCotizacionStatus(c.status),
      }));

      const reservas = (reservasRes.data || reservasRes || []).map((r: any) => ({
        ...r,
        dataType: "reserva",
        uiStatus: mapReservaStatus(r.status),
      }));

      const combined = [...cotizaciones, ...reservas].sort(
        (a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
      );

      setData(combined);
    } catch (error) {
      console.error("Error loading combined data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const scopedData = useMemo(() => {
    if (dateRange === "all") return data;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    threeMonthsAgo.setHours(0, 0, 0, 0);
    return data.filter((item) => {
      const refDate = new Date(item.checkIn || item.createdAt || Date.now());
      return refDate >= threeMonthsAgo;
    });
  }, [data, dateRange]);

  const filteredData = useMemo(() => {
    return scopedData.filter((item) => {
      if (activeTab === "Todas") return true;
      return item.uiStatus === activeTab;
    });
  }, [scopedData, activeTab]);

  // Contadores por tab y métricas KPI
  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      Todas: scopedData.length,
      Cotizaciones: 0,
      Pendientes: 0,
      Realizadas: 0,
      "En Casa": 0,
      Canceladas: 0,
    };
    scopedData.forEach((item) => {
      const st = item.uiStatus as Exclude<FilterTab, "Todas">;
      if (counts[st] !== undefined) counts[st]++;
    });
    return counts;
  }, [data]);

  const totalConfirmedRevenue = useMemo(() => {
    return data
      .filter((i) => i.uiStatus === "Realizadas" || i.uiStatus === "En Casa")
      .reduce((acc, i) => acc + Number(i.value || i.total_estimado || 0), 0);
  }, [data]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Intl.DateTimeFormat("es-CO", { month: "short", day: "2-digit" }).format(
      new Date(dateString)
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatRoom = (item: any) => {
    const raw = item.habitacion?.titulo || item.habitacion_id;
    if (!raw) return "Sin asignar";
    const match = String(raw).match(/\d+/);
    return match ? `Habitación ${match[0]}` : String(raw);
  };

  const handleChangeStatus = async (
    id: string,
    type: "cotizacion" | "reserva",
    newStatus: string
  ) => {
    if (confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
      try {
        const endpoint =
          type === "cotizacion" ? `/cotizaciones/${id}/status` : `/reservations/${id}/status`;
        await fetchApi(endpoint, {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        });
        fetchData();
      } catch (error: any) {
        alert("Error al cambiar estado: " + (error.message || ""));
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 relative flex flex-col justify-between pb-28 antialiased">
      <div>
        {/* TOP HEADER & METRICS */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4F67B5] mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#473C8F]" />
              <span>Embudo Comercial & Recepción</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A2458]">
              Cotizaciones y Reservas
            </h1>
            <p className="text-xs md:text-sm text-[#4F67B5] mt-1">
              Gestión unificada desde la cotización inicial hasta el check-out del huésped.
            </p>
          </div>

          {/* KPIs */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8 bg-white px-6 py-4 rounded-[24px] border border-[#A5C5E2]/40 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                En Casa
              </p>
              <p className="text-2xl font-bold tracking-tight text-[#1A2458] mt-0.5">
                {tabCounts["En Casa"]}
              </p>
            </div>
            <div className="h-8 w-px bg-[#A5C5E2]/40" />
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Por Confirmar
              </p>
              <p className="text-2xl font-bold tracking-tight text-[#473C8F] mt-0.5">
                {tabCounts.Pendientes + tabCounts.Cotizaciones}
              </p>
            </div>
            <div className="h-8 w-px bg-[#A5C5E2]/40" />
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Confirmado
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-[#1A2458] mt-0.5">
                {formatCurrency(totalConfirmedRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* BARRA DE TABS + BUSCADOR + VISTAS + BOTONES DE ACCIÓN */}
        <div className="flex flex-col gap-4 mb-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Buscador + Switcher Vista */}
            <div className="flex flex-wrap items-center gap-3">
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

              <div className="relative flex-1 sm:w-72">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F67B5]" />
                <input
                  type="text"
                  placeholder="Buscar cliente, habitación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-white border border-[#A5C5E2]/50 rounded-full text-xs text-[#1A2458] placeholder-[#4F67B5]/70 focus:outline-none focus:ring-2 focus:ring-[#473C8F]/30 w-full transition-all"
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
            </div>

            {/* Botones Nueva Cotización & Nueva Reserva */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewCotizacionModalOpen(true)}
                className="flex items-center gap-2 bg-white hover:bg-[#A5C5E2]/30 text-[#1A2458] border border-[#A5C5E2] px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Nueva Cotización
              </button>
              <button
                type="button"
                onClick={() => setIsNewReservaModalOpen(true)}
                className="flex items-center gap-2 bg-[#1A2458] hover:bg-[#473C8F] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Nueva Reserva
              </button>
            </div>
          </div>

          {/* Pills / Tabs con Contadores + Filtro de Rango */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="flex overflow-x-auto gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                      isActive
                        ? "bg-[#1A2458] text-white border-[#1A2458] shadow-sm"
                        : "bg-white text-[#4F67B5] border-[#A5C5E2]/40 hover:text-[#1A2458] hover:bg-[#A5C5E2]/20"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#A5C5E2] text-[#1A2458]"
                          : "bg-[#F4F6FB] text-[#4F67B5]"
                      }`}
                    >
                      {tabCounts[tab]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center bg-[#F4F6FB] p-1 rounded-full border border-[#A5C5E2]/50 shrink-0">
              <button
                type="button"
                onClick={() => setDateRange("3m")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  dateRange === "3m"
                    ? "bg-[#1A2458] text-white shadow-xs"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                Últimos 3 meses
              </button>
              <button
                type="button"
                onClick={() => setDateRange("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  dateRange === "all"
                    ? "bg-[#1A2458] text-white shadow-xs"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                Todo el historial
              </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin" />
            <span className="text-xs font-medium text-[#4F67B5]">
              Cargando cotizaciones y reservas...
            </span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 border border-[#A5C5E2]/50 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-base font-bold text-[#1A2458]">
              No se encontraron registros en &ldquo;{activeTab}&rdquo;
            </p>
            <p className="text-xs text-[#4F67B5]">
              Prueba cambiando de filtro o crea una nueva cotización o reserva.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          /* ============================================================
              1. VISTA TARJETAS BENTO (PALETA INDIGO INFINITY)
             ============================================================ */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredData.map((item) => {
              const statusKey = (item.uiStatus as Exclude<FilterTab, "Todas">) || "Realizadas";
              const theme = STATUS_THEMES[statusKey] || STATUS_THEMES.Realizadas;
              const guestName = item.cliente?.nombre || "Sin Cliente";
              const totalValue = Number(item.value || item.total_estimado || 0);

              return (
                <div
                  key={`${item.dataType}-${item.id}`}
                  onClick={() => {
                    if (item.dataType === "reserva") {
                      setSelectedItem(item);
                      setIsDetalleModalOpen(true);
                    }
                  }}
                  className={`${theme.cardBg} ${theme.cardText} rounded-[28px] p-6 flex flex-col justify-between min-h-[245px] transition-all duration-300 hover:-translate-y-1.5 shadow-lg group relative overflow-hidden ${
                    item.dataType === "reserva" ? "cursor-pointer" : ""
                  }`}
                >
                  <div>
                    {/* Top Row: Badge Estado + ID + Tipo */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.pill}`}
                      >
                        ● {item.uiStatus}
                      </span>

                      <span className={`text-xs font-bold ${theme.subtext}`}>
                        #{item.id?.toString().slice(-4) || "---"}
                      </span>
                    </div>

                    {/* Cliente y Habitación */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center font-bold text-sm shrink-0">
                        {guestName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold leading-snug truncate">
                          {guestName}
                        </h3>
                        <p className={`text-xs font-medium truncate ${theme.subtext}`}>
                          {formatRoom(item)} · {item.cliente?.correo || "Sin correo"}
                        </p>
                      </div>
                    </div>

                    {/* Fechas y Valor */}
                    <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/15">
                      <div>
                        <p className={`text-[10px] uppercase font-bold ${theme.subtext}`}>
                          Estancia
                        </p>
                        <p className="text-xs font-bold mt-0.5 flex items-center gap-1">
                          <CalendarDaysIcon className="w-3.5 h-3.5 opacity-80" />
                          <span>
                            {formatDate(item.checkIn)} ➔ {formatDate(item.checkOut)}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] uppercase font-bold ${theme.subtext}`}>
                          Valor Total
                        </p>
                        <p className="text-sm font-bold mt-0.5">
                          {formatCurrency(totalValue)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones Operativas Directas */}
                  <div
                    className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/15"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Cotización -> Convertir a Reserva */}
                      {item.dataType === "cotizacion" && item.uiStatus === "Cotizaciones" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsConvertirModalOpen(true);
                          }}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${theme.actionPrimary}`}
                        >
                          <ArrowRightCircleIcon className="w-4 h-4 stroke-[2.2]" />
                          A Reserva
                        </button>
                      )}

                      {/* Reserva Pendiente -> Confirmar */}
                      {item.dataType === "reserva" && item.uiStatus === "Pendientes" && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus(item.id, "reserva", "confirmed")}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${theme.actionPrimary}`}
                        >
                          <CheckCircleIcon className="w-4 h-4 stroke-[2.2]" />
                          Confirmar
                        </button>
                      )}

                      {/* Reserva Confirmada -> Check-in */}
                      {item.dataType === "reserva" && item.uiStatus === "Realizadas" && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus(item.id, "reserva", "in_house")}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${theme.actionPrimary}`}
                        >
                          <HomeModernIcon className="w-4 h-4 stroke-[2.2]" />
                          Check-in
                        </button>
                      )}

                      {/* Reserva En Casa -> Check-out */}
                      {item.dataType === "reserva" && item.uiStatus === "En Casa" && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus(item.id, "reserva", "completed")}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${theme.actionPrimary}`}
                        >
                          <CheckCircleIcon className="w-4 h-4 stroke-[2.2]" />
                          Check-out
                        </button>
                      )}
                    </div>

                    {/* Botones secundarios: Ver detalle, PDF, Huéspedes TRA, Anular */}
                    <div className="flex items-center gap-1.5">
                      {item.dataType === "reserva" && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsHuespedesModalOpen(true);
                                }}
                                className={`p-2 rounded-full transition-colors ${theme.actionSecondary}`}
                              >
                                <UserGroupIcon className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Registro TRA</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsDetalleModalOpen(true);
                                }}
                                className={`p-2 rounded-full transition-colors ${theme.actionSecondary}`}
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Ver Detalles</TooltipContent>
                          </Tooltip>
                        </>
                      )}

                      {item.dataType === "cotizacion" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() =>
                                window.open(`${API_URL}/documents/cotizacion/${item.id}`, "_blank")
                              }
                              className={`p-2 rounded-full transition-colors ${theme.actionSecondary}`}
                            >
                              <DocumentArrowDownIcon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Descargar PDF</TooltipContent>
                        </Tooltip>
                      )}

                      {item.dataType === "reserva" &&
                        (item.uiStatus === "Pendientes" || item.uiStatus === "Realizadas") && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleChangeStatus(item.id, "reserva", "cancelled")}
                                className="p-2 rounded-full bg-white/10 hover:bg-rose-500 text-white transition-colors"
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Anular Reserva</TooltipContent>
                          </Tooltip>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================================
              2. VISTA TABLA UNIFICADA MODERNA
             ============================================================ */
          <div className="bg-white rounded-[28px] shadow-sm border border-[#A5C5E2]/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1A2458] text-white">
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">ID</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Cliente</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">
                      Habitación
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Fechas</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Estado</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A5C5E2]/30">
                  {filteredData.map((item) => {
                    const statusKey =
                      (item.uiStatus as Exclude<FilterTab, "Todas">) || "Realizadas";
                    const theme = STATUS_THEMES[statusKey] || STATUS_THEMES.Realizadas;

                    return (
                      <tr
                        key={`${item.dataType}-${item.id}`}
                        className="hover:bg-[#A5C5E2]/15 transition-colors group"
                      >
                        <td className="p-4 text-xs text-[#4F67B5] font-bold">
                          #{item.id?.toString().slice(-4) || "---"}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-[#1A2458] line-clamp-1">
                              {item.cliente?.nombre}
                            </span>
                            <span className="text-xs text-[#4F67B5]">{item.cliente?.correo}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold text-[#1A2458]">
                          {formatRoom(item)}
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-[#1A2458]">
                            {formatDate(item.checkIn)}{" "}
                            <span className="text-[#4F67B5] mx-1">➔</span>{" "}
                            {formatDate(item.checkOut)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${theme.badgeTable}`}
                          >
                            {item.uiStatus}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold text-[#1A2458]">
                          {formatCurrency(Number(item.value || item.total_estimado))}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.dataType === "cotizacion" &&
                              item.uiStatus === "Cotizaciones" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsConvertirModalOpen(true);
                                  }}
                                  className="flex items-center gap-1 bg-[#1A2458] hover:bg-[#473C8F] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm"
                                >
                                  <ArrowRightCircleIcon className="w-4 h-4" />
                                  A Reserva
                                </button>
                              )}

                            {item.dataType === "reserva" && (
                              <>
                                {item.uiStatus === "Realizadas" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChangeStatus(item.id, "reserva", "in_house")
                                    }
                                    className="flex items-center gap-1 bg-[#4F67B5] hover:bg-[#1A2458] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                                  >
                                    <HomeModernIcon className="w-4 h-4" />
                                    Check-in
                                  </button>
                                )}
                                {item.uiStatus === "En Casa" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChangeStatus(item.id, "reserva", "completed")
                                    }
                                    className="flex items-center gap-1 bg-[#1A2458] hover:bg-[#473C8F] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Check-out
                                  </button>
                                )}
                                {item.uiStatus === "Pendientes" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChangeStatus(item.id, "reserva", "confirmed")
                                    }
                                    className="flex items-center gap-1 bg-[#473C8F] hover:bg-[#1A2458] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Confirmar
                                  </button>
                                )}
                                {(item.uiStatus === "Pendientes" ||
                                  item.uiStatus === "Realizadas") && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleChangeStatus(item.id, "reserva", "cancelled")
                                        }
                                        className="p-1.5 text-[#4F67B5] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                                      >
                                        <XCircleIcon className="w-5 h-5" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Anular Reserva</TooltipContent>
                                  </Tooltip>
                                )}
                              </>
                            )}

                            <div className="flex gap-1 ml-1 border-l pl-2 border-[#A5C5E2]/40">
                              {item.dataType === "reserva" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedItem(item);
                                        setIsDetalleModalOpen(true);
                                      }}
                                      className="p-1.5 text-[#4F67B5] hover:text-[#1A2458] hover:bg-[#A5C5E2]/30 rounded-full transition-all"
                                    >
                                      <EyeIcon className="w-5 h-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Ver Detalles</TooltipContent>
                                </Tooltip>
                              )}
                              {item.dataType === "cotizacion" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        window.open(
                                          `${API_URL}/documents/cotizacion/${item.id}`,
                                          "_blank"
                                        )
                                      }
                                      className="p-1.5 text-[#4F67B5] hover:text-[#1A2458] hover:bg-[#A5C5E2]/30 rounded-full transition-all"
                                    >
                                      <DocumentArrowDownIcon className="w-5 h-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Descargar PDF</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
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

      {/* DOCK FLOTANTE INFERIOR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-xl border border-[#A5C5E2]/60">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`p-2.5 rounded-full transition-all ${
              viewMode === "cards"
                ? "bg-[#1A2458] text-white"
                : "text-[#4F67B5] hover:bg-[#A5C5E2]/30 hover:text-[#1A2458]"
            }`}
            title="Vista Tarjetas"
          >
            <Squares2X2Icon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsNewCotizacionModalOpen(true)}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#534FA6] text-white hover:bg-[#473C8F] transition-colors"
          >
            + Cotización
          </button>

          <button
            type="button"
            onClick={() => setIsNewReservaModalOpen(true)}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#1A2458] text-white hover:bg-[#473C8F] transition-colors shadow-sm"
          >
            + Reserva
          </button>

          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`p-2.5 rounded-full transition-all ${
              viewMode === "table"
                ? "bg-[#1A2458] text-white"
                : "text-[#4F67B5] hover:bg-[#A5C5E2]/30 hover:text-[#1A2458]"
            }`}
            title="Vista Tabla"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modales existentes intactos */}
      <NuevaReservaModal
        isOpen={isNewReservaModalOpen}
        onClose={() => setIsNewReservaModalOpen(false)}
        onSuccess={fetchData}
      />
      <CotizacionModal
        isOpen={isNewCotizacionModalOpen}
        onClose={() => setIsNewCotizacionModalOpen(false)}
        onSuccess={fetchData}
      />
      {selectedItem && (
        <>
          <DetalleReservaModal
            isOpen={isDetalleModalOpen}
            onClose={() => setIsDetalleModalOpen(false)}
            reservation={selectedItem}
          />
          <ConvertirReservaModal
            isOpen={isConvertirModalOpen}
            onClose={() => setIsConvertirModalOpen(false)}
            item={selectedItem}
            onSuccess={fetchData}
          />
          <HuespedesModal
            isOpen={isHuespedesModalOpen}
            onClose={() => setIsHuespedesModalOpen(false)}
            reservation={selectedItem}
            onSuccess={fetchData}
          />
          <TransferirReservaModal
            isOpen={isTransferirModalOpen}
            onClose={() => setIsTransferirModalOpen(false)}
            reservation={selectedItem}
            onSuccess={fetchData}
          />
        </>
      )}
    </div>
  );
}