import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Huesped } from './entities/huesped.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import {
  Habitacion,
  EstadoLimpieza,
} from '../habitaciones/entities/habitacion.entity';
import { MailService } from '../common/mail/mail.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { FinanzasService } from '../finanzas/finanzas.service';
import {
  Transaccion,
  TipoTransaccion,
  CategoriaTransaccion,
} from '../finanzas/entities/transaccion.entity';

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
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    private readonly mailService: MailService,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly finanzasService: FinanzasService,
  ) {}

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private normalizeDate(date: Date | string, hour: number): Date {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    // Colombia es UTC-5, así que le sumamos 5 a la hora local para obtener la hora UTC
    return new Date(Date.UTC(year, month, day, hour + 5, 0, 0));
  }

  async create(createReservationDto: Partial<Reservation>) {
    if (createReservationDto.checkIn) {
      createReservationDto.checkIn = this.normalizeDate(
        createReservationDto.checkIn.toString(),
        15,
      );
    }

    if (createReservationDto.checkOut) {
      createReservationDto.checkOut = this.normalizeDate(
        createReservationDto.checkOut.toString(),
        11,
      );
    }

    if (!createReservationDto.checkIn || !createReservationDto.checkOut) {
      throw new BadRequestException(
        'Las fechas de entrada y salida son obligatorias',
      );
    }

    if (!createReservationDto.habitacion_id) {
      throw new BadRequestException('El ID de la habitación es obligatorio');
    }

    await this.verificarDisponibilidad(
      createReservationDto.habitacion_id,
      new Date(createReservationDto.checkIn),
      new Date(createReservationDto.checkOut),
    );

    const reservation = this.reservationRepository.create(createReservationDto);
    const saved = await this.reservationRepository.save(reservation);

    // Si la reserva se crea con un anticipo inicial
    if (saved.anticipo && Number(saved.anticipo) > 0) {
      await this.finanzasService.create({
        monto: Number(saved.anticipo),
        tipo: TipoTransaccion.INGRESO,
        categoria: CategoriaTransaccion.RESERVACION,
        concepto: `Anticipo inicial de la reserva #${saved.id}`,
        fecha: new Date().toISOString(),
        reservaId: saved.id,
      });
    }

    if (saved.status === ReservationStatus.CONFIRMED) {
      await this.processConfirmedReservation(saved);
    }

    return saved;
  }

  async createPublicReservation(data: {
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
  }) {
    const nombre = data?.cliente?.nombre?.trim();
    const documento = data?.cliente?.documento?.trim();
    const correo = data?.cliente?.correo?.trim() || '';

    if (!nombre || !documento) {
      throw new BadRequestException(
        'Nombre y documento del cliente son obligatorios',
      );
    }
    if (
      !data?.reserva?.habitacion_id ||
      !data?.reserva?.checkIn ||
      !data?.reserva?.checkOut
    ) {
      throw new BadRequestException(
        'Habitación, fecha de entrada y fecha de salida son obligatorias',
      );
    }

    // El documento es único: evitar asociar la reserva a otro cliente por un correo vacío.
    const cliente =
      (await this.clienteRepository.findOne({ where: { documento } })) ??
      (await this.clienteRepository.save(
        this.clienteRepository.create({
          nombre,
          documento,
          correo: correo || undefined,
          telefono: data.cliente.telefono?.trim() || undefined,
        }),
      ));

    const habitacion = await this.habitacionRepository.findOne({
      where: { id: data.reserva.habitacion_id },
    });
    if (!habitacion) {
      throw new NotFoundException(
        `Habitación ${data.reserva.habitacion_id} no encontrada`,
      );
    }

    const normalizedCheckIn = this.normalizeDate(data.reserva.checkIn, 15);
    const normalizedCheckOut = this.normalizeDate(data.reserva.checkOut, 11);
    if (
      Number.isNaN(normalizedCheckIn.getTime()) ||
      Number.isNaN(normalizedCheckOut.getTime())
    ) {
      throw new BadRequestException('Las fechas de la reserva no son válidas');
    }

    await this.verificarDisponibilidad(
      habitacion.id,
      normalizedCheckIn,
      normalizedCheckOut,
    );

    // El valor se calcula en el servidor: el cliente público no puede manipularlo.
    const noches = Math.max(
      1,
      Math.round(
        (normalizedCheckOut.getTime() - normalizedCheckIn.getTime()) / 86400000,
      ),
    );
    const value = Number(habitacion.precio) * noches;

    const reservation = this.reservationRepository.create({
      habitacion_id: habitacion.id,
      checkIn: normalizedCheckIn,
      checkOut: normalizedCheckOut,
      numeroAdultos: Number(data.reserva.numeroAdultos) || 1,
      numeroNinos: Number(data.reserva.numeroNinos) || 0,
      notas_admin: data.reserva.notas_admin,
      value,
      cliente_id: cliente.id,
      status: ReservationStatus.PENDING,
      origenReserva: 'Web Publica',
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.cliente', 'cliente')
      .leftJoinAndSelect('reservation.habitacion', 'habitacion')
      .leftJoinAndSelect('reservation.huespedes', 'huespedes')
      .orderBy('reservation.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(cliente.nombre ILIKE :search OR cliente.correo ILIKE :search OR CAST(reservation.id AS TEXT) ILIKE :search OR habitacion.titulo ILIKE :search)',
        { search: `%${search}%` },
      );
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

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['cliente', 'habitacion', 'huespedes'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: Partial<Reservation>) {
    const oldReservation = await this.findOne(id);

    if (updateReservationDto.checkIn) {
      updateReservationDto.checkIn = this.normalizeDate(
        updateReservationDto.checkIn,
        15,
      );
    }
    if (updateReservationDto.checkOut) {
      updateReservationDto.checkOut = this.normalizeDate(
        updateReservationDto.checkOut,
        11,
      );
    }

    // Si cambia de fechas o de habitación, validar disponibilidad
    if (
      (updateReservationDto.checkIn &&
        new Date(updateReservationDto.checkIn).getTime() !==
          oldReservation.checkIn.getTime()) ||
      (updateReservationDto.checkOut &&
        new Date(updateReservationDto.checkOut).getTime() !==
          oldReservation.checkOut.getTime()) ||
      (updateReservationDto.habitacion_id &&
        updateReservationDto.habitacion_id !== oldReservation.habitacion_id)
    ) {
      await this.verificarDisponibilidad(
        updateReservationDto.habitacion_id || oldReservation.habitacion_id,
        updateReservationDto.checkIn || oldReservation.checkIn,
        updateReservationDto.checkOut || oldReservation.checkOut,
        id,
      );
    }

    // Reactivar una reserva anulada debe volver a comprobar disponibilidad.
    if (
      oldReservation.status === ReservationStatus.CANCELLED &&
      updateReservationDto.status &&
      updateReservationDto.status !== ReservationStatus.CANCELLED
    ) {
      await this.verificarDisponibilidad(
        updateReservationDto.habitacion_id || oldReservation.habitacion_id,
        updateReservationDto.checkIn || oldReservation.checkIn,
        updateReservationDto.checkOut || oldReservation.checkOut,
        id,
      );
    }

    const updated = await this.reservationRepository.save({
      ...oldReservation,
      ...updateReservationDto,
    });

    // Detectar si el anticipo aumentó (nuevo pago)
    if (
      updateReservationDto.anticipo !== undefined &&
      oldReservation.anticipo !== undefined
    ) {
      const diff =
        Number(updateReservationDto.anticipo) - Number(oldReservation.anticipo);
      if (diff > 0) {
        await this.finanzasService.create({
          monto: diff,
          tipo: TipoTransaccion.INGRESO,
          categoria: CategoriaTransaccion.RESERVACION,
          concepto: `Pago/Anticipo de la reserva #${updated.id}`,
          fecha: new Date().toISOString(),
          reservaId: updated.id,
        });
      }
    }

    // Si el estado cambió a 'confirmed' en esta actualización
    if (
      oldReservation.status !== ReservationStatus.CONFIRMED &&
      updated.status === ReservationStatus.CONFIRMED
    ) {
      await this.processConfirmedReservation(updated);
    }

    // Si el estado cambió a 'completed' en esta actualización (Check-out)
    if (
      oldReservation.status !== ReservationStatus.COMPLETED &&
      updated.status === ReservationStatus.COMPLETED
    ) {
      const habitacion = await this.habitacionRepository.findOne({
        where: { id: updated.habitacion_id },
      });
      if (habitacion) {
        habitacion.estadoLimpieza = EstadoLimpieza.POR_ASEAR;
        await this.habitacionRepository.save(habitacion);
      }
    }

    // Si el estado cambió a 'cancelled' (Anular reserva)
    if (
      oldReservation.status !== ReservationStatus.CANCELLED &&
      updated.status === ReservationStatus.CANCELLED
    ) {
      await this.releaseCancelledReservation(updated, oldReservation);
    }

    return updated;
  }

  /** Limpia Calendar y registra la devolución al anular una reserva. */
  private async releaseCancelledReservation(
    updated: Reservation,
    oldReservation: Reservation,
  ) {
    if (oldReservation.googleEventId) {
      const eventId = oldReservation.googleEventId;
      try {
        const deleted = await this.googleCalendarService.deleteEvent(eventId);
        if (deleted) {
          await this.reservationRepository
            .createQueryBuilder()
            .update(Reservation)
            .set({ googleEventId: () => 'NULL' })
            .where('id = :id', { id: updated.id })
            .execute();
          updated.googleEventId = null;
        } else {
          this.logger.warn(
            `No se eliminó el evento ${eventId} de Google Calendar; se conserva googleEventId en la reserva #${updated.id} para reintentar.`,
          );
        }
      } catch (calError) {
        this.logger.warn(
          `No se pudo eliminar evento de Google Calendar al anular reserva: ${this.errorMessage(calError)}. Se conserva googleEventId para reintentar.`,
        );
      }
    }

    const anticipo = Number(oldReservation.anticipo || 0);
    if (anticipo > 0) {
      try {
        await this.finanzasService.create({
          monto: anticipo,
          tipo: TipoTransaccion.EGRESO,
          categoria: CategoriaTransaccion.RESERVACION,
          concepto: `Devolución por anulación de la reserva #${updated.id}`,
          fecha: new Date().toISOString(),
          reservaId: updated.id,
        });
        await this.reservationRepository.update(updated.id, {
          devolucion: anticipo,
        });
        updated.devolucion = anticipo;
      } catch (financeError) {
        this.logger.error(
          `No se pudo registrar la devolución de la reserva #${updated.id}: ${this.errorMessage(financeError)}`,
        );
      }
    }
  }

  async updateStatus(id: number, status: ReservationStatus) {
    if (!status || !Object.values(ReservationStatus).includes(status)) {
      throw new BadRequestException(`Estado inválido: ${status}`);
    }
    return this.update(id, { status });
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);

    if (reservation.googleEventId) {
      try {
        const deleted = await this.googleCalendarService.deleteEvent(
          reservation.googleEventId,
        );
        if (!deleted) {
          this.logger.warn(
            `No se pudo eliminar el evento ${reservation.googleEventId} al borrar la reserva #${id}.`,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Error eliminando evento de Calendar al borrar la reserva #${id}: ${this.errorMessage(error)}`,
        );
      }
    }

    // Conservar el historial contable: desvincular los movimientos antes del delete físico.
    await this.transaccionRepository
      .createQueryBuilder()
      .update(Transaccion)
      .set({ reservaId: () => 'NULL' })
      .where('reservaId = :id', { id })
      .execute();

    return await this.reservationRepository.remove(reservation);
  }

  async addHuesped(
    reservationId: number,
    huespedData: { nombre: string; documento: string },
  ) {
    const reservation = await this.findOne(reservationId);
    const huesped = this.huespedRepository.create({
      ...huespedData,
      reservation,
    });
    return await this.huespedRepository.save(huesped);
  }

  async removeHuesped(huespedId: number) {
    const huesped = await this.huespedRepository.findOne({
      where: { id: huespedId },
    });
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
          reservation.checkIn
            ? reservation.checkIn.toString()
            : 'Fecha por confirmar',
          reservation.checkIn ? reservation.checkIn.toString() : '',
        );
      }

      // 2. Sincronizar con Google Calendar (si ya hay evento, no crear otro)
      try {
        if (reservation.googleEventId) {
          this.logger.warn(
            `La reserva #${reservation.id} ya tiene el evento ${reservation.googleEventId}; se omite la creación de otro.`,
          );
        } else {
          const googleEvent =
            await this.googleCalendarService.createEvent(reservation);
          if (googleEvent && googleEvent.id) {
            // Usamos una actualización directa para evitar loops
            await this.reservationRepository
              .createQueryBuilder()
              .update(Reservation)
              .set({ googleEventId: googleEvent.id })
              .where('id = :id', { id: reservation.id })
              .execute();
            reservation.googleEventId = googleEvent.id;
          }
        }
      } catch (calError) {
        this.logger.warn(
          `No se pudo sincronizar con Google Calendar: ${this.errorMessage(calError)}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error procesando confirmación de reserva: ${this.errorMessage(error)}`,
      );
    }
  }

  async verificarDisponibilidad(
    habitacionId: string,
    checkIn: Date,
    checkOut: Date,
    excludeReservationId?: number,
  ) {
    if (checkOut <= checkIn) {
      throw new NotFoundException(
        'La fecha de check-out debe ser posterior al check-in.',
      );
    }

    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.habitacion_id = :habitacionId', { habitacionId })
      .andWhere('reservation.status NOT IN (:...statuses)', {
        statuses: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED],
      })
      .andWhere(
        '(reservation.checkIn < :checkOut AND reservation.checkOut > :checkIn)',
        {
          checkIn,
          checkOut,
        },
      );

    if (excludeReservationId) {
      query.andWhere('reservation.id != :excludeReservationId', {
        excludeReservationId,
      });
    }

    const overlapping = await query.getOne();

    if (overlapping) {
      throw new NotFoundException(
        'La habitación no está disponible para las fechas seleccionadas.',
      );
    }
  }
}
