import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user_image' })
export class UserImage {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne()
}