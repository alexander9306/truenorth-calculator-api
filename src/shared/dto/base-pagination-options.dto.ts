import { IsInt, Max, Min } from 'class-validator';

export abstract class BasePaginationOptionsDto {
  @IsInt()
  @Min(1)
  pageNumber = 1;

  @IsInt()
  @Min(10)
  @Max(100)
  pageSize = 10;

  get skip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
