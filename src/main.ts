import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { HttpExceptionFilter } from './http-Exception.filter';
import { setupAsyncApi } from './config/asyncapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  setupSwagger(app);
  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('ma6-main-asyncapi')
    .setDescription('모던애자일 6기 메인프로젝트 AsyncAPI 문서')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .build();

  const asyncapiDocument = await AsyncApiModule.createDocument(
    app,
    asyncApiOptions,
  );
  await AsyncApiModule.setup('asyncapi', app, asyncapiDocument);
  // setupAsyncApi(app);
  app.useLogger(logger);

  await app.listen(3000);
}
bootstrap();
