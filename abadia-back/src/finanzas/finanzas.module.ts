import { Module } from '@nestjs/common';
import { FinanzasService } from './finanzas.service';
import { FinanzasController } from './finanzas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion } from './entities/transaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaccion])],
  controllers: [FinanzasController],
  providers: [FinanzasService],
  exports: [FinanzasService],
})
export class FinanzasModule {}
