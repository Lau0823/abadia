'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Iniciar desvanecimiento a los 2.5s para que a los 3s esté completamente oculto
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Desmontar el splash a los 3 segundos exactos
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Pantalla de bienvenida"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-950 px-6 text-white transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in text-center">
        {/* Contenedor del Logo */}
        <div className="relative h-32 w-32 md:h-40 md:w-40 drop-shadow-lg">
          <Image
            src="/logo-abadia.png" // Ajusta la ruta a tu archivo en /public
            alt="Logo Abadía"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Textos de Bienvenida */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-amber-100">
            Bienvenido
          </h1>
          <p className="text-sm md:text-base font-light tracking-wide text-blue-200/80">
            Hotel Abadía
          </p>
        </div>

        {/* Indicador sutil de carga (opcional) */}
        <div className="w-16 h-0.5 bg-blue-400/30 overflow-hidden rounded-full mt-4">
          <div className="w-full h-full bg-amber-200/80 animate-pulse" />
        </div>
      </div>
    </aside>
  );
};