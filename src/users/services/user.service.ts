import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UserImageRepository } from "../repositories/user-image.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
  ) {}
  async getUserInfo(userId: number) {
    const userName = await this.userRepository.getUserName(userId);
    const userImage = (await this.userImageRepository.checkUserImage(userId)).imageUrl;
    return {
      userName,
      userImage,
    };
  }
}