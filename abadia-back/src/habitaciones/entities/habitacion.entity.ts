import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoHabitacion {
  DISPONIBLE = 'DISPONIBLE',
  MANTENIMIENTO = 'MANTENIMIENTO',
  FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO'
}

export enum EstadoLimpieza {
  LIMPIA = 'LIMPIA',
  POR_ASEAR = 'POR_ASEAR'
}

@Entity('habitaciones')
export class Habitacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  titulo: string; // e.g. "Habitación 1"

  @Column({ length: 100 })
  subtitulo: string; // e.g. "Suite Insignia"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column('text', { nullable: true })
  descripcion: string; // Detalle largo de la suite

  @Column('simple-array', { nullable: true })
  imagenes: string[]; // URLs of the images

  @Column({ length: 100 })
  ocupacion: string; // e.g. "Máx. 2 Adultos"

  @Column('simple-array', { nullable: true })
  comodidades: string[]; // Ej. ["Nevera", "WiFi"]

  @Column({ type: 'enum', enum: EstadoHabitacion, default: EstadoHabitacion.DISPONIBLE })
  estado: EstadoHabitacion;

  @Column({ type: 'enum', enum: EstadoLimpieza, default: EstadoLimpieza.LIMPIA })
  estadoLimpieza: EstadoLimpieza;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
