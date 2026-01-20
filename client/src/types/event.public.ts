export type PublicEvent = {
  uuid: string;
  title_en: string;
  title_ml?: string;
  description_en: string;
  description_ml?: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  type: string; // e.g. "Gathering", "Ceremony"
  location: string;
};
