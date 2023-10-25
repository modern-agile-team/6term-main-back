import { INestApplication } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

export async function setupAsyncApi(app: INestApplication) {
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
}
