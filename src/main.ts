import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  setupSwagger(app);
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
