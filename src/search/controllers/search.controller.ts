import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiSearchBoardsByHead } from '../swagger-decorators/search-boards-by-head.decorator';
import { ApiSearchBoardsByBody } from '../swagger-decorators/search-boards-by-body.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiSearchBoardsByUserName } from '../swagger-decorators/search-boards-by-userName.decorator';

@ApiTags('SEARCH')
@UsePipes(ValidationPipe)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiSearchBoardsByHead()
  @Get('boards/:category/head')
  async searchBoardsByHead(
    @Param('category') category: string,
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByHead(
      category,
      searchQuery,
      page,
      limit,
    );
  }

  @ApiSearchBoardsByBody()
  @Get('boards/:category/body')
  async searchBoardsByBody(
    @Param('category') category: string,
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByBody(
      category,
      searchQuery,
      page,
      limit,
    );
  }

  @ApiSearchBoardsByUserName()
  @Get('boards/:category/user')
  async searchBoardsByUserName(
    @Param('category') category: string,
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByUserName(
      category,
      searchQuery,
      page,
      limit,
    );
  }

  @Get('users')
  async searchUsersByName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersByName(searchQuery);
  }
}
