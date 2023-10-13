import { TokenService } from './../../auth/services/token.service';
import { Controller, Headers, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageService } from '../services/user-image.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user/image')
@ApiTags('user API')
export class UserImageController {
  constructor(
    private readonly userImageService: UserImageService,
    private readonly tokenService: TokenService
    ) {}

  @ApiOperation({ summary: '유저 이미지 업로드 API', description: '유저 이미지 업로드 API' })
  @ApiResponse({ status: 200, description: '성공적으로 이미지를 업로드한 경우', content: { JSON: { example: { message: '이미지 업로드에 성공했습니다.' } } } })
  @ApiResponse({ status: 500, description: '이미지 업로드 및 처리 중 오류가 발생한 경우', content: { JSON: { example: { statusCode: 500, message: '이미지 업로드 및 처리 중 오류가 발생했습니다.' } } } })
  @ApiResponse({ status: 403, description: '만료된 액세스 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '만료된 토큰입니다.' } } } })
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Headers('access_token') accessToken: string, @UploadedFile() file: Express.Multer.File) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.userImageService.uploadImage(userId, file);
  }
}
