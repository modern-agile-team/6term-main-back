import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUSerDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userInfo: CreateUSerDto): Promise<User> {
    const { name, email, gender } = userInfo;

    const user = new User();
    user.name = name;
    user.email = email;
    user.gender = gender;

    console.log(user);

    return this.userRepository.save(user); // 데이터베이스에 저장
  }
}
