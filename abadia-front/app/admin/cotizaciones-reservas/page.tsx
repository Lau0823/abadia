"use client";

import { useState, useEffect } from "react";
import { fetchApi, API_URL } from "@/lib/api";
import { PlusIcon, UserGroupIcon, EyeIcon, DocumentTextIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ArrowRightCircleIcon, HomeModernIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import NuevaReservaModal from "@/components/NuevaReservaModal";
import CotizacionModal from "@/components/CotizacionModal";
import HuespedesModal from "@/components/HuespedesModal";
import TransferirReservaModal from "@/components/TransferirReservaModal";
import DetalleReservaModal from "@/components/DetalleReservaModal";
import ConvertirReservaModal from "@/components/ConvertirReservaModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

type FilterTab = 'Todas' | 'Cotizaciones' | 'Pendientes' | 'Realizadas' | 'En Casa' | 'Canceladas';

export default function CotizacionesReservasPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('Todas');
  
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
  
  const tabs: FilterTab[] = ['Todas', 'Cotizaciones', 'Pendientes', 'Realizadas', 'En Casa', 'Canceladas'];

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both endpoints concurrently
      // Ideally these endpoints support pagination/search, but for unified view we might need to fetch all or use a unified endpoint in the future.
      // Assuming no pagination for this combined view or handling it on the client for simplicity.
      const [cotizacionesRes, reservasRes] = await Promise.all([
        fetchApi(`/cotizaciones?limit=100&search=${encodeURIComponent(search)}`).catch(() => ({ data: [] })),
        fetchApi(`/reservations?limit=100&search=${encodeURIComponent(search)}`).catch(() => ({ data: [] }))
      ]);

      const cotizaciones = (cotizacionesRes.data || cotizacionesRes || []).map((c: any) => ({
        ...c,
        dataType: 'cotizacion',
        uiStatus: mapCotizacionStatus(c.status)
      }));

      const reservas = (reservasRes.data || reservasRes || []).map((r: any) => ({
        ...r,
        dataType: 'reserva',
        uiStatus: mapReservaStatus(r.status)
      }));

      // Sort by date (descending checkIn)
      const combined = [...cotizaciones, ...reservas].sort((a, b) => 
        new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
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

  const mapCotizacionStatus = (status: string) => {
    if (status === 'PENDING') return 'Cotizaciones';
    if (status === 'ACCEPTED') return 'Realizadas';
    if (status === 'EXPIRED') return 'Canceladas';
    return 'Cotizaciones';
  };

  const mapReservaStatus = (status: string) => {
    if (status === 'pending') return 'Pendientes';
    if (status === 'confirmed') return 'Realizadas';
    if (status === 'in_house') return 'En Casa';
    if (status === 'completed') return 'Todas'; // Or a new tab "Completadas"
    if (status === 'cancelled') return 'Canceladas';
    return 'Todas';
  };

  const filteredData = data.filter(item => {
    if (activeTab === 'Todas') return true;
    return item.uiStatus === activeTab;
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', { month: 'short', day: '2-digit' }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const handleChangeStatus = async (id: string, type: 'cotizacion' | 'reserva', newStatus: string) => {
    if (confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
      try {
        const endpoint = type === 'cotizacion' ? `/cotizaciones/${id}/status` : `/reservations/${id}/status`;
        await fetchApi(endpoint, {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus })
        });
        fetchData();
      } catch (error: any) {
        alert("Error al cambiar estado: " + (error.message || ""));
      }
    }
  };

  const getStatusBadge = (uiStatus: string) => {
    switch(uiStatus) {
      case 'Cotizaciones': return 'bg-cyan-100 text-cyan-700 border-cyan-200'; // Azul Hielo
      case 'Pendientes': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Realizadas': return 'bg-blue-100 text-blue-700 border-blue-200'; // Azul Cobalto
      case 'En Casa': return 'bg-orange-100 text-orange-700 border-orange-200'; // Terracota
      case 'Canceladas': return 'bg-red-100 text-red-700 border-red-200'; // Arcilla
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Cotizaciones y Reservas</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestión unificada del ciclo de venta de hospedaje.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente, habitación..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)] focus:border-transparent w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsNewCotizacionModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[var(--mv-ink)] px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Cotización
            </button>
            <button 
              onClick={() => setIsNewReservaModalOpen(true)}
              className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-md"
            >
              <PlusIcon className="w-4 h-4" />
              Reserva
            </button>
          </div>
        </div>
      </div>

      {/* Tabs / Badges */}
      <div className="flex overflow-x-auto gap-2 pb-2 mv-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              activeTab === tab 
                ? 'bg-[var(--mv-ink)] text-white border-[var(--mv-ink)] shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabla Unificada */}
      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mv-cream)]/50 border-b border-[var(--mv-sage)]/10">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Cliente</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Habitación</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Fechas</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Valor Total</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mv-sage)]/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando datos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No se encontraron registros.</td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={`${item.dataType}-${item.id}`} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-sm text-gray-500 font-medium">#{item.id?.toString().slice(-4) || '---'}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--mv-ink)] line-clamp-1">{item.cliente?.nombre}</span>
                        <span className="text-xs text-gray-500">{item.cliente?.correo}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-[var(--mv-ink)]">
                      {item.habitacion?.titulo || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-sm text-gray-600">
                        <span>{formatDate(item.checkIn)} <span className="text-gray-300 mx-1">➔</span> {formatDate(item.checkOut)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${getStatusBadge(item.uiStatus)}`}>
                        {item.uiStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[var(--mv-ink)]">
                      {formatCurrency(Number(item.value || item.total_estimado))}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Acciones para Cotizaciones */}
                        {item.dataType === 'cotizacion' && item.uiStatus === 'Cotizaciones' && (
                          <button 
                            onClick={() => { setSelectedItem(item); setIsConvertirModalOpen(true); }}
                            className="flex items-center gap-1 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                          >
                            <ArrowRightCircleIcon className="w-4 h-4" />
                            A Reserva
                          </button>
                        )}
                        
                        {/* Acciones Rápidas para Reservas */}
                        {item.dataType === 'reserva' && (
                          <>
                            {item.uiStatus === 'Realizadas' && (
                              <button 
                                onClick={() => handleChangeStatus(item.id, 'reserva', 'in_house')}
                                className="flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-orange-200"
                              >
                                <HomeModernIcon className="w-4 h-4" />
                                Check-in
                              </button>
                            )}
                            {item.uiStatus === 'En Casa' && (
                              <button 
                                onClick={() => handleChangeStatus(item.id, 'reserva', 'completed')}
                                className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-green-200"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                Check-out
                              </button>
                            )}
                            {item.uiStatus === 'Pendientes' && (
                              <button 
                                onClick={() => handleChangeStatus(item.id, 'reserva', 'confirmed')}
                                className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-green-200 mr-2"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                Confirmar
                              </button>
                            )}
                            {(item.uiStatus === 'Pendientes' || item.uiStatus === 'Realizadas') && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    onClick={() => handleChangeStatus(item.id, 'reserva', 'cancelled')}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <XCircleIcon className="w-5 h-5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Anular Reserva</TooltipContent>
                              </Tooltip>
                            )}
                          </>
                        )}

                        {/* Acciones Globales */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2 border-l pl-2 border-gray-200">
                           {item.dataType === 'reserva' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => { setSelectedItem(item); setIsDetalleModalOpen(true); }}
                                  className="p-1.5 text-gray-400 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-lg transition-all"
                                >
                                  <EyeIcon className="w-5 h-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Ver Detalles</TooltipContent>
                            </Tooltip>
                           )}
                           {item.dataType === 'cotizacion' && (
                             <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => window.open(`${API_URL}/documents/cotizacion/${item.id}`, "_blank")}
                                  className="p-1.5 text-gray-400 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-lg transition-all"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
        </>
      )}
    </div>
  );
}
