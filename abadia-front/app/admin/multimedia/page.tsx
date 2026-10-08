"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSettingsStore } from "@/store/settingsStore";
import { 
  PhotoIcon, 
  FilmIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";

export default function MultimediaPage() {
  const { fetchSettings, getSetting, updateSetting, uploadFile, isLoading } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'global' | 'home' | 'guide' | 'planes' | 'turismo'>('global');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [localTexts, setLocalTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveText = async (key: string, value: string) => {
    setSavingKey(key);
    await updateSetting(key, value);
    setSavingKey(null);
    setSuccessKey(key);
    setTimeout(() => setSuccessKey(null), 2000);
  };

  const handleTextChange = (key: string, value: string) => {
    setLocalTexts(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSavingKey(key);
    try {
      const url = await uploadFile(file);
      if (url) {
        await updateSetting(key, url);
        setSuccessKey(key);
        setTimeout(() => setSuccessKey(null), 2000);
      }
    } catch (error) {
      console.error("Error al subir archivo", error);
    }
    setSavingKey(null);
  };

  const triggerFileInput = (key: string) => {
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key]?.click();
    }
  };

  const renderMediaUploader = (key: string, title: string, description: string, type: 'image' | 'video') => {
    const currentValue = getSetting(key, '');
    const isSaving = savingKey === key;
    const isSuccess = successKey === key;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
        <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
          {currentValue ? (
            type === 'video' ? (
              <video src={currentValue} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            ) : (
              <Image src={currentValue} alt={title} fill className="object-cover" unoptimized />
            )
          ) : (
            <div className="text-slate-400 flex flex-col items-center">
              {type === 'video' ? <FilmIcon className="w-10 h-10 mb-2 opacity-50" /> : <PhotoIcon className="w-10 h-10 mb-2 opacity-50" />}
              <span className="text-xs font-medium uppercase tracking-wider">Sin {type === 'video' ? 'Video' : 'Imagen'}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={() => triggerFileInput(key)}
              disabled={isSaving}
              className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              {isSaving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CloudArrowUpIcon className="w-4 h-4" />}
              {isSaving ? 'Subiendo...' : 'Reemplazar'}
            </button>
          </div>
          
          {isSuccess && (
            <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-tight">{description}</p>
          <input 
            type="file" 
            accept={type === 'video' ? 'video/*' : 'image/*'} 
            className="hidden" 
            ref={el => { fileInputRefs.current[key] = el; }}
            onChange={(e) => handleFileUpload(e, key)}
          />
        </div>
      </div>
    );
  };

  const renderExtendedCard = (
    index: number, 
    imgKey: string, 
    blockTitle: string,
    fields: { key: string, label: string, type: 'text' | 'textarea' }[]
  ) => {
    return (
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 shrink-0">
          {renderMediaUploader(imgKey, `Imagen ${index}`, `Imagen ilustrativa para: ${blockTitle}`, 'image')}
        </div>
        <div className="flex-1 space-y-4 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
              {index}
            </span>
            <h3 className="text-lg font-extrabold text-slate-800">{blockTitle}</h3>
          </div>
          
          {fields.map((field) => {
            const currentVal = localTexts[field.key] ?? getSetting(field.key, '');
            return (
              <div key={field.key} className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                <div className="flex gap-2">
                  {field.type === 'textarea' ? (
                    <textarea 
                      value={currentVal}
                      onChange={(e) => handleTextChange(field.key, e.target.value)}
                      rows={3}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 outline-none transition-all resize-none"
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={currentVal}
                      onChange={(e) => handleTextChange(field.key, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-[var(--mv-blue)]/30 outline-none transition-all"
                    />
                  )}
                  <button 
                    onClick={() => handleSaveText(field.key, currentVal)}
                    disabled={savingKey === field.key}
                    className="bg-slate-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center min-w-[90px]"
                  >
                    {savingKey === field.key ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : (successKey === field.key ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : 'Guardar')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading && Object.keys(localTexts).length === 0) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando gestor multimedia...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <PhotoIcon className="w-8 h-8 text-[var(--mv-blue)]" />
          Mi Página Web (Fotos y Textos)
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium max-w-2xl">
          Aquí puedes personalizar toda la información, imágenes y videos que verán tus visitantes. Simplemente haz clic sobre lo que quieras modificar y se actualizará en tu sitio.
        </p>
      </div>

      {/* CUSTOM TABS */}
      <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit mb-8 flex-wrap">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'global' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Archivos Globales
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'home' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Inicio (Casa)
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'guide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Conoce Abadía
        </button>
        <button
          onClick={() => setActiveTab('planes')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'planes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Planes / Experiencias
        </button>
        <button
          onClick={() => setActiveTab('turismo')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'turismo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Lugares de Interés
        </button>
      </div>

      {/* CONTENT: GLOBAL */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderMediaUploader('logo_principal', 'Logo Principal', 'Utilizado en la barra superior (navbar) de la web pública.', 'image')}
          {renderMediaUploader('logo_secundario', 'Logo Admin / Oscuro', 'Utilizado en la barra lateral del panel administrativo.', 'image')}
          {renderMediaUploader('hero_video', 'Video Fondo (Home)', 'Video ambiental que se reproduce automáticamente al inicio.', 'video')}
          {renderMediaUploader('login_bg', 'Fondo de Login', 'Imagen de fondo de pantalla para los administradores al entrar.', 'image')}
        </div>
      )}

      {/* CONTENT: HOME */}
      {activeTab === 'home' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-bold text-blue-900">Fotos de "Conoce la Casa Hotel"</h3>
            <p className="text-xs text-blue-700 mt-1">Sube aquí las 3 fotos principales que se muestran juntas justo debajo de las habitaciones en tu página de inicio.</p>
          </div>
          {renderExtendedCard(1, 'home_casa_1_img', 'Espacio Casa 1', [{key: 'home_casa_1_title', label: 'Título', type: 'text'}])}
          {renderExtendedCard(2, 'home_casa_2_img', 'Espacio Casa 2', [{key: 'home_casa_2_title', label: 'Título', type: 'text'}])}
          {renderExtendedCard(3, 'home_casa_3_img', 'Espacio Casa 3', [{key: 'home_casa_3_title', label: 'Título', type: 'text'}])}
        </div>
      )}

      {/* CONTENT: GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-bold text-amber-900">Fotos para "Conoce Abadía" (Guía Turística)</h3>
            <p className="text-xs text-amber-700 mt-1">Aquí puedes cambiar las imágenes gigantes que adornan la sección donde cuentas la historia, la gastronomía y el bienestar de Abadía.</p>
          </div>
          {renderExtendedCard(1, 'guide_sec_1_img', 'Bloque Historia', [
            {key: 'guide_sec_1_title', label: 'Título', type: 'text'},
            {key: 'guide_sec_1_desc', label: 'Descripción Larga', type: 'textarea'}
          ])}
          {renderExtendedCard(2, 'guide_sec_2_img', 'Bloque Gastronomía', [
            {key: 'guide_sec_2_title', label: 'Título', type: 'text'},
            {key: 'guide_sec_2_desc', label: 'Descripción Larga', type: 'textarea'}
          ])}
          {renderExtendedCard(3, 'guide_sec_3_img', 'Bloque Bienestar', [
            {key: 'guide_sec_3_title', label: 'Título', type: 'text'},
            {key: 'guide_sec_3_desc', label: 'Descripción Larga', type: 'textarea'}
          ])}
        </div>
      )}

      {/* CONTENT: PLANES */}
      {activeTab === 'planes' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-bold text-emerald-900">Tus Planes y Experiencias</h3>
            <p className="text-xs text-emerald-700 mt-1">Configura las fotos, títulos y precios de los pasadías, planes románticos o paquetes especiales que quieres destacar.</p>
          </div>
          {renderExtendedCard(1, 'plan_1_img', 'Plan Principal (Romántica)', [
            {key: 'plan_1_title', label: 'Título', type: 'text'},
            {key: 'plan_1_subtitle', label: 'Subtítulo Corto', type: 'text'},
            {key: 'plan_1_tag', label: 'Etiqueta Visual', type: 'text'},
            {key: 'plan_1_price', label: 'Precio', type: 'text'},
            {key: 'plan_1_desc', label: 'Descripción Detallada', type: 'textarea'}
          ])}
          {renderExtendedCard(2, 'plan_2_img', 'Plan Secundario (Madre)', [
            {key: 'plan_2_title', label: 'Título', type: 'text'},
            {key: 'plan_2_subtitle', label: 'Subtítulo Corto', type: 'text'},
            {key: 'plan_2_tag', label: 'Etiqueta Visual', type: 'text'},
            {key: 'plan_2_price', label: 'Precio', type: 'text'},
            {key: 'plan_2_desc', label: 'Descripción Detallada', type: 'textarea'}
          ])}
          {renderExtendedCard(3, 'plan_3_img', 'Plan Alternativo (Finde)', [
            {key: 'plan_3_title', label: 'Título', type: 'text'},
            {key: 'plan_3_subtitle', label: 'Subtítulo Corto', type: 'text'},
            {key: 'plan_3_tag', label: 'Etiqueta Visual', type: 'text'},
            {key: 'plan_3_price', label: 'Precio', type: 'text'},
            {key: 'plan_3_desc', label: 'Descripción Detallada', type: 'textarea'}
          ])}
        </div>
      )}

      {/* CONTENT: TURISMO */}
      {activeTab === 'turismo' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-900">Lugares de Interés (Turismo Local)</h3>
            <p className="text-xs text-purple-700 mt-1">Recomiéndale a tus clientes los mejores lugares turísticos cercanos. Esta información aparecerá al final de tu página de inicio.</p>
          </div>
          {renderExtendedCard(1, 'turismo_1_img', 'Lugar Turístico 1', [
            {key: 'turismo_1_lugar', label: 'Municipio / Sector', type: 'text'},
            {key: 'turismo_1_title', label: 'Nombre del Lugar', type: 'text'},
            {key: 'turismo_1_price', label: 'Costo (Desde)', type: 'text'}
          ])}
          {renderExtendedCard(2, 'turismo_2_img', 'Lugar Turístico 2', [
            {key: 'turismo_2_lugar', label: 'Municipio / Sector', type: 'text'},
            {key: 'turismo_2_title', label: 'Nombre del Lugar', type: 'text'},
            {key: 'turismo_2_price', label: 'Costo (Desde)', type: 'text'}
          ])}
          {renderExtendedCard(3, 'turismo_3_img', 'Lugar Turístico 3', [
            {key: 'turismo_3_lugar', label: 'Municipio / Sector', type: 'text'},
            {key: 'turismo_3_title', label: 'Nombre del Lugar', type: 'text'},
            {key: 'turismo_3_price', label: 'Costo (Desde)', type: 'text'}
          ])}
        </div>
      )}

    </div>
  );
}
