import api from "./api";
import type {
  AdminEvent,
  PaginatedEvents,
  EventQueryParams,
} from "../types/event.admin";

/**
 * Service handling Admin-only Event operations.
 * Note: api.ts now automatically unwraps 'response.data.data',
 * so we return the results directly.
 * toast messages handled by api.ts
 */
export const eventsAdminService = {
  async getAll(params?: EventQueryParams): Promise<PaginatedEvents> {
    return await api.get("/events/admin", { params });
  },

  async create(event: Omit<AdminEvent, "uuid">): Promise<AdminEvent> {
    return await api.post("/events", event);
  },

  async update(uuid: string, event: Partial<AdminEvent>): Promise<AdminEvent> {
    // Remove metadata fields that shouldn't be sent to the backend
    const { id: _, uuid: __, ...payload } = event as any;
    return await api.patch(`/events/${uuid}`, payload);
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/events/${uuid}`);
  },
};
