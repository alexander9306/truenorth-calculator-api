import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { Operation } from 'src/operations/entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Node } from 'src/shared/entities/node.entity';
import { StatusEnum } from 'src/shared/enums/status.enum';

@Entity()
export class Record extends Node {
  @Column('int')
  amount: number;

  @Column('int')
  user_balance: number;

  @Column()
  operation_response: string;

  @CreateDateColumn()
  date: Date;

  @Column({
    type: 'simple-enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Operation, (operation) => operation.records)
  operation: Operation;

  @ManyToOne(() => User, (user) => user.records)
  user: User;
}
