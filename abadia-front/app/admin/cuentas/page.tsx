"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import RegistrarPagoModal from "@/components/RegistrarPagoModal";
import * as XLSX from "xlsx";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function CuentasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/reservations");
      setReservas(data);
    } catch (error) {
      console.error("Error cargando reservas para cuentas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const totalRecaudado = reservas.reduce((sum, res) => sum + Number(res.anticipo || 0), 0);
  const totalEsperado = reservas.reduce((sum, res) => sum + Number(res.value || 0), 0);
  const totalPendiente = totalEsperado - totalRecaudado;

  const handleExportExcel = () => {
    // 1. Mapear los datos para que sean limpios
    const dataToExport = reservas.map(res => {
      const valorTotal = Number(res.value || 0);
      const anticipo = Number(res.anticipo || 0);
      const pendiente = valorTotal - anticipo;
      const paymentStatus = res.paymentStatus || 'pending';
      const statusTranslate = paymentStatus === 'paid' ? 'Pagado' : paymentStatus === 'partial' ? 'Parcial' : 'Pendiente';

      return {
        "Cliente": res.cliente?.nombre || 'Sin cliente',
        "Habitación": res.habitacion?.titulo || 'Sin habitación',
        "Valor Total": valorTotal,
        "Anticipo Pagado": anticipo,
        "Saldo Pendiente": pendiente,
        "Estado": statusTranslate,
        "Fecha CheckIn": res.checkIn ? new Date(res.checkIn).toLocaleDateString('es-CO') : '',
        "Fecha CheckOut": res.checkOut ? new Date(res.checkOut).toLocaleDateString('es-CO') : ''
      };
    });

    // 2. Crear un Worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. Crear un Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuentas");

    // 4. Descargar archivo
    XLSX.writeFile(workbook, "Cuentas_Abadia.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Cuentas y Pagos</h2>
          <p className="text-gray-500 mt-1 text-sm">Control financiero de las reservaciones.</p>
        </div>
        <button 
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Exportar Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 flex flex-col justify-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total Esperado</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">${totalEsperado.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 flex flex-col justify-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total Recaudado (Anticipos)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">${totalRecaudado.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 flex flex-col justify-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Saldo Pendiente</p>
            <p className="text-3xl font-bold text-red-500 mt-2">${totalPendiente.toLocaleString('es-CO')}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mv-cream)]/50 border-b border-[var(--mv-sage)]/10">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Huésped / Habitación</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Valor Total</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Pagado (Anticipo)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Saldo Pendiente</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado de Pago</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mv-sage)]/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando cuentas...</span>
                    </div>
                  </td>
                </tr>
              ) : reservas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No hay reservas registradas.</td>
                </tr>
              ) : (
                reservas.map((res) => {
                  const valorTotal = Number(res.value || 0);
                  const anticipo = Number(res.anticipo || 0);
                  const pendiente = valorTotal - anticipo;
                  const paymentStatus = res.paymentStatus || 'pending';

                  return (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-[var(--mv-ink)]">{res.cliente?.nombre || 'Sin cliente'}</span>
                            <span className="text-xs text-gray-500">{res.habitacion?.titulo || 'Sin habitación'}</span>
                        </div>
                        </td>
                        <td className="p-4">
                        <span className="font-medium text-[var(--mv-ink)]">
                            ${valorTotal.toLocaleString("es-CO")}
                        </span>
                        </td>
                        <td className="p-4">
                        <span className="font-medium text-green-600">
                            ${anticipo.toLocaleString("es-CO")}
                        </span>
                        </td>
                        <td className="p-4">
                        <span className={`font-medium ${pendiente > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            ${pendiente.toLocaleString("es-CO")}
                        </span>
                        </td>
                        <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                            paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                            paymentStatus === 'partial' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {paymentStatus === 'paid' ? 'Pagado' :
                             paymentStatus === 'partial' ? 'Parcial' : 'Pendiente'}
                        </span>
                        </td>
                        <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setSelectedReserva(res)}
                              className="px-3 py-1.5 text-xs font-bold text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-lg transition-all"
                            >
                              REGISTRAR PAGO
                            </button>
                        </div>
                        </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrarPagoModal 
        reserva={selectedReserva}
        isOpen={!!selectedReserva}
        onClose={() => setSelectedReserva(null)}
        onSuccess={() => {
          fetchReservas();
        }}
      />
    </div>
  );
}
