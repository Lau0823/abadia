"use client";

import { useState, useEffect } from "react";
import { fetchApi, API_URL } from "@/lib/api";
import { PlusIcon, DocumentArrowDownIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import CotizacionModal from "@/components/CotizacionModal";

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCotizaciones = async () => {
    setLoading(true);
    try {
      const response = await fetchApi("/cotizaciones");
      setCotizaciones(response.data || []);
    } catch (error) {
      console.error("Error cargando cotizaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const handleOpenNew = () => {
    setIsModalOpen(true);
  };

  const handleDownloadPdf = (id: string) => {
    window.open(`${API_URL}/documents/cotizacion/${id}`, "_blank");
  };

  const handleConvertToReservation = async (id: string) => {
    if (confirm("¿Estás seguro de convertir esta cotización en una reserva confirmada?")) {
      try {
        await fetchApi(`/cotizaciones/${id}/convertir`, { method: "POST" });
        alert("¡Cotización convertida a reserva con éxito!");
        fetchCotizaciones();
      } catch (error: any) {
        alert("Error al convertir a reserva: " + (error.message || "Error desconocido"));
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Cotizaciones</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona cotizaciones de clientes y conviértelas en reservaciones.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shrink-0"
          >
            <PlusIcon className="w-5 h-5" />
            Nueva Cotización
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex flex-col items-center text-gray-400">
            <div className="w-8 h-8 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-3">Cargando cotizaciones...</span>
          </div>
        ) : cotizaciones.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center text-gray-500 bg-white rounded-3xl border border-[var(--mv-sage)]/10">
            <p>No hay cotizaciones registradas.</p>
          </div>
        ) : (
          cotizaciones.map((c) => (
            <div key={c.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--mv-sage)]/10 hover:shadow-md transition-shadow relative overflow-hidden group">
              {c.status === "PENDING" && <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>}
              {c.status === "ACCEPTED" && <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>}
              {c.status === "EXPIRED" && <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[var(--mv-ink)] text-lg line-clamp-1">{c.cliente?.nombre || 'Cliente sin nombre'}</h3>
                  <p className="text-sm text-gray-500">{c.habitacion?.titulo || 'Habitación'}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  c.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  c.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {c.status === "PENDING" && <ClockIcon className="w-3 h-3" />}
                  {c.status === "ACCEPTED" && <CheckCircleIcon className="w-3 h-3" />}
                  {c.status === "EXPIRED" && <XCircleIcon className="w-3 h-3" />}
                  {c.status}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-in:</span>
                  <span className="font-medium text-gray-800">{formatDate(c.checkIn)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-out:</span>
                  <span className="font-medium text-gray-800">{formatDate(c.checkOut)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ocupación:</span>
                  <span className="font-medium text-gray-800">{c.numeroAdultos} Ads, {c.numeroNinos} Niñ.</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Estimado:</span>
                  <span className="font-bold text-[var(--mv-blue)] text-lg">{formatCurrency(Number(c.total_estimado))}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleDownloadPdf(c.id)}
                  className="p-2 text-gray-500 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-xl transition-colors flex-1 flex justify-center items-center gap-2"
                  title="Descargar PDF"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span className="text-xs font-medium">PDF</span>
                </button>
                {c.status === "PENDING" && (
                  <button 
                    onClick={() => handleConvertToReservation(c.id)}
                    className="p-2 text-white bg-[var(--mv-blue)] hover:bg-[#0b3c66] rounded-xl transition-colors flex-[2] flex justify-center items-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">Aprobar y Reservar</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CotizacionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCotizaciones}
      />
    </div>
  );
}
