import { Module } from '@nestjs/common';
import { FriendsController } from './controllers/friends.controller';
import { FriendsService } from './services/friends.service';
import { FriendsRepository } from './repositories/friends.repository';
import { TokenService } from 'src/auth/services/token.service';
import { TokenRepository } from 'src/auth/repositories/token.repository';

@Module({
  imports: [],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository, TokenService, TokenRepository],
})
export class FriendsModule {}
