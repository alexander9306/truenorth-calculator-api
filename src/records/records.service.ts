import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  findAll() {
    return `This action returns all records`;
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
