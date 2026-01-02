import api from "./api";
import type { AdminEvent } from "../types/event.admin";

export const eventsAdminService = {
  async getAll(): Promise<AdminEvent[]> {
    const { data } = await api.get("/events/admin");
    return data;
  },

  async create(event: Omit<AdminEvent, "uuid">): Promise<AdminEvent> {
    const { data } = await api.post("/events", event);
    return data;
  },

  async update(uuid: string, event: Partial<AdminEvent>): Promise<AdminEvent> {
    // We strip out the uuid from the body to prevent trying to update the ID itself
    const { uuid: _, ...payload } = event;
    const { data } = await api.patch(`/events/${uuid}`, payload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/events/${uuid}`);
  },
};
