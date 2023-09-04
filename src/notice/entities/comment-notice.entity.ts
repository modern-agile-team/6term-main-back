import { Comment } from "src/comments/entities/comment.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comment_notification'})
export class CommentNotification {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'comment_id' })
    commentId: Comment;

    @CreateDateColumn({ name: 'create_at' })
    createAt: Date;

}
