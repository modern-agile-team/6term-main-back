import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('boards/head')
  async searchBoardsByHead(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchBoardsByHead(searchQuery);
  }

  @Get('boards/body')
  async searchBoardsByBody(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchBoardsByBody(searchQuery);
  }

  @Get('users')
  async searchUsersByName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersByName(searchQuery);
  }
}
