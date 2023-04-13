import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { RecordOptionsDto } from './dto/record-options.dto';
import { PaginatedDataDto } from 'src/shared/dto/paginated-data.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async findAll({
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    filterValue,
    filterField,
    skip,
  }: RecordOptionsDto): Promise<PaginatedDataDto<Record>> {
    const { where, whereConditionRelations } = this.getFilterCondition(
      filterValue,
      filterField,
    );
    const { sortColumns, sortColumnRelations } = this.getSortColumn(
      sortField,
      sortDirection,
    );
    const relationToAdd = {
      ...whereConditionRelations,
      ...sortColumnRelations,
    };

    const [data, count] = await Promise.all([
      this.recordRepository.find({
        where,
        skip,
        take: pageSize,
        relations: relationToAdd,
        order: sortColumns,
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
    const sortColumns = {};
    const sortColumnRelations = {};
    switch (sortField) {
      case 'user':
        sortColumns[sortField] = { username: sortDirection };
        sortColumnRelations[sortField] = true;
        break;
      case 'operation':
        sortColumns[sortField] = { type: sortDirection };
        sortColumnRelations[sortField] = true;
        break;
      default:
        sortColumns[sortField] = sortDirection;
        break;
    }

    return {
      sortColumns,
      sortColumnRelations,
    };
  }

  private getFilterCondition(filterValue?: string, filterField?: keyof Record) {
    if (filterValue) {
      return;
    }
    const where = {};
    const whereConditionRelations = {};

    switch (filterField) {
      case 'user':
        where[filterField] = { username: Like(`%${filterValue}%`) };
        whereConditionRelations[filterField] = true;
        break;
      case 'operation':
        where[filterField] = { type: Like(`%${filterValue}%`) };
        whereConditionRelations[filterField] = true;
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

  findOne(id: number) {
    return this.recordRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.recordRepository.save({
      id: id,
      status: StatusEnum.INACTIVE,
    });
  }
}
