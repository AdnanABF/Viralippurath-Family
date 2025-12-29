export type EventStatus = "DRAFT" | "PUBLISHED";

export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  location?: string;
  status: EventStatus;
};
