import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';

import { User } from './users/entities/user.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { MetodoPago } from './metodosPago/entities/metodo-pago.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { Habitacion } from './habitaciones/entities/habitacion.entity';
import { Setting } from './settings/entities/setting.entity';
import { Huesped } from './reservations/entities/huesped.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientesModule } from './clientes/clientes.module';
import { MetodosPagoModule } from './metodosPago/metodos-pago.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { SeedModule } from './common/seed/seed.module';
import { ReservationsModule } from './reservations/reservations.module';
import { HabitacionesModule } from './habitaciones/habitaciones.module';
import { GoogleCalendarModule } from './google-calendar/google-calendar.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FinanzasModule } from './finanzas/finanzas.module';
import { Transaccion } from './finanzas/entities/transaccion.entity';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { Cotizacion } from './cotizaciones/entities/cotizacion.entity';
import { FacturasModule } from './facturas/facturas.module';
import { Factura } from './facturas/entities/factura.entity';
import { DocumentsModule } from './documents/documents.module';
import { TareasModule } from './tareas/tareas.module';
import { Tarea } from './tareas/entities/tarea.entity';

import { DataSource } from 'typeorm';
import { AddInHouseReservationStatus1795230000000 } from './migrations/1795230000000-add-in-house-reservation-status';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        // En producción el esquema se gestiona con migraciones: synchronize puede
        // destruir datos al cambiar una entidad. Se puede forzar con DB_SYNCHRONIZE=true.
        const isProduction = process.env.NODE_ENV === 'production';
        const synchronize =
          !isProduction || config.get<string>('DB_SYNCHRONIZE') === 'true';
        const migrations = [AddInHouseReservationStatus1795230000000];
        const migrationsTransactionMode = 'each' as const;

        const entities = [
          User,
          Cliente,
          MetodoPago,
          Reservation,
          Habitacion,
          Setting,
          Huesped,
          Transaccion,
          Cotizacion,
          Factura,
          Tarea,
        ];

        if (databaseUrl) {
          // Caso Railway o Render
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: entities,
            autoLoadEntities: true,
            synchronize,
            migrations,
            migrationsRun: true,
            migrationsTransactionMode,
          };
        }

        // Caso local (sin DATABASE_URL)
        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: entities,
          autoLoadEntities: true,
          synchronize,
          migrations,
          migrationsRun: true,
          migrationsTransactionMode,
        };
      },
    }),
    AuthModule,
    UsersModule,
    ClientesModule,
    MetodosPagoModule,
    CloudinaryModule,
    SeedModule,
    ReservationsModule,
    HabitacionesModule,
    GoogleCalendarModule,
    SettingsModule,
    DashboardModule,
    FinanzasModule,
    CotizacionesModule,
    FacturasModule,
    DocumentsModule,
    TareasModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Una BD completamente vacía (primer despliegue) aún necesita crear el esquema.
    // Se hace una única vez; en producción el día a día lo gestionan las migraciones.
    try {
      const result: Array<{ exists: boolean }> = await this.dataSource.query(
        `SELECT to_regclass('reservations') IS NOT NULL AS exists`,
      );
      if (!result[0]?.exists) {
        console.warn('BD vacía: ejecutando synchronize inicial de bootstrap.');
        await this.dataSource.synchronize();
      }
    } catch (error) {
      console.warn(
        'No se pudo comprobar/crear el esquema inicial:',
        this.errorMessage(error),
      );
    }

    try {
      console.log('Verificando y configurando extensiones de BD (pg_trgm)...');
      await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

      // Índices para Clientes
      await this.dataSource.query(
        `CREATE INDEX IF NOT EXISTS idx_cliente_nombre_trgm ON clientes USING gin (nombre gin_trgm_ops);`,
      );
      await this.dataSource.query(
        `CREATE INDEX IF NOT EXISTS idx_cliente_correo_trgm ON clientes USING gin (correo gin_trgm_ops);`,
      );

      // Índices para Habitaciones
      await this.dataSource.query(
        `CREATE INDEX IF NOT EXISTS idx_habitacion_titulo_trgm ON habitaciones USING gin (titulo gin_trgm_ops);`,
      );

      // Índices para Cotizaciones
      await this.dataSource.query(
        `CREATE INDEX IF NOT EXISTS idx_cotizacion_numero_trgm ON cotizaciones USING gin (numero_cotizacion gin_trgm_ops);`,
      );

      // Índices para Facturas
      await this.dataSource.query(
        `CREATE INDEX IF NOT EXISTS idx_factura_numero_trgm ON facturas USING gin (numero_factura gin_trgm_ops);`,
      );

      console.log('Índices de alta velocidad GIN configurados correctamente.');
    } catch (error) {
      console.error(
        'Error al configurar pg_trgm (Puede que la BD no soporte esta extensión o falten permisos):',
        this.errorMessage(error),
      );
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
