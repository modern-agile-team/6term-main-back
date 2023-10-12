import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './config/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger();
  app.enableCors();
  setupSwagger(app);
  app.useLogger(logger);

  const config = new DocumentBuilder()
    .setTitle('ma6-main API')
    .setDescription('모던애자일 6기 메인프로젝트 API 문서')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', description: '여기에 토큰 입력', in: 'header' }, 'access-token')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
