import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { CotizacionStatus } from './entities/cotizacion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('cotizaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cotización' })
  create(@Body() createCotizacionDto: CreateCotizacionDto) {
    return this.cotizacionesService.create(createCotizacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cotizaciones' })
  findAll() {
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cotización por id' })
  findOne(@Param('id') id: string) {
    return this.cotizacionesService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una cotización' })
  updateStatus(@Param('id') id: string, @Body('status') status: CotizacionStatus) {
    return this.cotizacionesService.updateStatus(id, status);
  }

  @Post(':id/convertir')
  @ApiOperation({ summary: 'Convertir cotización en reserva' })
  convertToReservation(@Param('id') id: string) {
    return this.cotizacionesService.convertToReservation(id);
  }
}
