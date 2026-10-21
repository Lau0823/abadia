import React from 'react';
import './globals.css'; // Importa tus estilos globales
import Navigation from '../components/ui/Navigation';
import BottomFloatingGlassNav from '../components/BottomFloatingMenu';

export const metadata = {
  title: 'Abadía Hotel Boutique',
  description: 'Un espacio exclusivo diseñado para la calma.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navigation />
        {children}
        <BottomFloatingGlassNav />
      </body>
    </html>
  );
}