import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'token' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'refresh_token' })
  refreshToken: string;
}
