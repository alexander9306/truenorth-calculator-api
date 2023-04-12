import { Exclude } from 'class-transformer';
import { Node } from 'src/shared/entities/node.entity';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Node {
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'simple-enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
