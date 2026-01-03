import api from "./api";
import type {
  AdminNotification,
  AdminNotificationDraft,
} from "../types/notification.admin";

export const notificationsAdminService = {
  async getAll(): Promise<AdminNotification[]> {
    const { data } = await api.get("/notifications/admin");
    return data;
  },

  async create(payload: AdminNotificationDraft): Promise<AdminNotification> {
    const { data } = await api.post("/notifications", payload);
    return data;
  },

  async update(
    uuid: string,
    notification: Partial<AdminNotification>
  ): Promise<AdminNotification> {
    const { id: _, uuid: __, ...payload } = notification as any;
    const { data } = await api.patch(`/notifications/${uuid}`, payload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/notifications/${uuid}`);
  },
};
