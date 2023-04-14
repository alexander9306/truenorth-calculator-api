import { BasePaginationSortAndFilter } from 'src/shared/interfaces/base-pagination-sort-and-filter.interface';
import { Operation } from '../entities/operation.entity';
import { BasePaginationOptionsDto } from 'src/shared/dto/base-pagination-options.dto';
import { IsIn, IsOptional, ValidateIf } from 'class-validator';

export class OperationQueryOptionsDto
  extends BasePaginationOptionsDto
  implements BasePaginationSortAndFilter<Operation>
{
  @IsIn(['id', 'type', 'cost'])
  sortField: keyof Operation;

  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @IsOptional()
  filterValue?: string;

  @ValidateIf((o) => typeof o.filterValue !== 'undefined')
  @IsIn(['id', 'type', 'cost'])
  filterField?: keyof Operation;
}
