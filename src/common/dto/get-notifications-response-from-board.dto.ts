import { OmitType } from '@nestjs/swagger';
import { BoardNotification } from '../notice/entities/board-notice.entity';

export class GetNotificationsResponseFromBoardDto extends OmitType(
  BoardNotification,
  ['board', 'receiver', 'sender'],
) {}
