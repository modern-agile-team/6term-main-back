import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { ReComment } from './recomment.entity';

@Entity({ name: 'comment_like' })
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  commentId: Comment;

  @ManyToOne(() => ReComment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recomment_id' })
  recommentId: ReComment;
}
