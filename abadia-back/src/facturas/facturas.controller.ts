import { Controller, Get, Post, Body, Param, Put, UseGuards, Query } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturaStatus } from './entities/factura.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('facturas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva factura' })
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.facturasService.findAll(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por id' })
  findOne(@Param('id') id: string) {
    return this.facturasService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una factura' })
  updateStatus(@Param('id') id: string, @Body('status') status: FacturaStatus) {
    return this.facturasService.updateStatus(id, status);
  }
}
