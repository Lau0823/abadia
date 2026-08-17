import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { Transaccion } from './entities/transaccion.entity';

@Injectable()
export class FinanzasService {
  constructor(
    @InjectRepository(Transaccion)
    private transaccionRepository: Repository<Transaccion>,
  ) {}

  async create(createTransaccionDto: CreateTransaccionDto): Promise<Transaccion> {
    const transaccion = this.transaccionRepository.create({
      ...createTransaccionDto,
      fecha: new Date(createTransaccionDto.fecha),
    });
    return await this.transaccionRepository.save(transaccion);
  }

  async findAll(): Promise<Transaccion[]> {
    return await this.transaccionRepository.find({
      order: { fecha: 'DESC' },
      relations: ['metodoPago', 'reserva'],
    });
  }

  async findOne(id: string): Promise<Transaccion> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id },
      relations: ['metodoPago', 'reserva'],
    });
    if (!transaccion) {
      throw new NotFoundException(`Transaccion con id ${id} no encontrada`);
    }
    return transaccion;
  }

  async remove(id: string): Promise<void> {
    const transaccion = await this.findOne(id);
    await this.transaccionRepository.remove(transaccion);
  }
}
