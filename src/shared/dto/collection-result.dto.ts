export interface CollectionResultDto<T> {
  data: T[];
  pageNumber: number;
  count: number;
  totalPages: number;
}
