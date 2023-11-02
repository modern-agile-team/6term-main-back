import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('boards')
  async searchBoardsAsHeadOrBody(@Query('boardHead') boardHead: string) {
    return this.searchService.searchBoardsAsHeadOrBody(boardHead);
  }
}
