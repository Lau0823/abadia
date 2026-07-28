import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Habitacion } from '../habitaciones/entities/habitacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Reservation, Habitacion])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
