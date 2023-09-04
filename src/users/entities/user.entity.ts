import { Board } from "src/boards/entities/board.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'user'
})
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
