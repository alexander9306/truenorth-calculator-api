import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Operation } from 'src/operations/entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Node } from 'src/shared/entities/node.entity';

@Entity()
export class Record extends Node {
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
