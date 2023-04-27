import { BaseRepository } from 'src/shared/base-repository.repository';
import { Operation } from './entities/operation.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class OperationRepository extends BaseRepository<Operation> {
  constructor(private readonly dataSource: DataSource) {
    super(Operation, dataSource.manager);
  }
}
