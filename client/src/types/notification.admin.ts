import type { PublicNotification } from "./notification.public";

export type NotificationStatus = "DRAFT" | "PUBLISHED";
export type NotificationPriority = "HIGH" | "NORMAL";

export type AdminNotification = PublicNotification & {
  status: NotificationStatus;
};

export type AdminNotificationDraft = Omit<AdminNotification, "uuid">;

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedNotifications {
  data: AdminNotification[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
