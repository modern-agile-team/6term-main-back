import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [BoardsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
