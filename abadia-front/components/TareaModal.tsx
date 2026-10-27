"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface TareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tarea?: any | null; // Si se pasa, es modo edición
  habitacionPreseleccionada?: any | null; // Habitación pre-seleccionada si viene de habitaciones
}

const TAREAS_PREDEFINIDAS = [
  "🧺 Cambio de toallas",
  "🚿 Aseo de baño",
  "🛏️ Cambio de lencería habitación",
  "🧹 Barrido",
  "🧽 Trapeado",
  "🌸 Aromatización",
  "🗑️ Recolección de basura",
  "👜 Objetos personales de huéspedes"
];

export default function TareaModal({ isOpen, onClose, onSuccess, tarea, habitacionPreseleccionada }: TareaModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [selectedHabitacionId, setSelectedHabitacionId] = useState<string>("");
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "PENDIENTE",
    fecha_limite: "",
    asignado_a_id: ""
  });

  const handleSelectPredefinida = (nombre: string) => {
    setFormData(prev => {
      const limpio = nombre.replace(/^[\p{Emoji}\s]+/u, '').trim();
      return {
        ...prev,
        titulo: prev.titulo ? `${prev.titulo}, ${limpio}` : limpio
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, habRes] = await Promise.all([
          fetchApi("/users"),
          fetchApi("/habitaciones")
        ]);
        setEmpleados(empRes?.data || empRes || []);
        setHabitaciones(Array.isArray(habRes) ? habRes : (habRes?.data || []));
      } catch (error) {
        console.error("Error cargando empleados o habitaciones", error);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (tarea) {
        // Extraer habitación si está etiquetada en la descripción
        const habMatch = tarea.descripcion?.match(/\[hab_id:([^\]]+)\]/);
        const habIdFromDesc = habMatch ? habMatch[1] : "";

        // Limpiar el tag técnico de la descripción visual
        const cleanDesc = (tarea.descripcion || "").replace(/\[hab_id:[^\]]+\]\s*/g, "").trim();

        setFormData({
          titulo: tarea.titulo || "",
          descripcion: cleanDesc,
          estado: tarea.estado || "PENDIENTE",
          fecha_limite: tarea.fecha_limite ? new Date(tarea.fecha_limite).toISOString().split('T')[0] : "",
          asignado_a_id: tarea.asignado_a?.id?.toString() || ""
        });
        setSelectedHabitacionId(habIdFromDesc || habitacionPreseleccionada?.id || "");
      } else {
        setFormData({
          titulo: "",
          descripcion: "",
          estado: "PENDIENTE",
          fecha_limite: "",
          asignado_a_id: ""
        });
        setSelectedHabitacionId(habitacionPreseleccionada?.id || "");
      }
      setError("");
    }
  }, [isOpen, tarea, habitacionPreseleccionada]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    
    try {
      const selectedHab = habitaciones.find(h => h.id === selectedHabitacionId);
      
      // Si hay habitación asociada, prefijar el título elegantemente
      let finalTitulo = formData.titulo.trim();
      if (selectedHab) {
        const prefix = `[${selectedHab.titulo}]`;
        if (!finalTitulo.startsWith(prefix)) {
          // Remover otros prefijos si existían
          finalTitulo = `${prefix} ${finalTitulo.replace(/^\[[^\]]+\]\s*/, "")}`;
        }
      }

      // Incrustar el tag de trazabilidad en la descripción
      let finalDescripcion = formData.descripcion.trim();
      if (selectedHab) {
        finalDescripcion = `[hab_id:${selectedHab.id}] ${finalDescripcion}`;
      }

      const payload: any = {
        titulo: finalTitulo,
        descripcion: finalDescripcion,
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
        payload.creado_por_id = user?.id;
        await fetchApi("/tareas", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      // Sincronizar automáticamente el estado de limpieza de la habitación
      if (selectedHab) {
        const nuevoEstadoLimpieza = formData.estado === 'COMPLETADA' ? 'LIMPIA' : 'POR_ASEAR';
        try {
          await fetchApi(`/habitaciones/${selectedHab.id}/limpieza`, {
            method: "PATCH",
            body: JSON.stringify({ estadoLimpieza: nuevoEstadoLimpieza })
          });
        } catch (e) {
          console.warn("No se pudo sincronizar automáticamente el estado de limpieza de la habitación", e);
        }
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
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Habitación / Espacio Vinculado
            </label>
            <select
              value={selectedHabitacionId}
              onChange={(e) => setSelectedHabitacionId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all bg-white"
            >
              <option value="">-- General / Áreas Comunes --</option>
              {habitaciones.map(hab => (
                <option key={hab.id} value={hab.id}>
                  🚪 {hab.titulo} {hab.subtitulo ? `(${hab.subtitulo})` : ''} {hab.estadoLimpieza === 'POR_ASEAR' ? '🧹 [Por Asear]' : '✨ [Limpia]'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Actividades Sugeridas (Clic para agregar)</label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {TAREAS_PREDEFINIDAS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectPredefinida(item)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-[var(--mv-blue)] hover:border-blue-200 border border-slate-200 rounded-lg transition-all text-slate-700 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
            
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título de la Tarea</label>
            <input 
              type="text" 
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej. Cambio de toallas, Aseo de baño"
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
