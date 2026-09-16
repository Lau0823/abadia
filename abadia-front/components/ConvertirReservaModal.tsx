import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { XMarkIcon, CurrencyDollarIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function ConvertirReservaModal({
  isOpen,
  onClose,
  item,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSuccess: () => void;
}) {
  const [anticipo, setAnticipo] = useState<number | "">("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetchApi(`/cotizaciones/${item.id}/convertir`, {
        method: "POST",
        body: JSON.stringify({
          anticipo: Number(anticipo) || 0,
          metodoPago
        })
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al convertir a reserva");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-[var(--mv-sage)]/10 flex justify-between items-center bg-[var(--mv-cream)]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--mv-blue)]/10 flex items-center justify-center text-[var(--mv-blue)]">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--mv-ink)]">Convertir a Reserva</h3>
              <p className="text-xs text-gray-500">Cotización #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
            <span className="text-sm text-blue-800">Total Estimado</span>
            <span className="font-bold text-lg text-blue-900">{formatCurrency(Number(item.total_estimado))}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--mv-ink)] mb-2">Anticipo / Pago Inicial</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                required
                min="0"
                value={anticipo}
                onChange={(e) => setAnticipo(Number(e.target.value) || "")}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)]/50 focus:border-[var(--mv-blue)] transition-all font-medium text-gray-900"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--mv-ink)] mb-2">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'efectivo', label: 'Efectivo', icon: BanknotesIcon },
                { id: 'tarjeta', label: 'Tarjeta', icon: CurrencyDollarIcon },
                { id: 'transferencia', label: 'Transferencia', icon: BanknotesIcon }
              ].map(method => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setMetodoPago(method.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    metodoPago === method.id 
                      ? 'bg-[var(--mv-blue)]/10 border-[var(--mv-blue)] text-[var(--mv-blue)]'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <method.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-medium text-white bg-[var(--mv-blue)] hover:bg-[#0b3c66] rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                'Confirmar y Reservar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
