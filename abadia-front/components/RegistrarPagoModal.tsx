"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface RegistrarPagoModalProps {
  reserva: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrarPagoModal({ reserva, isOpen, onClose, onSuccess }: RegistrarPagoModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    anticipo: 0,
    paymentStatus: "pending"
  });

  useEffect(() => {
    if (reserva) {
      setFormData({
        anticipo: Number(reserva.anticipo) || 0,
        paymentStatus: reserva.paymentStatus || "pending"
      });
    }
  }, [reserva]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserva) return;
    
    setError("");
    setSaving(true);
    
    try {
      await fetchApi(`/reservations/${reserva.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          anticipo: Number(formData.anticipo),
          paymentStatus: formData.paymentStatus
        })
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el pago");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !reserva) return null;

  const valorTotal = Number(reserva.value || 0);
  const anticipoActual = Number(formData.anticipo || 0);
  const saldoPendiente = valorTotal - anticipoActual;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-[var(--mv-ink)] mb-4 border-b pb-2">Registrar Pago</h3>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cliente</span>
                <span className="font-semibold text-gray-800">{reserva.cliente?.nombre}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-gray-500">Valor Total</span>
                <span className="font-semibold text-gray-800">${valorTotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-sm font-semibold text-gray-700">Saldo Pendiente Restante</span>
                <span className={`font-bold ${saldoPendiente > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    ${saldoPendiente.toLocaleString('es-CO')}
                </span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Monto Pagado (Anticipo Acumulado)</label>
            <input 
              type="number" 
              min="0"
              name="anticipo"
              value={formData.anticipo}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all text-lg font-bold text-[var(--mv-ink)]"
            />
            <p className="text-xs text-gray-400 mt-1">Suma el nuevo pago al anticipo existente.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado del Pago</label>
            <select 
              name="paymentStatus" 
              value={formData.paymentStatus} 
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            >
              <option value="pending">Pendiente (No ha pagado o pagó muy poco)</option>
              <option value="partial">Parcial (Abonó una parte importante)</option>
              <option value="paid">Pagado (Completó el 100%)</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Guardar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
