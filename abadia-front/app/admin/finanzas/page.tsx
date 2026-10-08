"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";
import TransaccionModal from "@/components/TransaccionModal";

export default function FinanzasPage() {
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0, balance: 0 });

  const fetchTransacciones = async () => {
    setLoading(true);
    try {
      const response = await fetchApi("/finanzas");
      const data = response.data || [];
      setTransacciones(data);
      
      // Calcular resumen
      let ing = 0;
      let egr = 0;
      data.forEach((t: any) => {
        if (t.tipo === 'INGRESO') ing += Number(t.monto);
        else if (t.tipo === 'EGRESO') egr += Number(t.monto);
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
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--mv-blue)]/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide flex items-center gap-3">
            <PresentationChartLineIcon className="w-8 h-8 text-[var(--mv-blue)]" />
            Dashboard Financiero
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Controla los ingresos y gastos del hotel en tiempo real.</p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--mv-blue)] to-[#0b3c66] hover:shadow-lg hover:shadow-[var(--mv-blue)]/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-all shrink-0"
          >
            <PlusIcon className="w-5 h-5" />
            Registrar Transacción
          </button>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--mv-sage)]/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <ArrowTrendingUpIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Ingresos Totales</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(resumen.ingresos)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--mv-sage)]/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <ArrowTrendingDownIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Egresos Totales</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(resumen.egresos)}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--mv-blue)] to-[#0b3c66] rounded-3xl p-6 shadow-lg shadow-[var(--mv-blue)]/20 flex items-center gap-4 text-white relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 z-10">
            <CurrencyDollarIcon className="w-7 h-7 text-white" />
          </div>
          <div className="z-10">
            <p className="text-sm text-white/80 font-medium uppercase tracking-wider">Balance de Caja</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(resumen.balance)}</h3>
          </div>
        </div>
      </div>

      {/* Historial de Transacciones */}
      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden">
        <div className="p-6 border-b border-[var(--mv-sage)]/10 bg-gray-50/50">
          <h3 className="text-lg font-bold text-[var(--mv-ink)]">Historial de Transacciones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mv-cream)]/30 border-b border-[var(--mv-sage)]/10">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Fecha</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Concepto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Categoría</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Monto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-center">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mv-sage)]/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando datos financieros...</span>
                    </div>
                  </td>
                </tr>
              ) : transacciones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    No hay transacciones registradas.
                  </td>
                </tr>
              ) : (
                transacciones.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(t.fecha)}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[var(--mv-ink)]">{t.concepto}</span>
                      {t.reservaId && (
                        <p className="text-xs text-blue-600 mt-1">Reserva #{t.reservaId}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {t.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">
                      {formatCurrency(Number(t.monto))}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        t.tipo === 'INGRESO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.tipo}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransaccionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransacciones}
      />
    </div>
  );
}
