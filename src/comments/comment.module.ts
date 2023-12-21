import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReComment } from './entities/recomment.entity';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.services';
import { TokenService } from 'src/auth/services/token.service';
import { CommentsRepository } from './repository/comments.repository';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { ReCommentsService } from './services/recomments.services';
import { ReCommentsRepository } from './repository/recomments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, ReComment])],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    ReCommentsService,
    ReCommentsRepository,
    TokenService,
    TokenRepository,
  ],
})
export class CommentModule {}
