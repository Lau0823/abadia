"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empleado?: any | null; // Si se pasa, es modo edición
}

export default function EmpleadoModal({ isOpen, onClose, onSuccess, empleado }: EmpleadoModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    telefono: "",
    password: "", // Only required on creation
    rol: "employee" // Default role
  });

  useEffect(() => {
    if (isOpen) {
      if (empleado) {
        setFormData({
          nombre: empleado.nombre || "",
          username: empleado.username || "",
          email: empleado.email || "",
          telefono: empleado.telefono || "",
          password: "", // Leave blank for edit, not sent unless we want to change
          rol: empleado.rol || "employee"
        });
      } else {
        setFormData({
          nombre: "",
          username: "",
          email: "",
          telefono: "",
          password: "",
          rol: "employee"
        });
      }
      setError("");
    }
  }, [isOpen, empleado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    
    try {
      if (empleado && empleado.id) {
        // Edit
        const body: any = {
            nombre: formData.nombre,
            username: formData.username,
            email: formData.email,
            telefono: formData.telefono,
            rol: formData.rol
        };
        if (formData.password) {
            body.password = formData.password;
        }

        await fetchApi(`/users/${empleado.id}`, {
          method: "PATCH",
          body: JSON.stringify(body)
        });
      } else {
        // Create
        if (!formData.password) {
            throw new Error("La contraseña es requerida para un nuevo empleado.");
        }
        await fetchApi("/users", {
          method: "POST",
          body: JSON.stringify(formData)
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar el empleado");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!empleado;

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
          {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre Completo</label>
            <input 
              type="text" 
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Ej. Juan Pérez"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre de Usuario</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={4}
                placeholder="Ej. jperez"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Contraseña</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                minLength={6}
                placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Correo Electrónico (Opcional)</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Teléfono (Opcional)</label>
              <input 
                type="tel" 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej. 3001234567"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rol</label>
            <select 
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--mv-blue)] outline-none transition-all"
            >
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
              <option value="superadmin">Super Administrador</option>
              <option value="supervisor">Supervisor</option>
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
              {isEditing ? "Guardar Cambios" : "Crear Empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
