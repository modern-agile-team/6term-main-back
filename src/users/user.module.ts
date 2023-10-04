import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserImageController } from './controllers/user-image.controller';
import { S3Service } from 'src/common/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { UserImageRepository } from './repositories/user-image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserImageController],
  providers: [
        S3Service, UserImageController, UserRepository, UserImageRepository],
})
export class UserModule {}
