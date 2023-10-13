import { TokenService } from './../../auth/services/token.service';
import { Controller, Headers, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageService } from '../services/user-image.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user/image')
@ApiTags('user API')
export class UserImageController {
  constructor(
    private readonly userImageService: UserImageService,
    private readonly tokenService: TokenService
    ) {}

  @ApiOperation({ summary: '유저 이미지 업로드 API', description: '유저 이미지 업로드 API' })
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Headers('access_token') accessToken: string, @UploadedFile() file: Express.Multer.File) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.userImageService.uploadImage(userId, file);
  }
}
