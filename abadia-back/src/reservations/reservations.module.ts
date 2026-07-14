import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Huesped } from './entities/huesped.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Habitacion } from '../habitaciones/entities/habitacion.entity';
import { MailModule } from '../common/mail/mail.module';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Huesped, Cliente, Habitacion]),
    MailModule,
    GoogleCalendarModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService]
})
export class ReservationsModule {}
