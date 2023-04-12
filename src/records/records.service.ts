import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  findAll() {
    return this.recordRepository.find();
  }

  findOne(id: number) {
    return this.recordRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.recordRepository.save({
      id: id,
      status: StatusEnum.INACTIVE,
    });
  }
}
