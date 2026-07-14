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

  private normalizeDate(date: Date | string, hour: number): Date {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    return new Date(Date.UTC(year, month, day, hour + 5, 0, 0));
  }

  async findDisponibles(checkInStr: string, checkOutStr: string): Promise<Habitacion[]> {
    const checkIn = this.normalizeDate(checkInStr, 15);
    const checkOut = this.normalizeDate(checkOutStr, 11);

    const qb = this.habitacionRepository.createQueryBuilder('habitacion')
      .where("habitacion.estado = 'DISPONIBLE'")
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('reservation.habitacion_id')
          .from('reservations', 'reservation')
          .where("reservation.status NOT IN ('cancelled', 'completed')")
          .andWhere('(reservation.checkIn < :checkOut AND reservation.checkOut > :checkIn)')
          .getQuery();
        return 'habitacion.id NOT IN ' + subQuery;
      })
      .setParameter('checkIn', checkIn)
      .setParameter('checkOut', checkOut)
      .orderBy('habitacion.precio', 'ASC');

    return await qb.getMany();
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

  async updateLimpieza(id: string, estadoLimpieza: any): Promise<Habitacion> {
    const habitacion = await this.findOne(id);
    habitacion.estadoLimpieza = estadoLimpieza;
    return this.habitacionRepository.save(habitacion);
  }
}
