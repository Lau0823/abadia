"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSettingsStore } from "@/store/settingsStore";
import AdminDialog, { dialogError } from "@/components/AdminDialog";
import {
  PhotoIcon,
  FilmIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  GlobeAltIcon,
  HomeIcon,
  BookOpenIcon,
  SparklesIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

type MultimediaTab = "global" | "home" | "guide" | "planes" | "turismo";

export default function MultimediaPage() {
  const { fetchSettings, getSetting, updateSetting, uploadFile, isLoading } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<MultimediaTab>("global");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
    setLocalTexts((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadError(null);
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
      setUploadError(
        dialogError(
          error,
          "No se pudo subir el archivo. Verifica que pese menos de 30 MB e inténtalo de nuevo."
        )
      );
    } finally {
      e.target.value = "";
      setSavingKey(null);
    }
  };

  const triggerFileInput = (key: string) => {
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key]?.click();
    }
  };

  const tabs: { id: MultimediaTab; label: string; icon: React.ComponentType<any> }[] = [
    { id: "global", label: "Archivos Globales", icon: GlobeAltIcon },
    { id: "home", label: "Inicio (Casa)", icon: HomeIcon },
    { id: "guide", label: "Conoce Abadía", icon: BookOpenIcon },
    { id: "planes", label: "Planes / Experiencias", icon: SparklesIcon },
    { id: "turismo", label: "Lugares de Interés", icon: MapPinIcon },
  ];

  const renderMediaUploader = (
    key: string,
    title: string,
    description: string,
    type: "image" | "video"
  ) => {
    const currentValue = getSetting(key, "");
    const isSaving = savingKey === key;
    const isSuccess = successKey === key;

    return (
      <div className="bg-white rounded-[26px] shadow-sm border border-[#A5C5E2]/50 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
        <div>
          <div className="relative aspect-video bg-gradient-to-br from-[#1A2458] to-[#473C8F] flex items-center justify-center overflow-hidden">
            {currentValue ? (
              type === "video" ? (
                <video
                  src={currentValue}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={currentValue}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              )
            ) : (
              <div className="text-[#A5C5E2] flex flex-col items-center">
                {type === "video" ? (
                  <FilmIcon className="w-10 h-10 mb-2 opacity-80" />
                ) : (
                  <PhotoIcon className="w-10 h-10 mb-2 opacity-80" />
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Sin {type === "video" ? "Video" : "Imagen"}
                </span>
              </div>
            )}

            {/* Badge de formato superior izquierdo */}
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A2458]/85 text-[#A5C5E2] backdrop-blur-md">
              {type === "video" ? "Video MP4/MOV" : "Imagen"}
            </span>

            {/* Confirmación visual */}
            {isSuccess && (
              <div className="absolute top-3 right-3 bg-[#1A2458] text-[#A5C5E2] px-3 py-1 rounded-full shadow-lg flex items-center gap-1 text-[10px] font-bold">
                <CheckCircleIcon className="w-4 h-4" />
                Actualizado
              </div>
            )}
          </div>

          <div className="p-5">
            <h4 className="text-sm font-bold text-[#1A2458]">{title}</h4>
            <p className="text-xs text-[#4F67B5] mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={() => triggerFileInput(key)}
            disabled={isSaving}
            className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold bg-[#F4F6FB] hover:bg-[#1A2458] text-[#1A2458] hover:text-white border border-[#A5C5E2]/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <CloudArrowUpIcon className="w-4 h-4 stroke-[2]" />
            )}
            {isSaving
              ? "Subiendo archivo..."
              : currentValue
              ? "Reemplazar archivo"
              : `Subir ${type === "video" ? "video" : "imagen"}`}
          </button>

          <input
            type="file"
            accept={type === "video" ? "video/*" : "image/*"}
            className="hidden"
            ref={(el) => {
              fileInputRefs.current[key] = el;
            }}
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
    fields: { key: string; label: string; type: "text" | "textarea" }[]
  ) => {
    return (
      <div className="bg-white rounded-[30px] shadow-sm border border-[#A5C5E2]/50 p-6 md:p-7 flex flex-col lg:flex-row gap-7">
        <div className="w-full lg:w-1/3 shrink-0">
          {renderMediaUploader(
            imgKey,
            `Imagen ${index}`,
            `Imagen ilustrativa para: ${blockTitle}`,
            "image"
          )}
        </div>

        <div className="flex-1 space-y-4 flex flex-col justify-center">
          <div className="flex items-center gap-3 pb-3 border-b border-[#A5C5E2]/30">
            <span className="w-9 h-9 rounded-2xl bg-[#1A2458] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              0{index}
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#1A2458]">{blockTitle}</h3>
              <p className="text-[11px] font-medium text-[#4F67B5]">
                Edita los textos visibles en la web pública y guarda cada cambio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {fields.map((field) => {
              const savedVal = getSetting(field.key, "");
              const currentVal = localTexts[field.key] ?? savedVal;
              const isDirty =
                localTexts[field.key] !== undefined && localTexts[field.key] !== savedVal;

              return (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-[#4F67B5] uppercase tracking-wider">
                      {field.label}
                    </label>
                    {isDirty && (
                      <span className="text-[10px] font-bold text-[#473C8F]">
                        ● Sin guardar
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {field.type === "textarea" ? (
                      <textarea
                        value={currentVal}
                        onChange={(e) => handleTextChange(field.key, e.target.value)}
                        rows={3}
                        className="flex-1 bg-[#F4F6FB] border border-[#A5C5E2]/50 rounded-2xl px-4 py-2.5 text-sm text-[#1A2458] font-medium focus:bg-white focus:ring-2 focus:ring-[#473C8F]/30 outline-none transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleTextChange(field.key, e.target.value)}
                        className="flex-1 bg-[#F4F6FB] border border-[#A5C5E2]/50 rounded-2xl px-4 py-2.5 text-sm text-[#1A2458] font-medium focus:bg-white focus:ring-2 focus:ring-[#473C8F]/30 outline-none transition-all"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveText(field.key, currentVal)}
                      disabled={savingKey === field.key}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center min-w-[100px] shrink-0 cursor-pointer ${
                        successKey === field.key
                          ? "bg-[#473C8F] text-white"
                          : isDirty
                          ? "bg-[#1A2458] hover:bg-[#473C8F] text-white shadow-sm"
                          : "bg-[#A5C5E2]/40 hover:bg-[#1A2458] text-[#1A2458] hover:text-white"
                      }`}
                    >
                      {savingKey === field.key ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      ) : successKey === field.key ? (
                        <span className="flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4 text-[#A5C5E2]" />
                          Listo
                        </span>
                      ) : (
                        "Guardar"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && Object.keys(localTexts).length === 0) {
    return (
      <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] rounded-[32px] p-12 flex flex-col items-center justify-center gap-3 text-[#4F67B5]">
        <div className="w-9 h-9 border-2 border-[#1A2458] border-t-[#A5C5E2] rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">
          Cargando gestor multimedia...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#F4F6FB] text-[#1A2458] rounded-[32px] p-5 md:p-8 pb-24 antialiased">
      {/* HEADER EN ÍNDIGO PROFUNDO (#1A2458) */}
      <div className="bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] text-white rounded-[30px] p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-[#473C8F]/35 pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#A5C5E2] mb-2.5">
            <PhotoIcon className="w-3.5 h-3.5" />
            CMS & Contenido Web
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Mi Página Web (Fotos y Textos)
          </h1>
          <p className="text-xs md:text-sm text-[#A5C5E2]/90 mt-1.5 max-w-2xl">
            Personaliza todas las imágenes, videos y textos que verán tus huéspedes en la web pública. Cada cambio se sincroniza de inmediato.
          </p>
        </div>

        {/* TABS INTEGRADOS EN EL HEADER */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/15 relative z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#A5C5E2] text-[#1A2458] shadow-sm"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT: GLOBAL */}
      {activeTab === "global" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {renderMediaUploader(
            "logo_principal",
            "Logo Principal",
            "Utilizado en la barra superior (navbar) de la web pública.",
            "image"
          )}
          {renderMediaUploader(
            "logo_secundario",
            "Logo Admin / Oscuro",
            "Utilizado en la barra lateral del panel administrativo.",
            "image"
          )}
          {renderMediaUploader(
            "hero_video",
            "Video Fondo (Home)",
            "Video ambiental que se reproduce automáticamente al inicio.",
            "video"
          )}
          {renderMediaUploader(
            "login_bg",
            "Fondo de Login",
            "Imagen de fondo de pantalla para los administradores al entrar.",
            "image"
          )}
        </div>
      )}

      {/* CONTENT: HOME */}
      {activeTab === "home" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#534FA6] text-white rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-sm font-bold">Videos del Inicio (Página Principal)</h3>
              <p className="text-xs text-white/85 mt-0.5">
                Configura el banner principal, la sección 1 y el video intermedio. Se admiten formatos MP4 o MOV.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#A5C5E2] text-[#1A2458] text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
              3 Espacios de Video
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderMediaUploader(
              "hero_video_1",
              "Banner Principal",
              "Primer video que se reproduce a pantalla completa en el banner de inicio.",
              "video"
            )}
            {renderMediaUploader(
              "hero_video_2",
              "Sección 1 (Segundo Video)",
              "Segundo video disponible en el banner superior.",
              "video"
            )}
            {renderMediaUploader(
              "video_mid",
              "Sección 2 (Video Intermedio)",
              "Video que adorna la sección intermedia entre las habitaciones.",
              "video"
            )}
          </div>
        </div>
      )}

      {/* CONTENT: GUIDE */}
      {activeTab === "guide" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#473C8F] text-white rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-sm font-bold">
                Fotos y Relatos para &ldquo;Conoce Abadía&rdquo;
              </h3>
              <p className="text-xs text-white/85 mt-0.5">
                Personaliza las imágenes y textos de historia, gastronomía y bienestar del hotel.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#A5C5E2] text-[#1A2458] text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
              Guía del Hotel
            </span>
          </div>

          {renderExtendedCard(1, "guide_sec_1_img", "Bloque Historia", [
            { key: "guide_sec_1_title", label: "Título", type: "text" },
            { key: "guide_sec_1_desc", label: "Descripción Larga", type: "textarea" },
          ])}
          {renderExtendedCard(2, "guide_sec_2_img", "Bloque Gastronomía", [
            { key: "guide_sec_2_title", label: "Título", type: "text" },
            { key: "guide_sec_2_desc", label: "Descripción Larga", type: "textarea" },
          ])}
          {renderExtendedCard(3, "guide_sec_3_img", "Bloque Bienestar", [
            { key: "guide_sec_3_title", label: "Título", type: "text" },
            { key: "guide_sec_3_desc", label: "Descripción Larga", type: "textarea" },
          ])}
        </div>
      )}

      {/* CONTENT: PLANES */}
      {activeTab === "planes" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1A2458] text-white rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-sm font-bold">Tus Planes y Experiencias Especiales</h3>
              <p className="text-xs text-[#A5C5E2] mt-0.5">
                Configura las fotografías, etiquetas, tarifas y descripciones de cada paquete destacado.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#A5C5E2] text-[#1A2458] text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
              3 Paquetes
            </span>
          </div>

          {renderExtendedCard(1, "plan_1_img", "Plan Principal (Romántica)", [
            { key: "plan_1_title", label: "Título", type: "text" },
            { key: "plan_1_subtitle", label: "Subtítulo Corto", type: "text" },
            { key: "plan_1_tag", label: "Etiqueta Visual", type: "text" },
            { key: "plan_1_price", label: "Precio", type: "text" },
            { key: "plan_1_desc", label: "Descripción Detallada", type: "textarea" },
          ])}
          {renderExtendedCard(2, "plan_2_img", "Plan Secundario (Madre)", [
            { key: "plan_2_title", label: "Título", type: "text" },
            { key: "plan_2_subtitle", label: "Subtítulo Corto", type: "text" },
            { key: "plan_2_tag", label: "Etiqueta Visual", type: "text" },
            { key: "plan_2_price", label: "Precio", type: "text" },
            { key: "plan_2_desc", label: "Descripción Detallada", type: "textarea" },
          ])}
          {renderExtendedCard(3, "plan_3_img", "Plan Alternativo (Finde)", [
            { key: "plan_3_title", label: "Título", type: "text" },
            { key: "plan_3_subtitle", label: "Subtítulo Corto", type: "text" },
            { key: "plan_3_tag", label: "Etiqueta Visual", type: "text" },
            { key: "plan_3_price", label: "Precio", type: "text" },
            { key: "plan_3_desc", label: "Descripción Detallada", type: "textarea" },
          ])}
        </div>
      )}

      {/* CONTENT: TURISMO */}
      {activeTab === "turismo" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#534FA6] text-white rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-sm font-bold">Lugares de Interés (Turismo Local)</h3>
              <p className="text-xs text-white/85 mt-0.5">
                Recomienda a tus visitantes los mejores destinos cercanos al hotel.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#A5C5E2] text-[#1A2458] text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
              Destinos Cercanos
            </span>
          </div>

          {renderExtendedCard(1, "turismo_1_img", "Lugar Turístico 1", [
            { key: "turismo_1_lugar", label: "Municipio / Sector", type: "text" },
            { key: "turismo_1_title", label: "Nombre del Lugar", type: "text" },
            { key: "turismo_1_price", label: "Costo (Desde)", type: "text" },
          ])}
          {renderExtendedCard(2, "turismo_2_img", "Lugar Turístico 2", [
            { key: "turismo_2_lugar", label: "Municipio / Sector", type: "text" },
            { key: "turismo_2_title", label: "Nombre del Lugar", type: "text" },
            { key: "turismo_2_price", label: "Costo (Desde)", type: "text" },
          ])}
          {renderExtendedCard(3, "turismo_3_img", "Lugar Turístico 3", [
            { key: "turismo_3_lugar", label: "Municipio / Sector", type: "text" },
            { key: "turismo_3_title", label: "Nombre del Lugar", type: "text" },
            { key: "turismo_3_price", label: "Costo (Desde)", type: "text" },
          ])}
        </div>
      )}

      <AdminDialog
        config={
          uploadError
            ? {
                title: "No se pudo subir el archivo",
                message: uploadError,
                variant: "error",
              }
            : null
        }
        onClose={() => setUploadError(null)}
      />
    </div>
  );
}