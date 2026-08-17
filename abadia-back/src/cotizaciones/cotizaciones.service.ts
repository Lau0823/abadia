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
    const cotizacion = this.cotizacionRepository.create({
      ...createCotizacionDto,
      checkIn: new Date(createCotizacionDto.checkIn),
      checkOut: new Date(createCotizacionDto.checkOut),
    });
    return await this.cotizacionRepository.save(cotizacion);
  }

  async findAll(): Promise<Cotizacion[]> {
    return await this.cotizacionRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['cliente', 'habitacion'],
    });
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
