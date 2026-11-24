import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { CotizacionesService } from '../cotizaciones/cotizaciones.service';
import { FacturasService } from '../facturas/facturas.service';

@Injectable()
export class DocumentsService {
  // Paleta alineada con el panel /admin (globals.css)
  private readonly colorAzul = '#0f4c81'; // --mv-blue (corporativo)
  private readonly colorAzulOscuro = '#0b3c66';
  private readonly colorInk = '#2d2a27'; // --mv-ink
  private readonly colorDorado = '#bea27a'; // --mv-gold
  private readonly colorCrema = '#f4f0ea'; // --mv-cream
  private readonly colorGris = '#64748b';
  private readonly colorBlanco = '#ffffff';

  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly facturasService: FacturasService,
  ) {}

  private resolveLogoPath(): string | null {
    const candidates = [
      path.join(__dirname, '..', 'assets', 'logo.png'),
      path.join(process.cwd(), 'dist', 'assets', 'logo.png'),
      path.join(process.cwd(), 'src', 'assets', 'logo.png'),
      path.join(process.cwd(), '..', 'abadia-front', 'public', 'logo_color.png'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return null;
  }

  async buildCotizacionPdf(id: string, res: Response): Promise<void> {
    const cotizacion = await this.cotizacionesService.findOne(id);
    if (!cotizacion) throw new NotFoundException('Cotizacion no encontrada');

    const doc = new PDFDocument({ margin: 0, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=cotizacion_${cotizacion.numero_cotizacion || id}.pdf`,
    );
    doc.pipe(res);

    const docId =
      cotizacion.numero_cotizacion ||
      `COT-${cotizacion.id.split('-')[0].toUpperCase()}`;
    this.generateHeader(doc, 'COTIZACIÓN', docId);
    this.generateCustomerInformation(
      doc,
      cotizacion.cliente,
      cotizacion.createdAt,
      cotizacion.checkIn,
      cotizacion.checkOut,
    );

    const tableTop = 335;
    this.generateTableHeader(doc, tableTop, [
      'Descripción',
      'Habitación',
      'Ocupación',
      'Total Estimado',
    ]);

    const ocupacion = `${cotizacion.numeroAdultos} Ads, ${cotizacion.numeroNinos} Niñ`;
    this.generateTableRow(
      doc,
      tableTop + 36,
      'Estadía en Abadía',
      cotizacion.habitacion?.titulo || 'Habitación',
      ocupacion,
      `$${Number(cotizacion.total_estimado).toLocaleString('es-CO')}`,
    );

    this.generateFooter(doc);
    doc.end();
  }

  async buildFacturaPdf(id: string, res: Response): Promise<void> {
    const factura = await this.facturasService.findOne(id);
    if (!factura) throw new NotFoundException('Factura no encontrada');

    const doc = new PDFDocument({ margin: 0, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=factura_${factura.numero_factura}.pdf`,
    );
    doc.pipe(res);

    this.generateHeader(doc, 'FACTURA', `${factura.numero_factura}`);
    this.generateCustomerInformation(doc, factura.cliente, factura.createdAt);

    const tableTop = 335;
    this.generateTableHeader(doc, tableTop, [
      'Descripción',
      'Concepto',
      'Referencia',
      'Total',
    ]);

    this.generateTableRow(
      doc,
      tableTop + 36,
      'Estadía en Abadía',
      'Reserva Confirmada',
      `#${factura.reserva_id ? factura.reserva_id.toString().substring(0, 8) : 'N/A'}`,
      `$${Number(factura.total).toLocaleString('es-CO')}`,
    );

    this.generateFooter(doc);
    doc.end();
  }

  private generateHeader(
    doc: typeof PDFDocument,
    docType: string,
    idText: string,
  ) {
    const pageWidth = doc.page.width;

    // Fondo azul corporativo igual al panel admin
    doc.rect(0, 0, pageWidth, 138).fill(this.colorAzul);
    // Franja inferior decorativa
    doc.rect(0, 138, pageWidth, 4).fill(this.colorDorado);

    // Logo oficial de Abadía
    const logoPath = this.resolveLogoPath();
    if (logoPath) {
      doc.image(logoPath, 46, 16, { fit: [120, 106], align: 'left', valign: 'center' });
    } else {
      doc
        .fillColor(this.colorBlanco)
        .font('Helvetica-Bold')
        .fontSize(28)
        .text('ABADÍA', 50, 46, { characterSpacing: 4 })
        .font('Helvetica')
        .fontSize(10)
        .fillColor(this.colorDorado)
        .text('C A S A   H O T E L', 50, 82, { characterSpacing: 2 });
    }

    // Tipo de Documento y Referencia
    doc
      .fillColor(this.colorBlanco)
      .font('Helvetica-Bold')
      .fontSize(20)
      .text(docType, 340, 46, {
        align: 'right',
        width: 205,
        characterSpacing: 2,
      })
      .font('Helvetica')
      .fontSize(11)
      .fillColor(this.colorCrema)
      .text(idText, 340, 74, { align: 'right', width: 205 });
  }

  private generateCustomerInformation(
    doc: typeof PDFDocument,
    cliente: { nombre?: string; documento?: string; correo?: string; telefono?: string } | null,
    date: Date,
    checkIn?: Date,
    checkOut?: Date,
  ) {
    const top = 185;

    doc
      .fillColor(this.colorAzul)
      .font('Helvetica-Bold')
      .fontSize(13)
      .text('Información del Cliente', 50, top)
      .moveTo(50, top + 20)
      .lineTo(545, top + 20)
      .lineWidth(1)
      .strokeColor(this.colorAzul)
      .stroke();

    doc.font('Helvetica').fontSize(10);

    // Columna izquierda
    doc
      .fillColor(this.colorGris)
      .text('Fecha de Emisión:', 50, top + 34)
      .fillColor(this.colorInk)
      .font('Helvetica-Bold')
      .text(new Date(date).toLocaleDateString('es-CO'), 155, top + 34)

      .font('Helvetica')
      .fillColor(this.colorGris)
      .text('Nombre:', 50, top + 54)
      .fillColor(this.colorInk)
      .font('Helvetica-Bold')
      .text(cliente?.nombre || 'Consumidor Final', 155, top + 54)

      .font('Helvetica')
      .fillColor(this.colorGris)
      .text('Documento:', 50, top + 74)
      .fillColor(this.colorInk)
      .text(cliente?.documento || 'N/A', 155, top + 74);

    // Columna derecha (fechas de estadía si existen)
    if (checkIn && checkOut) {
      doc
        .fillColor(this.colorGris)
        .text('Check-in:', 345, top + 34)
        .fillColor(this.colorInk)
        .font('Helvetica-Bold')
        .text(new Date(checkIn).toLocaleDateString('es-CO'), 420, top + 34)

        .font('Helvetica')
        .fillColor(this.colorGris)
        .text('Check-out:', 345, top + 54)
        .fillColor(this.colorInk)
        .font('Helvetica-Bold')
        .text(new Date(checkOut).toLocaleDateString('es-CO'), 420, top + 54);
    }

    if (cliente?.telefono) {
      doc
        .font('Helvetica')
        .fillColor(this.colorGris)
        .text('Teléfono:', 345, top + 74)
        .fillColor(this.colorInk)
        .text(cliente.telefono, 420, top + 74);
    }
  }

  private generateTableHeader(
    doc: typeof PDFDocument,
    y: number,
    headers: string[],
  ) {
    doc.roundedRect(50, y, 495, 28, 6).fill(this.colorAzul);

    doc.fillColor(this.colorBlanco).font('Helvetica-Bold').fontSize(9.5);
    doc.text(headers[0], 62, y + 9);
    doc.text(headers[1], 200, y + 9);
    doc.text(headers[2], 350, y + 9);
    doc.text(headers[3], 445, y + 9, { width: 88, align: 'right' });
  }

  private generateTableRow(
    doc: typeof PDFDocument,
    y: number,
    col1: string,
    col2: string,
    col3: string,
    col4: string,
  ) {
    doc.fillColor(this.colorInk).font('Helvetica').fontSize(10);
    doc.text(col1, 62, y);
    doc.text(col2, 200, y);
    doc.text(col3, 350, y);
    doc.font('Helvetica-Bold').fillColor(this.colorAzul);
    doc.text(col4, 445, y, { width: 88, align: 'right' });

    doc
      .moveTo(50, y + 22)
      .lineTo(545, y + 22)
      .lineWidth(0.75)
      .strokeColor('#e2e8f0')
      .stroke();
  }

  private generateFooter(doc: typeof PDFDocument) {
    const pageWidth = doc.page.width;
    const footerTop = doc.page.height - 92;

    doc.rect(0, footerTop, pageWidth, 92).fill(this.colorCrema);
    doc.rect(0, footerTop, pageWidth, 2).fill(this.colorAzulOscuro);

    doc
      .fillColor(this.colorAzul)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('Gracias por elegir Abadía', 50, footerTop + 22, {
        align: 'center',
        width: pageWidth - 100,
      })
      .font('Helvetica')
      .fontSize(9)
      .fillColor(this.colorGris)
      .text('Abadía Casa Hotel • Playa Blanca, San Antero, Córdoba, Colombia', 50, footerTop + 42, {
        align: 'center',
        width: pageWidth - 100,
      })
      .text('WhatsApp: +57 312 237 3415', 50, footerTop + 57, {
        align: 'center',
        width: pageWidth - 100,
      });
  }
}
