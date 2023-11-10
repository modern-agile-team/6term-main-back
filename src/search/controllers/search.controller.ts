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
import { ApiSearchBoardsByHeadOrBodyOrUserName } from '../swagger-decorators/search-boards-by-head-or-body-or-user-name.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SEARCH')
@UsePipes(ValidationPipe)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiSearchBoardsByHeadOrBodyOrUserName()
  @Get('board/:category')
  async searchBoardsByHead(
    @Param('category') category: string,
    @Query('head') head: string,
    @Query('body') body: string,
    @Query('userName') userName: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByHead(
      head,
      body,
      userName,
      category,
      page,
      limit,
    );
  }

  @Get('users')
  async searchUsersByName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersByName(searchQuery);
  }
}
