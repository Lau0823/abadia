// Capa de datos harcodeados (mock) para trabajar el panel /admin solo en frontend
// sin necesidad de levantar NestJS ni PostgreSQL.

const daysFromToday = (offsetDays: number, hour = 14): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

interface MockUser {
  id: number;
  username: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
}

interface MockCliente {
  id: string;
  nombre: string;
  documento: string;
  telefono: string;
  correo: string;
}

interface MockHabitacion {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo_habitacion: string;
  descripcion: string;
  precio: number;
  ocupacion: string;
  capacidad: string;
  estado: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO';
  estadoLimpieza: 'LIMPIA' | 'POR_ASEAR';
  imagenes: string[];
  comodidades: string[];
}

interface MockHuesped {
  id: string;
  nombre: string;
  documento: string;
}

interface MockReserva {
  id: string;
  clienteId: string;
  cliente: MockCliente;
  habitacion_id: string;
  habitacion: MockHabitacion;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'in_house' | 'completed' | 'cancelled';
  value: number;
  anticipo: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  numeroAdultos: number;
  numeroNinos: number;
  notas_admin?: string;
  huespedes: MockHuesped[];
}

interface MockCotizacion {
  id: string;
  clienteId: string;
  cliente: MockCliente;
  habitacion_id: string;
  habitacion: MockHabitacion;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  total_estimado: number;
  value: number;
  numeroAdultos: number;
  numeroNinos: number;
}

interface MockTransaccion {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  monto: number;
  tipo: 'INGRESO' | 'EGRESO';
  reservaId?: string;
}

interface MockTarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  fecha_limite: string;
  asignado_a: MockUser | null;
  creado_por: MockUser | null;
}

interface MockSetting {
  key: string;
  value: string;
  description: string;
}

let isLoggedIn = true;

let currentUser: MockUser = {
  id: 1,
  username: 'admin',
  nombre: 'Administrador Demo',
  email: 'admin@hotelabadia.com',
  telefono: '+57 300 123 4567',
  rol: 'superadmin',
};

let users: MockUser[] = [
  currentUser,
  {
    id: 2,
    username: 'laura.recepcion',
    nombre: 'Laura Martínez',
    email: 'laura@hotelabadia.com',
    telefono: '+57 310 456 7890',
    rol: 'admin',
  },
  {
    id: 3,
    username: 'diego.sup',
    nombre: 'Diego Hernández',
    email: 'diego@hotelabadia.com',
    telefono: '+57 315 234 5678',
    rol: 'supervisor',
  },
  {
    id: 4,
    username: 'sofia.aseo',
    nombre: 'Sofía Ramírez',
    email: 'sofia@hotelabadia.com',
    telefono: '+57 320 987 6543',
    rol: 'empleado',
  },
  {
    id: 5,
    username: 'mateo.mant',
    nombre: 'Mateo Castro',
    email: 'mateo@hotelabadia.com',
    telefono: '+57 301 654 3210',
    rol: 'empleado',
  },
];

let habitaciones: MockHabitacion[] = [
  {
    id: 'hab-101',
    titulo: 'Suite Insignia 101',
    subtitulo: 'Vista al jardín y balcón privado',
    tipo_habitacion: 'Suite Insignia',
    descripcion: 'Amplia suite con cama King, balcón panorámico y acabados artesanales en madera.',
    precio: 450000,
    ocupacion: '2 Adultos',
    capacidad: '2 personas',
    estado: 'OCUPADA',
    estadoLimpieza: 'LIMPIA',
    imagenes: ['/DSC05650.jpeg', '/DSC05657.jpeg'],
    comodidades: ['❄️ Aire acondicionado', '🚿 Baño privado', '📺 Smart TV', '📶 WiFi Alta Velocidad'],
  },
  {
    id: 'hab-102',
    titulo: 'Refugio Rústico 102',
    subtitulo: 'Acogedora estancia con terraza',
    tipo_habitacion: 'Refugio Rústico',
    descripcion: 'Habitación tranquila rodeada de vegetación, ideal para escapadas de descanso.',
    precio: 320000,
    ocupacion: '2 Adultos, 1 Niño',
    capacidad: '3 personas',
    estado: 'DISPONIBLE',
    estadoLimpieza: 'POR_ASEAR',
    imagenes: ['/DSC05670.jpeg', '/DSC05671.jpeg'],
    comodidades: ['❄️ Nevera pequeña', '🚿 Baño privado', '📺 Smart TV', '📶 Internet WiFi'],
  },
  {
    id: 'hab-103',
    titulo: 'Suite Principal 103',
    subtitulo: 'Jacuzzi privado y vista al atardecer',
    tipo_habitacion: 'Suite Principal',
    descripcion: 'Nuestra suite más exclusiva con jacuzzi privado, sala de estar y desayuno incluido.',
    precio: 680000,
    ocupacion: '2 Adultos, 2 Niños',
    capacidad: '4 personas',
    estado: 'OCUPADA',
    estadoLimpieza: 'LIMPIA',
    imagenes: ['/DSC05829.jpeg', '/DSC05836.jpeg'],
    comodidades: ['🛁 Jacuzzi privado', '❄️ Aire acondicionado', '📺 Smart TV', '☕ Cafetera'],
  },
  {
    id: 'hab-104',
    titulo: 'Habitación Familiar 104',
    subtitulo: 'Dos camas dobles y zona de lectura',
    tipo_habitacion: 'Habitación Familiar',
    descripcion: 'Espacio diseñado para familias, cerca de la piscina y restaurante.',
    precio: 500000,
    ocupacion: '4 Adultos',
    capacidad: '4 personas',
    estado: 'DISPONIBLE',
    estadoLimpieza: 'LIMPIA',
    imagenes: ['/habitacion6.jpeg', '/abadia.jpeg'],
    comodidades: ['❄️ Aire acondicionado', '🚿 Baño privado', '📺 Smart TV', '📶 Internet WiFi'],
  },
  {
    id: 'hab-105',
    titulo: 'Cabaña del Bosque 105',
    subtitulo: 'Privacidad total junto a la naturaleza',
    tipo_habitacion: 'Cabaña',
    descripcion: 'Cabaña independiente con hamaca, porche privado y sonido natural del entorno.',
    precio: 540000,
    ocupacion: '2 Adultos',
    capacidad: '2 personas',
    estado: 'MANTENIMIENTO',
    estadoLimpieza: 'POR_ASEAR',
    imagenes: ['/DSC05657.jpeg'],
    comodidades: ['🌿 Terraza privada', '🚿 Baño privado', '📶 Internet WiFi'],
  },
  {
    id: 'hab-106',
    titulo: 'Suite Panorámica 106',
    subtitulo: 'Segundo nivel con vista a la piscina',
    tipo_habitacion: 'Suite Panorámica',
    descripcion: 'Luminosa habitación en segundo piso con ventanales amplios y minibar.',
    precio: 420000,
    ocupacion: '2 Adultos, 1 Niño',
    capacidad: '3 personas',
    estado: 'DISPONIBLE',
    estadoLimpieza: 'LIMPIA',
    imagenes: ['/DSC05671.jpeg', '/piscina.png'],
    comodidades: ['❄️ Aire acondicionado', '🍷 Minibar', '📺 Smart TV', '📶 Internet WiFi'],
  },
];

let clientes: MockCliente[] = [
  {
    id: 'cli-1',
    nombre: 'María Fernanda Pérez',
    documento: '1020456789',
    telefono: '+57 310 555 0101',
    correo: 'maria.perez@ejemplo.com',
  },
  {
    id: 'cli-2',
    nombre: 'Carlos Andrés López',
    documento: '71890234',
    telefono: '+57 312 555 0202',
    correo: 'carlos.lopez@ejemplo.com',
  },
  {
    id: 'cli-3',
    nombre: 'Ana Sofía Gómez',
    documento: '1036789123',
    telefono: '+57 300 555 0303',
    correo: 'ana.gomez@ejemplo.com',
  },
  {
    id: 'cli-4',
    nombre: 'Julián Esteban Torres',
    documento: '98765432',
    telefono: '+57 315 555 0404',
    correo: 'julian.torres@ejemplo.com',
  },
  {
    id: 'cli-5',
    nombre: 'Valentina Ríos Mejía',
    documento: '1017234890',
    telefono: '+57 318 555 0505',
    correo: 'valentina.rios@ejemplo.com',
  },
];

let reservas: MockReserva[] = [
  {
    id: '1001',
    clienteId: 'cli-1',
    cliente: clientes[0],
    habitacion_id: 'hab-101',
    habitacion: habitaciones[0],
    checkIn: daysFromToday(-1, 15),
    checkOut: daysFromToday(2, 12),
    status: 'in_house',
    value: 1350000,
    anticipo: 1350000,
    paymentStatus: 'paid',
    numeroAdultos: 2,
    numeroNinos: 0,
    notas_admin: 'Solicitaron decoración romántica para aniversario.',
    huespedes: [
      { id: 'h-1', nombre: 'María Fernanda Pérez', documento: '1020456789' },
      { id: 'h-2', nombre: 'Andrés Felipe Ruiz', documento: '1020998877' },
    ],
  },
  {
    id: '1002',
    clienteId: 'cli-3',
    cliente: clientes[2],
    habitacion_id: 'hab-103',
    habitacion: habitaciones[2],
    checkIn: daysFromToday(0, 14),
    checkOut: daysFromToday(3, 12),
    status: 'in_house',
    value: 2040000,
    anticipo: 1000000,
    paymentStatus: 'partial',
    numeroAdultos: 2,
    numeroNinos: 2,
    notas_admin: 'Llegada temprana confirmada.',
    huespedes: [
      { id: 'h-3', nombre: 'Ana Sofía Gómez', documento: '1036789123' },
    ],
  },
  {
    id: '1003',
    clienteId: 'cli-2',
    cliente: clientes[1],
    habitacion_id: 'hab-102',
    habitacion: habitaciones[1],
    checkIn: daysFromToday(2, 15),
    checkOut: daysFromToday(5, 12),
    status: 'confirmed',
    value: 960000,
    anticipo: 480000,
    paymentStatus: 'partial',
    numeroAdultos: 2,
    numeroNinos: 1,
    notas_admin: 'Requiere cuna adicional.',
    huespedes: [],
  },
  {
    id: '1004',
    clienteId: 'cli-4',
    cliente: clientes[3],
    habitacion_id: 'hab-104',
    habitacion: habitaciones[3],
    checkIn: daysFromToday(4, 15),
    checkOut: daysFromToday(6, 12),
    status: 'pending',
    value: 1000000,
    anticipo: 0,
    paymentStatus: 'pending',
    numeroAdultos: 3,
    numeroNinos: 1,
    huespedes: [],
  },
  {
    id: '1005',
    clienteId: 'cli-5',
    cliente: clientes[4],
    habitacion_id: 'hab-106',
    habitacion: habitaciones[5],
    checkIn: daysFromToday(-5, 15),
    checkOut: daysFromToday(-2, 12),
    status: 'completed',
    value: 1260000,
    anticipo: 1260000,
    paymentStatus: 'paid',
    numeroAdultos: 2,
    numeroNinos: 0,
    huespedes: [],
  },
  {
    id: '1006',
    clienteId: 'cli-2',
    cliente: clientes[1],
    habitacion_id: 'hab-106',
    habitacion: habitaciones[5],
    checkIn: daysFromToday(8, 15),
    checkOut: daysFromToday(10, 12),
    status: 'cancelled',
    value: 840000,
    anticipo: 0,
    paymentStatus: 'pending',
    numeroAdultos: 2,
    numeroNinos: 0,
    notas_admin: 'Cancelada por cambio de itinerario.',
    huespedes: [],
  },
];

let cotizaciones: MockCotizacion[] = [
  {
    id: '2001',
    clienteId: 'cli-4',
    cliente: clientes[3],
    habitacion_id: 'hab-103',
    habitacion: habitaciones[2],
    checkIn: daysFromToday(7, 15),
    checkOut: daysFromToday(10, 12),
    status: 'PENDING',
    total_estimado: 2040000,
    value: 2040000,
    numeroAdultos: 2,
    numeroNinos: 0,
  },
  {
    id: '2002',
    clienteId: 'cli-5',
    cliente: clientes[4],
    habitacion_id: 'hab-104',
    habitacion: habitaciones[3],
    checkIn: daysFromToday(11, 15),
    checkOut: daysFromToday(13, 12),
    status: 'PENDING',
    total_estimado: 1000000,
    value: 1000000,
    numeroAdultos: 4,
    numeroNinos: 0,
  },
];

let transacciones: MockTransaccion[] = [
  {
    id: 'tx-1',
    fecha: daysFromToday(-1, 11),
    concepto: 'Pago total estancia Suite Insignia 101 - María Fernanda Pérez',
    categoria: 'HOSPEDAJE',
    monto: 1350000,
    tipo: 'INGRESO',
    reservaId: '1001',
  },
  {
    id: 'tx-2',
    fecha: daysFromToday(0, 9),
    concepto: 'Anticipo 50% Suite Principal 103 - Ana Sofía Gómez',
    categoria: 'HOSPEDAJE',
    monto: 1000000,
    tipo: 'INGRESO',
    reservaId: '1002',
  },
  {
    id: 'tx-3',
    fecha: daysFromToday(-2, 16),
    concepto: 'Anticipo Refugio Rústico 102 - Carlos Andrés López',
    categoria: 'HOSPEDAJE',
    monto: 480000,
    tipo: 'INGRESO',
    reservaId: '1003',
  },
  {
    id: 'tx-4',
    fecha: daysFromToday(-2, 10),
    concepto: 'Compra insumos de lavandería y amenities',
    categoria: 'INSUMOS',
    monto: 340000,
    tipo: 'EGRESO',
  },
  {
    id: 'tx-5',
    fecha: daysFromToday(-3, 14),
    concepto: 'Mantenimiento preventivo aire acondicionado Cabaña 105',
    categoria: 'MANTENIMIENTO',
    monto: 280000,
    tipo: 'EGRESO',
  },
  {
    id: 'tx-6',
    fecha: daysFromToday(-4, 18),
    concepto: 'Consumos restaurante y bebidas fin de semana',
    categoria: 'RESTAURANTE',
    monto: 620000,
    tipo: 'INGRESO',
  },
];

let tareas: MockTarea[] = [
  {
    id: 1,
    titulo: '[Refugio Rústico 102] Limpieza general y cambio de lencería',
    descripcion: '[hab_id:hab-102] Preparar habitación para check-in de mañana y verificar minibar.',
    estado: 'PENDIENTE',
    fecha_limite: daysFromToday(1, 12),
    asignado_a: users[3],
    creado_por: users[0],
  },
  {
    id: 2,
    titulo: '[Cabaña del Bosque 105] Revisión de plomería y pintura de deck',
    descripcion: '[hab_id:hab-105] Ajustar llave de ducha y retocar barniz de la terraza.',
    estado: 'EN_PROGRESO',
    fecha_limite: daysFromToday(2, 17),
    asignado_a: users[4],
    creado_por: users[2],
  },
  {
    id: 3,
    titulo: '[Suite Insignia 101] Reposición de cortesías y flores',
    descripcion: '[hab_id:hab-101] Arreglo floral de bienvenida para aniversario.',
    estado: 'COMPLETADA',
    fecha_limite: daysFromToday(-1, 13),
    asignado_a: users[3],
    creado_por: users[1],
  },
  {
    id: 4,
    titulo: 'Inventario semanal de bodega y cafetería',
    descripcion: 'Validar stock de café de origen, agua embotellada y frutas para desayunos.',
    estado: 'PENDIENTE',
    fecha_limite: daysFromToday(3, 10),
    asignado_a: users[2],
    creado_por: users[0],
  },
];

let settings: MockSetting[] = [
  { key: 'nombre_hotel', value: 'Hotel La Abadía', description: 'Nombre de la marca mostrado en el sitio web y facturas.' },
  { key: 'telefono', value: '+57 300 123 4567', description: 'Número de teléfono para contacto directo y reservas.' },
  { key: 'whatsapp', value: '+57 300 123 4567', description: 'WhatsApp oficial donde se enviarán consultas de huéspedes.' },
  { key: 'email_contacto', value: 'contacto@hotelabadia.com', description: 'Email donde llegarán las confirmaciones.' },
  { key: 'direccion', value: 'San Antero, Córdoba - Colombia', description: 'Ubicación del hotel.' },
  { key: 'horario_atencion', value: 'Recepción 24/7 | Check-in 3:00 PM - Check-out 12:00 PM', description: 'Horario de recepción.' },
  { key: 'facebook', value: 'https://facebook.com/hotelabadia', description: 'URL de Facebook.' },
  { key: 'instagram', value: 'https://instagram.com/hotelabadia', description: 'URL de Instagram.' },
  { key: 'tiktok', value: 'https://tiktok.com/@hotelabadia', description: 'URL de TikTok.' },
  { key: 'tripadvisor', value: 'https://tripadvisor.com', description: 'Perfil de TripAdvisor.' },
  { key: 'hero_title', value: 'Vive una experiencia inolvidable de descanso', description: 'Título principal.' },
  { key: 'hero_subtitle', value: 'Naturaleza, tranquilidad y hospitalidad en un solo lugar.', description: 'Subtítulo de bienvenida.' },
  { key: 'politica_cancelacion', value: 'Cancelaciones gratuitas con 48 horas de anticipación.', description: 'Políticas de cancelación.' },
  { key: 'google_calendar_id', value: 'primary', description: 'ID de Google Calendar.' },
  { key: 'logo_principal', value: '/logo.png', description: 'Logo principal.' },
  { key: 'logo_secundario', value: '/abadia.png', description: 'Logo del panel admin.' },
  { key: 'login_bg', value: '/abadia.jpeg', description: 'Fondo de login.' },
  { key: 'guide_sec_1_img', value: '/abadia.jpeg', description: 'Imagen historia.' },
  { key: 'guide_sec_1_title', value: 'Nuestra Historia', description: 'Título historia.' },
  { key: 'guide_sec_1_desc', value: 'Un refugio creado para desconectarse y disfrutar la calma del Caribe colombiano.', description: 'Descripción historia.' },
  { key: 'guide_sec_2_img', value: '/gastronomia.png', description: 'Imagen gastronomía.' },
  { key: 'guide_sec_2_title', value: 'Gastronomía Local', description: 'Título gastronomía.' },
  { key: 'guide_sec_2_desc', value: 'Sabores frescos del mar y recetas tradicionales preparadas al momento.', description: 'Descripción gastronomía.' },
  { key: 'guide_sec_3_img', value: '/piscina.png', description: 'Imagen bienestar.' },
  { key: 'guide_sec_3_title', value: 'Bienestar y Descanso', description: 'Título bienestar.' },
  { key: 'guide_sec_3_desc', value: 'Piscina al aire libre, zonas verdes y atardeceres inolvidables.', description: 'Descripción bienestar.' },
  { key: 'plan_1_img', value: '/DSC05829.jpeg', description: 'Imagen plan 1.' },
  { key: 'plan_1_title', value: 'Escapada Romántica', description: 'Título plan 1.' },
  { key: 'plan_1_subtitle', value: '2 noches para parejas', description: 'Subtítulo plan 1.' },
  { key: 'plan_1_tag', value: 'Más Popular', description: 'Etiqueta plan 1.' },
  { key: 'plan_1_price', value: '$890.000 COP', description: 'Precio plan 1.' },
  { key: 'plan_1_desc', value: 'Incluye cena a la luz de las velas, decoración especial y desayuno.', description: 'Descripción plan 1.' },
  { key: 'plan_2_img', value: '/Restaurante.png', description: 'Imagen plan 2.' },
  { key: 'plan_2_title', value: 'Pasadía Abadía', description: 'Título plan 2.' },
  { key: 'plan_2_subtitle', value: 'Día completo de descanso', description: 'Subtítulo plan 2.' },
  { key: 'plan_2_tag', value: 'Recomendado', description: 'Etiqueta plan 2.' },
  { key: 'plan_2_price', value: '$140.000 COP', description: 'Precio plan 2.' },
  { key: 'plan_2_desc', value: 'Acceso a piscina, almuerzo típico y bebida de bienvenida.', description: 'Descripción plan 2.' },
  { key: 'plan_3_img', value: '/atardecer.jpg', description: 'Imagen plan 3.' },
  { key: 'plan_3_title', value: 'Fin de Semana Familiar', description: 'Título plan 3.' },
  { key: 'plan_3_subtitle', value: 'Hasta 4 personas', description: 'Subtítulo plan 3.' },
  { key: 'plan_3_tag', value: 'Familia', description: 'Etiqueta plan 3.' },
  { key: 'plan_3_price', value: '$1.450.000 COP', description: 'Precio plan 3.' },
  { key: 'plan_3_desc', value: 'Alojamiento en habitación familiar con desayunos incluidos.', description: 'Descripción plan 3.' },
  { key: 'turismo_1_img', value: '/cispata.png', description: 'Imagen turismo 1.' },
  { key: 'turismo_1_lugar', value: 'San Antero', description: 'Lugar turismo 1.' },
  { key: 'turismo_1_title', value: 'Bahía de Cispatá', description: 'Título turismo 1.' },
  { key: 'turismo_1_price', value: '$80.000 COP', description: 'Precio turismo 1.' },
  { key: 'turismo_2_img', value: '/caimanera.png', description: 'Imagen turismo 2.' },
  { key: 'turismo_2_lugar', value: 'Coveñas', description: 'Lugar turismo 2.' },
  { key: 'turismo_2_title', value: 'Ciénaga de la Caimanera', description: 'Título turismo 2.' },
  { key: 'turismo_2_price', value: '$65.000 COP', description: 'Precio turismo 2.' },
  { key: 'turismo_3_img', value: '/otroslugares.png', description: 'Imagen turismo 3.' },
  { key: 'turismo_3_lugar', value: 'Córdoba', description: 'Lugar turismo 3.' },
  { key: 'turismo_3_title', value: 'Volcán de Lodo', description: 'Título turismo 3.' },
  { key: 'turismo_3_price', value: '$50.000 COP', description: 'Precio turismo 3.' },
];

const parseBody = (body?: BodyInit | null): any => {
  if (!body || typeof body !== 'string') return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const computeDashboardStats = () => {
  const activeReservations = reservas.filter((r) => r.status === 'in_house' || r.status === 'confirmed');
  const inHouse = reservas.filter((r) => r.status === 'in_house');
  const huespedesAdultos = inHouse.reduce((sum, r) => sum + Number(r.numeroAdultos || 0), 0);
  const huespedesNinos = inHouse.reduce((sum, r) => sum + Number(r.numeroNinos || 0), 0);
  const ingresosMes = transacciones
    .filter((t) => t.tipo === 'INGRESO')
    .reduce((sum, t) => sum + Number(t.monto || 0), 0);

  const ocupadasCount = habitaciones.filter((h) => h.estado === 'OCUPADA').length;
  const tasaOcupacion = habitaciones.length > 0 ? Math.round((ocupadasCount / habitaciones.length) * 100) : 0;

  const estadoHabitaciones = habitaciones.map((h) => {
    const resActiva = inHouse.find((r) => r.habitacion_id === h.id);
    return {
      id: h.id,
      titulo: h.titulo,
      capacidad: h.capacidad || h.ocupacion,
      estado: h.estado,
      estadoLimpieza: h.estadoLimpieza,
      huespedesActuales: resActiva ? resActiva.numeroAdultos + resActiva.numeroNinos : 0,
    };
  });

  const proximasCitas = activeReservations.slice(0, 5).map((r) => ({
    id: r.id,
    inicial: (r.cliente?.nombre || 'H').charAt(0).toUpperCase(),
    clienteNombre: r.cliente?.nombre || 'Huésped',
    fechaTexto: new Intl.DateTimeFormat('es-CO', { month: 'short', day: '2-digit' }).format(new Date(r.checkIn)),
    habitacionNombre: r.habitacion?.titulo || 'Habitación',
  }));

  return {
    totalClientes: clientes.length,
    huespedesTotal: huespedesAdultos + huespedesNinos,
    huespedesAdultos,
    huespedesNinos,
    citasHoy: activeReservations.length,
    ingresosMes,
    tasaOcupacion,
    proximasCitas,
    estadoHabitaciones,
  };
};

export async function mockFetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const method = (options.method || 'GET').toUpperCase();
  const [rawPath, queryString] = endpoint.split('?');
  const path = rawPath.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(queryString || '');
  const search = (params.get('search') || '').trim().toLowerCase();
  const body = parseBody(options.body);

  // Pequeña pausa imperceptible para mantener el comportamiento asíncrono realista
  if (typeof window !== 'undefined') {
    await new Promise((resolve) => setTimeout(resolve, 60));
  }

  // --- AUTH ---
  if (path === '/auth/check-session' && method === 'GET') {
    return isLoggedIn ? { user: currentUser } : { user: null };
  }
  if (path === '/auth/login' && method === 'POST') {
    isLoggedIn = true;
    if (body.email) {
      currentUser = { ...currentUser, email: body.email };
    }
    return { user: currentUser };
  }
  if (path === '/auth/logout' && method === 'POST') {
    isLoggedIn = false;
    return { ok: true };
  }

  // --- DASHBOARD ---
  if (path === '/dashboard/stats' && method === 'GET') {
    return computeDashboardStats();
  }

  // --- USERS / PROFILE ---
  if (path === '/users/profile' && method === 'GET') {
    return currentUser;
  }
  if (path === '/users/profile' && (method === 'PATCH' || method === 'PUT')) {
    currentUser = { ...currentUser, ...body };
    users = users.map((u) => (u.id === currentUser.id ? currentUser : u));
    return currentUser;
  }
  if (path === '/users/profile/change-password' && method === 'POST') {
    return { ok: true, message: 'Contraseña actualizada (modo demo)' };
  }
  if (path === '/users' && method === 'GET') {
    const filtered = search
      ? users.filter(
          (u) =>
            u.nombre.toLowerCase().includes(search) ||
            u.username.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        )
      : users;
    return filtered;
  }
  if (path === '/users' && method === 'POST') {
    const created: MockUser = {
      id: Date.now(),
      username: body.username || `user${users.length + 1}`,
      nombre: body.nombre || body.username || 'Nuevo Empleado',
      email: body.email || '',
      telefono: body.telefono || '',
      rol: body.rol || 'empleado',
    };
    users = [created, ...users];
    return created;
  }
  if (path.startsWith('/users/') && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    users = users.map((u) => (String(u.id) === id ? { ...u, ...body } : u));
    return users.find((u) => String(u.id) === id) || null;
  }
  if (path.startsWith('/users/') && method === 'DELETE') {
    const id = path.split('/')[2];
    users = users.filter((u) => String(u.id) !== id);
    return null;
  }

  // --- CLIENTES ---
  if (path === '/clientes' && method === 'GET') {
    const filtered = search
      ? clientes.filter(
          (c) =>
            c.nombre.toLowerCase().includes(search) ||
            c.documento.toLowerCase().includes(search) ||
            c.correo.toLowerCase().includes(search)
        )
      : clientes;
    return { data: filtered, total: filtered.length };
  }
  if (path === '/clientes' && method === 'POST') {
    const created: MockCliente = {
      id: `cli-${Date.now()}`,
      nombre: body.nombre || 'Nuevo Cliente',
      documento: body.documento || 'N/A',
      telefono: body.telefono || '',
      correo: body.correo || '',
    };
    clientes = [created, ...clientes];
    return created;
  }
  if (path.startsWith('/clientes/') && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    clientes = clientes.map((c) => (String(c.id) === id ? { ...c, ...body } : c));
    return clientes.find((c) => String(c.id) === id) || null;
  }
  if (path.startsWith('/clientes/') && method === 'DELETE') {
    const id = path.split('/')[2];
    clientes = clientes.filter((c) => String(c.id) !== id);
    return null;
  }

  // --- HABITACIONES ---
  if (path === '/habitaciones/disponibles' && method === 'GET') {
    return habitaciones.filter((h) => h.estado !== 'MANTENIMIENTO');
  }
  if (path === '/habitaciones' && method === 'GET') {
    return habitaciones;
  }
  if (path === '/habitaciones' && method === 'POST') {
    const created: MockHabitacion = {
      id: `hab-${Date.now()}`,
      titulo: body.titulo || 'Nueva Habitación',
      subtitulo: body.subtitulo || 'Estancia confortable',
      tipo_habitacion: body.tipo_habitacion || body.subtitulo || 'Estándar',
      descripcion: body.descripcion || '',
      precio: Number(body.precio || 350000),
      ocupacion: body.ocupacion || '2 Adultos',
      capacidad: body.capacidad || body.ocupacion || '2 personas',
      estado: body.estado || 'DISPONIBLE',
      estadoLimpieza: body.estadoLimpieza || 'LIMPIA',
      imagenes: body.imagenes || ['/DSC05650.jpeg'],
      comodidades: body.comodidades || ['❄️ Aire acondicionado', '🚿 Baño privado', '📶 WiFi'],
    };
    habitaciones = [...habitaciones, created];
    return created;
  }
  if (/^\/habitaciones\/[^/]+\/limpieza$/.test(path) && method === 'PATCH') {
    const id = path.split('/')[2];
    habitaciones = habitaciones.map((h) =>
      String(h.id) === id ? { ...h, estadoLimpieza: body.estadoLimpieza || h.estadoLimpieza } : h
    );
    return habitaciones.find((h) => String(h.id) === id) || null;
  }
  if (/^\/habitaciones\/[^/]+\/imagenes$/.test(path) && method === 'POST') {
    const id = path.split('/')[2];
    const hab = habitaciones.find((h) => String(h.id) === id);
    if (hab && typeof window !== 'undefined' && options.body instanceof FormData) {
      const files = options.body.getAll('files').concat(options.body.getAll('imagenes'));
      const urls = files
        .filter((f): f is File => f instanceof File)
        .map((f) => URL.createObjectURL(f));
      if (urls.length > 0) {
        hab.imagenes = [...hab.imagenes, ...urls];
      }
    }
    return hab || { ok: true };
  }
  if (/^\/habitaciones\/[^/]+$/.test(path) && method === 'GET') {
    const id = path.split('/')[2];
    return habitaciones.find((h) => String(h.id) === id) || habitaciones[0] || null;
  }
  if (/^\/habitaciones\/[^/]+$/.test(path) && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    habitaciones = habitaciones.map((h) =>
      String(h.id) === id ? { ...h, ...body, precio: body.precio !== undefined ? Number(body.precio) : h.precio } : h
    );
    return habitaciones.find((h) => String(h.id) === id) || null;
  }
  if (/^\/habitaciones\/[^/]+$/.test(path) && method === 'DELETE') {
    const id = path.split('/')[2];
    habitaciones = habitaciones.filter((h) => String(h.id) !== id);
    return null;
  }

  // --- RESERVAS ---
  if (path === '/reservations' && method === 'GET') {
    const filtered = search
      ? reservas.filter(
          (r) =>
            r.cliente?.nombre.toLowerCase().includes(search) ||
            r.habitacion?.titulo.toLowerCase().includes(search) ||
            String(r.id).includes(search)
        )
      : reservas;
    return filtered;
  }
  if ((path === '/reservations' || path === '/reservations/book') && method === 'POST') {
    const clienteObj =
      clientes.find((c) => String(c.id) === String(body.clienteId || body.cliente_id)) ||
      (body.nombre
        ? {
            id: `cli-${Date.now()}`,
            nombre: body.nombre,
            documento: body.documento || 'N/A',
            telefono: body.telefono || '',
            correo: body.correo || body.email || '',
          }
        : clientes[0]);
    const habObj =
      habitaciones.find((h) => String(h.id) === String(body.habitacionId || body.habitacion_id)) || habitaciones[0];
    const value = Number(body.value || body.total || habObj.precio);
    const anticipo = Number(body.anticipo || 0);
    const paymentStatus: 'pending' | 'partial' | 'paid' =
      anticipo >= value && value > 0 ? 'paid' : anticipo > 0 ? 'partial' : 'pending';

    const created: MockReserva = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      clienteId: clienteObj.id,
      cliente: clienteObj,
      habitacion_id: habObj.id,
      habitacion: habObj,
      checkIn: body.checkIn || daysFromToday(1, 15),
      checkOut: body.checkOut || daysFromToday(3, 12),
      status: body.status || 'confirmed',
      value,
      anticipo,
      paymentStatus: body.paymentStatus || paymentStatus,
      numeroAdultos: Number(body.numeroAdultos || 2),
      numeroNinos: Number(body.numeroNinos || 0),
      notas_admin: body.notas_admin || '',
      huespedes: [],
    };
    reservas = [created, ...reservas];
    return created;
  }
  if (/^\/reservations\/[^/]+\/status$/.test(path) && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    reservas = reservas.map((r) => (String(r.id) === id ? { ...r, status: body.status } : r));
    return reservas.find((r) => String(r.id) === id) || null;
  }
  if (/^\/reservations\/[^/]+\/huespedes$/.test(path) && method === 'POST') {
    const id = path.split('/')[2];
    const newGuest: MockHuesped = {
      id: `h-${Date.now()}`,
      nombre: body.nombre || 'Acompañante',
      documento: body.documento || 'N/A',
    };
    reservas = reservas.map((r) =>
      String(r.id) === id ? { ...r, huespedes: [...(r.huespedes || []), newGuest] } : r
    );
    return newGuest;
  }
  if (/^\/reservations\/huespedes\/[^/]+$/.test(path) && method === 'DELETE') {
    const guestId = path.split('/')[3];
    reservas = reservas.map((r) => ({
      ...r,
      huespedes: (r.huespedes || []).filter((h) => String(h.id) !== guestId),
    }));
    return null;
  }
  if (/^\/reservations\/[^/]+$/.test(path) && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    reservas = reservas.map((r) => {
      if (String(r.id) !== id) return r;
      const nextHab =
        body.habitacionId || body.habitacion_id
          ? habitaciones.find((h) => String(h.id) === String(body.habitacionId || body.habitacion_id)) || r.habitacion
          : r.habitacion;
      const nextValue = body.value !== undefined ? Number(body.value) : r.value;
      const nextAnticipo = body.anticipo !== undefined ? Number(body.anticipo) : r.anticipo;
      const nextPaymentStatus: 'pending' | 'partial' | 'paid' =
        body.paymentStatus ||
        (nextAnticipo >= nextValue && nextValue > 0 ? 'paid' : nextAnticipo > 0 ? 'partial' : 'pending');
      return {
        ...r,
        ...body,
        habitacion: nextHab,
        habitacion_id: nextHab.id,
        value: nextValue,
        anticipo: nextAnticipo,
        paymentStatus: nextPaymentStatus,
      };
    });
    return reservas.find((r) => String(r.id) === id) || null;
  }

  // --- COTIZACIONES ---
  if (path === '/cotizaciones' && method === 'GET') {
    const filtered = search
      ? cotizaciones.filter(
          (c) =>
            c.cliente?.nombre.toLowerCase().includes(search) ||
            c.habitacion?.titulo.toLowerCase().includes(search) ||
            String(c.id).includes(search)
        )
      : cotizaciones;
    return filtered;
  }
  if (path === '/cotizaciones' && method === 'POST') {
    const clienteObj =
      clientes.find((c) => String(c.id) === String(body.clienteId || body.cliente_id)) || clientes[0];
    const habObj =
      habitaciones.find((h) => String(h.id) === String(body.habitacionId || body.habitacion_id)) || habitaciones[0];
    const total = Number(body.total_estimado || body.value || habObj.precio);
    const created: MockCotizacion = {
      id: String(Math.floor(2000 + Math.random() * 8000)),
      clienteId: clienteObj.id,
      cliente: clienteObj,
      habitacion_id: habObj.id,
      habitacion: habObj,
      checkIn: body.checkIn || daysFromToday(5, 15),
      checkOut: body.checkOut || daysFromToday(7, 12),
      status: 'PENDING',
      total_estimado: total,
      value: total,
      numeroAdultos: Number(body.numeroAdultos || 2),
      numeroNinos: Number(body.numeroNinos || 0),
    };
    cotizaciones = [created, ...cotizaciones];
    return created;
  }
  if (/^\/cotizaciones\/[^/]+\/status$/.test(path) && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    cotizaciones = cotizaciones.map((c) => (String(c.id) === id ? { ...c, status: body.status } : c));
    return cotizaciones.find((c) => String(c.id) === id) || null;
  }
  if (/^\/cotizaciones\/[^/]+\/convertir$/.test(path) && method === 'POST') {
    const id = path.split('/')[2];
    const quote = cotizaciones.find((c) => String(c.id) === id);
    if (quote) {
      quote.status = 'ACCEPTED';
      const anticipo = Number(body.anticipo || 0);
      const paymentStatus: 'pending' | 'partial' | 'paid' =
        anticipo >= quote.total_estimado ? 'paid' : anticipo > 0 ? 'partial' : 'pending';
      const newRes: MockReserva = {
        id: String(Math.floor(1000 + Math.random() * 9000)),
        clienteId: quote.clienteId,
        cliente: quote.cliente,
        habitacion_id: quote.habitacion_id,
        habitacion: quote.habitacion,
        checkIn: quote.checkIn,
        checkOut: quote.checkOut,
        status: 'confirmed',
        value: quote.total_estimado,
        anticipo,
        paymentStatus,
        numeroAdultos: quote.numeroAdultos,
        numeroNinos: quote.numeroNinos,
        huespedes: [],
      };
      reservas = [newRes, ...reservas];
      return newRes;
    }
    return { ok: true };
  }

  // --- FINANZAS ---
  if (path === '/finanzas' && method === 'GET') {
    return transacciones;
  }
  if (path === '/finanzas' && method === 'POST') {
    const created: MockTransaccion = {
      id: `tx-${Date.now()}`,
      fecha: body.fecha || new Date().toISOString(),
      concepto: body.concepto || 'Transacción registrada',
      categoria: body.categoria || 'GENERAL',
      monto: Number(body.monto || 0),
      tipo: body.tipo === 'EGRESO' ? 'EGRESO' : 'INGRESO',
      reservaId: body.reservaId,
    };
    transacciones = [created, ...transacciones];
    return created;
  }

  // --- TAREAS ---
  if (path === '/tareas' && method === 'GET') {
    return tareas;
  }
  if (path === '/tareas' && method === 'POST') {
    const asignado = users.find((u) => String(u.id) === String(body.asignadoAId || body.asignado_a_id)) || null;
    const created: MockTarea = {
      id: Date.now(),
      titulo: body.titulo || 'Nueva tarea',
      descripcion: body.descripcion || '',
      estado: body.estado || 'PENDIENTE',
      fecha_limite: body.fecha_limite || daysFromToday(1, 16),
      asignado_a: asignado,
      creado_por: currentUser,
    };
    tareas = [created, ...tareas];
    return created;
  }
  if (/^\/tareas\/[^/]+$/.test(path) && (method === 'PATCH' || method === 'PUT')) {
    const id = path.split('/')[2];
    tareas = tareas.map((t) => {
      if (String(t.id) !== id) return t;
      const asignado =
        body.asignadoAId || body.asignado_a_id
          ? users.find((u) => String(u.id) === String(body.asignadoAId || body.asignado_a_id)) || t.asignado_a
          : t.asignado_a;
      return { ...t, ...body, asignado_a: asignado };
    });
    return tareas.find((t) => String(t.id) === id) || null;
  }
  if (/^\/tareas\/[^/]+$/.test(path) && method === 'DELETE') {
    const id = path.split('/')[2];
    tareas = tareas.filter((t) => String(t.id) !== id);
    return null;
  }

  // --- SETTINGS ---
  if (path === '/settings' && method === 'GET') {
    return settings;
  }
  if (path === '/settings/batch' && method === 'POST') {
    const incoming: MockSetting[] = Array.isArray(body.settings) ? body.settings : [];
    incoming.forEach((item) => {
      const idx = settings.findIndex((s) => s.key === item.key);
      if (idx >= 0) {
        settings[idx] = { ...settings[idx], value: item.value, description: item.description ?? settings[idx].description };
      } else {
        settings.push({ key: item.key, value: item.value, description: item.description || '' });
      }
    });
    return { ok: true, settings };
  }
  if (path.startsWith('/settings/upload-image/') && method === 'POST') {
    const key = path.replace('/settings/upload-image/', '');
    let url = '/abadia.jpeg';
    if (typeof window !== 'undefined' && options.body instanceof FormData) {
      const file = options.body.get('file');
      if (file instanceof File) {
        url = URL.createObjectURL(file);
      }
    }
    const idx = settings.findIndex((s) => s.key === key);
    if (idx >= 0) {
      settings[idx] = { ...settings[idx], value: url };
    } else {
      settings.push({ key, value: url, description: '' });
    }
    return { key, value: url };
  }

  console.warn(`[mockApi] Endpoint no manejado: ${method} ${endpoint}`);
  return null;
}
