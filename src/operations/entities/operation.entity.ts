import { Record } from 'src/records/entities/record.entity';
import { Node } from 'src/shared/entities/node.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum OperationTypeEnum {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
  SQUARE_ROOT = 'square_root',
  RANDOM_STRING = 'random_string',
}

@Entity()
export class Operation extends Node {
  @Column({
    type: 'simple-enum',
    enum: OperationTypeEnum,
  })
  type: OperationTypeEnum;

  @Column('int')
  cost: number;

  @OneToMany(() => Record, (record) => record.operation)
  records: Record[];
}
