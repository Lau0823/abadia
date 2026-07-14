"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

interface Setting {
  key: string;
  value: string;
  description: string;
  isNew?: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/settings");
      setSettings(data);
    } catch (error) {
      console.error("Error cargando configuración", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAddSetting = () => {
    setSettings([{ key: "", value: "", description: "", isNew: true }, ...settings]);
  };

  const handleChange = (index: number, field: keyof Setting, value: string) => {
    const newSettings = [...settings];
    newSettings[index][field] = value as never;
    setSettings(newSettings);
  };

  const handleRemoveSetting = (index: number) => {
    const newSettings = [...settings];
    newSettings.splice(index, 1);
    setSettings(newSettings);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      // Filtrar los que no tienen key
      const validSettings = settings.filter(s => s.key.trim() !== "");
      
      await fetchApi("/settings/batch", {
        method: "POST",
        body: JSON.stringify({
          settings: validSettings.map(s => ({
            key: s.key,
            value: s.value,
            description: s.description
          }))
        })
      });
      setSuccessMsg("Configuración guardada exitosamente");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchSettings(); // Recargar para quitar el flag isNew
    } catch (error) {
      console.error("Error guardando settings", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Configuración del Sistema</h2>
          <p className="text-gray-500 mt-1 text-sm">Administra las variables globales y credenciales (Ej. Google Calendar).</p>
        </div>
        
        <div className="flex items-center gap-4">
          {successMsg && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <CheckIcon className="w-4 h-4" /> {successMsg}
            </span>
          )}
          <button 
            onClick={handleAddSetting}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            Añadir Variable
          </button>
          <button 
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CheckIcon className="w-5 h-5" />
            )}
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden p-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {settings.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay configuraciones registradas. Añade tu primera variable.
              </div>
            ) : (
              settings.map((setting, index) => (
                <div key={index} className={`flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-2xl border ${setting.isNew ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-gray-50/50'} transition-all`}>
                  
                  <div className="w-full md:w-1/4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Clave (Key)</label>
                    <input 
                      type="text" 
                      value={setting.key}
                      onChange={(e) => handleChange(index, 'key', e.target.value)}
                      disabled={!setting.isNew && setting.key === 'google_access_token' || setting.key === 'google_refresh_token'}
                      placeholder="Ej. TAX_RATE"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--mv-blue)] outline-none disabled:bg-gray-100 disabled:text-gray-500 font-mono"
                    />
                  </div>

                  <div className="w-full md:w-2/4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor</label>
                    <input 
                      type="text" 
                      value={setting.value}
                      onChange={(e) => handleChange(index, 'value', e.target.value)}
                      placeholder="Ej. 19"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                    />
                  </div>

                  <div className="w-full md:w-1/4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Descripción (Opcional)</label>
                    <input 
                      type="text" 
                      value={setting.description || ""}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      placeholder="Para qué sirve..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--mv-blue)] outline-none"
                    />
                  </div>

                  <div className="md:mt-5">
                     <button 
                       onClick={() => handleRemoveSetting(index)}
                       className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                       title="Eliminar esta variable de la vista"
                     >
                       <TrashIcon className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))
            )}
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800">
              <strong>Nota:</strong> Al presionar "Guardar Cambios", se actualizarán todas las variables listadas arriba. Las variables del sistema como `google_access_token` no deben editarse manualmente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
