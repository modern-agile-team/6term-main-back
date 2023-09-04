import { BoardsModule } from "src/boards/boards.module";
import { Board } from "src/boards/entities/board.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'board_notification'})
export class BoardNotification {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Board)
    @JoinColumn({ name: 'board_id' })
    boardId: Board;

    @CreateDateColumn({ name: 'create_at' })
    createAt: Date;

}
