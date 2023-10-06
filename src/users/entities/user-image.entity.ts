import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_image' })
export class UserImage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.userImage) // userId ---> 뭐 나중에 생각해서 변경해야함 이름안겹치게
  @JoinColumn()
  userId: User;

  @Column({ name: 'user_id' }) // userIdd가 --> userId로 변경될 예정
  userIdd: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @OneToOne(() => User, (userId: User) => userId.userImage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
