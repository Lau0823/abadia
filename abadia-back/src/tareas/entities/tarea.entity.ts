import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 50, default: 'PENDIENTE' })
  estado: string; // PENDIENTE, EN_PROGRESO, COMPLETADA

  @Column({ type: 'date', nullable: true })
  fecha_limite: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'asignado_a_id' })
  asignado_a: User | null;

  @Column({ type: 'int', nullable: true })
  asignado_a_id: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: User | null;

  @Column({ type: 'int', nullable: true })
  creado_por_id: number | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
