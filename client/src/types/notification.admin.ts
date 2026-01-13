import type {
  PublicNotification,
  NotificationCategory,
} from "./notification.public";

export type NotificationStatus = "DRAFT" | "PUBLISHED";

export { type NotificationCategory };

export type AdminNotification = PublicNotification & {
  status: NotificationStatus;
};

export type AdminNotificationDraft = Omit<AdminNotification, "uuid">;

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  isPinned?: boolean;
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
