import { Module } from '@nestjs/common';
import { Test1Controller } from './test1.controller';
import { Test1Service } from './test1.service';

@Module({
  // controller와 service가 모듈에 정의되어야 컨트롤러,서비스 안에서 이용가능합니다.
  controllers: [Test1Controller],
  providers: [Test1Service],
})
export class Test1Module {} // 서버테스트입니다
