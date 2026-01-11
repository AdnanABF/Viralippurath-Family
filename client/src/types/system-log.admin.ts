export interface SystemLog {
  uuid: string;
  errorCode: string;
  message: string;
  stack?: string;
  path: string;
  method: string;
  payload?: any;
  userUuid?: string;
  ipAddress?: string;
  correlationId?: string;
  createdAt: string;
}

export interface PaginatedSystemLogResponse {
  data: SystemLog[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface SystemLogQueryParams {
  page?: number;
  limit?: number;
  errorCode?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
  correlationId?: string;
}
