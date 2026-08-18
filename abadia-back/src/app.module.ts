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

import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 120,
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

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
        ];

        if (databaseUrl) {
          // Caso Railway o Render
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: entities,
            autoLoadEntities: true,
            synchronize: true, // Forzamos true para asegurar que las tablas se creen en el VPS
            migrationsRun: false,
          };
        }

        // Caso local (sin DATABASE_URL)
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: entities,
          autoLoadEntities: true,
          synchronize: true, // Forzamos true para desarrollo y despliegue inicial
          migrationsRun: false,
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
    try {
      console.log('Verificando y configurando extensiones de BD (pg_trgm)...');
      await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

      // Índices para Clientes
      await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_cliente_nombre_trgm ON clientes USING gin (nombre gin_trgm_ops);`);
      await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_cliente_correo_trgm ON clientes USING gin (correo gin_trgm_ops);`);
      
      // Índices para Habitaciones
      await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_habitacion_titulo_trgm ON habitaciones USING gin (titulo gin_trgm_ops);`);
      
      // Índices para Cotizaciones
      await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_cotizacion_numero_trgm ON cotizaciones USING gin (numero_cotizacion gin_trgm_ops);`);
      
      // Índices para Facturas
      await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_factura_numero_trgm ON facturas USING gin (numero_factura gin_trgm_ops);`);

      console.log('Índices de alta velocidad GIN configurados correctamente.');
    } catch (error) {
      console.error('Error al configurar pg_trgm (Puede que la BD no soporte esta extensión o falten permisos):', error.message);
    }
  }
}