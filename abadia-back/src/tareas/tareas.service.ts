import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
    const tarea = this.tareaRepository.create(createTareaDto);
    
    if (createTareaDto.asignado_a_id) {
        const user = await this.userRepository.findOne({ where: { id: createTareaDto.asignado_a_id } });
        if (user) tarea.asignado_a = user;
    }

    if (createTareaDto.creado_por_id) {
        const user = await this.userRepository.findOne({ where: { id: createTareaDto.creado_por_id } });
        if (user) tarea.creado_por = user;
    }

    return await this.tareaRepository.save(tarea);
  }

  async findAll(): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      relations: ['asignado_a', 'creado_por'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({
      where: { id },
      relations: ['asignado_a', 'creado_por'],
    });

    if (!tarea) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }

    return tarea;
  }

  async update(id: number, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    
    // Si se actualizan relaciones
    if (updateTareaDto.asignado_a_id !== undefined) {
        if (updateTareaDto.asignado_a_id === null) {
            tarea.asignado_a = null;
        } else {
            const user = await this.userRepository.findOne({ where: { id: updateTareaDto.asignado_a_id } });
            if (user) tarea.asignado_a = user;
        }
    }

    Object.assign(tarea, updateTareaDto);
    return await this.tareaRepository.save(tarea);
  }

  async remove(id: number): Promise<void> {
    const tarea = await this.findOne(id);
    await this.tareaRepository.remove(tarea);
  }
}
