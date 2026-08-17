import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

export enum FacturaStatus {
  EMITIDA = 'EMITIDA',
  CANCELADA = 'CANCELADA',
}

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero_factura: string;

  @OneToOne(() => Reservation, { nullable: false })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reservation;

  @Column()
  reserva_id: number;

  @ManyToOne(() => Cliente, { nullable: false })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column()
  cliente_id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  pdfUrl: string;

  @Column({ type: 'enum', enum: FacturaStatus, default: FacturaStatus.EMITIDA })
  status: FacturaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
