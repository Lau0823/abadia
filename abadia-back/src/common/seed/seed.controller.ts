import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  async executeSeed() {
    try {
      await this.seedService.runSeed();
      return {
        message: 'Base de datos poblada exitosamente',
        timestamp: new Date().toISOString(),
      };
    } catch (e: unknown) {
      return {
        message: 'Error al ejecutar seeder',
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      };
    }
  }
}
