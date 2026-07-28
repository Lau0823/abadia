import { IsString, IsNumber, IsOptional, IsEnum, Min, IsArray } from 'class-validator';
import { EstadoHabitacion } from '../entities/habitacion.entity';

export class CreateHabitacionDto {
  @IsString()
  titulo: string;

  @IsString()
  subtitulo: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  @IsOptional()
  imagen?: string;

  @IsString()
  ocupacion: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  comodidades?: string[];

  @IsEnum(EstadoHabitacion)
  @IsOptional()
  estado?: EstadoHabitacion;
}
