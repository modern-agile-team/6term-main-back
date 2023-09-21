import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUSerDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() userInfo: CreateUSerDto): Promise<User> {
    return this.userService.create(userInfo);
  }
}
