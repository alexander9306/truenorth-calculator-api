import { Exclude } from 'class-transformer';
import { Record } from 'src/records/entities/record.entity';
import { Node } from 'src/shared/entities/node.entity';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { Column, Entity, OneToMany } from 'typeorm';

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

  @OneToMany(() => Record, (record) => record.user)
  records: Record[];
}
