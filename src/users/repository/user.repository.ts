import { UserImage } from './../entities/user-image.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async checkUserImage(userId: number): Promise<UserImage | null> {
    try {
      const userImage = await this.entityManager.findOne(UserImage, { where: { userId } });
      return userImage;
    } catch (error) {
      console.error('이미지 체크 오류:', error);
      return null;
    }
  }

  async uploadUserImage(userId: number, imageUrl: string): Promise<UserImage> {
    const userImage = new UserImage();
    userImage.userId = userId;
    userImage.imageUrl = imageUrl;

    return this.entityManager.save(userImage);
  }

  async updateUserImage(userId: number, newImageUrl: string): Promise<UserImage | null> {
    try {
      const userImage = await this.entityManager.findOne(UserImage, { where: { userId } });

      if (!userImage) {
        throw new NotFoundException('사용자 이미지를 찾을 수 없습니다.');
      } else {
        userImage.imageUrl = newImageUrl;
        await this.entityManager.save(userImage);
    
        return userImage;
      }
    } catch (error) {
      console.error('이미지 업데이트 오류:', error);
      return null;
    }
  }
}
