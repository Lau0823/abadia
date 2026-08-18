import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura, FacturaStatus } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    const d = new Date();
    let retries = 5;
    let offset = 1;

    while (retries > 0) {
      try {
        const count = await this.facturaRepository.count();
        const numero_factura = `F-${d.getFullYear()}-${(count + offset).toString().padStart(4, '0')}`;

        const factura = this.facturaRepository.create({
          ...createFacturaDto,
          numero_factura,
        });
        return await this.facturaRepository.save(factura);
      } catch (error: any) {
        if (error.code === '23505') {
          retries--;
          offset++;
          if (retries === 0) {
            throw new Error('No se pudo generar un número de factura único. Por favor intente nuevamente.');
          }
        } else {
          throw error;
        }
      }
    }
    throw new Error('Error al generar factura');
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.facturaRepository.createQueryBuilder('factura')
      .leftJoinAndSelect('factura.reserva', 'reserva')
      .leftJoinAndSelect('factura.cliente', 'cliente')
      .orderBy('factura.createdAt', 'DESC');

    if (search) {
      query.andWhere('(cliente.nombre ILIKE :search OR cliente.correo ILIKE :search OR factura.numero_factura ILIKE :search OR CAST(factura.id AS TEXT) ILIKE :search)', { search: `%${search}%` });
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

  async findOne(id: string): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: ['reserva', 'cliente'],
    });
    if (!factura) {
      throw new NotFoundException(`Factura con id ${id} no encontrada`);
    }
    return factura;
  }

  async updateStatus(id: string, status: FacturaStatus): Promise<Factura> {
    const factura = await this.findOne(id);
    factura.status = status;
    return await this.facturaRepository.save(factura);
  }
}
