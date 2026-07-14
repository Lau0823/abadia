import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitacion } from './entities/habitacion.entity';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';

@Injectable()
export class HabitacionesService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
  ) {}

  async create(createHabitacionDto: CreateHabitacionDto): Promise<Habitacion> {
    const habitacion = this.habitacionRepository.create(createHabitacionDto);
    return this.habitacionRepository.save(habitacion);
  }

  async findAll(): Promise<Habitacion[]> {
    return this.habitacionRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Habitacion> {
    const habitacion = await this.habitacionRepository.findOne({ where: { id } });
    if (!habitacion) {
      throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
    }
    return habitacion;
  }

  async update(id: string, updateHabitacionDto: UpdateHabitacionDto): Promise<Habitacion> {
    const habitacion = await this.findOne(id);
    Object.assign(habitacion, updateHabitacionDto);
    return this.habitacionRepository.save(habitacion);
  }

  async remove(id: string): Promise<void> {
    const habitacion = await this.findOne(id);
    await this.habitacionRepository.remove(habitacion);
  }
}
