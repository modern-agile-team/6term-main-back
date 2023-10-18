import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subject, map } from 'rxjs';
import { ChatNotification } from '../schemas/chat-notifiation.schemas';
import mongoose from 'mongoose';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly subject = new Subject();

  constructor(
    @InjectModel(ChatNotification.name)
    private readonly chatNotification: mongoose.Model<ChatNotification>,
  ) {}

  notificationListener() {
    try {
      return this.subject
        .asObservable()
        .pipe(
          map((notification: Notification) => JSON.stringify(notification)),
        );
    } catch (error) {
      this.logger.error('notificationListener : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
