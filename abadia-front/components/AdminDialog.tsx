"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type AdminDialogVariant = "error" | "warning" | "confirm" | "success" | "info";

/** Mensaje seguro para mostrar al usuario sin asumir que el error es un `any`. */
export function dialogError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export interface AdminDialogConfig {
  title: string;
  message: React.ReactNode;
  variant?: AdminDialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Si se pasa, aparecen los botones Cancelar / confirmar.
   * Devuelve false para mantener el diálogo abierto (por ejemplo, si el caller
   * muestra otro diálogo de error dentro de la acción).
   */
  onConfirm?: () => void | boolean | Promise<void | boolean>;
}

interface AdminDialogProps {
  config: AdminDialogConfig | null;
  onClose: () => void;
}

const TONES: Record<
  AdminDialogVariant,
  { icon: React.ElementType; wrap: string; color: string }
> = {
  error: {
    icon: ExclamationTriangleIcon,
    wrap: "bg-rose-500/20",
    color: "text-rose-200",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    wrap: "bg-amber-400/20",
    color: "text-amber-200",
  },
  confirm: {
    icon: InformationCircleIcon,
    wrap: "bg-[#A5C5E2]/20",
    color: "text-[#A5C5E2]",
  },
  success: {
    icon: CheckCircleIcon,
    wrap: "bg-emerald-400/20",
    color: "text-emerald-200",
  },
  info: {
    icon: InformationCircleIcon,
    wrap: "bg-[#A5C5E2]/20",
    color: "text-[#A5C5E2]",
  },
};

/** Diálogo único del panel: mismos colores, radios y tipografía que el resto del admin. */
export default function AdminDialog({ config, onClose }: AdminDialogProps) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!config) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config, busy, onClose]);

  if (!config) return null;

  const variant = config.variant ?? (config.onConfirm ? "confirm" : "error");
  const tone = TONES[variant];
  const Icon = tone.icon;
  const isConfirm = Boolean(config.onConfirm);

  const handleConfirm = async () => {
    if (!config.onConfirm) {
      onClose();
      return;
    }
    try {
      setBusy(true);
      const result = await config.onConfirm();
      if (result !== false) onClose();
    } catch {
      // El caller ya mostró el error correspondiente: dejamos el diálogo abierto.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B122E]/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dialog-title"
      onMouseDown={(event) => {
        if (!busy && event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#E4EAF5] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A2458] via-[#1A2458] to-[#2B377A] px-6 py-5 text-white">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#473C8F]/35" />
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          <div className="relative z-0 flex items-center gap-3 pr-8">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.wrap} ${tone.color}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 id="admin-dialog-title" className="text-lg font-bold leading-tight">
              {config.title}
            </h3>
          </div>
        </div>

        <div className="px-6 py-5 text-sm leading-relaxed text-[#5B6789]">
          {config.message}
        </div>

        <div className="flex flex-wrap justify-end gap-2 px-6 pb-6">
          {isConfirm && (
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full bg-[#A5C5E2]/35 px-5 py-3 text-xs font-bold text-[#1A2458] transition-colors hover:bg-[#A5C5E2]/55 disabled:opacity-50"
            >
              {config.cancelLabel ?? "Cancelar"}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            autoFocus
            className="rounded-full bg-[#1A2458] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#2B377A] disabled:opacity-60"
          >
            {busy
              ? "Un momento..."
              : config.confirmLabel ?? (isConfirm ? "Confirmar" : "Entendido")}
          </button>
        </div>
      </div>
    </div>
  );
}
