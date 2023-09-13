import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_image' })
export class UserImage {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @CreateDateColumn({ name: 'create_at' })
  create_at: Date;

  @DeleteDateColumn({ name: 'delete_at' })
  delete_at: Date | null;
}
