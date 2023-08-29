import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { Image } from './entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
