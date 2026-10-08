const { Client } = require('pg');
const crypto = require('crypto');

async function seed() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'abadia',
    password: 'Admin',
    port: 5432,
  });

  try {
    await client.connect();
    console.log("Connected to DB");

    // Seed Habitaciones
    const habitaciones = [
      { titulo: "Habitación 1", subtitulo: "Nuestra suite insignia con tina de hidromasaje exterior y vistas infinitas al valle.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.44.jpeg", precio: 450000, ocupacion: "Máx. 2 Adultos", estado: "DISPONIBLE" },
      { titulo: "Habitación 2", subtitulo: "Equilibrio perfecto entre arquitectura rústica y confort moderno, equipada con chimenea.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.43 (1).jpeg", precio: 320000, ocupacion: "Máx. 2 Adultos + 1 Niño", estado: "DISPONIBLE" },
      { titulo: "Habitación 3", subtitulo: "Un espacio diseñado para el silencio, la lectura y la reconexión espiritual interior.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.43.jpeg", precio: 280000, ocupacion: "Máx. 2 Adultos", estado: "DISPONIBLE" },
      { titulo: "Habitación 4", subtitulo: "Cabaña independiente rodeada de pinos con terraza privada elevada sobre el dosel arbóreo.", imagen: "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", precio: 310000, ocupacion: "Hasta 3 Personas", estado: "DISPONIBLE" },
      { titulo: "Habitación 5", subtitulo: "Orientada al oeste, ofrece los mejores espectáculos cromáticos del crepúsculo desde la cama.", imagen: "/WhatsApp Image 2026-07-08 at 10.54.20 (1).jpeg", precio: 380000, ocupacion: "Máx. 2 Adultos", estado: "DISPONIBLE" },
      { titulo: "Habitación 6", subtitulo: "Techos altos, luz natural cenital y texturas orgánicas inspiradas en la naturaleza local.", imagen: "/WhatsApp Image 2026-07-06 at 20.33.44.jpeg", precio: 290000, ocupacion: "Familiar — Hasta 4 Personas", estado: "DISPONIBLE" }
    ];

    const habIds = [];
    for (const h of habitaciones) {
      const res = await client.query(
        `SELECT id FROM habitaciones WHERE titulo = $1`, [h.titulo]
      );
      if (res.rows.length === 0) {
        const id = crypto.randomUUID();
        habIds.push(id);
        await client.query(
          `INSERT INTO habitaciones (id, titulo, subtitulo, precio, imagen, ocupacion, estado) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, h.titulo, h.subtitulo, h.precio, h.imagen, h.ocupacion, h.estado]
        );
      } else {
        habIds.push(res.rows[0].id);
      }
    }
    console.log("Habitaciones seeded");

    // Clientes
    const clientes = [
      { nombre: 'Juan Pérez', documento: '1020304050', telefono: '3001234567', correo: 'juan.perez@example.com' },
      { nombre: 'María Gómez', documento: '1098765432', telefono: '3109876543', correo: 'maria.gomez@example.com' }
    ];

    const cliIds = [];
    for (const c of clientes) {
      const res = await client.query(
        `INSERT INTO clientes (nombre, documento, telefono, correo) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (documento) DO UPDATE SET nombre = $1 RETURNING id`,
        [c.nombre, c.documento, c.telefono, c.correo]
      );
      cliIds.push(res.rows[0].id);
    }
    console.log("Clientes seeded");

    // Reservaciones
    const now = new Date();
    const c1 = new Date(); c1.setDate(now.getDate() + 5);
    const co1 = new Date(); co1.setDate(now.getDate() + 8);

    const c2 = new Date(); c2.setDate(now.getDate() + 10);
    const co2 = new Date(); co2.setDate(now.getDate() + 12);

    await client.query(
      `INSERT INTO reservations 
       (cliente_id, habitacion_id, "checkIn", "checkOut", "numeroHuespedes", "origenReserva", value, anticipo, status, "paymentStatus", notas_admin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [cliIds[0], habIds[0], c1, co1, 2, 'Directo', 450000 * 3, 450000, 'confirmed', 'partial', 'Reserva de prueba generada por seeder']
    );

    await client.query(
      `INSERT INTO reservations 
       (cliente_id, habitacion_id, "checkIn", "checkOut", "numeroHuespedes", "origenReserva", value, anticipo, status, "paymentStatus", notas_admin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [cliIds[1], habIds[1], c2, co2, 3, 'Booking', 320000 * 2, 640000, 'confirmed', 'paid', 'Segunda reserva de prueba']
    );
    console.log("Reservaciones seeded");

  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
seed();
