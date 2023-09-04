import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'board'
})
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    head: string;

    @Column()
    body: string;

    @Column()
    main_category: number;

    @Column()
    sub_category: number;

    @CreateDateColumn({ name: 'create_at' })
    createAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    userId: User;

}