import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HabitacionesService } from './habitaciones.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Habitaciones')
@Controller('habitaciones')
export class HabitacionesController {
  constructor(private readonly habitacionesService: HabitacionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin, Role.SuperAdmin)
  create(@Body() createHabitacionDto: CreateHabitacionDto) {
    return this.habitacionesService.create(createHabitacionDto);
  }

  @Get()
  @Public() // Las habitaciones pueden ser vistas por cualquiera en la web
  findAll() {
    return this.habitacionesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.habitacionesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin, Role.SuperAdmin)
  update(@Param('id') id: string, @Body() updateHabitacionDto: UpdateHabitacionDto) {
    return this.habitacionesService.update(id, updateHabitacionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin, Role.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.habitacionesService.remove(id);
  }
}
