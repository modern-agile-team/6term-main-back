import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { UserImage } from "../entities/user-image.entity";

@Injectable()
export class UserImageRepository {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async checkUserImage(userIdd: number): Promise<UserImage> {
    const userImage = await this.entityManager.findOne(UserImage, { where: { userIdd } });

    if (!userImage) {
      throw new NotFoundException('사용자 이미지를 찾을 수 없습니다.');
    }
    return userImage;
  }

  async uploadUserImage(userIdd: number, imageUrl: string): Promise<UserImage> {
    const userImage = new UserImage();
    userImage.userIdd = userIdd;
    userImage.imageUrl = imageUrl;

    return await this.entityManager.save(userImage);
  }

  async updateUserImage(userIdd: number, newImageUrl: string): Promise<UserImage | null> {
    try {
      const userImage = await this.entityManager.findOne(UserImage, { where: { userIdd } });
      
      if (!userImage) {
        throw new NotFoundException('사용자 이미지를 찾을 수 없습니다.');
      }
      userImage.imageUrl = newImageUrl;
      await this.entityManager.save(userImage);
  
      return userImage;
    } catch (error) {
      console.error('이미지 업데이트 오류:', error);
      return null;
    }
  }
}
