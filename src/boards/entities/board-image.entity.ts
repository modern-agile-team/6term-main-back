import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity({ name: 'board_image' })
export class BoardImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board)
  @JoinColumn({ name: 'board_id' })
  boardId: Board;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
