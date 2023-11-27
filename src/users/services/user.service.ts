import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserImageRepository } from '../repositories/user-image.repository';
import { BoardRepository } from 'src/boards/repository/boards.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  async getMyInfo(userId: number) {
    if (!userId) {
      throw new HttpException(
        '토큰이 제공되지 않았습니다.',
        HttpStatus.LENGTH_REQUIRED,
      );
    }
    const { name, email, gender, admin, provider } =
      await this.userRepository.getUserInfo(userId);
    const userImage = (await this.userImageRepository.checkUserImage(userId))
      .imageUrl;
    return {
      userId,
      name,
      email,
      gender,
      admin,
      provider,
      userImage,
    };
  }

  async getUserInfo(userId: number) {
    const board = await this.boardRepository.findBoardByuserId(userId);
    if (!board) {
      return true;
    }
    return board;
  }

  async getMyInfoWithOwner(userId: number, targetId: number) {
    const { name, email, gender, admin, provider } =
      await this.userRepository.getUserInfo(userId);
    const userImage = (await this.userImageRepository.checkUserImage(userId))
      .imageUrl;
    return {
      userId,
      name,
      email,
      gender,
      admin,
      provider,
      userImage,
      owner: userId === targetId,
    };
  }
}
