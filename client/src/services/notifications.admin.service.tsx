import api from "./api";
import type {
  AdminNotification,
  AdminNotificationDraft,
  NotificationQueryParams,
  PaginatedNotifications,
} from "../types/notification.admin";

export const notificationsAdminService = {
  async getAll(
    params?: NotificationQueryParams
  ): Promise<PaginatedNotifications> {
    const { data } = await api.get("/notifications/admin", { params });
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, uuid: __, ...payload } = notification as any;
    const { data } = await api.patch(`/notifications/${uuid}`, payload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/notifications/${uuid}`);
  },
};
