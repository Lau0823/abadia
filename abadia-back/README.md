# Abadía - Backend API 🏨

API robusta y escalable construida con NestJS para la gestión de **Abadía**. Maneja la autenticación, la gestión de habitaciones, el sistema de reservas de huéspedes y la configuración del sitio.

## 🛠️ Tecnologías

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Base de Datos**: PostgreSQL
- **Almacenamiento Multimedia**: [Cloudinary](https://cloudinary.com/) (para fotos de habitaciones y perfiles)
- **Seguridad**: Passport.js con JWT.
- **Documentación**: Swagger UI.

## 📁 Módulos Principales

- **Auth**: Gestión de usuarios, administradores y autenticación segura con JWT.
- **Habitaciones**: CRUD del inventario de habitaciones, precios, ocupación máxima y disponibilidad.
- **Reservations**: Sistema central de gestión de reservas, fechas de check-in/check-out y estados.
- **Clientes**: Base de datos de huéspedes e historial.
- **Settings**: Configuración dinámica del sitio web del hotel.

## 🧪 Testing

El proyecto cuenta con una suite de pruebas unitarias robusta utilizando **Jest**.

```bash
# Ejecutar todos los tests
npm run test
```

## 🚀 Configuración e Instalación

### Requisitos

- Node.js (v18+)
- PostgreSQL
- Cuenta en Cloudinary

### Variables de Entorno

Configura tu archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=...
DB_NAME=abadia

JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Credenciales de Administrador por defecto
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@abadia.com
ADMIN_PASSWORD=admin123*
```

### Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

3. Acceder a la documentación API (Swagger):
   `http://localhost:3002/api` (o el puerto configurado).

## 📄 Licencia

Abadía - Todos los derechos reservados.
