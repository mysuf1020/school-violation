export type Pagination = {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_records: number;
};

export type ChangedData = {
  key: string;
  old_value: string;
  new_value: string;
};

export type BaseResponse<T> = {
  data: T;
  error?: unknown;
};

export type ErrorResponse<T> = {
  error: T;
};
