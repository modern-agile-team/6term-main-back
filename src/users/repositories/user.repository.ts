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

  async deleteUser(userId: number): Promise<User | null> {
    try {
      const user = await this.entityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      } else {
        await this.entityManager.delete(User, { id: userId });
        return user;
      }
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      return null;
    }
  }
}
