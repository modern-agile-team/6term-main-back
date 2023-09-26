import { UserImage } from './../entities/user-image.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async findByProvider(provider: string): Promise<User | undefined> {
    return this.entityManager.findOne(User, { where: { provider } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.entityManager.findOne(User, { where: { email } });
  }

  async findByName(name: string): Promise<User | undefined> {
    return this.entityManager.findOne(User, { where: { name } });
  }

  async createUser(userInfo: any): Promise<User> {
    const user = new User();
    user.provider = userInfo.provider;
    user.name = userInfo.nickname;
    user.email = userInfo.email;
    user.gender = userInfo.gender;

    return this.entityManager.save(user);
  }

  async uploadUserImage(userId: number, imageUrl: string): Promise<UserImage> {
    const userImage = new UserImage();
    userImage.userId = userId;
    userImage.imageUrl = imageUrl;

    return this.entityManager.save(userImage);
  }

  async updateUserImage(userId: number, newImageUrl: string): Promise<UserImage> {
    const userImage = await this.entityManager.findOne(UserImage, { where: { userId } });
    userImage.imageUrl = newImageUrl;

    return this.entityManager.save(userImage);
  }
}
