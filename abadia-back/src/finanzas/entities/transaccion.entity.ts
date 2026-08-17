import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
// Import MetodoPago
import { MetodoPago } from '../../metodosPago/entities/metodo-pago.entity';

export enum TipoTransaccion {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
}

export enum CategoriaTransaccion {
  RESERVACION = 'RESERVACION',
  MANTENIMIENTO = 'MANTENIMIENTO',
  NOMINA = 'NOMINA',
  EXTRAS = 'EXTRAS',
  SERVICIOS_PUBLICOS = 'SERVICIOS_PUBLICOS',
  OTROS = 'OTROS',
}

@Entity('transacciones')
export class Transaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ type: 'enum', enum: TipoTransaccion })
  tipo: TipoTransaccion;

  @Column({ type: 'enum', enum: CategoriaTransaccion })
  categoria: CategoriaTransaccion;

  @Column('text')
  concepto: string; // Ej: "Anticipo de reserva", "Pago factura de luz"

  @Column({ type: 'timestamp' })
  fecha: Date;

  @ManyToOne(() => MetodoPago, { nullable: true })
  @JoinColumn({ name: 'metodoPagoId' })
  metodoPago: MetodoPago;

  @Column({ nullable: true })
  metodoPagoId: number;

  @ManyToOne(() => Reservation, { nullable: true })
  @JoinColumn({ name: 'reservaId' })
  reserva: Reservation;

  @Column({ nullable: true })
  reservaId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
