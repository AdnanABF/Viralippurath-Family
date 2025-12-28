export type Notification = {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  priority: "HIGH" | "NORMAL";
};
