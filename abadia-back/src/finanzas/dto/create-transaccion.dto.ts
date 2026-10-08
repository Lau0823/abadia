import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipoTransaccion, CategoriaTransaccion } from '../entities/transaccion.entity';

export class CreateTransaccionDto {
  @IsNumber()
  monto: number;

  @IsEnum(TipoTransaccion)
  tipo: TipoTransaccion;

  @IsEnum(CategoriaTransaccion)
  categoria: CategoriaTransaccion;

  @IsString()
  concepto: string;

  @IsString()
  fecha: string; // ISO string

  @IsOptional()
  @IsNumber()
  metodoPagoId?: number;

  @IsOptional()
  @IsNumber()
  reservaId?: number;
}
