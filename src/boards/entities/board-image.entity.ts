import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.entity";

@Entity({ name: 'board_image' })

export class BoardImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Board)
    @JoinColumn({ name: 'board_id' })
    boardId: Board;

    @CreateDateColumn({ name: 'create_at' })
    createAt: Date;
}