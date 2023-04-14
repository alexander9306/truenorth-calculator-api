import { Transform } from 'class-transformer';
import { Max, Min } from 'class-validator';

export abstract class BasePaginationOptionsDto {
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  pageNumber = 1;

  @Min(10)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  pageSize = 10;
}
