import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoLimpieza, Habitacion } from './entities/habitacion.entity';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class HabitacionesService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createHabitacionDto: CreateHabitacionDto): Promise<Habitacion> {
    const habitacion = this.habitacionRepository.create(createHabitacionDto);
    return this.habitacionRepository.save(habitacion);
  }

  async findAll(includeInactive = false): Promise<Habitacion[]> {
    return this.habitacionRepository.find({
      where: includeInactive ? {} : { activo: true },
      order: { createdAt: 'DESC' },
    });
  }

  private normalizeDate(date: Date | string, hour: number): Date {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    return new Date(Date.UTC(year, month, day, hour + 5, 0, 0));
  }

  async findDisponibles(
    checkInStr: string,
    checkOutStr: string,
  ): Promise<Habitacion[]> {
    const checkIn = this.normalizeDate(checkInStr, 15);
    const checkOut = this.normalizeDate(checkOutStr, 11);

    const qb = this.habitacionRepository
      .createQueryBuilder('habitacion')
      .where("habitacion.estado = 'DISPONIBLE'")
      .andWhere('habitacion.activo = true')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('reservation.habitacion_id')
          .from('reservations', 'reservation')
          .where("reservation.status NOT IN ('cancelled', 'completed')")
          .andWhere(
            '(reservation.checkIn < :checkOut AND reservation.checkOut > :checkIn)',
          )
          .getQuery();
        return 'habitacion.id NOT IN ' + subQuery;
      })
      .setParameter('checkIn', checkIn)
      .setParameter('checkOut', checkOut)
      .orderBy('habitacion.precio', 'ASC');

    return await qb.getMany();
  }

  async findOne(id: string, includeInactive = false): Promise<Habitacion> {
    const habitacion = await this.habitacionRepository.findOne({
      where: includeInactive ? { id } : { id, activo: true },
    });
    if (!habitacion) {
      throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
    }
    return habitacion;
  }

  async update(
    id: string,
    updateHabitacionDto: UpdateHabitacionDto,
  ): Promise<Habitacion> {
    const habitacion = await this.findOne(id, true);
    const previousImages = Array.isArray(habitacion.imagenes)
      ? [...habitacion.imagenes]
      : [];

    if (Array.isArray(updateHabitacionDto.imagenes)) {
      const nextImages = updateHabitacionDto.imagenes;
      const removedImages = previousImages.filter(
        (url) => !nextImages.includes(url),
      );
      if (removedImages.length > 0) {
        await Promise.allSettled(
          removedImages.map((url) => this.cloudinaryService.deleteByUrl(url)),
        );
      }
    }

    Object.assign(habitacion, updateHabitacionDto);
    return this.habitacionRepository.save(habitacion);
  }

  /**
   * Baja lógica: la habitación deja de mostrarse en la web pero se conservan
   * sus reservas y sus imágenes. Nunca se elimina el registro ni Cloudinary.
   */
  async setActivo(id: string, activo: boolean): Promise<Habitacion> {
    const habitacion = await this.findOne(id, true);
    habitacion.activo = activo;
    return this.habitacionRepository.save(habitacion);
  }

  async deactivate(id: string): Promise<Habitacion> {
    return this.setActivo(id, false);
  }

  async updateLimpieza(id: string, estadoLimpieza: any): Promise<Habitacion> {
    const habitacion = await this.findOne(id, true);
    habitacion.estadoLimpieza = estadoLimpieza as EstadoLimpieza;
    return this.habitacionRepository.save(habitacion);
  }

  async uploadImages(
    id: string,
    files: Express.Multer.File[],
  ): Promise<Habitacion> {
    const habitacion = await this.findOne(id, true);
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'Debe proporcionar al menos un archivo de imagen',
      );
    }

    const existingImages = Array.isArray(habitacion.imagenes)
      ? habitacion.imagenes
      : [];
    const remainingSlots = Math.max(0, 5 - existingImages.length);
    if (remainingSlots === 0) {
      throw new BadRequestException(
        'La habitación ya tiene el máximo de 5 imágenes. Elimina alguna antes de subir nuevas.',
      );
    }

    const filesToUpload = files.slice(0, remainingSlots);
    const uploadPromises = filesToUpload.map((file) =>
      this.cloudinaryService.uploadImage(file),
    );
    const results = await Promise.all(uploadPromises).catch((error) => {
      throw new BadRequestException(
        `Error al subir imágenes a Cloudinary: ${error instanceof Error ? error.message : String(error)}`,
      );
    });

    const newUrls = results.map(
      (res: { secure_url: string }) => res.secure_url,
    );
    habitacion.imagenes = [...existingImages, ...newUrls];
    return this.habitacionRepository.save(habitacion);
  }
}
