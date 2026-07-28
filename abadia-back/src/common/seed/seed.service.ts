import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitacion, EstadoHabitacion } from '../../habitaciones/entities/habitacion.entity';
import { MetodoPago } from '../../metodosPago/entities/metodo-pago.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { Reservation, ReservationStatus, PaymentStatus } from '../../reservations/entities/reservation.entity';
import { User } from '../../users/entities/user.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async runSeed() {
    this.logger.log('Iniciando Seeder...');
    await this.seedUsers();
    await this.seedSettings();
    await this.seedMetodosPago();
    await this.seedHabitaciones();
    await this.seedClientes();
    await this.seedReservations();
    this.logger.log('Seeder completado exitosamente.');
  }

  private async seedUsers() {
    const adminEmail = 'admin@abadia.com';
    const existing = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        nombre: 'Admin Abadía',
        username: 'admin',
        email: adminEmail,
        password_hash: hashedPassword,
        rol: 'admin',
      });
      await this.userRepository.save(admin);
    }
  }

  private async seedSettings() {
    const settings = [
      // SEO
      { key: 'seo_title', value: 'Abadía | Hotel Boutique', description: 'Título de la página' },
      { key: 'seo_description', value: 'Un lugar diseñado para el silencio, la lectura y la reconexión espiritual interior.', description: 'Meta descripción' },

      // HERO
      { key: 'hero_title', value: 'FOTOS SOÑADAS', description: 'Título principal de la portada' },
      { key: 'hero_subtitle', value: 'HAGAMOS DE TUS', description: 'Subtítulo del Hero' },
      { key: 'hero_description', value: 'Fotografía y audiovisual con una mirada editorial, emocional y cinematográfica para parejas que quieren recuerdos que realmente se sientan.', description: 'Texto descriptivo del Hero' },

      // BIENVENIDA
      { key: 'welcome_title', value: 'UNA EXPERIENCIA VISUAL QUE SE SIENTE', description: 'Título de bienvenida' },
      { key: 'welcome_text', value: 'Cada historia merece una estética cuidada, una dirección sensible y una experiencia que conecte desde el primer vistazo hasta la última entrega.', description: 'Texto de bienvenida' },

      // ACERCA DE MI
      { key: 'about_title', value: 'HISTORIAS REALES, MIRADA EDITORIAL', description: 'Título de Acerca de mí' },
      { key: 'about_text_1', value: 'Soy Miles, fotógrafo y productor audiovisual. Mi trabajo nace de la sensibilidad, la estética y la intención de transformar cada momento en una pieza visual con emoción, carácter y presencia.', description: 'Párrafo 1 de biografía' },
      { key: 'about_text_2', value: 'Me interesa crear imágenes que no solo se vean hermosas, sino que también transmitan verdad, atmósfera y una experiencia memorable desde el primer contacto.', description: 'Párrafo 2 de biografía' },

      // SECCIONES
      { key: 'bodas_desc', value: 'Coberturas con una mirada elegante, emocional y cinematográfica para contar tu historia con belleza, sensibilidad y verdad.', description: 'Descripción sección Bodas' },
      { key: 'prebodas_desc', value: 'Sesiones íntimas y editoriales para parejas que quieren imágenes delicadas, naturales y con una narrativa visual especial.', description: 'Descripción sección Prebodas' },
      { key: 'estudio_desc', value: 'Retratos y piezas visuales con una propuesta limpia, refinada y pensada desde la estética, la dirección y el detalle.', description: 'Descripción sección Estudio' },

      // CONTACTO
      { key: 'contact_email', value: 'hola@abadia.com', description: 'Email de contacto' },
      { key: 'contact_phone', value: '573148112717', description: 'WhatsApp' },
      { key: 'instagram_url', value: 'https://instagram.com/abadia', description: 'Instagram' },
      { key: 'whatsapp_number', value: '573148112717', description: 'Número de WhatsApp para cotizaciones' },

      // RECURSOS MULTIMEDIA (CLOUDINARY)
      { key: 'hero_video_url', value: 'https://res.cloudinary.com/dgfp5gcjr/video/upload/v1777429058/VIDEO_1_1_b0wg0m.mp4', description: 'Video principal del inicio' },
      { key: 'middle_video_url', value: 'https://res.cloudinary.com/dgfp5gcjr/video/upload/v1778000231/VIDEO_2_1_ggrrzq.mp4', description: 'Video intermedio de la página' },
      { key: 'about_image_1', value: 'https://res.cloudinary.com/dgfp5gcjr/image/upload/v1777471870/WhatsApp_Image_2026-04-13_at_12.24.20_PM_1_tooe7y.jpg', description: 'Imagen superior de Acerca de Mí' },
      { key: 'about_image_2', value: 'https://res.cloudinary.com/dgfp5gcjr/image/upload/v1777471868/WhatsApp_Image_2026-04-13_at_12.24.19_PM_qibzhs.jpg', description: 'Imagen inferior de Acerca de Mí' },
      { key: 'about_video_url', value: 'https://res.cloudinary.com/dgfp5gcjr/video/upload/v1777429150/VIDEO_4_1_v0pinj.mp4', description: 'Video de la sección nosotros' },
      { key: 'about_title_top', value: '¿QUIÉNES', description: 'Título superior sección nosotros' },
      { key: 'about_title_bottom', value: 'SOMOS?', description: 'Título inferior (script) sección nosotros' },
    ];

    for (const s of settings) {
      let existing = await this.settingRepository.findOne({ where: { key: s.key } });
      if (existing) {
        // Actualizamos el valor si ya existe para asegurar que tenga la URL correcta
        existing.value = s.value;
        await this.settingRepository.save(existing);
      } else {
        await this.settingRepository.save(s);
      }
    }
  }



  private async seedMetodosPago() {
    const metodos = [
      { nombre: 'Bancolombia', descripcion: 'Transferencia directa', activo: true },
      { nombre: 'Zelle', descripcion: 'Pagos internacionales', activo: true },
    ];
    for (const m of metodos) {
      const existing = await this.metodoPagoRepository.findOne({ where: { nombre: m.nombre } });
      if (!existing) await this.metodoPagoRepository.save(m);
    }
  }

  private async seedReservations() {
    const cliente1 = await this.clienteRepository.findOne({ where: { documento: '1020304050' } });
    const cliente2 = await this.clienteRepository.findOne({ where: { documento: '1098765432' } });
    const hab1 = await this.habitacionRepository.findOne({ where: { titulo: 'Habitación 1' } });
    const hab2 = await this.habitacionRepository.findOne({ where: { titulo: 'Habitación 2' } });

    if (cliente1 && hab1) {
      const existing1 = await this.reservationRepository.findOne({ where: { cliente_id: cliente1.id, habitacion_id: hab1.id } });
      if (!existing1) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + 5);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 3);

        const r1: Reservation = this.reservationRepository.create[""]({
          cliente_id: cliente1.id,
          habitacion_id: hab1.id,
          checkIn,
          checkOut,
          numeroHuespedes: 2,
          origenReserva: 'Directo',
          value: 450000 * 3,
          anticipo: 450000,
          status: ReservationStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PARTIAL,
          notas_admin: 'Reserva de prueba generada por seeder',
        });
        await this.reservationRepository.save(r1);
      }
    }

    if (cliente2 && hab2) {
      const existing2 = await this.reservationRepository.findOne({ where: { cliente_id: cliente2.id, habitacion_id: hab2.id } });
      if (!existing2) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + 10);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 2);

        const r2 = this.reservationRepository.create[""]({
          cliente: cliente2,
          habitacion: hab2,
          checkIn,
          checkOut,
          numeroHuespedes: 3,
          origenReserva: 'Booking',
          value: 320000 * 2,
          anticipo: 640000,
          status: ReservationStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          notas_admin: 'Segunda reserva de prueba',
        });
        await this.reservationRepository.save(r2);
      }
    }
  }

  private async seedHabitaciones() {
    const habitaciones = [
      { 
        titulo: "Habitación 1", 
        subtitulo: "Nuestra suite insignia con tina de hidromasaje exterior y vistas infinitas al valle.", 
        descripcion: "Nuestra estancia más majestuosa. Cuenta con una tina de hidromasaje exterior privada y vistas infinitas al valle. Su arquitectura interior expone techos altos con vigas de madera nativa, lencería de cama de 400 hilos y ventanales acústicos de piso a techo.",
        comodidades: ["❄️ Nevera pequeña", "🚿 Baño privado", "📺 Smart TV", "📶 Internet WiFi", "☕ Cafetera"],
        imagenes: ["/WhatsApp Image 2026-07-06 at 20.33.44.jpeg"], 
        precio: 450000, ocupacion: "Máx. 2 Adultos", estado: EstadoHabitacion.DISPONIBLE 
      },
      { 
        titulo: "Habitación 2", 
        subtitulo: "Equilibrio perfecto entre arquitectura rústica y confort moderno, equipada con chimenea.", 
        descripcion: "Equilibrio perfecto entre la calidez rústica caribeña y el minimalismo moderno. Viene equipada con una chimenea privada para las noches frescas y un balcón artesanal diseñado minuciosamente para disfrutar los amaneceres.",
        comodidades: ["❄️ Nevera pequeña", "🚿 Baño privado", "📺 Smart TV", "📶 Internet WiFi", "🔥 Chimenea"],
        imagenes: ["/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg"], 
        precio: 320000, ocupacion: "Máx. 2 Adultos + 1 Niño", estado: EstadoHabitacion.DISPONIBLE 
      },
      { 
        titulo: "Habitación 3", 
        subtitulo: "Un espacio diseñado para el silencio, la lectura y la reconexión espiritual interior.", 
        descripcion: "Un entorno místico ideal para el descanso. Con detalles en madera y piedra que evocan la tranquilidad monástica, cuenta con sábanas de lujo, un pequeño escritorio vintage y acceso rápido al jardín zen central.",
        comodidades: ["🚿 Baño privado", "📶 Internet WiFi", "🧊 Minibar"],
        imagenes: ["/WhatsApp Image 2026-07-06 at 20.33.43.jpeg"], 
        precio: 280000, ocupacion: "Máx. 2 Adultos", estado: EstadoHabitacion.DISPONIBLE 
      },
      { 
        titulo: "Habitación 4", 
        subtitulo: "Cabaña independiente rodeada de pinos con terraza privada elevada sobre el dosel arbóreo.", 
        descripcion: "Sumérgete en la naturaleza con esta cabaña escondida. Sus amplios ventanales permiten observar la flora y fauna local desde la comodidad de una cama queen-size. Incluye una terraza privada para meditar al amanecer.",
        comodidades: ["❄️ Nevera pequeña", "🚿 Baño privado", "📶 Internet WiFi", "☕ Cafetera"],
        imagenes: ["/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg"], 
        precio: 310000, ocupacion: "Hasta 3 Personas", estado: EstadoHabitacion.DISPONIBLE 
      },
      { 
        titulo: "Habitación 5", 
        subtitulo: "Orientada al oeste, ofrece los mejores espectáculos cromáticos del crepúsculo desde la cama.", 
        descripcion: "Diseñada específicamente para capturar la luz del atardecer. Esta habitación goza de tonos dorados por la tarde, combinando mobiliario clásico y amenidades modernas para una experiencia de relajación total.",
        comodidades: ["🚿 Baño privado", "📺 Smart TV", "📶 Internet WiFi", "🌬️ Aire Acondicionado"],
        imagenes: ["/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg"], 
        precio: 380000, ocupacion: "Máx. 2 Adultos", estado: EstadoHabitacion.DISPONIBLE 
      },
      { 
        titulo: "Habitación 6", 
        subtitulo: "Techos altos, luz natural cenital y texturas orgánicas inspiradas en la naturaleza local.", 
        descripcion: "La suite ideal para la familia o grupo de amigos. Espacios amplios y diáfanos que permiten el descanso conjunto sin sacrificar la privacidad. Texturas de lino y algodón complementan la estética orgánica del lugar.",
        comodidades: ["❄️ Nevera pequeña", "🚿 Baño privado", "📺 Smart TV", "📶 Internet WiFi", "☕ Cafetera"],
        imagenes: ["/WhatsApp Image 2026-07-06 at 20.33.44.jpeg"], 
        precio: 290000, ocupacion: "Familiar — Hasta 4 Personas", estado: EstadoHabitacion.DISPONIBLE 
      }
    ];

    for (const h of habitaciones) {
      const existing = await this.habitacionRepository.findOne({ where: { titulo: h.titulo } });
      if (!existing) {
        await this.habitacionRepository.save(h);
      } else {
        existing.subtitulo = h.subtitulo;
        existing.descripcion = h.descripcion;
        existing.comodidades = h.comodidades;
        existing.imagenes = h.imagenes;
        existing.precio = h.precio;
        existing.ocupacion = h.ocupacion;
        existing.estado = h.estado;
        await this.habitacionRepository.save(existing);
      }
    }
  }

  private async seedClientes() {
    const clientes = [
      { nombre: 'Juan Pérez', documento: '1020304050', telefono: '3001234567', correo: 'juan.perez@example.com' },
      { nombre: 'María Gómez', documento: '1098765432', telefono: '3109876543', correo: 'maria.gomez@example.com' }
    ];

    for (const c of clientes) {
      const existing = await this.clienteRepository.findOne({ where: { documento: c.documento } });
      if (!existing) {
        await this.clienteRepository.save(c);
      }
    }
  }
}
