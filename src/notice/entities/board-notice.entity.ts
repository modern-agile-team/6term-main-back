import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'board_notification' })
export class BoardNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board)
  @JoinColumn({ name: 'board_id' })
  boardId: Board;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  senderId: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiverId: User;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;
}