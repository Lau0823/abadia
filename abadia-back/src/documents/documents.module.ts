import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { CotizacionesModule } from '../cotizaciones/cotizaciones.module';
import { FacturasModule } from '../facturas/facturas.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [CotizacionesModule, FacturasModule, ClientesModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
