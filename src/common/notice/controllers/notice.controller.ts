import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NoticeService } from '../services/notice.service';
import { TokenService } from 'src/auth/services/token.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetAllNotifications } from '../swagger-decorators/get-all-notifications.decorator';
import { ApiUpdateUnSeenNotification } from '../swagger-decorators/update-un-seen-notification.decorator';
import { ApiHardDeleteNotificatons } from '../swagger-decorators/hard-delete-notifications.decorator';

@ApiTags('BOARD-NOTICE')
@UsePipes(ValidationPipe)
@Controller('notice')
export class NoticeController {
  constructor(
    private noticeService: NoticeService,
    private tokenService: TokenService,
  ) {}

  @ApiGetAllNotifications()
  @Get()
  async getAllNotifications(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return this.noticeService.getAllNotifications(userId);
  }

  @ApiUpdateUnSeenNotification()
  @Patch(':notificationId')
  async updateUnSeenNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    return this.noticeService.updateUnSeenNotification(notificationId);
  }

  @ApiHardDeleteNotificatons()
  @Delete()
  async hardDeleteNotifications() {
    return this.noticeService.hardDeleteNotifications();
  }
}
