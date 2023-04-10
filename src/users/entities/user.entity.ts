import { Node } from 'src/shared/entities/node.entity';
import { Column, Entity } from 'typeorm';

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class User extends Node {
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;
}
