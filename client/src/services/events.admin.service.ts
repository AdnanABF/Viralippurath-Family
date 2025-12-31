import api from "./api";
import type { AdminEvent } from "../types/event.admin";

/**
 * NOTE:
 * Backend returns `_id`, frontend uses `id`
 * We normalize it here ONCE.
 */
const normalizeEvent = (event: any): AdminEvent => ({
  ...event,
  id: event.id || event._id,
});

export const eventsAdminService = {
  async getAll(): Promise<AdminEvent[]> {
    const { data } = await api.get("/events/admin");
    return data.map(normalizeEvent);
  },

  async create(event: Omit<AdminEvent, "id">): Promise<AdminEvent> {
    const { data } = await api.post("/events", event);
    return normalizeEvent(data);
  },

  async update(id: string, event: Partial<AdminEvent>): Promise<AdminEvent> {
    const { id: _, ...payload } = event;
    const { data } = await api.patch(`/events/${id}`, payload);
    return normalizeEvent(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
