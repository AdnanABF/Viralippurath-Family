import type { PublicEvent } from "./event.public";

export type EventStatus = "DRAFT" | "PUBLISHED";

export type AdminEvent = PublicEvent & {
  status: EventStatus;
};

export type AdminEventDraft = Omit<AdminEvent, "uuid">;

export interface PaginatedEvents {
  data: AdminEvent[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
