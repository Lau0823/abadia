# Abadía — Dashboard Admin (Solo Frontend)

Esta rama (`dashboard-admin`) contiene únicamente el panel administrativo (`/admin`) con datos harcodeados en memoria para trabajar diseño y frontend sin necesidad de levantar PostgreSQL, backend ni pantalla de login.

## Cómo correrlo

```bash
cd abadia-front
npm install
npm run dev
```

Abre `http://localhost:3000` (redirige automáticamente a `/admin`).

## Dónde están los datos de prueba
- [abadia-front/lib/mockApi.ts](abadia-front/lib/mockApi.ts): datos harcodeados (habitaciones, reservas, cotizaciones, clientes, empleados, finanzas, tareas y configuración).
- Todas las vistas del panel están en `abadia-front/app/admin/`.
