import { Property } from 'src/shared/decorators/property.decorator';
import { Node } from 'src/shared/entities/node.entity';
import { Column, Entity } from 'typeorm';

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
  @Property()
  @Column({
    type: 'simple-enum',
    enum: OperationTypeEnum,
  })
  type: OperationTypeEnum;

  @Property()
  @Column('int')
  cost: number;
}
