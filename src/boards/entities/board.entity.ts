import { User } from 'src/users/entities/user.entity';
import { BoardImage } from './board-image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @OneToMany(() => BoardImage, (boardImage) => boardImage.board, {
    onDelete: 'CASCADE',
  })
  boardImages: BoardImage[];

  @OneToMany(() => BoardLike, (boardLike) => boardLike.boardId, {
    onDelete: 'CASCADE',
  })
  boardLike: BoardLike;

  @Index({ fulltext: true })
  @Column('varchar')
  head: string;

  @Index({ fulltext: true })
  @Column('text')
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
