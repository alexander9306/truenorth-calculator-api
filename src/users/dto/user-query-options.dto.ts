import { BasePaginationSortAndFilter } from 'src/shared/interfaces/base-pagination-sort-and-filter.interface';
import { User } from '../entities/user.entity';
import { BasePaginationOptionsDto } from 'src/shared/dto/base-pagination-options.dto';
import { IsIn, IsOptional, ValidateIf } from 'class-validator';

export class UserQueryOptionsDto
  extends BasePaginationOptionsDto
  implements BasePaginationSortAndFilter<User>
{
  @IsIn(['id', 'username', 'status'])
  sortField: keyof User;

  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @IsOptional()
  filterValue?: string;

  @ValidateIf((o) => typeof o.filterValue !== 'undefined')
  @IsIn(['id', 'username', 'status'])
  filterField?: keyof User;
}
