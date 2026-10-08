import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitacionesService } from './habitaciones.service';
import { HabitacionesController } from './habitaciones.controller';
import { Habitacion } from './entities/habitacion.entity';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habitacion]),
    CloudinaryModule,
  ],
  controllers: [HabitacionesController],
  providers: [HabitacionesService],
  exports: [HabitacionesService],
})
export class HabitacionesModule {}
