export type NotificationCategory = "GENERAL" | "MAGAZINE" | "EVENT" | "URGENT";

export type PublicNotification = {
  uuid: string;
  title_en: string;
  title_ml?: string;
  content_en: string;
  content_ml?: string;
  date: string;
  expiresAt: string;
  category: NotificationCategory;
  isPinned: boolean;
};
