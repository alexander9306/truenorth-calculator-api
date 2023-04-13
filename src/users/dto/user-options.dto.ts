import { BasePaginationSortAndFilter } from 'src/shared/pagination/interfaces/base-pagination-sort-and-filter.interface';
import { User } from '../entities/user.entity';
import { BasePaginationOptionsDto } from 'src/shared/dto/base-pagination-options.dto';
import { IsIn, IsNotEmpty, ValidateIf } from 'class-validator';
import { getProperties } from 'src/shared/decorators/property.decorator';

export class UserOptionsDto
  extends BasePaginationOptionsDto
  implements BasePaginationSortAndFilter<User>
{
  @IsIn(getProperties(User))
  sortField: keyof User;

  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @ValidateIf((o) => typeof o.filterBy !== 'undefined')
  @IsNotEmpty()
  filterValue?: string;

  @ValidateIf((o) => typeof o.filter !== 'undefined')
  @IsIn(getProperties(User))
  filterField?: keyof User;
}
