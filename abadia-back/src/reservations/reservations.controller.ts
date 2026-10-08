import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createReservationDto: any) {
    return this.reservationsService.create(createReservationDto);
  }

  @Public()
  @Post('book')
  createPublicReservation(@Body() data: any) {
    return this.reservationsService.createPublicReservation(data);
  }

  @Public()
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

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: any) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/huespedes')
  addHuesped(@Param('id') id: string, @Body() huespedData: { nombre: string; documento: string }) {
    return this.reservationsService.addHuesped(+id, huespedData);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('huespedes/:huespedId')
  removeHuesped(@Param('huespedId') huespedId: string) {
    return this.reservationsService.removeHuesped(+huespedId);
  }
}
