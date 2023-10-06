import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Board } from 'src/boards/entities/board.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Board, (board) => board.user)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Column({ length: 10 })
  provider: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 5 })
  gender: string;

  @Column({ default: false })
  admin: boolean;

  @OneToOne(() => UserImage, (userImage) => userImage.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userImage: UserImage;
}
