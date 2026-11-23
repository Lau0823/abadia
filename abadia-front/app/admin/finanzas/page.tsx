"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  PresentationChartLineIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  TagIcon,
  CalendarDaysIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import TransaccionModal from "@/components/TransaccionModal";

export default function FinanzasPage() {
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0, balance: 0 });

  // Filtros y vista UX
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INGRESO" | "EGRESO">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const fetchTransacciones = async () => {
    setLoading(true);
    try {
      const response = await fetchApi("/finanzas");
      const data = Array.isArray(response) ? response : response?.data || [];
      setTransacciones(data);

      let ing = 0;
      let egr = 0;
      data.forEach((t: any) => {
        if (t.tipo === "INGRESO") ing += Number(t.monto);
        else if (t.tipo === "EGRESO") egr += Number(t.monto);
      });
      setResumen({ ingresos: ing, egresos: egr, balance: ing - egr });
    } catch (error) {
      console.error("Error cargando finanzas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const handleOpenNew = () => {
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Categorías dinámicas extraídas de los movimientos
  const categories = useMemo(() => {
    const set = new Set<string>();
    transacciones.forEach((t) => {
      if (t.categoria) set.add(String(t.categoria));
    });
    return Array.from(set);
  }, [transacciones]);

  // Transacciones filtradas
  const filteredTransacciones = useMemo(() => {
    return transacciones.filter((t) => {
      if (typeFilter !== "ALL" && t.tipo !== typeFilter) return false;
      if (categoryFilter !== "ALL" && String(t.categoria) !== categoryFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const concepto = (t.concepto || "").toLowerCase();
      const categoria = (t.categoria || "").toLowerCase();
      const reserva = t.reservaId ? `reserva #${t.reservaId}` : "";
      return concepto.includes(q) || categoria.includes(q) || reserva.includes(q);
    });
  }, [transacciones, typeFilter, categoryFilter, searchQuery]);

  // Indicadores visuales de proporción Ingresos vs Egresos
  const financialRatios = useMemo(() => {
    const totalFlow = resumen.ingresos + resumen.egresos;
    const incomePct = totalFlow > 0 ? Math.round((resumen.ingresos / totalFlow) * 100) : 50;
    const expensePct = totalFlow > 0 ? 100 - incomePct : 50;
    const marginPct =
      resumen.ingresos > 0
        ? Math.round(((resumen.ingresos - resumen.egresos) / resumen.ingresos) * 100)
        : 0;
    return { incomePct, expensePct, marginPct };
  }, [resumen]);

  // Exportación rápida a CSV
  const handleExportCSV = () => {
    const headers = ["Fecha", "Concepto", "Categoria", "Tipo", "Monto", "ReservaID"];
    const rows = filteredTransacciones.map((t) => [
      `"${formatDate(t.fecha)}"`,
      `"${(t.concepto || "").replace(/"/g, '""')}"`,
      `"${t.categoria || ""}"`,
      t.tipo,
      Number(t.monto || 0),
      t.reservaId || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `finanzas_hotel_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 space-y-7 pb-20 antialiased">
      {/* HEADER EJECUTIVO EN ÍNDIGO PROFUNDO (#1A2458) */}
      <div className="bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] text-white rounded-[30px] p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-14 -top-14 w-64 h-64 rounded-full bg-[#473C8F]/35 pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-52 h-52 rounded-full bg-[#A5C5E2]/10 pointer-events-none" />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#A5C5E2] mb-2.5">
              <PresentationChartLineIcon className="w-3.5 h-3.5" />
              Tesorería & Flujo de Caja
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Dashboard Financiero
            </h1>
            <p className="text-xs md:text-sm text-[#A5C5E2]/90 mt-1">
              Controla los ingresos por hospedaje, egresos operativos y balance neto en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {filteredTransacciones.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-3 rounded-2xl text-xs font-bold transition-all"
                title="Descargar reporte en Excel/CSV"
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-[#A5C5E2]" />
                Exportar CSV
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-2 bg-[#A5C5E2] hover:bg-white text-[#1A2458] px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md hover:scale-[1.02] shrink-0"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              Registrar Transacción
            </button>
          </div>
        </div>

        {/* Barra de Proporción Flujo de Caja */}
        <div className="mt-6 pt-5 border-t border-white/15 relative z-10">
          <div className="flex flex-wrap items-center justify-between text-xs mb-2 gap-2">
            <span className="font-semibold text-[#A5C5E2]">
              Distribución del flujo ({financialRatios.incomePct}% Ingresos ·{" "}
              {financialRatios.expensePct}% Egresos)
            </span>
            <span className="font-bold text-white bg-white/15 px-3 py-0.5 rounded-full">
              Margen operativo: {financialRatios.marginPct}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden flex">
            <div
              style={{ width: `${financialRatios.incomePct}%` }}
              className="bg-[#A5C5E2] h-full transition-all duration-500"
            />
            <div
              style={{ width: `${financialRatios.expensePct}%` }}
              className="bg-[#534FA6] h-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* TARJETAS KPI BENTO (PALETA INDIGO INFINITY + LETRA BLANCA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Balance de Caja (#1A2458) */}
        <div className="bg-[#1A2458] rounded-[28px] p-6 shadow-xl text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/[0.06] group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A5C5E2] text-[#1A2458]">
              Saldo Neto
            </span>
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-[#A5C5E2]" />
            </div>
          </div>
          <p className="text-xs font-semibold text-[#A5C5E2] uppercase tracking-wider">
            Balance de Caja
          </p>
          <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">
            {formatCurrency(resumen.balance)}
          </h3>
        </div>

        {/* 2. Ingresos Totales (#473C8F) */}
        <div className="bg-[#473C8F] rounded-[28px] p-6 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/[0.06] group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
              Entradas
            </span>
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-[#A5C5E2]" />
            </div>
          </div>
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            Ingresos Totales
          </p>
          <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">
            {formatCurrency(resumen.ingresos)}
          </h3>
        </div>

        {/* 3. Egresos Totales (#534FA6) */}
        <div className="bg-[#534FA6] rounded-[28px] p-6 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/[0.06] group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
              Salidas
            </span>
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
              <ArrowTrendingDownIcon className="w-6 h-6 text-[#A5C5E2]" />
            </div>
          </div>
          <p className="text-xs font-semibold text-white/85 uppercase tracking-wider">
            Egresos Totales
          </p>
          <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">
            {formatCurrency(resumen.egresos)}
          </h3>
        </div>
      </div>

      {/* BARRA DE FILTROS + BUSCADOR + SWITCHER DE VISTA */}
      <div className="bg-white rounded-[28px] p-5 border border-[#A5C5E2]/50 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Switcher Tabla / Tarjetas */}
          <div className="inline-flex bg-[#F4F6FB] p-1 rounded-full border border-[#A5C5E2]/40 mr-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-[#1A2458] text-white shadow-xs"
                  : "text-[#4F67B5] hover:text-[#1A2458]"
              }`}
            >
              <ListBulletIcon className="w-3.5 h-3.5" />
              Tabla
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-[#1A2458] text-white shadow-xs"
                  : "text-[#4F67B5] hover:text-[#1A2458]"
              }`}
            >
              <Squares2X2Icon className="w-3.5 h-3.5" />
              Tarjetas
            </button>
          </div>

          {/* Filtro por Tipo */}
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              typeFilter === "ALL"
                ? "bg-[#1A2458] text-white"
                : "bg-[#F4F6FB] text-[#4F67B5] hover:text-[#1A2458]"
            }`}
          >
            Todos ({transacciones.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("INGRESO")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              typeFilter === "INGRESO"
                ? "bg-[#473C8F] text-white"
                : "bg-[#F4F6FB] text-[#4F67B5] hover:text-[#1A2458]"
            }`}
          >
            Ingresos
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("EGRESO")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              typeFilter === "EGRESO"
                ? "bg-[#534FA6] text-white"
                : "bg-[#F4F6FB] text-[#4F67B5] hover:text-[#1A2458]"
            }`}
          >
            Egresos
          </button>

          {/* Filtro por Categoría */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filtrar por categoría"
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#A5C5E2]/30 text-[#1A2458] border border-[#A5C5E2]/50 outline-none cursor-pointer"
            >
              <option value="ALL">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Buscador */}
        <div className="relative w-full lg:w-72">
          <MagnifyingGlassIcon className="w-4 h-4 text-[#4F67B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar concepto, categoría o reserva..."
            className="w-full bg-[#F4F6FB] text-xs text-[#1A2458] placeholder-[#4F67B5]/70 pl-9 pr-8 py-2.5 rounded-full border border-[#A5C5E2]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#473C8F]/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4F67B5] hover:text-[#1A2458]"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* HISTORIAL DE TRANSACCIONES */}
      {loading ? (
        <div className="bg-white rounded-[28px] p-16 text-center border border-[#A5C5E2]/50 flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F67B5]">
            Cargando datos financieros...
          </span>
        </div>
      ) : filteredTransacciones.length === 0 ? (
        <div className="bg-white rounded-[28px] p-14 text-center border border-[#A5C5E2]/50 flex flex-col items-center gap-3">
          <p className="text-base font-bold text-[#1A2458]">
            No hay transacciones registradas con este filtro.
          </p>
          <p className="text-xs text-[#4F67B5]">
            Registra un nuevo ingreso o gasto operativo para comenzar el seguimiento.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* ============================================================
            1. VISTA TARJETAS BENTO
           ============================================================ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTransacciones.map((t) => {
            const isIncome = t.tipo === "INGRESO";
            return (
              <div
                key={t.id}
                className={`${
                  isIncome ? "bg-[#1A2458]" : "bg-[#534FA6]"
                } text-white rounded-[26px] p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between gap-4`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isIncome
                          ? "bg-[#A5C5E2] text-[#1A2458]"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {t.tipo}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 text-white">
                      <TagIcon className="w-3 h-3 text-[#A5C5E2]" />
                      {t.categoria}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white leading-snug">
                    {t.concepto}
                  </h4>

                  {t.reservaId && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A5C5E2] mt-1.5">
                      <BookmarkIcon className="w-3.5 h-3.5" />
                      Reserva #{t.reservaId}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/15 flex items-end justify-between gap-2">
                  <div className="text-[11px] text-white/75 flex items-center gap-1.5">
                    <CalendarDaysIcon className="w-3.5 h-3.5 text-[#A5C5E2]" />
                    <span>{formatDate(t.fecha)}</span>
                  </div>

                  <p className="text-lg font-extrabold tracking-tight text-white">
                    {isIncome ? "+" : "-"}
                    {formatCurrency(Number(t.monto))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ============================================================
            2. VISTA TABLA CONTABLE MODERNA
           ============================================================ */
        <div className="bg-white rounded-[28px] shadow-sm border border-[#A5C5E2]/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#A5C5E2]/30 flex items-center justify-between bg-[#F4F6FB]/60">
            <h3 className="text-sm font-bold text-[#1A2458] uppercase tracking-wider">
              Historial de Transacciones ({filteredTransacciones.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A2458] text-white">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Fecha</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Concepto</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider">Categoría</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-right">
                    Monto
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-center">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A5C5E2]/30">
                {filteredTransacciones.map((t) => {
                  const isIncome = t.tipo === "INGRESO";
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#A5C5E2]/15 transition-colors"
                    >
                      <td className="p-4 text-xs font-medium text-[#4F67B5] whitespace-nowrap">
                        {formatDate(t.fecha)}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-sm text-[#1A2458]">{t.concepto}</span>
                        {t.reservaId && (
                          <p className="text-xs font-semibold text-[#473C8F] mt-0.5">
                            Reserva #{t.reservaId}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A5C5E2]/35 text-[#1A2458]">
                          {t.categoria}
                        </span>
                      </td>
                      <td className="p-4 text-right font-extrabold text-sm text-[#1A2458]">
                        {isIncome ? "+" : "-"}
                        {formatCurrency(Number(t.monto))}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isIncome
                              ? "bg-[#1A2458] text-white"
                              : "bg-[#534FA6] text-white"
                          }`}
                        >
                          {t.tipo}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal existente intacto */}
      <TransaccionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransacciones}
      />
    </div>
  );
}