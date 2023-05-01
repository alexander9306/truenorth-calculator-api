import { Transform } from 'class-transformer';
import { Max, Min } from 'class-validator';

export abstract class BasePaginationOptionsDto {
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  pageNumber = 1;

  @Min(5)
  @Max(100)
  @Transform(({ value }) => Number.parseInt(value, 10))
  pageSize = 10;
}
