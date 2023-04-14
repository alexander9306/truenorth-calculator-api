import { BasePaginationSortAndFilter } from 'src/shared/interfaces/base-pagination-sort-and-filter.interface';
import { Record } from '../entities/record.entity';
import { BasePaginationOptionsDto } from 'src/shared/dto/base-pagination-options.dto';
import { IsIn, IsOptional, ValidateIf } from 'class-validator';

export class RecordQueryOptionsDto
  extends BasePaginationOptionsDto
  implements BasePaginationSortAndFilter<Record>
{
  @IsIn([
    'id',
    'amount',
    'user_balance',
    'operation_response',
    'date',
    'status',
    'operation',
    'user',
  ])
  sortField: keyof Record;

  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @IsOptional()
  filterValue?: string;

  @ValidateIf((o) => typeof o.filterValue !== 'undefined')
  @IsIn([
    'id',
    'amount',
    'user_balance',
    'operation_response',
    'date',
    'status',
    'operation',
    'user',
  ])
  filterField?: keyof Record;
}
