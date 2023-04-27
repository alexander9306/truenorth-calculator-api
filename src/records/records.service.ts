import { Injectable } from '@nestjs/common';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { RecordQueryOptionsDto } from './dto/record-query-options.dto';
import { RecordRepository } from './record.repository';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordRepository)
    private recordRepository: RecordRepository,
  ) {}

  findOne(id: number) {
    return this.recordRepository.findOneBy({ id });
  }

  remove(id: number) {
    const record = new Record();
    record.id = id;
    record.status = StatusEnum.INACTIVE;

    return this.recordRepository.save(record);
  }

  findAll(query: RecordQueryOptionsDto) {
    return this.recordRepository.findAndCountAll(query);
  }
}
