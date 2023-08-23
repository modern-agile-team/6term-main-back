import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';

import { Test1Controller } from './test1/test1.controller';
import { Test1Service } from './test1/test1.service';
import { Test1Module } from './test1/test1.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMconfig), Test1Module],
  controllers: [Test1Controller],
  providers: [Test1Service],
})
export class AppModule {}
