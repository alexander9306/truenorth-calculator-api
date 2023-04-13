import { BasePaginationSortAndFilter } from 'src/shared/pagination/interfaces/base-pagination-sort-and-filter.interface';
import { Record } from '../entities/record.entity';
import { BasePaginationOptionsDto } from 'src/shared/dto/base-pagination-options.dto';
import { IsIn, IsNotEmpty, ValidateIf } from 'class-validator';
import { getProperties } from 'src/shared/decorators/property.decorator';

export class RecordOptionsDto
  extends BasePaginationOptionsDto
  implements BasePaginationSortAndFilter<Record>
{
  @IsIn(getProperties(Record))
  sortField: keyof Record;

  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @ValidateIf((o) => typeof o.filterBy !== 'undefined')
  @IsNotEmpty()
  filterValue?: string;

  @ValidateIf((o) => typeof o.filter !== 'undefined')
  @IsIn(getProperties(Record))
  filterField?: keyof Record;
}