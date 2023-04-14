export interface BasePaginationSortAndFilter<T> {
  sortField: keyof T;

  sortDirection: 'ASC' | 'DESC';

  filterValue?: string;

  filterField?: keyof T;
}
