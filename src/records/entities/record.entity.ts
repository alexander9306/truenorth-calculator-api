import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Operation } from 'src/operations/entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Node } from 'src/shared/entities/node.entity';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { Property } from 'src/shared/decorators/property.decorator';

@Entity()
export class Record extends Node {
  @Property()
  @Column('int')
  amount: number;

  @Property()
  @Column('int')
  user_balance: number;

  @Property()
  @Column()
  operation_response: string;

  @Property()
  @Column('date')
  date: Date;

  @Property()
  @Column({
    type: 'simple-enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Property()
  @OneToOne(() => Operation)
  @JoinColumn()
  operation: Operation;

  @Property()
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
