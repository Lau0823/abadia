import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Habitacion } from '../../habitaciones/entities/habitacion.entity';

export enum CotizacionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_estimado: number;

  @Column({ type: 'enum', enum: CotizacionStatus, default: CotizacionStatus.PENDING })
  status: CotizacionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
