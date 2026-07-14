import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitacionesService } from './habitaciones.service';
import { HabitacionesController } from './habitaciones.controller';
import { Habitacion } from './entities/habitacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habitacion])],
  controllers: [HabitacionesController],
  providers: [HabitacionesService],
  exports: [HabitacionesService],
})
export class HabitacionesModule {}
