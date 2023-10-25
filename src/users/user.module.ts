import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserImageController } from './controllers/user-image.controller';
import { S3Service } from 'src/common/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { UserImageRepository } from './repositories/user-image.repository';
import { UserImageService } from './services/user-image.service';
import { TokenService } from 'src/auth/services/token.service';
import { TokenRepository } from 'src/auth/repositories/token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UserImageController],
  providers: [
        S3Service, UserRepository, UserImageRepository, UserService, UserImageService, TokenService, TokenRepository],
})
export class UserModule {}
