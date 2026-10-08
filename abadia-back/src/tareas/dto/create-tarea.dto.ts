import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({ description: 'Título de la tarea' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ description: 'Descripción de la tarea', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Estado de la tarea', required: false, default: 'PENDIENTE' })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({ description: 'Fecha límite de la tarea', required: false })
  @IsDateString()
  @IsOptional()
  fecha_limite?: string;

  @ApiProperty({ description: 'ID del empleado asignado', required: false })
  @IsNumber()
  @IsOptional()
  asignado_a_id?: number;

  @ApiProperty({ description: 'ID del usuario creador', required: false })
  @IsNumber()
  @IsOptional()
  creado_por_id?: number;
}
