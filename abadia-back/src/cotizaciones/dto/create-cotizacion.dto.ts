import { IsInt, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCotizacionDto {
  @IsNumber()
  cliente_id: number;

  @IsUUID()
  habitacion_id: string;

  @IsString()
  checkIn: string; // ISO string

  @IsString()
  checkOut: string; // ISO string

  @IsInt()
  numeroAdultos: number;

  @IsInt()
  numeroNinos: number;

  @IsNumber()
  total_estimado: number;
}
