import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { Recomment } from './recomment.entity';

@Entity({ name: 'comment_like' })
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'comment_id' })
  commentId: Comment;

  @ManyToOne(() => Recomment)
  @JoinColumn({ name: 'recomment_id' })
  recommentId: Recomment;
}
