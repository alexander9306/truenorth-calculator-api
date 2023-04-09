import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Operation } from 'src/operations/entities/operation.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  amount: number;

  @Column('int')
  user_balance: number;

  @Column()
  operation_response: string;

  @Column('date')
  date: Date;

  @OneToOne(() => Operation)
  @JoinColumn()
  operation: Operation;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
