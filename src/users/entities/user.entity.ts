import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column()
  phone: number;

  @Column({ length: 5 })
  gender: string;
}
