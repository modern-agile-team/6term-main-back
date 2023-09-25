import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './config/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: true, // 프론트엔드 주소
    // credentials: true, // 요청에 쿠키 포함 여부 설정 (withCredentials : true)
  };

  app.enableCors(corsOptions);
  const logger = new Logger();
  setupSwagger(app);
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
