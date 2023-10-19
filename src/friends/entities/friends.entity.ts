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

  @Column({ name: 'requester_id' })
  requesterId: number;

  @Column({ name: 'respondent_id' })
  respondentId: number;

  @ManyToOne(() => User, (userId: User) => userId.requesterId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (userId: User) => userId.respondentId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'respondent_id' })
  respondent: User;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status!: Status;
}
