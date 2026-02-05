export type EventType = "GENERAL" | "MARRIAGE" | "FUNERAL" | "CEREMONY" | "GATHERING" | "BIRTHDAY" | "OTHER";


export type PublicEvent = {
  uuid: string;
  title_en: string;
  title_ml?: string;
  description_en: string;
  description_ml?: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  type: EventType;
  location: string;
};
