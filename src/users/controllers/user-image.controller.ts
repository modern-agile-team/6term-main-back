import { Controller, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageService } from '../services/user-image.service';

@Controller('user/image')
export class UserImageController {
  constructor(private readonly userImageService: UserImageService) {}

  @Patch(':userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('userId') userId: number, @UploadedFile() file: Express.Multer.File) {
    return this.userImageService.uploadImage(userId, file);
  }
}
