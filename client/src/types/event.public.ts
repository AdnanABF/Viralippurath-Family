export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  type: string; // e.g. "Gathering", "Ceremony"
  location?: string;
};
