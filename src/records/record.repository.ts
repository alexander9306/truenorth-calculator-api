import { BaseRepository } from 'src/shared/base-repository.repository';
import { Record } from './entities/record.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RecordQueryOptionsDto } from './dto/record-query-options.dto';
import { CollectionResultDto } from 'src/shared/dto/collection-result.dto';
import { OperationTypeEnum } from 'src/operations/entities/operation.entity';
import { StatusEnum } from 'src/shared/enums/status.enum';

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

  protected getFilterCondition(
    filterValue: string,
    filterField: keyof Record,
  ): [string, object] {
    switch (filterField) {
      case 'id':
      case 'amount':
        return [
          `record.${filterField} = :amount`,
          { amount: Number.parseInt(filterValue, 10) || null },
        ];
      case 'user':
        return [
          `user.id = :id`,
          { id: Number.parseInt(filterValue, 10) || null },
        ];
      case 'operation':
        if (!Object.values(OperationTypeEnum).includes(filterValue as any))
          return ['record.id=NULL'] as any;

        return [`operation.type = :type`, { type: filterValue }];
      case 'status':
        if (!Object.values(StatusEnum).includes(filterValue as any))
          return ['record.id=NULL'] as any;

        return [`record.status = :status`, { status: filterValue }];
      case 'date':
        if (Number.isNaN(Date.parse(filterValue)))
          return ['record.id=NULL'] as any;

        const date = new Date(filterValue);
        date.setHours(0, 0, 0, 0);

        const nextDayDate = new Date(date);
        nextDayDate.setDate(date.getDate() + 1);

        return [
          `date >= :date AND date <= :nextDayDate`,
          { date, nextDayDate },
        ];
      default:
        return [
          `CAST(record.${filterField} AS TEXT) ILIKE :filterValue`,
          { filterValue: `%${filterValue}%` },
        ];
    }
  }
}
