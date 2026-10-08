"use client";

import { useEffect, useState } from "react";
import { UsersIcon, CalendarDaysIcon, CurrencyDollarIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";
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

  const stats = [
    { name: "Huéspedes Alojados", value: data.huespedesTotal.toString(), icon: UsersIcon, change: `${data.huespedesAdultos} adultos, ${data.huespedesNinos} niños`, changeType: "neutral" },
    { name: "Reservas Activas", value: data.citasHoy.toString(), icon: CalendarDaysIcon, change: "Hoy", changeType: "neutral" },
    { name: "Ingresos del Mes", value: `$${data.ingresosMes.toLocaleString("es-CO")}`, icon: CurrencyDollarIcon, change: "Este mes", changeType: "positive" },
    { name: "Ocupación", value: `${data.tasaOcupacion}%`, icon: PresentationChartLineIcon, change: "Hoy", changeType: "neutral" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="mv-section-card p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.name}</p>
              <div className="p-2 bg-(--mv-sage)/10 rounded-lg text-(--mv-sage)">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-semibold text-(--mv-ink)">{stat.value}</p>
              )}
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === "positive"
                    ? "bg-green-100 text-green-700"
                    : stat.changeType === "negative"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 mv-section-card p-6 min-h-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-(--mv-ink)">Estado de Habitaciones</h2>
            <Link href="/admin/habitaciones" className="text-sm text-(--mv-blue) hover:underline">Ver todas</Link>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : data.estadoHabitaciones && data.estadoHabitaciones.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.estadoHabitaciones.map((hab: any) => (
                  <div key={hab.id} className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white relative">
                    <div className="flex flex-col">
                      <span className="font-medium text-(--mv-ink) text-sm">{hab.titulo}</span>
                      <span className="text-xs text-gray-500 mt-1">{hab.capacidad || "Sin definir"}</span>
                      {hab.estado === 'OCUPADA' && (
                        <span className="text-xs text-blue-600 font-semibold mt-1">
                          👤 Ocupantes: {hab.huespedesActuales}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase self-start ${
                        hab.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-700' : 
                        hab.estado === 'OCUPADA' ? 'bg-blue-100 text-blue-700' : 
                        hab.estado === 'MANTENIMIENTO' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {hab.estado}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase self-start ${
                        hab.estadoLimpieza === 'LIMPIA' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {hab.estadoLimpieza === 'LIMPIA' ? '✨ Limpia' : '🧹 Por Asear'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl min-h-75">
                <p className="text-gray-400">No hay habitaciones registradas.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mv-section-card p-6">
          <h2 className="text-lg font-semibold text-(--mv-ink) mb-4">Próximas Citas</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 p-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data.proximasCitas.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No hay próximas citas.</p>
            ) : (
              data.proximasCitas.map((cita: any) => (
                <div key={cita.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-(--mv-gold)/20 flex items-center justify-center text-(--mv-gold) font-bold">
                    {cita.inicial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-(--mv-ink)">{cita.clienteNombre}</p>
                    <p className="text-xs text-gray-500">{cita.fechaTexto} - {cita.habitacionNombre}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/reservas">
            <button className="w-full mt-6 py-2 text-sm text-(--mv-blue) font-medium hover:bg-(--mv-blue)/5 rounded-lg transition-colors">
              Ver todas las citas
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
