import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'comment',
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Board)
  @JoinColumn({ name: 'board_id' })
  boardId: Board;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;
}
