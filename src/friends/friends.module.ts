import { Module } from '@nestjs/common';
import { FriendsController } from './controllers/friends.controller';
import { FriendsService } from './services/friends.service';
import { FriendsRepository } from './repositories/friends.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository],
})
export class FriendsModule {}
