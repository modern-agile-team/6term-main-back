import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserImage } from "./user-image.entity";

@Entity({
  name: 'user',
})

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  provider: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 5 })
  gender: string;

  @Column({ default: false })
  admin: boolean;

  @OneToOne(() => UserImage, (userImage) => userImage.user, {
    onDelete: 'CASCADE',
    })
  userImage: UserImage;
}
