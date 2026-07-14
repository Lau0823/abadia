"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface HuespedesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservation: any;
}

export default function HuespedesModal({ isOpen, onClose, onSuccess, reservation }: HuespedesModalProps) {
  const [huespedes, setHuespedes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newHuesped, setNewHuesped] = useState({
    nombre: "",
    documento: ""
  });

  useEffect(() => {
    if (isOpen && reservation) {
      setHuespedes(reservation.huespedes || []);
      setError("");
      setNewHuesped({ nombre: "", documento: "" });
    }
  }, [isOpen, reservation]);

  const handleAddHuesped = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHuesped.nombre || !newHuesped.documento) return;

    setLoading(true);
    setError("");

    try {
      const added = await fetchApi(`/reservations/${reservation.id}/huespedes`, {
        method: "POST",
        body: JSON.stringify(newHuesped)
      });
      setHuespedes([...huespedes, added]);
      setNewHuesped({ nombre: "", documento: "" });
      onSuccess(); // Refrescar en background si es necesario
    } catch (err: any) {
      setError(err.message || "Error al agregar el huésped");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveHuesped = async (id: string) => {
    if (!confirm("¿Eliminar a esta persona del registro?")) return;
    
    setLoading(true);
    setError("");

    try {
      await fetchApi(`/reservations/huespedes/${id}`, {
        method: "DELETE"
      });
      setHuespedes(huespedes.filter((h: any) => h.id !== id));
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-[var(--mv-ink)] mb-1">Registro de Acompañantes</h3>
        <p className="text-sm text-gray-500 mb-6">Habitación: {reservation.habitacion?.titulo || "N/A"}</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
          {huespedes.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl">
              No hay acompañantes registrados aún.
            </p>
          ) : (
            huespedes.map((huesped) => (
              <div key={huesped.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-[var(--mv-ink)]">{huesped.nombre}</p>
                  <p className="text-xs text-gray-500">Doc: {huesped.documento}</p>
                </div>
                <button 
                  onClick={() => handleRemoveHuesped(huesped.id)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Remover huésped"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddHuesped} className="bg-[var(--mv-cream)]/30 p-4 rounded-2xl border border-[var(--mv-sage)]/20">
          <h4 className="text-sm font-semibold text-[var(--mv-ink)] mb-3">Agregar Nueva Persona</h4>
          <div className="space-y-3">
            <div>
              <input 
                type="text" 
                placeholder="Nombre Completo"
                value={newHuesped.nombre}
                onChange={(e) => setNewHuesped({ ...newHuesped, nombre: e.target.value })}
                required
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
              />
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Documento"
                value={newHuesped.documento}
                onChange={(e) => setNewHuesped({ ...newHuesped, documento: e.target.value })}
                required
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-1 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
                Añadir
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
