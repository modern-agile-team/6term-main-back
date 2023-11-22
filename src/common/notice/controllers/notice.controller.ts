import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NoticeService } from '../services/notice.service';
import { TokenService } from 'src/auth/services/token.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetAllNotifications } from '../swagger-decorators/get-all-notifications.decorator';
import { ApiUpdateUnSeenNotification } from '../swagger-decorators/update-un-seen-notification.decorator';
import { ApiHardDeleteNotificatons } from '../swagger-decorators/hard-delete-notifications.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { GetNotificationsResponseFromBoardDto } from 'src/common/dto/get-notifications-response-from-board.dto';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@ApiTags('BOARD-NOTICE')
@UsePipes(ValidationPipe)
@UseInterceptors(SuccessResponseInterceptor)
@Controller('notice')
export class NoticeController {
  constructor(
    private noticeService: NoticeService,
    private tokenService: TokenService,
  ) {}

  @ApiGetAllNotifications()
  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async getAllNotifications(
    @GetUserId() userId: number,
  ): Promise<GetNotificationsResponseFromBoardDto[]> {
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
