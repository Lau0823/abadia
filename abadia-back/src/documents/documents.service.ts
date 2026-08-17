import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import type { Response } from 'express';
import { CotizacionesService } from '../cotizaciones/cotizaciones.service';
import { FacturasService } from '../facturas/facturas.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly facturasService: FacturasService,
  ) {}

  async buildCotizacionPdf(id: string, res: Response): Promise<void> {
    const cotizacion = await this.cotizacionesService.findOne(id);
    if (!cotizacion) throw new NotFoundException('Cotizacion no encontrada');

    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cotizacion_${id}.pdf`);
    doc.pipe(res);

    this.generateHeader(doc, 'COTIZACIÓN', `Cotización #${cotizacion.id.split('-')[0].toUpperCase()}`);
    this.generateCustomerInformation(doc, cotizacion.cliente, cotizacion.createdAt);
    
    // Table
    doc.moveDown();
    const tableTop = 330;
    this.generateTableRow(doc, tableTop, 'Descripción', 'Habitación', 'Adultos', 'Niños', 'Total');
    this.generateHr(doc, tableTop + 20);
    this.generateTableRow(
      doc, 
      tableTop + 30, 
      'Estadía', 
      cotizacion.habitacion.titulo, 
      cotizacion.numeroAdultos.toString(), 
      cotizacion.numeroNinos.toString(), 
      `$${cotizacion.total_estimado}`
    );

    doc.end();
  }

  async buildFacturaPdf(id: string, res: Response): Promise<void> {
    const factura = await this.facturasService.findOne(id);
    if (!factura) throw new NotFoundException('Factura no encontrada');

    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura_${factura.numero_factura}.pdf`);
    doc.pipe(res);

    this.generateHeader(doc, 'FACTURA', `Factura ${factura.numero_factura}`);
    this.generateCustomerInformation(doc, factura.cliente, factura.createdAt);
    
    // Table
    doc.moveDown();
    const tableTop = 330;
    this.generateTableRow(doc, tableTop, 'Descripción', '', '', '', 'Total');
    this.generateHr(doc, tableTop + 20);
    this.generateTableRow(
      doc, 
      tableTop + 30, 
      `Reservación en Abadia`, 
      '', 
      '', 
      '', 
      `$${factura.total}`
    );

    doc.end();
  }

  private generateHeader(doc: typeof PDFDocument, docType: string, idText: string) {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('La Abadía', 50, 57)
      .fontSize(10)
      .text('Hotel Boutique', 50, 80)
      .fontSize(10)
      .text(docType, 400, 50, { align: 'right' })
      .text(idText, 400, 65, { align: 'right' })
      .moveDown();
  }

  private generateCustomerInformation(doc: typeof PDFDocument, cliente: any, date: Date) {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('Facturar a', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Fecha:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(date.toLocaleDateString(), 150, customerInformationTop)
      .font('Helvetica')
      .text('Cliente:', 50, customerInformationTop + 15)
      .text(cliente.nombre, 150, customerInformationTop + 15)
      .text('Documento:', 50, customerInformationTop + 30)
      .text(cliente.documento, 150, customerInformationTop + 30)
      .moveDown();

    this.generateHr(doc, 252);
  }

  private generateTableRow(doc: typeof PDFDocument, y: number, item: string, description: string, unitCost: string, quantity: string, lineTotal: string) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  private generateHr(doc: typeof PDFDocument, y: number) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
}
