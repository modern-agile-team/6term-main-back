import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Token } from "src/auth/entities/token.entity";
import { Board } from 'src/boards/entities/board.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @JoinColumn()
  userImage: UserImage;

  @OneToMany(() => Board, (board) => board.user)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToOne(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  token: Token;
}
