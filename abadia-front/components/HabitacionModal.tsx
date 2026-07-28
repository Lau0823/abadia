"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface HabitacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  habitacion?: any | null; // Si se pasa, es modo edición
}

const AVAILABLE_AMENITIES = [
  "❄️ Nevera pequeña",
  "🚿 Baño privado",
  "📺 Smart TV",
  "📶 Internet WiFi",
  "☕ Cafetera",
  "🔥 Chimenea",
  "🧊 Minibar",
  "🌬️ Aire Acondicionado"
];

export default function HabitacionModal({ isOpen, onClose, onSuccess, habitacion }: HabitacionModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    precio: 0,
    capacidadAdultos: 2,
    capacidadNinos: 0,
    descripcion: "",
    estado: "DISPONIBLE"
  });
  const [comodidades, setComodidades] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (habitacion) {
        let capAd = 2;
        let capNi = 0;
        if (habitacion.ocupacion) {
          const matchAd = habitacion.ocupacion.match(/(\d+)\s+Adultos?/i);
          if (matchAd) capAd = parseInt(matchAd[1], 10);
          const matchNi = habitacion.ocupacion.match(/(\d+)\s+Niñ[oa]s?/i);
          if (matchNi) capNi = parseInt(matchNi[1], 10);
        }

        setFormData({
          titulo: habitacion.titulo || "",
          subtitulo: habitacion.subtitulo || "",
          precio: habitacion.precio || 0,
          capacidadAdultos: capAd,
          capacidadNinos: capNi,
          descripcion: habitacion.descripcion || "",
          estado: habitacion.estado || "DISPONIBLE"
        });
        setPreviews(habitacion.imagenes || []);
        setComodidades(habitacion.comodidades || []);
      } else {
        setFormData({
          titulo: "",
          subtitulo: "",
          precio: 0,
          capacidadAdultos: 2,
          capacidadNinos: 0,
          descripcion: "",
          estado: "DISPONIBLE"
        });
        setPreviews([]);
        setComodidades([]);
      }
      setSelectedFiles([]);
      setError("");
    }
  }, [isOpen, habitacion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleComodidadToggle = (comodidad: string) => {
    setComodidades(prev => 
      prev.includes(comodidad) 
        ? prev.filter(c => c !== comodidad) 
        : [...prev, comodidad]
    );
  };

  const processFiles = (files: File[]) => {
    const combined = [...selectedFiles, ...files].slice(0, 10); // Límite de 10 imágenes y suma a las existentes
    setSelectedFiles(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    
    try {
      const ocupacionStr = `Máx. ${formData.capacidadAdultos} Adultos${formData.capacidadNinos > 0 ? ` + ${formData.capacidadNinos} Niño${formData.capacidadNinos > 1 ? 's' : ''}` : ''}`;

      const payload = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo,
        precio: Number(formData.precio),
        descripcion: formData.descripcion,
        comodidades,
        estado: formData.estado,
        ocupacion: ocupacionStr
      };

      let roomId = "";
      if (habitacion && habitacion.id) {
        // Edit
        roomId = habitacion.id;
        await fetchApi(`/habitaciones/${roomId}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
      } else {
        // Create
        const created = await fetchApi("/habitaciones", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        roomId = created.id;
      }

      // Upload images if selected
      if (selectedFiles.length > 0 && roomId) {
        const formDataUpload = new FormData();
        selectedFiles.forEach(file => {
          formDataUpload.append("files", file);
        });
        
        const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/habitaciones/${roomId}/imagenes`;
        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          credentials: "include",
          body: formDataUpload
        });
        
        if (!uploadRes.ok) {
          throw new Error("Habitación guardada, pero hubo un error al subir las imágenes.");
        }
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
        <h3 className="text-xl font-bold text-(--mv-ink) mb-4 border-b pb-2">
          {isEditing ? "Editar Habitación" : "Nueva Habitación"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="group relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Imágenes de la Habitación
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] cursor-help" title="Puedes arrastrar hasta 10 imágenes. Éstas reemplazarán a las actuales.">?</span>
            </label>
            
            <div 
              onClick={handleDragAreaClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                isDragging ? 'border-(--mv-blue) bg-(--mv-blue)/5' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <div className="space-y-1 text-center pointer-events-none">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center gap-1 mt-2">
                  <span className="font-medium text-(--mv-blue) hover:text-[#0b3c66]">Sube archivos</span>
                  <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                  <p>o arrastra y suelta aquí</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB c/u</p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título (Ej. Habitación 1)</label>
            <input 
              type="text" 
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all"
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
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descripción</label>
            <textarea 
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Comodidades</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={comodidades.includes(amenity)}
                    onChange={() => handleComodidadToggle(amenity)}
                    className="rounded text-(--mv-blue) focus:ring-(--mv-blue)"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
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
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Capacidad Adultos</label>
              <input 
                type="number" 
                name="capacidadAdultos"
                value={formData.capacidadAdultos}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Capacidad Niños</label>
              <input 
                type="number" 
                name="capacidadNinos"
                value={formData.capacidadNinos}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado Operativo</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-(--mv-blue) outline-none transition-all"
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
              className="px-5 py-2.5 bg-(--mv-blue) hover:bg-[#0b3c66] text-white rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2"
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
