import { Board } from "src/boards/entities/board.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'comment'
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Board)
  board: Board;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;
}