import api from "./api";
import type { AdminNotification } from "../types/notification.admin";

/**
 * NOTE:
 * Backend returns `_id`, frontend uses `id`
 * We normalize it here ONCE.
 */
const normalize = (notification: any): AdminNotification => ({
  ...notification,
  id: notification.id || notification._id,
});

export const notificationsAdminService = {
  async getAll(): Promise<AdminNotification[]> {
    const { data } = await api.get("/notifications/admin");
    return data.map(normalize);
  },

  async create(
    event: Omit<AdminNotification, "id">
  ): Promise<AdminNotification> {
    const { data } = await api.post("/notifications", event);
    return normalize(data);
  },

  async update(
    id: string,
    event: Partial<AdminNotification>
  ): Promise<AdminNotification> {
    const { id: _, ...payload } = event;
    const { data } = await api.patch(`/notifications/${id}`, payload);
    return normalize(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
