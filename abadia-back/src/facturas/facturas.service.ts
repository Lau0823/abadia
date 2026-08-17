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
    // Generar un número de factura simple (ej: F-2023-0001)
    const count = await this.facturaRepository.count();
    const numero_factura = `F-${d.getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    const factura = this.facturaRepository.create({
      ...createFacturaDto,
      numero_factura,
    });
    return await this.facturaRepository.save(factura);
  }

  async findAll(): Promise<Factura[]> {
    return await this.facturaRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['reserva', 'cliente'],
    });
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
