import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiSearchBoardsByHead } from '../swagger-decorators/search-boards-by-head.decorator';
import { ApiSearchBoardsByBody } from '../swagger-decorators/search-boards-by-body.decorator';

@UsePipes(ValidationPipe)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiSearchBoardsByHead()
  @Get('boards/head')
  async searchBoardsByHead(
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByHead(searchQuery, page, limit);
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
