import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Añade el valor `in_house` al enum del estado de las reservas.
 *
 * Es idempotente: busca el tipo enum real asociado a reservations.status y sólo
 * agrega el valor si no existe. Se ejecuta fuera de transacción porque
 * `ALTER TYPE ... ADD VALUE` no puede correr dentro de un bloque transaccional
 * en versiones de PostgreSQL anteriores a la 12.
 */
export class AddInHouseReservationStatus1795230000000
  implements MigrationInterface
{
  name = 'AddInHouseReservationStatus1795230000000';
  transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        enum_type_name text;
      BEGIN
        SELECT t.typname INTO enum_type_name
        FROM pg_type t
        JOIN pg_attribute a ON a.atttypid = t.oid
        JOIN pg_class c ON c.oid = a.attrelid
        WHERE c.relname = 'reservations'
          AND a.attname = 'status'
          AND t.typtype = 'e'
        LIMIT 1;

        IF enum_type_name IS NOT NULL AND NOT EXISTS (
          SELECT 1
          FROM pg_enum e
          JOIN pg_type t ON t.oid = e.enumtypid
          WHERE t.typname = enum_type_name
            AND e.enumlabel = 'in_house'
        ) THEN
          EXECUTE format('ALTER TYPE %I ADD VALUE %L', enum_type_name, 'in_house');
        END IF;
      END
      $$;
    `);
  }

  public down(): Promise<void> {
    // PostgreSQL no permite eliminar valores de un enum; se deja sin efecto.
    return Promise.resolve();
  }
}
