import { Exclude } from 'class-transformer';
import { Property } from 'src/shared/decorators/property.decorator';
import { Node } from 'src/shared/entities/node.entity';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Node {
  @Property()
  @Column({
    unique: true,
  })
  username: string;

  @Property()
  @Column()
  @Exclude()
  password: string;

  @Property()
  @Column({
    type: 'simple-enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
