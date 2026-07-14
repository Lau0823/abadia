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
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }