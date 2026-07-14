"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface HabitacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  habitacion?: any | null; // Si se pasa, es modo edición
}

export default function HabitacionModal({ isOpen, onClose, onSuccess, habitacion }: HabitacionModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    precio: 0,
    ocupacion: "",
    estado: "DISPONIBLE"
  });

  useEffect(() => {
    if (isOpen) {
      if (habitacion) {
        setFormData({
          titulo: habitacion.titulo || "",
          subtitulo: habitacion.subtitulo || "",
          precio: habitacion.precio || 0,
          ocupacion: habitacion.ocupacion || "",
          estado: habitacion.estado || "DISPONIBLE"
        });
      } else {
        setFormData({
          titulo: "",
          subtitulo: "",
          precio: 0,
          ocupacion: "",
          estado: "DISPONIBLE"
        });
      }
      setError("");
    }
  }, [isOpen, habitacion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        precio: Number(formData.precio)
      };

      if (habitacion && habitacion.id) {
        // Edit
        await fetchApi(`/habitaciones/${habitacion.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
      } else {
        // Create
        await fetchApi("/habitaciones", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar la habitación");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!habitacion;

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
        <h3 className="text-xl font-bold text-[var(--mv-ink)] mb-4 border-b pb-2">
          {isEditing ? "Editar Habitación" : "Nueva Habitación"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título (Ej. Habitación 1)</label>
            <input 
              type="text" 
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subtítulo (Ej. Suite Insignia)</label>
            <input 
              type="text" 
              name="subtitulo"
              value={formData.subtitulo}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Precio por Noche (COP)</label>
            <input 
              type="number" 
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ocupación</label>
            <input 
              type="text" 
              name="ocupacion"
              value={formData.ocupacion}
              onChange={handleChange}
              placeholder="Ej. Máx. 2 Adultos + 1 Niño"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado Operativo</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="MANTENIMIENTO">En Mantenimiento</option>
              <option value="FUERA_DE_SERVICIO">Fuera de Servicio</option>
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
              {isEditing ? "Guardar Cambios" : "Crear Habitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
