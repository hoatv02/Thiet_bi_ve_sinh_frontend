export interface PagedResult<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: T[];
  hasPrevious: boolean;
  hasNext: boolean;
}
