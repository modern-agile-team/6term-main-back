import { TokenService } from './../../auth/services/token.service';
import {
  Controller,
  Headers,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageService } from '../services/user-image.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiUploadUserImage } from '../swagger-decorators/upload-user-image.decorator';

@Controller('user/image')
@ApiTags('user API')
export class UserImageController {
  constructor(
    private readonly userImageService: UserImageService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiUploadUserImage()
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @Headers('access_token') accessToken: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.userImageService.uploadImage(userId, file);
  }
}
