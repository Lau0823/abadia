import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFacturaDto {
  @IsNumber()
  reserva_id: number;

  @IsNumber()
  cliente_id: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  pdfUrl?: string;
}
