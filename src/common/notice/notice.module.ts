import { Module } from '@nestjs/common';
import { NoticeController } from './controllers/notice.controller';
import { NoticeService } from './services/notice.service';
import { NoticeRepository } from './repositories/notice.repository';
import { TokenService } from 'src/auth/services/token.service';
import { TokenRepository } from 'src/auth/repositories/token.repository';

@Module({
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository, TokenService, TokenRepository],
  exports: [NoticeService],
})
export class NoticeModule {}
