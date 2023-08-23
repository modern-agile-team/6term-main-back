import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';

import { Test1Controller } from './test1/test1.controller';
import { Test1Service } from './test1/test1.service';
import { Test1Module } from './test1/test1.module';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMconfig), Test1Module, ImagesModule],
  controllers: [Test1Controller, ImagesController], 
  providers: [Test1Service, ImagesService], 
})
export class AppModule {}
