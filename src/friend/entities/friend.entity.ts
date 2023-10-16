import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  PENDING = '대기 상태',
  ACCEPT = '친구 수락',
  REJECT = '친구 거절',
}

@Entity({ name: 'friend' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requesterId: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requrested_id' })
  requestedId: User;

  @Column({ type: 'enum', enum: Status })
  status!: Status;
}
