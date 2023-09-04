import { Comment } from "src/comments/entities/comment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'recomment'
})
export class Recomment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'comment_id' })
  commentId: Comment;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;
}