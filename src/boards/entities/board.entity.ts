import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'board'
})
export class Board {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    userId: User;

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

    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date;


}