import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Habitacion } from '../../habitaciones/entities/habitacion.entity';
import { Huesped } from './huesped.entity';

export enum ReservationStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PARTIAL = 'partial',
    PAID = 'paid',
}

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cliente, { nullable: false })
    @JoinColumn({ name: 'cliente_id' })
    cliente: Cliente;

    @Column()
    cliente_id: number;

    @ManyToOne(() => Habitacion, { nullable: false })
    @JoinColumn({ name: 'habitacion_id' })
    habitacion: Habitacion;

    @Column('uuid')
    habitacion_id: string;

    @Column({ type: 'timestamp' })
    checkIn: Date;

    @Column({ type: 'timestamp' })
    checkOut: Date;

    @Column({ type: 'int', default: 1 })
    numeroAdultos: number;

    @Column({ type: 'int', default: 0 })
    numeroNinos: number;

    @Column({ nullable: true })
    origenReserva: string; // e.g. "Booking", "Directo"

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    anticipo: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    devolucion: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gastos_operativos: number;

    @Column({ type: 'text', nullable: true })
    notas_admin: string;

    @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
    status: ReservationStatus;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Column({ nullable: true })
    googleEventId: string;

    @OneToMany(() => Huesped, huesped => huesped.reservation)
    huespedes: Huesped[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
