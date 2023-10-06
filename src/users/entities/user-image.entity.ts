import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'user_image' })
export class UserImage {
    @PrimaryGeneratedColumn()
    id: number;


  @OneToOne(() => User, (user) => user.userImage)
  @JoinColumn()
  userId: User;

    @Column({ name: 'image_url' })
    imageUrl: string;

    @OneToOne(() => User, (userId: User) => userId.userImage, {
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'user_id' })
    user: User;
}
