export type NotificationCategory = "GENERAL" | "MAGAZINE" | "EVENT" | "URGENT";

export type PublicNotification = {
  uuid: string;
  title: string;
  content: string;
  date: string;
  expiresAt: string;
  category: NotificationCategory;
  isPinned: boolean;
};
