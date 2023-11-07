import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiSearchBoardsByHead } from '../swagger-decorators/search-boards-by-head.decorator';
import { ApiSearchBoardsByBody } from '../swagger-decorators/search-boards-by-body.decorator';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiSearchBoardsByHead()
  @Get('boards/head')
  async searchBoardsByHead(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchBoardsByHead(searchQuery);
  }

  @ApiSearchBoardsByBody()
  @Get('boards/body')
  async searchBoardsByBody(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchBoardsByBody(searchQuery);
  }

  @Get('users')
  async searchUsersByName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersByName(searchQuery);
  }
}
