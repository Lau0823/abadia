import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { FinanzasService } from './finanzas.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('finanzas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finanzas')
export class FinanzasController {
  constructor(private readonly finanzasService: FinanzasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  create(@Body() createTransaccionDto: CreateTransaccionDto) {
    return this.finanzasService.create(createTransaccionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  findAll() {
    return this.finanzasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por id' })
  findOne(@Param('id') id: string) {
    return this.finanzasService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transacción' })
  remove(@Param('id') id: string) {
    return this.finanzasService.remove(id);
  }
}
