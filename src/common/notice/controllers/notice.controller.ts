import { Controller, Get, Headers } from '@nestjs/common';
import { NoticeService } from '../services/notice.service';
import { TokenService } from 'src/auth/services/token.service';

@Controller('notice')
export class NoticeController {
  constructor(
    private noticeService: NoticeService,
    private tokenService: TokenService,
  ) {}

  @Get()
  async getAllNotifications(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return this.noticeService.getAllNotifications(userId);
  }
}
