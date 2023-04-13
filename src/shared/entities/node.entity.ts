import { PrimaryGeneratedColumn } from 'typeorm';
import { Property } from '../decorators/property.decorator';

export abstract class Node {
  @Property()
  @PrimaryGeneratedColumn()
  id: number;
}
