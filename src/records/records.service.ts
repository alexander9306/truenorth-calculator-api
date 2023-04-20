import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, Like, Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { RecordQueryOptionsDto } from './dto/record-query-options.dto';
import { CollectionResultDto } from 'src/shared/dto/collection-result.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
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

  async findAll({
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    filterValue,
    filterField,
  }: RecordQueryOptionsDto): Promise<CollectionResultDto<Record>> {
    const { where, whereConditionRelations } = this.getFilterCondition(
      filterValue,
      filterField,
    );
    const { sortColumn, sortColumnRelations } = this.getSortColumn(
      sortField,
      sortDirection,
    );
    const relationToAdd = {
      ...whereConditionRelations,
      ...sortColumnRelations,
    };
    const skip = (pageNumber - 1) * pageSize;

    // TODO: Change to implementation to Query builder so I can request data and count in one call, also for further improvement in the search queries.
    const [data, count] = await Promise.all([
      this.recordRepository.find({
        where,
        skip,
        take: pageSize,
        relations: relationToAdd,
        order: sortColumn,
      }),
      this.recordRepository.count({ where }),
    ]);

    const totalPages = Math.ceil(count / pageSize);

    return {
      data,
      pageNumber,
      count,
      totalPages,
    };
  }

  private getSortColumn(sortField: keyof Record, sortDirection) {
    const sortColumn = {};
    const sortColumnRelations = {};
    switch (sortField) {
      case 'user':
        sortColumn[sortField] = { id: sortDirection };
        sortColumnRelations[sortField] = true;
        break;
      case 'operation':
        sortColumn[sortField] = { type: sortDirection };
        sortColumnRelations[sortField] = true;
        break;
      default:
        sortColumn[sortField] = sortDirection;
        break;
    }

    return {
      sortColumn,
      sortColumnRelations,
    };
  }

  private getFilterCondition(filterValue?: string, filterField?: keyof Record) {
    const where = {};
    const whereConditionRelations = { user: true };

    if (!filterValue) {
      return {
        where,
        whereConditionRelations,
      };
    }

    switch (filterField) {
      case 'id':
      case 'amount':
      case 'user_balance':
        const value = parseInt(filterValue, 10);
        if (isNaN(value)) break;

        where[filterField] = value;
        break;
      case 'user':
        const id = parseInt(filterValue, 10);
        if (isNaN(id)) break;

        where[filterField] = { id: id };
        break;
      case 'status':
        const status = Object.values(StatusEnum).find(
          (v) => v === (filterValue.toLowerCase() as any),
        );
        if (!status) break;

        where[filterField] = status;
        break;
      case 'operation':
        where[filterField] = { type: Like(`%${filterValue}%`) };
        whereConditionRelations[filterField] = true;
        break;
      case 'date':
        if (isNaN(Date.parse(filterField))) break;

        const date = new Date(filterValue);
        date.setDate(date.getDate() + 1);
        where[filterField] = LessThanOrEqual(date);
        break;
      default:
        where[filterField] = Like(`%${filterValue}%`);
        break;
    }

    return {
      where,
      whereConditionRelations,
    };
  }
}
