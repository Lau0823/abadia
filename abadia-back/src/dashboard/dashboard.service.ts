import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { Habitacion } from '../habitaciones/entities/habitacion.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
  ) {}

  async getStats() {
    // 1. Total Clientes
    const totalClientes = await this.clienteRepository.count();

    // 2. Citas/Reservas Hoy (checkIn happens today or is currently ongoing)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const citasHoy = await this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.status != :status', { status: ReservationStatus.CANCELLED })
      .andWhere('reservation.checkIn < :tomorrow', { tomorrow })
      .andWhere('reservation.checkOut >= :today', { today })
      .getCount();

    // 3. Ingresos del Mes (Reservations created this month, or checkIn this month)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await this.reservationRepository.createQueryBuilder('reservation')
      .select('SUM(reservation.value)', 'total')
      .where('reservation.status != :status', { status: ReservationStatus.CANCELLED })
      .andWhere('reservation.checkIn >= :start', { start: startOfMonth })
      .andWhere('reservation.checkIn <= :end', { end: endOfMonth })
      .getRawOne();
      
    const ingresosMes = result?.total ? parseFloat(result.total) : 0;

    // 4. Próximas Citas (upcoming 3 reservations from today onwards)
    const proximasCitas = await this.reservationRepository.find({
      where: {
        checkIn: MoreThanOrEqual(today),
      },
      relations: ['cliente', 'habitacion'],
      order: {
        checkIn: 'ASC',
      },
      take: 3,
    });

    // Formatting for frontend
    const proximasCitasFormatted = proximasCitas.map((res) => {
      const checkInDate = new Date(res.checkIn);
      const timeStr = checkInDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const dateStr = checkInDate.toLocaleDateString('es-CO');
      
      const isToday = checkInDate.toDateString() === today.toDateString();
      
      return {
        id: res.id,
        clienteNombre: res.cliente?.nombre || 'Cliente Desconocido',
        inicial: res.cliente?.nombre?.charAt(0).toUpperCase() || 'C',
        habitacionNombre: res.habitacion?.titulo || 'Habitación',
        fechaTexto: isToday ? `Hoy, ${timeStr}` : `${dateStr}, ${timeStr}`,
        status: res.status
      };
    });

    // 5. Tasa de ocupacion y Estado de Habitaciones
    const todasLasHabitaciones = await this.habitacionRepository.find({ order: { titulo: 'ASC' } });
    const totalHabitaciones = todasLasHabitaciones.length;
    
    // We calculate occupied rooms today
    const activeReservations = await this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.status != :status', { status: ReservationStatus.CANCELLED })
      .andWhere('reservation.checkIn <= :todayStr', { todayStr: today })
      .andWhere('reservation.checkOut > :todayStr', { todayStr: today })
      .getMany();
      
    const occupiedToday = activeReservations.length;
    const tasaOcupacion = totalHabitaciones > 0 ? Math.round((occupiedToday / totalHabitaciones) * 100) : 0;

    let huespedesAdultos = 0;
    let huespedesNinos = 0;
    
    activeReservations.forEach(res => {
      huespedesAdultos += (res.numeroAdultos || 0);
      huespedesNinos += (res.numeroNinos || 0);
    });
    
    const huespedesTotal = huespedesAdultos + huespedesNinos;

    const estadoHabitaciones = todasLasHabitaciones.map(hab => {
      const activeRes = activeReservations.find(res => res.habitacion_id === hab.id);
      const isOccupied = !!activeRes;
      let huespedesActuales = 0;
      if (isOccupied) {
        huespedesActuales = (activeRes.numeroAdultos || 0) + (activeRes.numeroNinos || 0);
      }
      return {
        id: hab.id,
        titulo: hab.titulo,
        estado: isOccupied ? 'OCUPADA' : hab.estado, // OCUPADA if currently reserved
        estadoLimpieza: hab.estadoLimpieza,
        capacidad: hab.ocupacion,
        huespedesActuales
      };
    });

    return {
      totalClientes,
      huespedesTotal,
      huespedesAdultos,
      huespedesNinos,
      citasHoy,
      ingresosMes,
      tasaOcupacion,
      proximasCitas: proximasCitasFormatted,
      estadoHabitaciones,
    };
  }
}
