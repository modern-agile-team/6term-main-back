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
      userId,
      name,
      email,
      gender,
      admin,
      provider,
      userImage,
    };
  }

  async checkMyInfoOwner(userId: number, targetId: number) {
    if (userId === targetId) {
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
        owner: true,
      };
    }

    const { name, email, gender, admin, provider } =
      await this.userRepository.getUserInfo(targetId);
    const userImage = (await this.userImageRepository.checkUserImage(targetId))
      .imageUrl;
    return {
      userId,
      name,
      email,
      gender,
      admin,
      provider,
      userImage,
      owner: false,
    };
  }
}
