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
  PERMANENT = '영구 거절',
  BLOCK = '차단',
}

@Entity({ name: 'friend' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'requester_id' })
  requesterId: number;

  @Column({ name: 'respondent_id' })
  respondentId: number;

  @ManyToOne(() => User, (userId: User) => userId.requester, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (userId: User) => userId.respondent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'respondent_id' })
  respondent: User;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status!: Status;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
