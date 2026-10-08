"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface TareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tarea?: any | null; // Si se pasa, es modo edición
}

export default function TareaModal({ isOpen, onClose, onSuccess, tarea }: TareaModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [empleados, setEmpleados] = useState<any[]>([]);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "PENDIENTE",
    fecha_limite: "",
    asignado_a_id: ""
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetchApi("/users");
        setEmpleados(response.data || response || []);
      } catch (error) {
        console.error("Error cargando empleados", error);
      }
    };
    if (isOpen) {
      fetchEmpleados();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (tarea) {
        setFormData({
          titulo: tarea.titulo || "",
          descripcion: tarea.descripcion || "",
          estado: tarea.estado || "PENDIENTE",
          fecha_limite: tarea.fecha_limite ? new Date(tarea.fecha_limite).toISOString().split('T')[0] : "",
          asignado_a_id: tarea.asignado_a?.id?.toString() || ""
        });
      } else {
        setFormData({
          titulo: "",
          descripcion: "",
          estado: "PENDIENTE",
          fecha_limite: "",
          asignado_a_id: ""
        });
      }
      setError("");
    }
  }, [isOpen, tarea]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    
    try {
      const payload: any = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        estado: formData.estado
      };

      if (formData.fecha_limite) {
        payload.fecha_limite = new Date(formData.fecha_limite).toISOString();
      }
      
      if (formData.asignado_a_id) {
        payload.asignado_a_id = parseInt(formData.asignado_a_id);
      }

      if (tarea && tarea.id) {
        // Edit
        await fetchApi(`/tareas/${tarea.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
      } else {
        // Create
        payload.creado_por_id = user?.id; // asume que hay un usuario logueado
        await fetchApi("/tareas", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar la tarea");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!tarea;

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
          {isEditing ? "Editar Tarea" : "Nueva Tarea"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título</label>
            <input 
              type="text" 
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej. Limpiar Suite 1"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descripción</label>
            <textarea 
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Instrucciones adicionales..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Asignar a</label>
              <select 
                name="asignado_a_id"
                value={formData.asignado_a_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
              >
                <option value="">-- Ninguno --</option>
                {empleados.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre || emp.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fecha Límite</label>
              <input 
                type="date" 
                name="fecha_limite"
                value={formData.fecha_limite}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
            <select 
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
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
              {isEditing ? "Guardar" : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
