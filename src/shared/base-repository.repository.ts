import { Repository } from 'typeorm';
import { BasePaginationOptionsDto } from './dto/base-pagination-options.dto';
import { BasePaginationSortAndFilter } from './interfaces/base-pagination-sort-and-filter.interface';
import { CollectionResultDto } from './dto/collection-result.dto';
import { Node } from './entities/node.entity';

type BaseDtoQuery<T> = BasePaginationOptionsDto &
  BasePaginationSortAndFilter<T>;

export class BaseRepository<T extends Node> extends Repository<T> {
  async findAndCountAll({
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    filterValue,
    filterField,
  }: BaseDtoQuery<T>): Promise<CollectionResultDto<T>> {
    const queryBuilder = this.createQueryBuilder('default');

    if (filterValue)
      queryBuilder.where(...this.getFilterCondition(filterValue, filterField));

    const skip = (pageNumber - 1) * pageSize;
    queryBuilder
      .orderBy(`default.${sortField as string}`, sortDirection)
      .skip(skip)
      .take(pageSize);

    const [data, count] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(count / pageSize);

    return {
      data,
      pageNumber,
      count,
      totalPages,
    };
  }

  protected getFilterCondition(
    filterValue: string,
    filterField: keyof T,
  ): [string, object] {
    switch (filterField) {
      case 'id':
        return [
          `default.id = :id`,
          { id: Number.parseInt(filterValue, 10) || null },
        ];
      default:
        return [
          `CAST(default.${filterField as string} AS TEXT) ILIKE :filterValue`,
          { filterValue: `%${filterValue}%` },
        ];
    }
  }
}
