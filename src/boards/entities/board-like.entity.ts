import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity({ name: 'board_like' })
export class BoardLike {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.boardLike, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Board, (board) => board.boardLike, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  boardId: Board;
}
