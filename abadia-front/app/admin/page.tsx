"use client";

import { UsersIcon, CalendarDaysIcon, CurrencyDollarIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Clientes", value: "128", icon: UsersIcon, change: "+12%", changeType: "positive" },
    { name: "Citas Hoy", value: "14", icon: CalendarDaysIcon, change: "4 pendientes", changeType: "neutral" },
    { name: "Ingresos del Mes", value: "$4,250", icon: CurrencyDollarIcon, change: "+8%", changeType: "positive" },
    { name: "Tasa de Conversión", value: "64%", icon: PresentationChartLineIcon, change: "-2%", changeType: "negative" },
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
              <div className="p-2 bg-[var(--mv-sage)]/10 rounded-lg text-[var(--mv-sage)]">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-[var(--mv-ink)]">{stat.value}</p>
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
        <div className="lg:col-span-2 mv-section-card p-6 min-h-[400px]">
          <h2 className="text-lg font-semibold text-[var(--mv-ink)] mb-4">Actividad Reciente</h2>
          <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400">Gráfico de actividad próximamente...</p>
          </div>
        </div>
        
        <div className="mv-section-card p-6">
          <h2 className="text-lg font-semibold text-[var(--mv-ink)] mb-4">Próximas Citas</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[var(--mv-gold)]/20 flex items-center justify-center text-[var(--mv-gold)] font-bold">
                  {["M", "C", "A"][i-1]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--mv-ink)]">{["María Pérez", "Carlos López", "Ana Gómez"][i-1]}</p>
                  <p className="text-xs text-gray-500">Hoy, {["10:00 AM", "02:30 PM", "04:15 PM"][i-1]}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-[var(--mv-blue)] font-medium hover:bg-[var(--mv-blue)]/5 rounded-lg transition-colors">
            Ver todas las citas
          </button>
        </div>
      </div>
    </div>
  );
}
