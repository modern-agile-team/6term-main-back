import { UserRepository } from 'src/users/repository/user.repository';
import { Controller, InternalServerErrorException, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/common/s3/s3.service';

@Controller('user/image')
export class UserImageController {
  constructor(private readonly s3Service: S3Service, private userRepository: UserRepository) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('userId') userId: number, @UploadedFile() file: Express.Multer.File) {
    userId = parseInt(userId.toString().slice(1));
    const res = await this.s3Service.imgUpload(file, userId);
    if (res === false) {
      throw new InternalServerErrorException('S3 이미지 업로드에 실패했습니다.');
    } else {
      const imageUrl = res.url;
      
      const updateUserImage = await this.userRepository.updateUserImage(userId, imageUrl);
      if (!updateUserImage) {
        throw new InternalServerErrorException('사용자 이미지 업데이트에 실패했습니다.');
      } else {
        return { status: 'success', message: '이미지 업데이트에 성공했습니다.'};
      }
    }
  }
}
