import { Module, forwardRef } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion]),
    forwardRef(() => ReservationsModule),
  ],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}
