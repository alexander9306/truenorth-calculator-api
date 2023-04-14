import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class Node {
  @PrimaryGeneratedColumn()
  id: number;
}
