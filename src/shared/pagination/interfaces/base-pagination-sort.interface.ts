export interface BasePaginationSort<T> {
  sortField: keyof T;
  sortDirection: 'ASC' | 'DESC';
}
