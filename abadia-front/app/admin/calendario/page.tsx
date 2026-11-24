"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isSameDay,
  isSameMonth,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  getYear,
} from "date-fns";
import { es } from "date-fns/locale/es";
import { fetchApi } from "@/lib/api";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  XMarkIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import HuespedesModal from "@/components/HuespedesModal";
import NuevaReservaModal from "@/components/NuevaReservaModal";

// Habitaciones numeradas del 1 al 6
const HOTEL_ROOMS = [1, 2, 3, 4, 5, 6];

// REGLA ÚNICA DE COLOR (Paleta Indigo Infinity) PARA TODAS LAS CUADRÍCULAS
const STATUS_COLORS = {
  confirmed: {
    label: "Confirmada",
    bg: "bg-[#1A2458]",
    hover: "hover:bg-[#131B44]",
    text: "text-white",
    subtext: "text-[#A5C5E2]",
    pill: "bg-[#A5C5E2]/20 text-[#A5C5E2] border-[#A5C5E2]/35",
  },
  pending: {
    label: "Pendiente",
    bg: "bg-[#473C8F]",
    hover: "hover:bg-[#3A3078]",
    text: "text-white",
    subtext: "text-white/80",
    pill: "bg-white/20 text-white border-white/30",
  },
  free: {
    label: "Libre",
    bg: "bg-[#A5C5E2]",
    hover: "hover:bg-[#92B7D9]",
    text: "text-[#1A2458]",
    subtext: "text-[#1A2458]/75",
    pill: "bg-white/85 text-[#1A2458] border-transparent",
  },
};

const extractRoomNumber = (d: any, fallbackIndex: number): number => {
  const candidates = [
    d?.habitacion?.numero,
    d?.habitacion?.titulo,
    d?.habitacion_id,
    d?.habitacionId,
    d?.room,
  ];
  for (const val of candidates) {
    if (val !== undefined && val !== null) {
      const match = String(val).match(/\d+/);
      if (match) {
        const num = Number(match[0]);
        if (num >= 1 && num <= 6) return num;
        return ((num - 1) % 6) + 1;
      }
    }
  }
  return (fallbackIndex % 6) + 1;
};

const isDateInReservation = (date: Date, start: Date, end: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return d >= s && d <= e;
};

const resolveDayStatus = (dayReservations: any[]): "confirmed" | "pending" | "free" => {
  if (!dayReservations || dayReservations.length === 0) return "free";
  const hasConfirmed = dayReservations.some((e) => {
    const st = e.reservationDetails?.status;
    return st === "confirmed" || st === "completed" || !st;
  });
  return hasConfirmed ? "confirmed" : "pending";
};

export default function CalendarioPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isHuespedesModalOpen, setIsHuespedesModalOpen] = useState(false);
  const [isNuevaReservaModalOpen, setIsNuevaReservaModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState<"matrix" | "day" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const buildSampleEvents = () => {
    const today = new Date();
    return [
      {
        title: "María Pérez · Habitación 1",
        start: new Date(new Date(today).setHours(14, 0, 0, 0)),
        end: new Date(new Date(today).setDate(today.getDate() + 3)),
        resource: "Habitación 1",
        roomNumber: 1,
        reservationDetails: {
          id: 101,
          status: "confirmed",
          habitacion_id: 1,
          habitacion: { id: 1, titulo: "1" },
          cliente: { nombre: "María Pérez", correo: "maria@ejemplo.com" },
          value: 450000,
          numeroAdultos: 2,
          numeroNinos: 0,
          traCompletado: true,
        },
      },
      {
        title: "Carlos López · Habitación 2",
        start: new Date(new Date(today).setHours(15, 0, 0, 0)),
        end: new Date(new Date(today).setDate(today.getDate() + 2)),
        resource: "Habitación 2",
        roomNumber: 2,
        reservationDetails: {
          id: 102,
          status: "pending",
          habitacion_id: 2,
          habitacion: { id: 2, titulo: "2" },
          cliente: { nombre: "Carlos López", correo: "carlos@ejemplo.com" },
          value: 320000,
          numeroAdultos: 2,
          numeroNinos: 1,
          traCompletado: false,
        },
      },
    ];
  };

  const fetchReservas = async () => {
    try {
      const response = await fetchApi("/reservations");
      const data = Array.isArray(response) ? response : response?.data || [];

      const mappedEvents = data.map((d: any, idx: number) => {
        const roomNum = extractRoomNumber(d, idx);
        const roomLabel = `Habitación ${roomNum}`;
        return {
          title: `${d.cliente?.nombre || "Huésped"} · ${roomLabel}`,
          start: new Date(d.checkIn),
          end: new Date(d.checkOut),
          resource: roomLabel,
          roomNumber: roomNum,
          reservationDetails: d,
        };
      });

      // Si el backend no tiene reservas activas hoy, inyectamos las 2 de muestra para que veas la paleta
      const today = new Date();
      const hasEventsToday = mappedEvents.some((e: any) =>
        isDateInReservation(today, new Date(e.start), new Date(e.end))
      );

      if (mappedEvents.length > 0 && hasEventsToday) {
        setEvents(mappedEvents);
      } else {
        setEvents([...mappedEvents, ...buildSampleEvents()]);
      }
    } catch (error) {
      setEvents(buildSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const status = e.reservationDetails?.status || "confirmed";
      if (status === "cancelled") return false;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "confirmed"
          ? status === "confirmed" || status === "completed"
          : status === "pending";

      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const guest = (e.reservationDetails?.cliente?.nombre || "").toLowerCase();
      const room = `habitación ${e.roomNumber || ""}`.toLowerCase();
      return guest.includes(q) || room.includes(q);
    });
  }, [events, statusFilter, searchQuery]);

  const handlePrev = () => {
    if (viewMode === "matrix") setSelectedDate((d) => subDays(d, 7));
    else if (viewMode === "day") setSelectedDate((d) => subDays(d, 1));
    else if (viewMode === "month") setSelectedDate((d) => subMonths(d, 1));
    else setSelectedDate((d) => subYears(d, 1));
  };

  const handleNext = () => {
    if (viewMode === "matrix") setSelectedDate((d) => addDays(d, 7));
    else if (viewMode === "day") setSelectedDate((d) => addDays(d, 1));
    else if (viewMode === "month") setSelectedDate((d) => addMonths(d, 1));
    else setSelectedDate((d) => addYears(d, 1));
  };

  const matrixDays = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => addDays(subDays(selectedDate, 2), i));
  }, [selectedDate]);

  const weekStripDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(subDays(selectedDate, 2), i));
  }, [selectedDate]);

  const roomCardsForDay = useMemo(() => {
    return HOTEL_ROOMS.map((roomNum) => {
      const matchingEvent = filteredEvents.find(
        (e) =>
          e.roomNumber === roomNum &&
          isDateInReservation(selectedDate, new Date(e.start), new Date(e.end))
      );
      return { roomNum, event: matchingEvent || null };
    });
  }, [filteredEvents, selectedDate]);

  const monthCalendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOffset = (startOfMonth(selectedDate).getDay() + 6) % 7;
    const blanks = Array.from({ length: firstDayOffset }, (_, i) => ({
      type: "blank" as const,
      key: `b-${i}`,
    }));
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dateObj = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
      const dayReservations = filteredEvents.filter((e) =>
        isDateInReservation(dateObj, new Date(e.start), new Date(e.end))
      );
      return {
        type: "day" as const,
        day: i + 1,
        date: dateObj,
        reservations: dayReservations,
        status: resolveDayStatus(dayReservations),
      };
    });
    return [...blanks, ...days];
  }, [selectedDate, filteredEvents]);

  const yearMonthsData = useMemo(() => {
    const currentYear = getYear(selectedDate);
    return Array.from({ length: 12 }, (_, monthIdx) => {
      const monthStart = new Date(currentYear, monthIdx, 1);
      const monthEnd = endOfMonth(monthStart);
      const daysCount = getDaysInMonth(monthStart);
      const firstOffset = (monthStart.getDay() + 6) % 7;

      const monthEvents = filteredEvents.filter((e) => {
        const s = new Date(e.start);
        const end = new Date(e.end);
        return s <= monthEnd && end >= monthStart;
      });

      const days = Array.from({ length: daysCount }, (_, dIdx) => {
        const dDate = new Date(currentYear, monthIdx, dIdx + 1);
        const dayRes = monthEvents.filter((e) =>
          isDateInReservation(dDate, new Date(e.start), new Date(e.end))
        );
        return {
          day: dIdx + 1,
          date: dDate,
          count: dayRes.length,
          status: resolveDayStatus(dayRes),
        };
      });

      return {
        monthIdx,
        monthDate: monthStart,
        name: format(monthStart, "MMMM", { locale: es }),
        eventsCount: monthEvents.length,
        firstOffset,
        days,
      };
    });
  }, [selectedDate, filteredEvents]);

  const stats = useMemo(() => {
    const occupiedToday = roomCardsForDay.filter((r) => r.event !== null).length;
    const pendingCount = filteredEvents.filter((e) => e.reservationDetails?.status === "pending").length;
    const totalGuests = roomCardsForDay.reduce(
      (acc, r) =>
        acc +
        (r.event
          ? Number(r.event.reservationDetails?.numeroAdultos || 0) +
            Number(r.event.reservationDetails?.numeroNinos || 0)
          : 0),
      0
    );

    return { occupiedToday, pendingCount, totalGuests };
  }, [roomCardsForDay, filteredEvents]);

  const getStayStage = (event: any) => {
    const status = event.reservationDetails?.status;
    if (status === "pending") return { step: 1, label: "Pendiente" };
    const now = new Date();
    const start = new Date(event.start);
    const end = new Date(event.end);

    if (now >= end) return { step: 4, label: "Finalizada" };
    if (isSameDay(now, start)) return { step: 3, label: "Llega hoy" };
    if (now > start) return { step: 3, label: "En casa" };
    return { step: 2, label: "Confirmada" };
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 relative flex flex-col justify-between pb-28 antialiased">
      <div>
        {/* TOP HEADER & METRICS */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4F67B5] mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#473C8F]" />
              <span>Recepción & Ocupación · Habitaciones 1, 2, 3, 4, 5, 6</span>
              <span>·</span>
              <span className="capitalize">
                {format(selectedDate, "MMMM yyyy", { locale: es })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A2458]">
                {viewMode === "matrix" && "Disponibilidad 1 – 6"}
                {viewMode === "day" &&
                  format(selectedDate, "EEEE d 'de' MMMM", { locale: es }).replace(/^\w/, (c) =>
                    c.toUpperCase()
                  )}
                {viewMode === "month" &&
                  format(selectedDate, "MMMM yyyy", { locale: es }).replace(/^\w/, (c) =>
                    c.toUpperCase()
                  )}
                {viewMode === "year" && `Calendario ${getYear(selectedDate)}`}
              </h1>

              {/* Controles de Navegación */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#1A2458]/10 shadow-sm">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 hover:bg-[#A5C5E2]/35 rounded-full transition-colors text-[#1A2458]"
                  title="Anterior"
                >
                  <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1 text-xs font-bold hover:bg-[#A5C5E2]/35 rounded-full transition-colors text-[#1A2458]"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 hover:bg-[#A5C5E2]/35 rounded-full transition-colors text-[#1A2458]"
                  title="Siguiente"
                >
                  <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="flex items-center gap-8 md:gap-10 bg-white px-6 py-4 rounded-[24px] border border-[#A5C5E2]/40 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Ocupadas Hoy
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A2458] mt-0.5">
                {stats.occupiedToday}{" "}
                <span className="text-sm font-medium text-[#4F67B5]">/ 6</span>
              </p>
            </div>
            <div className="h-8 w-px bg-[#A5C5E2]/40" />
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Por Confirmar
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#473C8F] mt-0.5">
                {stats.pendingCount}
              </p>
            </div>
            <div className="h-8 w-px bg-[#A5C5E2]/40" />
            <div>
              <p className="text-[11px] font-semibold text-[#4F67B5] uppercase tracking-wider">
                Huéspedes
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A2458] mt-0.5">
                {stats.totalGuests}
              </p>
            </div>
          </div>
        </div>

        {/* GUÍA DE COLORES SIEMPRE VISIBLE + SELECTOR DE ESCALA + BUSCADOR */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Selector de Escala */}
            <div className="inline-flex bg-white p-1.5 rounded-full border border-[#A5C5E2]/50 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "matrix"
                    ? "bg-[#1A2458] text-white shadow-sm"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                Cuadrícula 1–6
              </button>
              <button
                type="button"
                onClick={() => setViewMode("day")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "day"
                    ? "bg-[#1A2458] text-white shadow-sm"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                Por Día
              </button>
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "month"
                    ? "bg-[#1A2458] text-white shadow-sm"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                Por Mes
              </button>
              <button
                type="button"
                onClick={() => setViewMode("year")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "year"
                    ? "bg-[#1A2458] text-white shadow-sm"
                    : "text-[#4F67B5] hover:text-[#1A2458]"
                }`}
              >
                Por Año
              </button>
            </div>

            {/* Leyenda Unificada de los 3 Colores */}
            <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#A5C5E2]/50 shadow-sm">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === "all"
                    ? "bg-[#534FA6] text-white"
                    : "text-[#1A2458] hover:bg-[#A5C5E2]/25"
                }`}
              >
                Todos
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("confirmed")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all bg-[#1A2458] text-white ${
                  statusFilter === "confirmed" ? "ring-2 ring-[#A5C5E2]" : "opacity-90 hover:opacity-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#A5C5E2]" />
                Confirmada
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all bg-[#473C8F] text-white ${
                  statusFilter === "pending" ? "ring-2 ring-[#A5C5E2]" : "opacity-90 hover:opacity-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                Pendiente
              </button>

              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#A5C5E2] text-[#1A2458]">
                <span className="w-2 h-2 rounded-full bg-[#1A2458]" />
                Día Libre
              </span>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative w-full xl:w-72">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#4F67B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar huésped o hab. 1–6..."
              className="w-full bg-white text-xs text-[#1A2458] placeholder-[#4F67B5]/70 pl-9 pr-8 py-2.5 rounded-full border border-[#A5C5E2]/50 focus:outline-none focus:ring-2 focus:ring-[#473C8F]/30 transition-all"
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

        {/* 1. CUADRÍCULA 1–6 */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin" />
            <p className="text-xs font-medium text-[#4F67B5]">Cargando disponibilidad...</p>
          </div>
        ) : viewMode === "matrix" ? (
          <div className="bg-white rounded-[28px] p-5 md:p-6 border border-[#A5C5E2]/50 shadow-sm overflow-x-auto">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[150px_repeat(14,minmax(48px,1fr))] gap-2 mb-3 items-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#4F67B5] pl-2">
                  Habitación
                </div>
                {matrixDays.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => {
                        setSelectedDate(day);
                        setViewMode("day");
                      }}
                      className={`py-2 rounded-2xl text-center cursor-pointer transition-colors ${
                        isToday
                          ? "bg-[#1A2458] text-white shadow-sm"
                          : "bg-[#F4F6FB] text-[#1A2458] hover:bg-[#A5C5E2]/35"
                      }`}
                    >
                      <p
                        className={`text-[9px] uppercase font-bold ${
                          isToday ? "text-[#A5C5E2]" : "text-[#4F67B5]"
                        }`}
                      >
                        {format(day, "EEE", { locale: es })}
                      </p>
                      <p className="text-xs font-bold mt-0.5">{format(day, "d")}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                {HOTEL_ROOMS.map((roomNum) => (
                  <div
                    key={`matrix-row-${roomNum}`}
                    className="grid grid-cols-[150px_repeat(14,minmax(48px,1fr))] gap-2 items-center"
                  >
                    <div className="flex items-center gap-2.5 bg-[#F4F6FB] px-3.5 py-3 rounded-2xl">
                      <span className="w-7 h-7 rounded-xl bg-[#1A2458] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {roomNum}
                      </span>
                      <span className="text-xs font-bold text-[#1A2458]">
                        Habitación {roomNum}
                      </span>
                    </div>

                    {matrixDays.map((day) => {
                      const reservation = filteredEvents.find(
                        (e) =>
                          e.roomNumber === roomNum &&
                          isDateInReservation(day, new Date(e.start), new Date(e.end))
                      );

                      if (!reservation) {
                        return (
                          <button
                            type="button"
                            key={`${roomNum}-${day.toISOString()}`}
                            onClick={() => {
                              setSelectedDate(day);
                              setIsNuevaReservaModalOpen(true);
                            }}
                            title={`Habitación ${roomNum} · ${format(day, "dd MMM", {
                              locale: es,
                            })} (Libre)`}
                            className={`h-12 rounded-2xl ${STATUS_COLORS.free.bg} ${STATUS_COLORS.free.hover} ${STATUS_COLORS.free.text} flex flex-col items-center justify-center transition-all hover:scale-105 group`}
                          >
                            <span className="text-[10px] font-bold group-hover:hidden">
                              Libre
                            </span>
                            <PlusIcon className="w-4 h-4 hidden group-hover:block stroke-[2.5]" />
                          </button>
                        );
                      }

                      const isPending = reservation.reservationDetails?.status === "pending";
                      const style = isPending ? STATUS_COLORS.pending : STATUS_COLORS.confirmed;
                      const guestFirstName =
                        reservation.reservationDetails?.cliente?.nombre?.split(" ")[0] || "Res";

                      return (
                        <button
                          type="button"
                          key={`${roomNum}-${day.toISOString()}`}
                          onClick={() => setSelectedEvent(reservation)}
                          title={`Habitación ${roomNum} · ${
                            reservation.reservationDetails?.cliente?.nombre
                          } (${style.label})`}
                          className={`h-12 rounded-2xl px-1.5 flex flex-col items-center justify-center ${style.bg} ${style.hover} ${style.text} transition-all hover:scale-105 shadow-sm`}
                        >
                          <span className="text-[10px] font-bold leading-none truncate w-full text-center">
                            {guestFirstName}
                          </span>
                          <span className={`text-[8px] font-semibold mt-1 ${style.subtext}`}>
                            {isPending ? "Pend." : "Conf."}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : viewMode === "day" ? (
          /* 2. VISTA POR DÍA */
          <div className="space-y-6">
            <div className="grid grid-cols-7 gap-2 bg-white p-2 rounded-[22px] border border-[#A5C5E2]/40">
              {weekStripDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const dayRes = filteredEvents.filter((e) =>
                  isDateInReservation(day, new Date(e.start), new Date(e.end))
                );
                const statusKey = resolveDayStatus(dayRes);
                const style = STATUS_COLORS[statusKey];

                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${style.bg} ${style.text} ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-[#1A2458] scale-[1.03] shadow-md"
                        : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold ${style.subtext}`}>
                      {format(day, "EEE", { locale: es })}
                    </span>
                    <span className="text-sm font-bold mt-0.5">{format(day, "d")}</span>
                    <span
                      className={`text-[9px] font-bold mt-1 px-1.5 rounded-full ${
                        statusKey === "free"
                          ? "bg-white/70 text-[#1A2458]"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {statusKey === "free" ? "Libre" : `${dayRes.length}/6`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {roomCardsForDay.map(({ roomNum, event }) => {
                if (!event) {
                  return (
                    <div
                      key={`room-free-${roomNum}`}
                      onClick={() => setIsNuevaReservaModalOpen(true)}
                      className={`${STATUS_COLORS.free.bg} ${STATUS_COLORS.free.hover} rounded-[28px] p-6 min-h-[220px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm group relative overflow-hidden`}
                    >
                      <span className="absolute right-5 top-3 text-6xl font-black text-[#1A2458]/10 pointer-events-none select-none">
                        0{roomNum}
                      </span>

                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/85 text-[#1A2458]">
                          Día Libre · Sin reserva
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-[#1A2458]">
                          Habitación {roomNum}
                        </h3>
                        <p className="text-xs font-medium text-[#1A2458]/75 mt-0.5">
                          Disponible para reservar hoy
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 pt-3 border-t border-[#1A2458]/15">
                        <span className="w-8 h-8 rounded-full bg-[#1A2458] text-white group-hover:bg-[#473C8F] flex items-center justify-center transition-colors shadow-sm">
                          <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                        </span>
                        <span className="text-xs font-bold text-[#1A2458]">
                          Reservar Habitación {roomNum}
                        </span>
                      </div>
                    </div>
                  );
                }

                const isPending = event.reservationDetails?.status === "pending";
                const style = isPending ? STATUS_COLORS.pending : STATUS_COLORS.confirmed;
                const stage = getStayStage(event);
                const nights = Math.max(
                  1,
                  differenceInDays(new Date(event.end), new Date(event.start))
                );
                const guestName = event.reservationDetails?.cliente?.nombre || "Huésped";
                const traOk = event.reservationDetails?.traCompletado;

                return (
                  <div
                    key={`room-reserved-${roomNum}-${event.reservationDetails?.id}`}
                    onClick={() => setSelectedEvent(event)}
                    className={`${style.bg} rounded-[28px] p-6 flex flex-col justify-between min-h-[220px] cursor-pointer transition-all duration-300 -translate-y-0.5 hover:-translate-y-1.5 shadow-xl group relative overflow-hidden`}
                  >
                    <span className="absolute right-5 top-3 text-6xl font-black text-white/10 pointer-events-none select-none">
                      0{roomNum}
                    </span>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border ${style.pill}`}
                        >
                          ● {style.label}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white">
                          {nights}n
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-white">
                        Habitación {roomNum}
                      </h3>

                      <div className="grid grid-cols-4 gap-1.5 mt-4">
                        {[1, 2, 3, 4].map((step) => (
                          <span
                            key={step}
                            className={`h-[3.5px] rounded-full ${
                              step <= stage.step ? "bg-[#A5C5E2]" : "bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-6 pt-3 border-t border-white/15">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#A5C5E2] text-[#1A2458] flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-white/30">
                          {guestName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">{guestName}</p>
                          <p className="text-[11px] font-medium text-white/80">
                            {format(new Date(event.start), "dd MMM", { locale: es })} →{" "}
                            {format(new Date(event.end), "dd MMM", { locale: es })}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setIsHuespedesModalOpen(true);
                        }}
                        title={traOk ? "TRA Completado" : "Completar Registro TRA"}
                        className={`p-2 rounded-full transition-all shrink-0 ${
                          traOk
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : "bg-[#A5C5E2] text-[#1A2458] hover:scale-105"
                        }`}
                      >
                        {traOk ? (
                          <CheckBadgeIcon className="w-4 h-4 stroke-[2.2]" />
                        ) : (
                          <UserGroupIcon className="w-4 h-4 stroke-[2.2]" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : viewMode === "month" ? (
          /* 3. VISTA POR MES */
          <div className="bg-white rounded-[28px] p-5 md:p-6 border border-[#A5C5E2]/50 shadow-sm">
            <div className="grid grid-cols-7 gap-2.5 mb-3 text-center">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                <div
                  key={d}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#4F67B5] py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {monthCalendarCells.map((cell) => {
                if (cell.type === "blank") {
                  return <div key={cell.key} className="min-h-[118px] rounded-2xl bg-[#F4F6FB]" />;
                }

                const isToday = isSameDay(cell.date, new Date());
                const style = STATUS_COLORS[cell.status];

                return (
                  <div
                    key={cell.date.toISOString()}
                    onClick={() => {
                      setSelectedDate(cell.date);
                      setViewMode("day");
                    }}
                    className={`min-h-[118px] rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${style.bg} ${style.hover} ${style.text} ${
                      isToday ? "ring-2 ring-offset-2 ring-[#1A2458]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          cell.status === "free"
                            ? "bg-white/80 text-[#1A2458]"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        {cell.day}
                      </span>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          cell.status === "free"
                            ? "bg-white/60 text-[#1A2458]"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        {cell.status === "free" ? "Libre" : `${cell.reservations.length}/6`}
                      </span>
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[76px]">
                      {cell.reservations.slice(0, 3).map((ev, idx) => {
                        const evIsPending = ev.reservationDetails?.status === "pending";
                        return (
                          <div
                            key={`${ev.reservationDetails?.id}-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold text-white truncate transition-colors ${
                              evIsPending ? "bg-[#473C8F] ring-1 ring-white/30" : "bg-white/15"
                            }`}
                          >
                            Hab {ev.roomNumber || "?"} ·{" "}
                            {ev.reservationDetails?.cliente?.nombre?.split(" ")[0]}
                          </div>
                        );
                      })}
                      {cell.reservations.length > 3 && (
                        <p className="text-[10px] font-bold text-[#A5C5E2] pl-1">
                          +{cell.reservations.length - 3} más
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 4. VISTA POR AÑO */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {yearMonthsData.map((month) => {
              const isCurrentMonth = isSameMonth(month.monthDate, new Date());
              const hasMonthReservations = month.eventsCount > 0;

              return (
                <div
                  key={month.monthIdx}
                  onClick={() => {
                    setSelectedDate(month.monthDate);
                    setViewMode("month");
                  }}
                  className="bg-white rounded-[26px] p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 border border-[#A5C5E2]/50 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold capitalize text-[#1A2458] flex items-center gap-2">
                      <span>{month.name}</span>
                      {isCurrentMonth && <span className="w-2 h-2 rounded-full bg-[#473C8F]" />}
                    </h3>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        hasMonthReservations
                          ? "bg-[#1A2458] text-white"
                          : "bg-[#A5C5E2] text-[#1A2458]"
                      }`}
                    >
                      {month.eventsCount} {month.eventsCount === 1 ? "reserva" : "reservas"}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                      <span key={i} className="text-[9px] font-bold text-[#4F67B5]">
                        {d}
                      </span>
                    ))}

                    {Array.from({ length: month.firstOffset }).map((_, i) => (
                      <span key={`empty-${i}`} />
                    ))}

                    {month.days.map((d) => {
                      const style = STATUS_COLORS[d.status];
                      return (
                        <span
                          key={d.day}
                          className={`h-6 w-6 mx-auto rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${style.bg} ${style.text}`}
                        >
                          {d.day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DOCK FLOTANTE INFERIOR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-xl border border-[#A5C5E2]/60">
          <button
            type="button"
            onClick={() => setViewMode("matrix")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "matrix"
                ? "bg-[#1A2458] text-white"
                : "text-[#4F67B5] hover:bg-[#A5C5E2]/30 hover:text-[#1A2458]"
            }`}
          >
            1–6
          </button>

          <button
            type="button"
            onClick={() => setViewMode("day")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "day"
                ? "bg-[#1A2458] text-white"
                : "text-[#4F67B5] hover:bg-[#A5C5E2]/30 hover:text-[#1A2458]"
            }`}
          >
            Día
          </button>

          <button
            type="button"
            onClick={() => setIsNuevaReservaModalOpen(true)}
            className="w-11 h-11 rounded-full bg-[#1A2458] hover:bg-[#473C8F] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-all mx-1"
            title="Nueva Reserva"
          >
            <PlusIcon className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "month"
                ? "bg-[#1A2458] text-white"
                : "text-[#4F67B5] hover:bg-[#A5C5E2]/30 hover:text-[#1A2458]"
            }`}
          >
            Mes
          </button>

          <button
            type="button"
            onClick={() => setViewMode("year")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "year"
                ? "bg-[#1A2458] text-white"
                : "text-[#4F67B5] hover:bg-[#A5C5E2]/30 hover:text-[#1A2458]"
            }`}
          >
            Año
          </button>
        </div>
      </div>

      {/* PANEL DE DETALLE (SLIDE-OVER) */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#1A2458]/35 backdrop-blur-sm p-3"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[30px] h-full shadow-2xl p-7 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#A5C5E2]/30 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A2458] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {selectedEvent.reservationDetails?.cliente?.nombre
                      ?.charAt(0)
                      .toUpperCase() || "R"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2458]">
                      {selectedEvent.reservationDetails?.cliente?.nombre || "Huésped"}
                    </h3>
                    <p className="text-xs text-[#4F67B5]">
                      Reserva #{selectedEvent.reservationDetails?.id} ·{" "}
                      {selectedEvent.reservationDetails?.cliente?.correo || "Sin correo"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 text-[#4F67B5] hover:text-[#1A2458] bg-[#A5C5E2]/25 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#F4F6FB] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F67B5]">
                    Estado de Reserva
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      selectedEvent.reservationDetails?.status === "pending"
                        ? "bg-[#473C8F]"
                        : "bg-[#1A2458]"
                    }`}
                  >
                    {selectedEvent.reservationDetails?.status === "pending"
                      ? "Pendiente"
                      : "Confirmada"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["Reservada", "Confirmada", "Check-In", "Check-Out"].map((label, idx) => {
                    const active = idx + 1 <= getStayStage(selectedEvent).step;
                    return (
                      <div key={label} className="space-y-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            active ? "bg-[#473C8F]" : "bg-[#A5C5E2]/40"
                          }`}
                        />
                        <p
                          className={`text-[9px] font-semibold ${
                            active ? "text-[#1A2458]" : "text-[#4F67B5]/60"
                          }`}
                        >
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#A5C5E2]/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F67B5]">
                    Alojamiento Asignado
                  </p>
                  <p className="text-base font-bold text-[#1A2458] mt-0.5">
                    Habitación {selectedEvent.roomNumber}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A5C5E2]/40 text-[#1A2458]">
                  {Math.max(
                    1,
                    differenceInDays(new Date(selectedEvent.end), new Date(selectedEvent.start))
                  )}{" "}
                  noches
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-[#A5C5E2]/50">
                  <p className="text-[10px] font-bold uppercase text-[#4F67B5] flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" /> Check-In
                  </p>
                  <p className="text-sm font-bold text-[#1A2458] mt-1">
                    {format(new Date(selectedEvent.start), "dd MMM yyyy", { locale: es })}
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-[#A5C5E2]/50">
                  <p className="text-[10px] font-bold uppercase text-[#4F67B5] flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" /> Check-Out
                  </p>
                  <p className="text-sm font-bold text-[#1A2458] mt-1">
                    {format(new Date(selectedEvent.end), "dd MMM yyyy", { locale: es })}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#A5C5E2]/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#4F67B5]">
                    Ocupación
                  </p>
                  <p className="text-sm font-semibold text-[#1A2458] mt-0.5">
                    {selectedEvent.reservationDetails?.numeroAdultos || 1} Adulto(s)
                    {selectedEvent.reservationDetails?.numeroNinos > 0
                      ? `, ${selectedEvent.reservationDetails?.numeroNinos} Niño(s)`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHuespedesModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#473C8F] text-white px-4 py-2.5 rounded-full text-xs font-semibold hover:bg-[#1A2458] transition-colors"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Registro TRA
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#1A2458] text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#A5C5E2]">
                    Total Estancia
                  </p>
                  <p className="text-2xl font-bold text-white mt-0.5">
                    $
                    {Number(
                      selectedEvent.reservationDetails?.value || 0
                    ).toLocaleString("es-CO")}
                  </p>
                </div>
                <SparklesIcon className="w-7 h-7 text-[#A5C5E2]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="w-full py-3.5 rounded-full bg-[#1A2458] text-white text-xs font-bold tracking-wide hover:bg-[#473C8F] transition-colors mt-6"
            >
              Cerrar Panel
            </button>
          </div>
        </div>
      )}

      {selectedEvent && (
        <HuespedesModal
          isOpen={isHuespedesModalOpen}
          onClose={() => setIsHuespedesModalOpen(false)}
          reservation={selectedEvent.reservationDetails}
          onSuccess={() => fetchReservas()}
        />
      )}

      <NuevaReservaModal
        isOpen={isNuevaReservaModalOpen}
        onClose={() => setIsNuevaReservaModalOpen(false)}
        onSuccess={() => fetchReservas()}
      />
    </div>
  );
}