import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserImageRepository } from '../repositories/user-image.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
  ) {}

  async getMyInfo(userId: number) {
    const { name, email, gender, admin, provider } =
      await this.userRepository.getUserInfo(userId);
    const userImage = (await this.userImageRepository.checkUserImage(userId))
      .imageUrl;
    return {
      name,
      email,
      gender,
      admin,
      provider,
      userImage,
    };
  }
}
