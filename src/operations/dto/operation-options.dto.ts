import { BasePaginationSortAndFilter } from 'src/shared/pagination/interfaces/base-pagination-sort-and-filter.interface';
import { Operation } from '../entities/operation.entity';
import { BasePaginationOptionsDto } from 'src/shared/dto/base-pagination-options.dto';
import { IsIn, IsNotEmpty, ValidateIf } from 'class-validator';
import { getProperties } from 'src/shared/decorators/property.decorator';

export class OperationOptionsDto
  extends BasePaginationOptionsDto
  implements BasePaginationSortAndFilter<Operation>
{
  @IsIn(getProperties(Operation))
  sortField: keyof Operation;

  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @ValidateIf((o) => typeof o.filterBy !== 'undefined')
  @IsNotEmpty()
  filterValue?: string;

  @ValidateIf((o) => typeof o.filter !== 'undefined')
  @IsIn(getProperties(Operation))
  filterField?: keyof Operation;
}
