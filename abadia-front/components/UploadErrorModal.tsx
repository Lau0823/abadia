"use client";

import React, { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface UploadErrorModalProps {
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
}

export default function UploadErrorModal({ isOpen, message, onClose }: UploadErrorModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-error-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 id="upload-error-title" className="text-lg font-extrabold text-[#1A2458]">
              No se pudo subir el archivo
            </h3>
            <p className="text-sm text-[#4F67B5] mt-1 leading-relaxed break-words">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#1A2458] text-white hover:bg-[#2B377A] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
