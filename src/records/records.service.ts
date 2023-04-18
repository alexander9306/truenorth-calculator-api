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
      case 'user':
        const id = parseInt(filterValue, 10);
        where[filterField] = { id: id };
        whereConditionRelations[filterField] = true;
        break;
      case 'operation':
        where[filterField] = { type: Like(`%${filterValue}%`) };
        whereConditionRelations[filterField] = true;
        break;
      case 'date':
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
