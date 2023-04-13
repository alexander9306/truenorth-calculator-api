export interface BasePaginationFilter<T> {
  filterValue?: string;

  filterField?: keyof T;
}
