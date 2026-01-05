export type PublicEvent = {
  uuid: string;
  title: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  type: string; // e.g. "Gathering", "Ceremony"
  location: string;
};
