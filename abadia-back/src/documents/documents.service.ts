import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import type { Response } from 'express';
import { CotizacionesService } from '../cotizaciones/cotizaciones.service';
import { FacturasService } from '../facturas/facturas.service';

@Injectable()
export class DocumentsService {
  private readonly colorPrimario = '#3d342e'; // Dark ink
  private readonly colorSecundario = '#7a6e5d'; // Sage / Accent
  private readonly colorFondo = '#f4f1ea'; // Cream
  private readonly colorGris = '#888888';

  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly facturasService: FacturasService,
  ) {}

  async buildCotizacionPdf(id: string, res: Response): Promise<void> {
    const cotizacion = await this.cotizacionesService.findOne(id);
    if (!cotizacion) throw new NotFoundException('Cotizacion no encontrada');

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    
    // Pipe to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cotizacion_${cotizacion.numero_cotizacion || id}.pdf`);
    doc.pipe(res);

    const docId = cotizacion.numero_cotizacion || `COT-${cotizacion.id.split('-')[0].toUpperCase()}`;
    this.generateHeader(doc, 'COTIZACIÓN', docId);
    this.generateCustomerInformation(doc, cotizacion.cliente, cotizacion.createdAt);
    
    // Table
    const tableTop = 330;
    this.generateTableHeader(doc, tableTop, ['Descripción', 'Habitación', 'Ocupación', 'Total Estimado']);
    
    const ocupacion = `${cotizacion.numeroAdultos} Ads, ${cotizacion.numeroNinos} Niñ`;
    this.generateTableRow(
      doc, 
      tableTop + 35, 
      'Estadía en Hotel Boutique', 
      cotizacion.habitacion.titulo, 
      ocupacion,
      `$${Number(cotizacion.total_estimado).toLocaleString('es-CO')}`
    );

    this.generateFooter(doc);
    doc.end();
  }

  async buildFacturaPdf(id: string, res: Response): Promise<void> {
    const factura = await this.facturasService.findOne(id);
    if (!factura) throw new NotFoundException('Factura no encontrada');

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    
    // Pipe to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura_${factura.numero_factura}.pdf`);
    doc.pipe(res);

    this.generateHeader(doc, 'FACTURA', `${factura.numero_factura}`);
    this.generateCustomerInformation(doc, factura.cliente, factura.createdAt);
    
    // Table
    const tableTop = 330;
    this.generateTableHeader(doc, tableTop, ['Descripción', 'Concepto', 'Referencia', 'Total']);
    
    this.generateTableRow(
      doc, 
      tableTop + 35, 
      `Servicios de Alojamiento`, 
      'Reserva Confirmada', 
      `#${factura.reserva_id ? factura.reserva_id.toString().substring(0,8) : 'N/A'}`,
      `$${Number(factura.total).toLocaleString('es-CO')}`
    );

    this.generateFooter(doc);
    doc.end();
  }

  private generateHeader(doc: typeof PDFDocument, docType: string, idText: string) {
    // Fondo del Header
    doc.rect(0, 0, 600, 150).fill(this.colorPrimario);

    // Texto La Abadía
    doc
      .fillColor(this.colorFondo)
      .fontSize(28)
      .text('LA ABADÍA', 50, 50, { characterSpacing: 4 })
      .fontSize(10)
      .fillColor(this.colorSecundario)
      .text('H O T E L  B O U T I Q U E', 50, 85, { characterSpacing: 2 });

    // Tipo de Documento
    doc
      .fillColor(this.colorFondo)
      .fontSize(20)
      .text(docType, 350, 50, { align: 'right', width: 200, characterSpacing: 2 })
      .fontSize(12)
      .fillColor(this.colorSecundario)
      .text(idText, 350, 75, { align: 'right', width: 200 });
  }

  private generateCustomerInformation(doc: typeof PDFDocument, cliente: any, date: Date) {
    const top = 200;

    // Titulo Sección
    doc
      .fillColor(this.colorPrimario)
      .fontSize(14)
      .text('Información del Cliente', 50, top)
      .moveTo(50, top + 20)
      .lineTo(550, top + 20)
      .lineWidth(0.5)
      .strokeColor(this.colorSecundario)
      .stroke();

    // Datos
    doc
      .fontSize(10)
      .fillColor(this.colorGris)
      .text('Fecha de Emisión:', 50, top + 35)
      .fillColor(this.colorPrimario)
      .text(date.toLocaleDateString('es-CO'), 150, top + 35)
      
      .fillColor(this.colorGris)
      .text('Nombre:', 50, top + 55)
      .fillColor(this.colorPrimario)
      .text(cliente?.nombre || 'Consumidor Final', 150, top + 55)
      
      .fillColor(this.colorGris)
      .text('Documento:', 50, top + 75)
      .fillColor(this.colorPrimario)
      .text(cliente?.documento || 'N/A', 150, top + 75);
  }

  private generateTableHeader(doc: typeof PDFDocument, y: number, headers: string[]) {
    doc.rect(50, y, 500, 25).fill(this.colorFondo);
    
    doc.fillColor(this.colorPrimario).fontSize(10);
    doc.text(headers[0], 60, y + 8);
    doc.text(headers[1], 200, y + 8);
    doc.text(headers[2], 350, y + 8);
    doc.text(headers[3], 450, y + 8, { width: 90, align: 'right' });
  }

  private generateTableRow(doc: typeof PDFDocument, y: number, col1: string, col2: string, col3: string, col4: string) {
    doc.fillColor(this.colorPrimario).fontSize(10);
    doc.text(col1, 60, y);
    doc.text(col2, 200, y);
    doc.text(col3, 350, y);
    doc.text(col4, 450, y, { width: 90, align: 'right' });

    // Línea separadora
    doc
      .moveTo(50, y + 20)
      .lineTo(550, y + 20)
      .lineWidth(0.5)
      .strokeColor('#dddddd')
      .stroke();
  }

  private generateFooter(doc: typeof PDFDocument) {
    doc
      .rect(0, 750, 600, 100)
      .fill(this.colorFondo);

    doc
      .fillColor(this.colorPrimario)
      .fontSize(12)
      .text('Gracias por elegir La Abadía', 50, 770, { align: 'center', width: 500 })
      .fontSize(9)
      .fillColor(this.colorGris)
      .text('San Antero, Córdoba, Colombia', 50, 790, { align: 'center', width: 500 })
      .text('contacto@laabadia.com | +57 300 000 0000', 50, 805, { align: 'center', width: 500 });
  }
}
