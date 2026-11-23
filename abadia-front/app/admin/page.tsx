"use client";

import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PresentationChartLineIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  HomeModernIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalClientes: 0,
    huespedesTotal: 0,
    huespedesAdultos: 0,
    huespedesNinos: 0,
    citasHoy: 0,
    ingresosMes: 0,
    tasaOcupacion: 0,
    proximasCitas: [],
    estadoHabitaciones: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await fetchApi("/dashboard/stats");
        setData(stats);
      } catch (error) {
        console.error("Error loading dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const todayFormatted = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const stats = [
    {
      name: "Ingresos del Mes",
      value: formatCOP(Number(data.ingresosMes) || 0),
      icon: CurrencyDollarIcon,
      badge: "Este mes",
      bg: "bg-[#1A2458]",
      badgeClass: "bg-[#A5C5E2] text-[#1A2458]",
      subtextClass: "text-[#A5C5E2]",
    },
    {
      name: "Ocupación",
      value: `${data.tasaOcupacion}%`,
      icon: PresentationChartLineIcon,
      badge: "Hoy",
      bg: "bg-[#473C8F]",
      badgeClass: "bg-white/20 text-white",
      subtextClass: "text-white/80",
    },
    {
      name: "Huéspedes Alojados",
      value: data.huespedesTotal.toString(),
      icon: UsersIcon,
      badge: `${data.huespedesAdultos} adultos · ${data.huespedesNinos} niños`,
      bg: "bg-[#534FA6]",
      badgeClass: "bg-white/20 text-white",
      subtextClass: "text-white/85",
    },
    {
      name: "Reservas Activas",
      value: data.citasHoy.toString(),
      icon: CalendarDaysIcon,
      badge: "En curso hoy",
      bg: "bg-[#4F67B5]",
      badgeClass: "bg-[#1A2458]/35 text-white",
      subtextClass: "text-white/85",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 space-y-7 pb-20 antialiased">
      {/* HEADER EJECUTIVO EN ÍNDIGO PROFUNDO (#1A2458) */}
      <div className="bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] text-white rounded-[30px] p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-14 -top-14 w-64 h-64 rounded-full bg-[#473C8F]/35 pointer-events-none" />
        <div className="absolute right-44 -bottom-24 w-52 h-52 rounded-full bg-[#A5C5E2]/10 pointer-events-none" />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#A5C5E2] mb-2.5 capitalize">
              <SparklesIcon className="w-3.5 h-3.5" />
              {todayFormatted}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Panel General del Hotel
            </h1>
            <p className="text-xs md:text-sm text-[#A5C5E2]/90 mt-1">
              Resumen en tiempo real de ocupación, huéspedes alojados, ingresos y próximas llegadas.
            </p>
          </div>

          {/* Accesos Directos Rápidos */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/calendario"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-3 rounded-2xl text-xs font-bold transition-all"
            >
              <CalendarDaysIcon className="w-4 h-4 text-[#A5C5E2]" />
              Calendario 1–6
            </Link>

            <Link
              href="/admin/reservas"
              className="flex items-center gap-2 bg-[#A5C5E2] hover:bg-white text-[#1A2458] px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
            >
              <span>Gestionar Reservas</span>
              <ArrowUpRightIcon className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Barra de Progreso de Ocupación del Día */}
        <div className="mt-6 pt-5 border-t border-white/15 relative z-10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#A5C5E2]">
              Ocupación actual del inventario
            </span>
            <span className="font-bold text-white bg-white/15 px-3 py-0.5 rounded-full">
              {loading ? "..." : `${data.tasaOcupacion}% ocupado`}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.max(0, Number(data.tasaOcupacion) || 0))}%` }}
              className="bg-[#A5C5E2] h-full rounded-full transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* 4 TARJETAS KPI BENTO (PALETA INDIGO INFINITY + LETRA BLANCA) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`${stat.bg} text-white rounded-[28px] p-6 shadow-lg flex flex-col justify-between min-h-[165px] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/[0.06] group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-center justify-between gap-2">
              <p className={`text-xs font-bold uppercase tracking-wider ${stat.subtextClass}`}>
                {stat.name}
              </p>
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="h-9 w-28 bg-white/20 rounded-xl animate-pulse" />
              ) : (
                <p className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </p>
              )}

              <span
                className={`inline-block mt-2.5 text-[10px] font-bold px-3 py-1 rounded-full ${stat.badgeClass}`}
              >
                {stat.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* BENTO GRID INFERIOR: ESTADO DE HABITACIONES (2/3) + PRÓXIMAS CITAS (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: ESTADO DE HABITACIONES */}
        <div className="lg:col-span-2 bg-white rounded-[30px] p-6 md:p-7 border border-[#A5C5E2]/50 shadow-sm flex flex-col">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-5 pb-4 border-b border-[#A5C5E2]/30">
            <div>
              <h2 className="text-lg font-bold text-[#1A2458]">Estado de Habitaciones</h2>
              <p className="text-xs text-[#4F67B5] mt-0.5">
                Disponibilidad y limpieza en tiempo real
              </p>
            </div>

            <Link
              href="/admin/habitaciones"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#F4F6FB] hover:bg-[#1A2458] text-[#1A2458] hover:text-white transition-colors"
            >
              <span>Ver todas</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-36 bg-[#F4F6FB] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : data.estadoHabitaciones && data.estadoHabitaciones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.estadoHabitaciones.map((hab: any, idx: number) => {
                  const isOccupied = hab.estado === "OCUPADA";
                  const isAvailable = hab.estado === "DISPONIBLE";
                  const isClean = hab.estadoLimpieza === "LIMPIA";

                  // Paleta Indigo Infinity aplicada a cada tarjeta de habitación:
                  // - Ocupada: #1A2458 (letra blanca)
                  // - Mantenimiento / Por Asear: #473C8F (letra blanca)
                  // - Disponible & Limpia: #A5C5E2 (letra #1A2458)
                  const cardStyle = isOccupied
                    ? "bg-[#1A2458] text-white shadow-md"
                    : !isAvailable || !isClean
                    ? "bg-[#473C8F] text-white shadow-md"
                    : "bg-[#A5C5E2] text-[#1A2458]";

                  const roomMatch = String(hab.titulo || "").match(/\d+/);
                  const roomNumber = roomMatch
                    ? roomMatch[0].padStart(2, "0")
                    : String(idx + 1).padStart(2, "0");

                  return (
                    <Link
                      href="/admin/habitaciones"
                      key={hab.id}
                      className={`${cardStyle} rounded-[24px] p-5 flex flex-col justify-between min-h-[155px] hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group`}
                    >
                      <span
                        className={`absolute right-4 top-2 text-5xl font-black pointer-events-none select-none ${
                          isAvailable && isClean ? "text-[#1A2458]/10" : "text-white/10"
                        }`}
                      >
                        {roomNumber}
                      </span>

                      <div>
                        <span className="font-bold text-base leading-snug block pr-8">
                          {hab.titulo}
                        </span>
                        <span
                          className={`text-xs font-medium block mt-0.5 ${
                            isAvailable && isClean ? "text-[#1A2458]/75" : "text-white/80"
                          }`}
                        >
                          {hab.capacidad || "Estancia Boutique"}
                        </span>

                        {isOccupied && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#A5C5E2] mt-2">
                            <UsersIcon className="w-3.5 h-3.5" />
                            Ocupantes: {hab.huespedesActuales}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-current/15">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                            isAvailable && isClean
                              ? "bg-white/85 text-[#1A2458]"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {isAvailable ? (
                            <CheckCircleIcon className="w-3 h-3" />
                          ) : isOccupied ? (
                            <HomeModernIcon className="w-3 h-3" />
                          ) : (
                            <WrenchScrewdriverIcon className="w-3 h-3" />
                          )}
                          {hab.estado}
                        </span>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                            isAvailable && isClean
                              ? "bg-[#1A2458] text-white"
                              : "bg-[#A5C5E2] text-[#1A2458]"
                          }`}
                        >
                          {isClean ? "✨ Limpia" : "🧹 Por Asear"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-[#A5C5E2] rounded-3xl min-h-[260px] p-6 text-center">
                <p className="text-sm font-bold text-[#1A2458]">
                  No hay habitaciones registradas.
                </p>
                <Link
                  href="/admin/habitaciones"
                  className="mt-3 px-4 py-2 rounded-full bg-[#1A2458] text-white text-xs font-bold hover:bg-[#473C8F] transition-colors"
                >
                  Configurar Habitaciones
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: PRÓXIMAS CITAS / LLEGADAS */}
        <div className="bg-white rounded-[30px] p-6 md:p-7 border border-[#A5C5E2]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#A5C5E2]/30">
              <div>
                <h2 className="text-lg font-bold text-[#1A2458]">Próximas Citas</h2>
                <p className="text-xs text-[#4F67B5] mt-0.5">Agenda inmediata de recepción</p>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#A5C5E2]/35 text-[#1A2458] flex items-center justify-center">
                <ClockIcon className="w-4 h-4 stroke-[2.2]" />
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3.5 p-3 animate-pulse">
                      <div className="w-10 h-10 rounded-2xl bg-[#F4F6FB]" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-[#F4F6FB] rounded w-2/3" />
                        <div className="h-3 bg-[#F4F6FB] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data.proximasCitas.length === 0 ? (
                <div className="py-10 text-center bg-[#F4F6FB] rounded-2xl p-4">
                  <p className="text-xs font-semibold text-[#4F67B5]">
                    No hay próximas citas programadas.
                  </p>
                </div>
              ) : (
                data.proximasCitas.map((cita: any, idx: number) => (
                  <Link
                    href="/admin/reservas"
                    key={cita.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F4F6FB]/75 hover:bg-[#A5C5E2]/30 transition-all border border-transparent hover:border-[#A5C5E2] group"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 text-white shadow-xs ${
                        idx % 2 === 0 ? "bg-[#1A2458]" : "bg-[#473C8F]"
                      }`}
                    >
                      {cita.inicial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A2458] truncate group-hover:text-[#473C8F] transition-colors">
                        {cita.clienteNombre}
                      </p>
                      <p className="text-xs font-medium text-[#4F67B5] truncate mt-0.5">
                        {cita.fechaTexto} · {cita.habitacionNombre}
                      </p>
                    </div>
                    <ArrowUpRightIcon className="w-4 h-4 text-[#4F67B5] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </div>

          <Link href="/admin/reservas" className="block mt-6">
            <button
              type="button"
              className="w-full py-3.5 rounded-full bg-[#1A2458] hover:bg-[#473C8F] text-white text-xs font-bold tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              Ver todas las citas
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}