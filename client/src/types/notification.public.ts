export type NotificationPriority = "HIGH" | "NORMAL";

export type PublicNotification = {
  uuid: string;
  title: string;
  content: string;
  date: string; // ISO string
  priority: NotificationPriority;
};
