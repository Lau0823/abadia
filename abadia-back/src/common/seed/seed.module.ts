import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MetodoPago } from '../../metodosPago/entities/metodo-pago.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { User } from '../../users/entities/user.entity';
import { Habitacion } from '../../habitaciones/entities/habitacion.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MetodoPago, 
      Setting, 
      Reservation, 
      User,
      Habitacion,
      Cliente
    ])
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
