import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('cotizacion/:id')
  @ApiOperation({ summary: 'Generar PDF de Cotización' })
  async getCotizacionPdf(@Param('id') id: string, @Res() res: Response) {
    await this.documentsService.buildCotizacionPdf(id, res);
  }

  @Get('factura/:id')
  @ApiOperation({ summary: 'Generar PDF de Factura' })
  async getFacturaPdf(@Param('id') id: string, @Res() res: Response) {
    await this.documentsService.buildFacturaPdf(id, res);
  }
}
