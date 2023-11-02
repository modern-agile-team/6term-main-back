import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Token } from 'src/auth/entities/token.entity';
import { Board } from 'src/boards/entities/board.entity';
import { Friend } from 'src/friends/entities/friends.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserImage, (userImage) => userImage.user)
  userImage: UserImage;

  @Column({ length: 10 })
  provider: string;

  @Index({ fulltext: true })
  @Column('varchar', { length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 5 })
  gender: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Board, (board) => board.user)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToOne(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  token: Token;

  @OneToMany(() => Friend, (friend) => friend.requesterId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: Friend;

  @OneToMany(() => Friend, (friend) => friend.respondentId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'respondent_id' })
  respondent: Friend;
}
