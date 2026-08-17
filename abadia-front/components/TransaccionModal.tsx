import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TransaccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransaccionModal({ isOpen, onClose, onSuccess }: TransaccionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monto: "",
    tipo: "INGRESO",
    categoria: "OTROS",
    concepto: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        monto: "",
        tipo: "INGRESO",
        categoria: "OTROS",
        concepto: "",
        fecha: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        monto: Number(formData.monto),
        fecha: new Date(formData.fecha).toISOString(),
      };

      await fetchApi("/finanzas", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onSuccess();
      onClose();
    } catch (error) {
      alert("Error al registrar la transacción. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">Nueva Transacción Manual</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none bg-white"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="INGRESO">Ingreso (Entrada)</option>
                <option value="EGRESO">Egreso (Gasto)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none bg-white"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="RESERVACION">Reservación</option>
                <option value="EXTRAS">Venta de Extras</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="NOMINA">Nómina</option>
                <option value="SERVICIOS_PUBLICOS">Servicios Públicos</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concepto / Descripción</label>
            <input
              type="text"
              required
              placeholder="Ej. Pago recibo de luz, Compra insumos"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto (COP)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
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
              {loading ? "Guardando..." : "Registrar Transacción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
