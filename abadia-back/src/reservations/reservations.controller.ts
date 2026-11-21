import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StatusPipe } from '../common/pipes/status.pipe';

interface PublicReservationBody {
  cliente: {
    nombre: string;
    correo: string;
    telefono: string;
    documento: string;
    tipoDocumento: string;
  };
  reserva: {
    habitacion_id: string;
    checkIn: string;
    checkOut: string;
    numeroAdultos: number;
    numeroNinos: number;
    notas_admin?: string;
  };
}

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createReservationDto: Partial<Reservation>) {
    return this.reservationsService.create(createReservationDto);
  }

  @Public()
  @Post('book')
  createPublicReservation(@Body() data: PublicReservationBody) {
    return this.reservationsService.createPublicReservation(data);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.reservationsService.findAll(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new StatusPipe(ReservationStatus)) status: ReservationStatus,
  ) {
    return this.reservationsService.updateStatus(+id, status);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id/status')
  updateStatusPut(
    @Param('id') id: string,
    @Body(new StatusPipe(ReservationStatus)) status: ReservationStatus,
  ) {
    return this.reservationsService.updateStatus(+id, status);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: Partial<Reservation>,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/huespedes')
  addHuesped(
    @Param('id') id: string,
    @Body() huespedData: { nombre: string; documento: string },
  ) {
    return this.reservationsService.addHuesped(+id, huespedData);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('huespedes/:huespedId')
  removeHuesped(@Param('huespedId') huespedId: string) {
    return this.reservationsService.removeHuesped(+huespedId);
  }
}
