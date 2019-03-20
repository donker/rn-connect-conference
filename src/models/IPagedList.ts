export interface IPagedList<T> extends Array<T> {
  HasNextPage: boolean;
  HasPreviousPage: boolean;
  IsFirstPage: boolean;
  IsLastPage: boolean;
  PageCount: number;
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
}
