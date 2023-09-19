import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardsService } from '../service/Boards.service';
import { Board } from '../entities/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(@Body() boardData: Partial<Board>): Promise<Board> {
    return this.boardsService.create(boardData);
  }

  @Get()
  async findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Board | undefined> {
    return this.boardsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    return this.boardsService.update(+id, boardData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.boardsService.remove(+id);
  }
}
