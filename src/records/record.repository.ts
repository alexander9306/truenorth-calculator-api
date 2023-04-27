import { BaseRepository } from 'src/shared/base-repository.repository';
import { Record } from './entities/record.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RecordQueryOptionsDto } from './dto/record-query-options.dto';
import { CollectionResultDto } from 'src/shared/dto/collection-result.dto';

@Injectable()
export class RecordRepository extends BaseRepository<Record> {
  constructor(private readonly dataSource: DataSource) {
    super(Record, dataSource.manager);
  }

  async findAndCountAll({
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    filterValue,
    filterField,
  }: RecordQueryOptionsDto): Promise<CollectionResultDto<Record>> {
    const skip = (pageNumber - 1) * pageSize;

    const queryBuilder = this.createQueryBuilder('record')
      .leftJoinAndSelect('record.user', 'user')
      .leftJoin('record.operation', 'operation')
      .skip(skip)
      .take(pageSize)
      .orderBy(this.getSortColumn(sortField), sortDirection);

    if (filterValue)
      queryBuilder.where(...this.getFilterCondition(filterValue, filterField));

    const [data, count] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(count / pageSize);

    return {
      data,
      pageNumber,
      count,
      totalPages,
    };
  }

  private getSortColumn(sortField: keyof Record) {
    switch (sortField) {
      case 'user':
        return 'user.id';
      case 'operation':
        return 'operation.type';
      default:
        return `record.${sortField}`;
    }
  }

  private getFilterCondition(
    filterValue: string,
    filterField: keyof Record,
  ): [string, object] {
    switch (filterField) {
      case 'user':
        return [
          `CAST(user.id AS TEXT) ILIKE :filterValue`,
          { filterValue: `%${filterValue}%` },
        ];
      case 'operation':
        return [
          `CAST(operation.type AS TEXT) ILIKE :filterValue`,
          { filterValue: `%${filterValue}%` },
        ];
      case 'date':
        // Avoid returning results when invalid date is passed
        if (isNaN(Date.parse(filterValue))) return ['record.id=NULL'] as any;

        const date = new Date(filterValue);
        return [`date <= :date`, { date }];
      default:
        return [
          `CAST(record.${filterField} AS TEXT) ILIKE :filterValue`,
          { filterValue: `%${filterValue}%` },
        ];
    }
  }
}
