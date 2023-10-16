import { User } from 'src/users/entities/user.entity';
import { BoardImage } from './board-image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardLike } from './board-like.entity';

@Entity({
  name: 'board',
})
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.board)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BoardImage, (boardImage) => boardImage.board)
  boardImages: BoardImage[];

  @OneToMany(() => BoardLike, (boardLike) => boardLike.boardId, {
    onDelete: 'CASCADE',
  })
  boardLike: BoardLike;

  @Column()
  head: string;

  @Column()
  body: string;

  @Column()
  main_category: string;

  @Column()
  sub_category: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
