import { UserRepository } from 'src/users/repository/user.repository';
import { Controller, InternalServerErrorException, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/common/s3/s3.service';

@Controller('user/image')
export class UserImageController {
  constructor(
    private readonly s3Service: S3Service,
    private userRepository: UserRepository
    ) {}

  @Patch(':userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('userId') userId: number, @UploadedFile() file: Express.Multer.File) {
    userId = parseInt(userId.toString().slice(1)); // userId 앞에 붙는 ':' 제거
    const res = await this.s3Service.imgUpload(file, userId); // S3에 이미지 업로드
    if (res === false) { // S3에 이미지 업로드 실패
      throw new InternalServerErrorException('S3 이미지 업로드에 실패했습니다.');
    } else { // S3에 이미지 업로드 성공
      const imageUrl = res.url; // S3에 업로드된 이미지 URL
      
      const checkUserImage = (await this.userRepository.checkUserImage(userId)).imageUrl; // DB에 이미지가 있는지 확인
      const imageUrlParts = checkUserImage.split('/');
      const imageKey = imageUrlParts[imageUrlParts.length - 1]; // S3에 업로드된 이미지의 키
      const dbImageUrl = imageUrlParts[imageUrlParts.length - 2]; // 이미지 제공자 이름
      
      if (dbImageUrl == 'ma6-main.s3.ap-northeast-2.amazonaws.com' && imageKey !== 'default_user_image.png') { // S3에 업로드된 이미지이고, 기본 이미지가 아닌 경우
        await this.s3Service.deleteImage(imageKey); // S3에 업로드된 기존 이미지 삭제
      }

      const updateUserImage = await this.userRepository.updateUserImage(userId, imageUrl); // DB에 이미지 URL 업데이트
      if (!updateUserImage) {
        throw new InternalServerErrorException('사용자 이미지 업데이트에 실패했습니다.');
      } else {
        return { status: 'success', message: '이미지 업데이트에 성공했습니다.'};
      }
    }
  }
}
