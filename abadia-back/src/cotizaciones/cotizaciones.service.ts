import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion, CotizacionStatus } from './entities/cotizacion.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { ReservationsService } from '../reservations/reservations.service';
import { ReservationStatus } from '../reservations/entities/reservation.entity';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationsService: ReservationsService,
  ) {}

  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    const d = new Date();
    let retries = 5;
    let offset = 1;

    while (retries > 0) {
      try {
        const count = await this.cotizacionRepository.count();
        const numero_cotizacion = `C-${d.getFullYear()}-${(count + offset).toString().padStart(4, '0')}`;

        const cotizacion = this.cotizacionRepository.create({
          ...createCotizacionDto,
          numero_cotizacion,
          checkIn: new Date(createCotizacionDto.checkIn),
          checkOut: new Date(createCotizacionDto.checkOut),
        });
        return await this.cotizacionRepository.save(cotizacion);
      } catch (error: any) {
        // 23505 es el código de Postgres para violación de unique constraint
        if (error.code === '23505') {
          retries--;
          offset++;
          if (retries === 0) {
            throw new Error('No se pudo generar un número de cotización único. Por favor intente nuevamente.');
          }
        } else {
          throw error;
        }
      }
    }
    throw new Error('Error al generar cotización');
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.cotizacionRepository.createQueryBuilder('cotizacion')
      .leftJoinAndSelect('cotizacion.cliente', 'cliente')
      .leftJoinAndSelect('cotizacion.habitacion', 'habitacion')
      .orderBy('cotizacion.createdAt', 'DESC');

    if (search) {
      query.andWhere('(cliente.nombre ILIKE :search OR cliente.correo ILIKE :search OR cotizacion.numero_cotizacion ILIKE :search OR CAST(cotizacion.id AS TEXT) ILIKE :search OR habitacion.titulo ILIKE :search)', { search: `%${search}%` });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id },
      relations: ['cliente', 'habitacion'],
    });
    if (!cotizacion) {
      throw new NotFoundException(`Cotizacion con id ${id} no encontrada`);
    }
    return cotizacion;
  }

  async updateStatus(id: string, status: CotizacionStatus): Promise<Cotizacion> {
    const cotizacion = await this.findOne(id);
    cotizacion.status = status;
    return await this.cotizacionRepository.save(cotizacion);
  }

  async convertToReservation(id: string): Promise<any> {
    const cotizacion = await this.findOne(id);
    
    if (cotizacion.status !== CotizacionStatus.PENDING) {
      throw new Error('Solo se pueden convertir cotizaciones pendientes');
    }

    // Crear la reserva
    const reservation = await this.reservationsService.create({
      cliente_id: cotizacion.cliente_id,
      habitacion_id: cotizacion.habitacion_id,
      checkIn: cotizacion.checkIn,
      checkOut: cotizacion.checkOut,
      numeroAdultos: cotizacion.numeroAdultos,
      numeroNinos: cotizacion.numeroNinos,
      value: cotizacion.total_estimado,
      status: ReservationStatus.PENDING,
      origenReserva: 'Cotizacion',
    });

    // Actualizar estado de la cotización
    cotizacion.status = CotizacionStatus.ACCEPTED;
    await this.cotizacionRepository.save(cotizacion);

    return reservation;
  }
}
