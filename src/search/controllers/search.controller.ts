import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('boards')
  async searchBoardsAsHeadOrBody(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchBoardsAsHeadOrBody(searchQuery);
  }

  @Get('users')
  async searchUsersAsName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersAsName(searchQuery);
  }
}
