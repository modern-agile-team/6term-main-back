import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'comment_notification' })
export class CommentNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'comment_id' })
  commentId: Comment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  senderId: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiverId: User;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;
}
