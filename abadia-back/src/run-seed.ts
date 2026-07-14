import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './common/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.runSeed();
  await app.close();
}

bootstrap();
