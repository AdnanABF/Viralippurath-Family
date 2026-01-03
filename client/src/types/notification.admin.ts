import type { PublicNotification } from "./notification.public";

export type NotificationStatus = "DRAFT" | "PUBLISHED";
export type NotificationPriority = "HIGH" | "NORMAL";

export type AdminNotification = PublicNotification & {
  status: NotificationStatus;
};

export type AdminNotificationDraft = Omit<AdminNotification, "uuid">;
