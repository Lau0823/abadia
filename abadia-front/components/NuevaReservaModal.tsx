"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface NuevaReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NuevaReservaModal({ isOpen, onClose, onSuccess }: NuevaReservaModalProps) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    cliente_id: "",
    habitacion_id: "",
    checkIn: "",
    checkOut: "",
    numeroAdultos: 1,
    numeroNinos: 0,
    value: 0,
    origenReserva: "Directo"
  });

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setLoadingData(true);
        try {
          const [clientesRes, habitacionesRes] = await Promise.all([
            fetchApi("/clientes?limit=1000"), // Traemos suficientes para el select por ahora
            fetchApi("/habitaciones")
          ]);
          setClientes(clientesRes.data || []);
          setHabitaciones(habitacionesRes || []);
        } catch (err: any) {
          setError("Error al cargar clientes o habitaciones.");
        } finally {
          setLoadingData(false);
        }
      };
      loadData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    
    try {
      await fetchApi("/reservations", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          numeroAdultos: Number(formData.numeroAdultos),
          numeroNinos: Number(formData.numeroNinos),
          value: Number(formData.value),
          cliente_id: Number(formData.cliente_id)
        })
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear la reserva");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-[var(--mv-ink)] mb-4 border-b pb-2">Nueva Reserva</h3>
        
        {loadingData ? (
          <div className="py-10 flex justify-center">
             <div className="animate-spin w-8 h-8 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cliente</label>
                <select 
                  name="cliente_id" 
                  value={formData.cliente_id} 
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.documento})</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Habitación</label>
                <select 
                  name="habitacion_id" 
                  value={formData.habitacion_id} 
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                >
                  <option value="">Selecciona una habitación</option>
                  {habitaciones.map(h => (
                    <option key={h.id} value={h.id}>{h.titulo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check In</label>
                <input 
                  type="datetime-local" 
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check Out</label>
                <input 
                  type="datetime-local" 
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Adultos</label>
                <input 
                  type="number" 
                  min="1"
                  name="numeroAdultos"
                  value={formData.numeroAdultos}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Niños</label>
                <input 
                  type="number" 
                  min="0"
                  name="numeroNinos"
                  value={formData.numeroNinos}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Valor Total ($)</label>
                <input 
                  type="number" 
                  min="0"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
                />
              </div>
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
                Crear Reserva
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
