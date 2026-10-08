"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  PhoneIcon, 
  GlobeAltIcon, 
  ShareIcon, 
  BuildingOfficeIcon, 
  KeyIcon, 
  SparklesIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon,
  FunnelIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

interface Setting {
  key: string;
  value: string;
  description: string;
  isNew?: boolean;
}

const PREDEFINED_KEYS: Record<string, { label: string; category: 'contact' | 'social' | 'general' | 'integrations'; description: string; placeholder: string; type?: string }> = {
  telefono: { label: "Teléfono Principal", category: "contact", description: "Número de teléfono para contacto directo y reservas.", placeholder: "+57 300 000 0000", type: "tel" },
  whatsapp: { label: "Número de WhatsApp", category: "contact", description: "WhatsApp oficial donde se enviarán consultas de huéspedes.", placeholder: "+57 300 000 0000", type: "tel" },
  email_contacto: { label: "Correo Electrónico de Notificaciones", category: "contact", description: "Email donde llegarán las confirmaciones y notificaciones del sistema.", placeholder: "contacto@hotelabadia.com", type: "email" },
  direccion: { label: "Dirección Física del Hotel", category: "contact", description: "Ubicación o dirección que verán los huéspedes en la web.", placeholder: "Calle Principal #12-34, Ciudad", type: "text" },
  horario_atencion: { label: "Horario de Recepción", category: "contact", description: "Horario de atención al público o de check-in.", placeholder: "Recepción 24/7 / 08:00 AM - 10:00 PM", type: "text" },

  facebook: { label: "Página de Facebook", category: "social", description: "URL de la página de Facebook del hotel.", placeholder: "https://facebook.com/hotelabadia", type: "url" },
  instagram: { label: "Perfil de Instagram", category: "social", description: "URL o usuario de Instagram.", placeholder: "https://instagram.com/hotelabadia", type: "url" },
  tiktok: { label: "Cuenta de TikTok", category: "social", description: "Enlace al perfil oficial de TikTok.", placeholder: "https://tiktok.com/@hotelabadia", type: "url" },
  tripadvisor: { label: "Perfil de TripAdvisor", category: "social", description: "Enlace a la ficha de reseñas en TripAdvisor.", placeholder: "https://tripadvisor.com/...", type: "url" },

  nombre_hotel: { label: "Nombre Oficial del Hotel / Posada", category: "general", description: "Nombre de la marca mostrado en el sitio web y facturas.", placeholder: "Hotel La Abadía", type: "text" },
  hero_title: { label: "Título Principal del Sitio Web (Hero)", category: "general", description: "Lema o título llamativo en la página principal.", placeholder: "Vive una experiencia inolvidable de descanso", type: "text" },
  hero_subtitle: { label: "Subtítulo de Bienvenida", category: "general", description: "Breve párrafo descriptivo debajo del título principal.", placeholder: "Disfruta de nuestras habitaciones rústicas y atención de primera clase.", type: "text" },
  politica_cancelacion: { label: "Políticas de Cancelación", category: "general", description: "Términos breves sobre cancelaciones y reembolsos.", placeholder: "Cancelaciones gratuitas con 48 horas de anticipación.", type: "textarea" },

  google_calendar_id: { label: "ID de Google Calendar", category: "integrations", description: "ID del calendario vinculado para sincronización de reservas.", placeholder: "primary o id@group.calendar.google.com", type: "text" },
};

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<'account' | 'contact' | 'social' | 'general' | 'integrations' | 'advanced'>('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newKeyModal, setNewKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState({ key: "", value: "", description: "" });

  // Profile form state
  const [userProfile, setUserProfile] = useState({
    username: "",
    nombre: "",
    email: "",
    telefono: ""
  });
  const [userSaving, setUserSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState("");
  const [accountError, setAccountError] = useState("");

  // Change password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await fetchApi("/users/profile");
      if (data) {
        setUserProfile({
          username: data.username || "",
          nombre: data.nombre || "",
          email: data.email || "",
          telefono: data.telefono || ""
        });
      }
    } catch (err) {
      console.error("Error cargando perfil", err);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/settings");
      const fetchedSettings: Setting[] = Array.isArray(data) ? data : (data?.data || []);
      
      const existingKeysMap = new Map(fetchedSettings.map(s => [s.key, s]));
      const fullList: Setting[] = [...fetchedSettings];

      Object.keys(PREDEFINED_KEYS).forEach(k => {
        if (!existingKeysMap.has(k)) {
          fullList.push({
            key: k,
            value: "",
            description: PREDEFINED_KEYS[k].description,
            isNew: true
          });
        }
      });

      setSettings(fullList);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error cargando configuración", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserSaving(true);
    setAccountMsg("");
    setAccountError("");
    try {
      const updatedUser = await fetchApi("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          username: userProfile.username,
          nombre: userProfile.nombre,
          email: userProfile.email,
          telefono: userProfile.telefono
        }),
      });

      if (updatedUser) {
        setUser(updatedUser);
      }
      setAccountMsg("¡Perfil y nombre de usuario actualizados con éxito!");
      setTimeout(() => setAccountMsg(""), 4000);
    } catch (err: any) {
      setAccountError(err.message || "Error al actualizar el perfil.");
    } finally {
      setUserSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMsg("");
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      setPasswordSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
      setPasswordSaving(false);
      return;
    }

    try {
      await fetchApi("/users/profile/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      setPasswordMsg("¡Contraseña actualizada exitosamente!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMsg(""), 4000);
    } catch (err: any) {
      setPasswordError(err.message || "Error al cambiar la contraseña. Verifica tu contraseña actual.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const updateSettingValue = (key: string, value: string, description?: string) => {
    setHasUnsavedChanges(true);
    setSettings(prev => {
      const index = prev.findIndex(s => s.key === key);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], value, description: description ?? updated[index].description };
        return updated;
      } else {
        return [...prev, { key, value, description: description || "", isNew: true }];
      }
    });
  };

  const handleRemoveSetting = (key: string) => {
    setHasUnsavedChanges(true);
    setSettings(prev => prev.filter(s => s.key !== key));
  };

  const handleCreateCustomKey = () => {
    if (!customKeyInput.key.trim()) return;
    const cleanKey = customKeyInput.key.trim().toLowerCase().replace(/\s+/g, '_');
    updateSettingValue(cleanKey, customKeyInput.value, customKeyInput.description);
    setCustomKeyInput({ key: "", value: "", description: "" });
    setNewKeyModal(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      const validSettings = settings.filter(s => s.key.trim() !== "");
      
      await fetchApi("/settings/batch", {
        method: "POST",
        body: JSON.stringify({
          settings: validSettings.map(s => ({
            key: s.key,
            value: s.value,
            description: s.description || PREDEFINED_KEYS[s.key]?.description || ""
          }))
        })
      });
      setSuccessMsg("Configuración del sitio guardada exitosamente");
      setHasUnsavedChanges(false);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchSettings();
    } catch (error) {
      console.error("Error guardando settings", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  const customSettings = settings.filter(s => !PREDEFINED_KEYS[s.key]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-xs border border-slate-200/70 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-xl font-extrabold text-[var(--mv-ink)] tracking-tight">Centro de Configuración</h2>
          </div>
          <p className="text-slate-500 mt-1 text-xs font-medium">Administra tu cuenta de acceso, contraseñas, datos de contacto y contenido del sitio.</p>
        </div>
        
        {activeTab !== 'account' && (
          <div className="flex items-center gap-3 shrink-0">
            {successMsg && (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                <CheckIcon className="w-4 h-4 stroke-[3]" /> {successMsg}
              </span>
            )}

            {hasUnsavedChanges && !successMsg && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Cambios sin guardar
              </span>
            )}

            <button 
              onClick={handleSaveAll}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-[var(--mv-blue)] to-[#0b3c66] hover:from-[#0b3c66] hover:to-[#082a48] text-white px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-900/10 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CheckIcon className="w-4 h-4 stroke-[2.5]" />
              )}
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 overflow-x-auto mv-scrollbar gap-1">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'account' 
              ? 'bg-white text-[var(--mv-blue)] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <UserIcon className="w-4 h-4 stroke-[2.5]" />
          Mi Cuenta y Seguridad
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'contact' 
              ? 'bg-white text-[var(--mv-blue)] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <PhoneIcon className="w-4 h-4 stroke-[2.5]" />
          Contacto y Ubicación
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'social' 
              ? 'bg-white text-[var(--mv-blue)] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <ShareIcon className="w-4 h-4 stroke-[2.5]" />
          Redes Sociales
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'general' 
              ? 'bg-white text-[var(--mv-blue)] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <BuildingOfficeIcon className="w-4 h-4 stroke-[2.5]" />
          Información del Hotel
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'integrations' 
              ? 'bg-white text-[var(--mv-blue)] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <GlobeAltIcon className="w-4 h-4 stroke-[2.5]" />
          Integraciones
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ml-auto ${
            activeTab === 'advanced' 
              ? 'bg-white text-purple-700 shadow-xs' 
              : 'text-slate-500 hover:text-purple-700 hover:bg-slate-200/50'
          }`}
        >
          <KeyIcon className="w-4 h-4 stroke-[2.5]" />
          Ajustes Avanzados ({customSettings.length})
        </button>
      </div>

      {/* Main Form Content */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/70 p-6 md:p-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full mb-3"></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cargando datos...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Category: Account & Security */}
            {activeTab === 'account' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* User Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-5 bg-slate-50/70 p-6 rounded-3xl border border-slate-200/60">
                  <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                        Perfil y Nombre de Usuario
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Modifica tu usuario de inicio de sesión y datos personales de cuenta.</p>
                    </div>

                    {accountMsg && (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                        {accountMsg}
                      </span>
                    )}
                  </div>

                  {accountError && (
                    <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200">
                      {accountError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre de Usuario (Username)
                      </label>
                      <input 
                        type="text" 
                        value={userProfile.username}
                        onChange={(e) => setUserProfile({ ...userProfile, username: e.target.value })}
                        required
                        placeholder="superadmin"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre Completo
                      </label>
                      <input 
                        type="text" 
                        value={userProfile.nombre}
                        onChange={(e) => setUserProfile({ ...userProfile, nombre: e.target.value })}
                        placeholder="Administrador General"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Correo Electrónico
                      </label>
                      <input 
                        type="email" 
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        required
                        placeholder="admin@abadia.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Teléfono
                      </label>
                      <input 
                        type="tel" 
                        value={userProfile.telefono}
                        onChange={(e) => setUserProfile({ ...userProfile, telefono: e.target.value })}
                        placeholder="+57 300 123 4567"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={userSaving}
                      className="px-6 py-2.5 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                    >
                      {userSaving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Guardar Datos de Usuario
                    </button>
                  </div>
                </form>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-5 bg-slate-50/70 p-6 rounded-3xl border border-slate-200/60">
                  <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <LockClosedIcon className="w-5 h-5 text-amber-600" />
                        Cambiar Contraseña
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Actualiza tu contraseña de acceso para garantizar la seguridad de tu cuenta.</p>
                    </div>

                    {passwordMsg && (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                        {passwordMsg}
                      </span>
                    )}
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200">
                      {passwordError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input 
                          type={showOldPass ? "text" : "password"} 
                          value={passwordForm.oldPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                          required
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showOldPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input 
                          type={showNewPass ? "text" : "password"} 
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                          minLength={6}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Confirmar Nueva Contraseña
                      </label>
                      <input 
                        type={showNewPass ? "text" : "password"} 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        placeholder="Repite la nueva contraseña"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                    >
                      {passwordSaving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Cambiar Contraseña
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Category: Contacto y Ubicación */}
            {activeTab === 'contact' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Contacto y Datos de Recepción</h3>
                  <p className="text-xs text-slate-500 font-medium">Estos datos se utilizarán en la información pública del hotel y notificaciones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(PREDEFINED_KEYS)
                    .filter(k => PREDEFINED_KEYS[k].category === 'contact')
                    .map(key => {
                      const meta = PREDEFINED_KEYS[key];
                      const setting = settings.find(s => s.key === key);
                      const value = setting?.value || "";

                      return (
                        <div key={key} className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <label className="block text-xs font-bold text-slate-800">
                            {meta.label}
                          </label>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">{meta.description}</p>
                          <input
                            type={meta.type || "text"}
                            value={value}
                            onChange={(e) => updateSettingValue(key, e.target.value)}
                            placeholder={meta.placeholder}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none transition-all"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Category: Redes Sociales */}
            {activeTab === 'social' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Redes Sociales y Enlaces Públicos</h3>
                  <p className="text-xs text-slate-500 font-medium">Conecta los perfiles oficiales para mostrarlos en el pie de página y menú del sitio web.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(PREDEFINED_KEYS)
                    .filter(k => PREDEFINED_KEYS[k].category === 'social')
                    .map(key => {
                      const meta = PREDEFINED_KEYS[key];
                      const setting = settings.find(s => s.key === key);
                      const value = setting?.value || "";

                      return (
                        <div key={key} className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ShareIcon className="w-3.5 h-3.5 text-blue-600" />
                            {meta.label}
                          </label>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">{meta.description}</p>
                          <input
                            type="url"
                            value={value}
                            onChange={(e) => updateSettingValue(key, e.target.value)}
                            placeholder={meta.placeholder}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none transition-all"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Category: Información del Hotel */}
            {activeTab === 'general' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Identidad del Hotel y Textos Web</h3>
                  <p className="text-xs text-slate-500 font-medium">Personaliza el título de la página, mensajes principales de bienvenida y políticas.</p>
                </div>

                <div className="space-y-5">
                  {Object.keys(PREDEFINED_KEYS)
                    .filter(k => PREDEFINED_KEYS[k].category === 'general')
                    .map(key => {
                      const meta = PREDEFINED_KEYS[key];
                      const setting = settings.find(s => s.key === key);
                      const value = setting?.value || "";

                      return (
                        <div key={key} className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <label className="block text-xs font-bold text-slate-800">
                            {meta.label}
                          </label>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">{meta.description}</p>

                          {meta.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              value={value}
                              onChange={(e) => updateSettingValue(key, e.target.value)}
                              placeholder={meta.placeholder}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none transition-all"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateSettingValue(key, e.target.value)}
                              placeholder={meta.placeholder}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none transition-all"
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Category: Integraciones */}
            {activeTab === 'integrations' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Integraciones de Servicios Externos</h3>
                  <p className="text-xs text-slate-500 font-medium">Configura enlaces de sincronización de calendarios e identificadores externos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(PREDEFINED_KEYS)
                    .filter(k => PREDEFINED_KEYS[k].category === 'integrations')
                    .map(key => {
                      const meta = PREDEFINED_KEYS[key];
                      const setting = settings.find(s => s.key === key);
                      const value = setting?.value || "";

                      return (
                        <div key={key} className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <label className="block text-xs font-bold text-slate-800">
                            {meta.label}
                          </label>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">{meta.description}</p>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateSettingValue(key, e.target.value)}
                            placeholder={meta.placeholder}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] outline-none transition-all"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Category: Ajustes Avanzados */}
            {activeTab === 'advanced' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-purple-950 flex items-center gap-1.5">
                      <KeyIcon className="w-4 h-4 text-purple-600" />
                      Gestor Avanzado de Claves (Key-Value)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Utiliza esta sección únicamente para agregar o inspeccionar variables técnicas personalizadas.</p>
                  </div>
                  <button 
                    onClick={() => setNewKeyModal(true)}
                    className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-purple-200 shrink-0"
                  >
                    <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                    Nueva Variable Personalizada
                  </button>
                </div>

                {customSettings.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 border border-slate-200/60">
                    <InformationCircleIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No hay variables personalizadas adicionales.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Todas las configuraciones principales están organizadas en sus pestañas temáticas.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    {customSettings.map((s) => (
                      <div key={s.key} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              {s.key}
                            </span>
                            {s.isNew && (
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Nuevo</span>
                            )}
                          </div>
                          {s.description && (
                            <p className="text-[11px] text-slate-400 mt-1 truncate">{s.description}</p>
                          )}
                        </div>

                        <div className="w-full md:w-1/2 flex items-center gap-3">
                          <input 
                            type="text" 
                            value={s.value}
                            onChange={(e) => updateSettingValue(s.key, e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleRemoveSetting(s.key)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Eliminar variable</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Seguridad & Privacidad:</strong> Las contraseñas se almacenan encriptadas con algoritmos de hashing seguro (Bcrypt). El token de sesión expira automáticamente para proteger el acceso.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding custom variable */}
      {newKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setNewKeyModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full p-1.5 transition-all"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Nueva Variable Personalizada</h3>
            <p className="text-xs text-slate-400 mb-4">Crea una clave técnica personalizada para contenido o integraciones.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clave / Identificador (Key)</label>
                <input 
                  type="text" 
                  placeholder="Ej. codigo_promocional"
                  value={customKeyInput.key}
                  onChange={(e) => setCustomKeyInput({ ...customKeyInput, key: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valor</label>
                <input 
                  type="text" 
                  placeholder="Valor asignado..."
                  value={customKeyInput.value}
                  onChange={(e) => setCustomKeyInput({ ...customKeyInput, value: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Para qué sirve esta clave..."
                  value={customKeyInput.description}
                  onChange={(e) => setCustomKeyInput({ ...customKeyInput, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setNewKeyModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateCustomKey}
                disabled={!customKeyInput.key.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 rounded-xl transition-all shadow-sm"
              >
                Crear Variable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
