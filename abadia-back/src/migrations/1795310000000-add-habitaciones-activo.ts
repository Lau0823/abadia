import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Da de baja habitaciones sin borrarlas: `activo = false` las oculta de la web
 * pero conserva sus reservas y sus fotos. Es idempotente para poder reintentar
 * el deploy si la migración anterior quedó a medias.
 */
export class AddHabitacionesActivo1795310000000 implements MigrationInterface {
  name = 'AddHabitacionesActivo1795310000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "habitaciones" ADD COLUMN IF NOT EXISTS "activo" boolean NOT NULL DEFAULT true',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "habitaciones" DROP COLUMN IF EXISTS "activo"',
    );
  }
}
