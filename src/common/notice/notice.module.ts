import { Module } from '@nestjs/common';
import { NoticeController } from './controllers/notice.controller';
import { NoticeService } from './services/notice.service';

@Module({
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
