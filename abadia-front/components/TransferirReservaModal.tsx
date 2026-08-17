import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { XMarkIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

interface TransferirReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  onSuccess: () => void;
}

export default function TransferirReservaModal({ isOpen, onClose, reservation, onSuccess }: TransferirReservaModalProps) {
  const [loading, setLoading] = useState(false);
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [nuevaHabitacionId, setNuevaHabitacionId] = useState("");

  useEffect(() => {
    if (isOpen && reservation) {
      setNuevaHabitacionId("");
      fetchHabitaciones();
    }
  }, [isOpen, reservation]);

  const fetchHabitaciones = async () => {
    try {
      if (!reservation?.checkIn || !reservation?.checkOut) return;
      
      const checkInStr = new Date(reservation.checkIn).toISOString();
      const checkOutStr = new Date(reservation.checkOut).toISOString();
      
      const response = await fetchApi(`/habitaciones/disponibles?checkIn=${checkInStr}&checkOut=${checkOutStr}`);
      
      const allRooms = Array.isArray(response) ? response : (response.data || []);
      setHabitaciones(allRooms.filter((h: any) => h.id !== reservation?.habitacion?.id));
    } catch (error) {
      console.error("Error loading habitaciones", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaHabitacionId) {
      alert("Por favor seleccione una nueva habitación.");
      return;
    }

    setLoading(true);

    try {
      await fetchApi(`/reservations/${reservation.id}`, {
        method: "PATCH",
        body: JSON.stringify({ habitacion_id: nuevaHabitacionId }),
      });

      alert("Reserva transferida con éxito.");
      onSuccess();
      onClose();
    } catch (error: any) {
      alert("Error al transferir la reserva. Es posible que la habitación no esté disponible en esas fechas. (" + (error.message || "Error desconocido") + ")");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--mv-blue)]/10 p-2 rounded-xl text-[var(--mv-blue)]">
              <ArrowsRightLeftIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--mv-ink)]">Transferir Reserva</h3>
              <p className="text-xs text-gray-500">Mover reserva a otra habitación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center text-sm">
            <div>
              <span className="block text-gray-500 mb-1">Habitación Actual:</span>
              <span className="font-bold text-[var(--mv-ink)]">{reservation.habitacion?.titulo}</span>
            </div>
            <div className="text-right">
              <span className="block text-gray-500 mb-1">Fechas:</span>
              <span className="font-medium text-[var(--mv-ink)] text-xs">
                {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Habitación</label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none bg-white text-gray-800 font-medium"
              value={nuevaHabitacionId}
              onChange={(e) => setNuevaHabitacionId(e.target.value)}
            >
              <option value="">Seleccione una habitación destino...</option>
              {habitaciones.map(h => (
                <option key={h.id} value={h.id}>{h.titulo}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              * El sistema verificará automáticamente si la nueva habitación está disponible en las fechas de esta reserva.
            </p>
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
              disabled={loading || !nuevaHabitacionId}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--mv-blue)] hover:bg-[#0b3c66] rounded-full transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {loading ? "Procesando..." : "Confirmar Transferencia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
