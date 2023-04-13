export class PaginatedDataDto<T> {
  data: T[];
  pageNumber: number;
  count: number;
  totalPages: number;
}
