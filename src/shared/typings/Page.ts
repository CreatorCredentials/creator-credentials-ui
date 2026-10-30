/** One page of a server-side paged list. */
export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type PageQuery = {
  q?: string;
  page?: number;
  pageSize?: number;
};
