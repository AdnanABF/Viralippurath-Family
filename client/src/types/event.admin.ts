import type { PublicEvent } from "./event.public";

export type EventStatus = "DRAFT" | "PUBLISHED";

export type AdminEvent = PublicEvent & {
  status: EventStatus;
};
