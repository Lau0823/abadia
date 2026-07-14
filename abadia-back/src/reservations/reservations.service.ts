import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Huesped } from './entities/huesped.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Habitacion, EstadoLimpieza } from '../habitaciones/entities/habitacion.entity';
import { MailService } from '../common/mail/mail.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Huesped)
    private readonly huespedRepository: Repository<Huesped>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
    private readonly mailService: MailService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  private normalizeDate(date: Date | string, hour: number): Date {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    // Colombia es UTC-5, así que le sumamos 5 a la hora local para obtener la hora UTC
    return new Date(Date.UTC(year, month, day, hour + 5, 0, 0));
  }

  async create(createReservationDto: Partial<Reservation>) {
    createReservationDto.checkIn = this.normalizeDate(createReservationDto.checkIn, 15); // 3:00 PM
    createReservationDto.checkOut = this.normalizeDate(createReservationDto.checkOut, 11); // 11:00 AM

    await this.verificarDisponibilidad(
      createReservationDto.habitacion_id,
      new Date(createReservationDto.checkIn),
      new Date(createReservationDto.checkOut)
    );

    const reservation = this.reservationRepository.create(createReservationDto);
    const saved = await this.reservationRepository.save(reservation);

    if (saved.status === ReservationStatus.CONFIRMED) {
      await this.processConfirmedReservation(saved);
    }

    return saved;
  }

  async createPublicReservation(data: {
    cliente: { nombre: string; correo: string; telefono: string; documento: string; tipoDocumento: string };
    reserva: { habitacion_id: string; checkIn: string; checkOut: string; numeroAdultos: number; numeroNinos: number; notas_admin?: string }
  }) {
    // 1. Buscar o Crear Cliente
    let cliente = await this.clienteRepository.findOne({
      where: [
        { correo: data.cliente.correo },
        { documento: data.cliente.documento }
      ]
    });

    if (!cliente) {
      cliente = this.clienteRepository.create(data.cliente);
      cliente = await this.clienteRepository.save(cliente);
    }

    const normalizedCheckIn = this.normalizeDate(data.reserva.checkIn, 15);
    const normalizedCheckOut = this.normalizeDate(data.reserva.checkOut, 11);

    await this.verificarDisponibilidad(
      data.reserva.habitacion_id,
      normalizedCheckIn,
      normalizedCheckOut
    );

    // 2. Crear Reserva
    const reservation = this.reservationRepository.create({
      ...data.reserva,
      checkIn: normalizedCheckIn,
      checkOut: normalizedCheckOut,
      cliente_id: cliente.id,
      status: ReservationStatus.PENDING,
      origenReserva: 'Web Publica'
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll() {
    return await this.reservationRepository.find({
      relations: ['cliente', 'habitacion', 'huespedes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['cliente', 'habitacion', 'huespedes']
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: Partial<Reservation>) {
    const oldReservation = await this.findOne(id);
    
    if (updateReservationDto.checkIn) {
      updateReservationDto.checkIn = this.normalizeDate(updateReservationDto.checkIn, 15);
    }
    if (updateReservationDto.checkOut) {
      updateReservationDto.checkOut = this.normalizeDate(updateReservationDto.checkOut, 11);
    }

    // Si cambia de fechas o de habitación, validar disponibilidad
    if (
      (updateReservationDto.checkIn && new Date(updateReservationDto.checkIn).getTime() !== oldReservation.checkIn.getTime()) ||
      (updateReservationDto.checkOut && new Date(updateReservationDto.checkOut).getTime() !== oldReservation.checkOut.getTime()) ||
      (updateReservationDto.habitacion_id && updateReservationDto.habitacion_id !== oldReservation.habitacion_id)
    ) {
      await this.verificarDisponibilidad(
        updateReservationDto.habitacion_id || oldReservation.habitacion_id,
        updateReservationDto.checkIn || oldReservation.checkIn,
        updateReservationDto.checkOut || oldReservation.checkOut,
        id
      );
    }

    const updated = await this.reservationRepository.save({
      ...oldReservation,
      ...updateReservationDto,
    });

    // Si el estado cambió a 'confirmed' en esta actualización
    if (oldReservation.status !== ReservationStatus.CONFIRMED && updated.status === ReservationStatus.CONFIRMED) {
      await this.processConfirmedReservation(updated);
    }

    // Si el estado cambió a 'completed' en esta actualización (Check-out)
    if (oldReservation.status !== ReservationStatus.COMPLETED && updated.status === ReservationStatus.COMPLETED) {
      const habitacion = await this.habitacionRepository.findOne({ where: { id: updated.habitacion_id }});
      if (habitacion) {
        habitacion.estadoLimpieza = EstadoLimpieza.POR_ASEAR;
        await this.habitacionRepository.save(habitacion);
      }
    }

    return updated;
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    return await this.reservationRepository.remove(reservation);
  }

  async addHuesped(reservationId: number, huespedData: { nombre: string; documento: string }) {
    const reservation = await this.findOne(reservationId);
    const huesped = this.huespedRepository.create({
      ...huespedData,
      reservation
    });
    return await this.huespedRepository.save(huesped);
  }

  async removeHuesped(huespedId: number) {
    const huesped = await this.huespedRepository.findOne({ where: { id: huespedId } });
    if (!huesped) {
      throw new NotFoundException(`Huesped with ID ${huespedId} not found`);
    }
    return await this.huespedRepository.remove(huesped);
  }

  private async processConfirmedReservation(reservation: Reservation) {
    try {
      // 1. Enviar Email (si tiene email)
      if (reservation.cliente && reservation.cliente.correo) {
        await this.mailService.sendReservationConfirmation(
          reservation.cliente.correo,
          reservation.cliente.nombre,
          reservation.habitacion?.titulo || 'Habitación',
          reservation.checkIn ? reservation.checkIn.toString() : 'Fecha por confirmar',
          reservation.checkIn ? reservation.checkIn.toString() : '',
        );
      }

      // 2. Sincronizar con Google Calendar
      try {
        const googleEvent = await this.googleCalendarService.createEvent(reservation);
        if (googleEvent && googleEvent.id) {
          // Usamos una actualización directa para evitar loops
          await this.reservationRepository.createQueryBuilder()
            .update(Reservation)
            .set({ googleEventId: googleEvent.id })
            .where("id = :id", { id: reservation.id })
            .execute();
        }
      } catch (calError) {
        this.logger.warn(`No se pudo sincronizar con Google Calendar: ${calError.message}`);
      }
    } catch (error) {
      this.logger.error(`Error procesando confirmación de reserva: ${error.message}`);
    }
  }

  async verificarDisponibilidad(habitacionId: string, checkIn: Date, checkOut: Date, excludeReservationId?: number) {
    if (checkOut <= checkIn) {
      throw new NotFoundException('La fecha de check-out debe ser posterior al check-in.');
    }

    const query = this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.habitacion_id = :habitacionId', { habitacionId })
      .andWhere('reservation.status NOT IN (:...statuses)', { 
        statuses: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED] 
      })
      .andWhere('(reservation.checkIn < :checkOut AND reservation.checkOut > :checkIn)', {
        checkIn,
        checkOut
      });

    if (excludeReservationId) {
      query.andWhere('reservation.id != :excludeReservationId', { excludeReservationId });
    }

    const overlapping = await query.getOne();

    if (overlapping) {
      throw new NotFoundException('La habitación no está disponible para las fechas seleccionadas.');
    }
  }
}
