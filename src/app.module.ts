import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';

import { Test1Controller } from './test1/test1.controller';
import { Test1Service } from './test1/test1.service';
import { Test1Module } from './test1/test1.module';
import UploadsController from './uploads/uploads.controller';
import { UploadsService } from './uploads/uploads.service';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMconfig), Test1Module, UploadsModule],
  controllers: [Test1Controller, UploadsController], 
  providers: [Test1Service, UploadsService], 
})
export class AppModule {}
