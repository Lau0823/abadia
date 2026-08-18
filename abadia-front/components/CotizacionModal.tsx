import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CotizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CotizacionModal({ isOpen, onClose, onSuccess }: CotizacionModalProps) {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    cliente_id: "",
    habitacion_id: "",
    checkIn: "",
    checkOut: "",
    numeroAdultos: 1,
    numeroNinos: 0,
    total_estimado: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
      if (!formData.checkIn || !formData.checkOut) {
        setHabitaciones([]);
      }
      setFormData({
        cliente_id: "",
        habitacion_id: "",
        checkIn: "",
        checkOut: "",
        numeroAdultos: 1,
        numeroNinos: 0,
        total_estimado: 0,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // Calculo automático del total estimado
    if (formData.habitacion_id && formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      if (checkOutDate > checkInDate) {
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Ensure habitaciones is an array before trying to find the item
        const hbs = Array.isArray(habitaciones) ? habitaciones : ((habitaciones as any).data || []);
        const habitacionSeleccionada = hbs.find((h: any) => h.id === formData.habitacion_id);
        
        if (habitacionSeleccionada) {
          const precioTotal = diffDays * Number(habitacionSeleccionada.precio);
          setFormData(prev => ({ ...prev, total_estimado: precioTotal }));
        }
      }
    }
  }, [formData.habitacion_id, formData.checkIn, formData.checkOut, habitaciones]);

  // Buscar habitaciones disponibles cuando cambian las fechas
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const loadDisponibles = async () => {
        try {
          const response = await fetchApi(`/habitaciones/disponibles?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}`);
          setHabitaciones(response || []);
          // Si la habitación seleccionada ya no está disponible, la deseleccionamos
          if (formData.habitacion_id && !response.find((h: any) => h.id === formData.habitacion_id)) {
            setFormData(prev => ({ ...prev, habitacion_id: "" }));
          }
        } catch (error) {
          console.error("Error loading habitaciones disponibles", error);
        }
      };
      loadDisponibles();
    } else {
      setHabitaciones([]);
      setFormData(prev => ({ ...prev, habitacion_id: "" }));
    }
  }, [formData.checkIn, formData.checkOut]);

  // Obtener fecha actual en formato para input date
  const todayStr = new Date().toISOString().slice(0, 10);

  const fetchClientes = async () => {
    try {
      const response = await fetchApi("/clientes?limit=100");
      setClientes(response.data || []);
    } catch (error) {
      console.error("Error loading clientes", error);
    }
  };

  // fetchHabitaciones ha sido reemplazado por la búsqueda dinámica en useEffect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        cliente_id: Number(formData.cliente_id),
        numeroAdultos: Number(formData.numeroAdultos),
        numeroNinos: Number(formData.numeroNinos),
        total_estimado: Number(formData.total_estimado),
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
      };

      await fetchApi("/cotizaciones", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onSuccess();
      onClose();
    } catch (error) {
      alert("Error al crear la cotización.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-[var(--mv-ink)]">Nueva Cotización</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none bg-white"
                value={formData.cliente_id}
                onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.documento})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitación / Propiedad</label>
              <select
                required
                disabled={!formData.checkIn || !formData.checkOut}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none bg-white disabled:opacity-50 disabled:bg-gray-50"
                value={formData.habitacion_id}
                onChange={(e) => setFormData({ ...formData, habitacion_id: e.target.value })}
              >
                <option value="">
                  {!formData.checkIn || !formData.checkOut 
                    ? "Selecciona fechas primero" 
                    : Array.isArray(habitaciones) && habitaciones.length === 0 
                      ? "No hay habitaciones disponibles" 
                      : "Seleccione una habitación..."}
                </option>
                {Array.isArray(habitaciones) && habitaciones.map(h => (
                  <option key={h.id} value={h.id}>{h.titulo} - ${h.precio}/noche</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input
                  type="date"
                  required
                  min={formData.checkIn || todayStr}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adultos</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                  value={formData.numeroAdultos}
                  onChange={(e) => setFormData({ ...formData, numeroAdultos: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niños</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                  value={formData.numeroNinos}
                  onChange={(e) => setFormData({ ...formData, numeroNinos: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Estimado a Cobrar (COP)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 border border-[var(--mv-blue)]/50 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none bg-blue-50/30 text-lg font-bold text-[var(--mv-blue)]"
                value={formData.total_estimado}
                onChange={(e) => setFormData({ ...formData, total_estimado: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--mv-blue)] hover:bg-[#0b3c66] rounded-full transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {loading ? "Creando..." : "Guardar Cotización"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
