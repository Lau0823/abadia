import React from 'react';
import './globals.css'; // Importa tus estilos globales

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
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}