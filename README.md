# Abadía

Monorepo de la web pública y el panel de administración de Abadía Casa Hotel.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `abadia-back/` | API NestJS 11 + TypeORM/PostgreSQL (auth JWT, reservas, cotizaciones, facturas, finanzas, Google Calendar, Cloudinary) |
| `abadia-front/` | Next.js 16 (App Router) + React 19 + Tailwind 4 + Zustand |
| `deploy/` | Configuración nginx (`/api/` → backend `:3102`, resto → frontend `:3100`) |
| `.github/workflows/deploy.yml` | CI/CD: build en GitHub Actions → SCP al VPS → PM2 |

## Desarrollo

```bash
cd abadia-back && npm ci && npm run start:dev
cd abadia-front && npm ci && npm run dev
```

El front llama a `/api/...` (proxy de nginx en producción, o `NEXT_PUBLIC_API_URL` en local).

## Base de datos

- En **desarrollo** TypeORM mantiene el esquema con `synchronize: true`.
- En **producción** `synchronize` está **desactivado**: los cambios de esquema se aplican con migraciones que se ejecutan automáticamente al arrancar (`migrationsRun: true`).
- Para añadir un cambio de esquema: crea una clase en `abadia-back/src/migrations/` y regístrala en el array `migrations` de `src/app.module.ts`.
- `DB_SYNCHRONIZE=true` fuerza una sincronización manual del esquema (usar con cuidado, puede destruir datos).
- En una BD completamente vacía, `AppModule.onModuleInit()` ejecuta un `synchronize` único de bootstrap para crear las tablas.

## Verificación

```bash
cd abadia-back
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
node node_modules/@nestjs/cli/bin/nest.js build
node node_modules/jest/bin/jest.js --runInBand
node node_modules/eslint/bin/eslint.js "src/**/*.ts"

cd ../abadia-front
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
node node_modules/next/dist/bin/next build
```

## Despliegue

Push a `camilo` con cambios en `abadia-back/`, `abadia-front/` o `deploy/` dispara el workflow. PM2 usa `abadia-back/ecosystem.config.cjs` con `NODE_ENV=production`.
