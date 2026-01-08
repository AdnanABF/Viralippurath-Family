export interface ActivityLog {
  uuid: string;
  adminUserName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: "EVENT" | "MAGAZINE" | "NOTIFICATION" | "GALLERY" | "ADMIN";
  entityTitle: string;
  createdAt: string;
}

export interface PaginatedActivityResponse {
  data: ActivityLog[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ActivityLogQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}
