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
import { BoardNotification } from 'src/common/notice/entities/board-notice.entity';

@Entity({
  name: 'board',
})
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.board, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BoardImage, (boardImage) => boardImage.board)
  boardImages: BoardImage[];

  @OneToMany(() => BoardLike, (boardLike) => boardLike.boardId)
  boardLike: BoardLike;

  @OneToMany(
    () => BoardNotification,
    (BoardNotification) => BoardNotification.board,
  )
  boardNotification: BoardNotification;

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
